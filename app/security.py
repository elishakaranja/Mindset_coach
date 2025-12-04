from datetime import datetime, timedelta
from typing import Optional

from jose import jwt, JWTError
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from .config import settings

# Configure a two-step hashing context:
# - First apply sha256_crypt to the plaintext (pre-hash). This produces
#   a fixed-length digest and avoids bcrypt's 72-byte input limit.
# - Then apply bcrypt as the primary scheme for storage/verification.
#
# `default="bcrypt"` ensures bcrypt is used for new hashes; including
# "sha256_crypt" in `schemes` enables passlib's built-in pre-hash
# behavior when configured via the sha256_crypt__* options below.
# Use PBKDF2-SHA256 as the primary scheme. It has no 72-byte input limit
# and doesn't require external C extensions. If you prefer bcrypt, you
# can switch back, but you'll need to handle bcrypt's 72-byte limit.
pwd_context = CryptContext(
    schemes=["pbkdf2_sha256"],
    default="pbkdf2_sha256",
)

# OAuth2PasswordBearer: This tells FastAPI where to look for the token
# tokenUrl="token" means the client should POST to /token to get a token
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


def verify_password(plain_password, hashed_password):
    # The context will automatically handle the two-step verification.
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    # The context will automatically handle the two-step hashing.
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM
    )
    return encoded_jwt




def get_current_user(token: str = Depends(oauth2_scheme)):
    """
    Dependency function to get the current authenticated user from a JWT token.
    
    This function:
    1. Extracts the token from the Authorization header (handled by oauth2_scheme)
    2. Decodes the JWT to get the user's email
    3. Queries the database to get the full User object
    4. Raises an HTTPException if anything fails
    
    Usage in endpoints:
        @app.post("/protected")
        def protected_route(current_user: User = Depends(get_current_user)):
            # current_user is now the authenticated User object
            return {"user_id": current_user.id}
    """
    from . import models, crud
    from .database import SessionLocal
    
    print(f"🔐 Token received: {token[:20] if token else 'None'}...")
    
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        # Decode the JWT token
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")  # "sub" is the subject (user identifier)
        print(f"✅ Token decoded successfully, email: {email}")
        if email is None:
            print("❌ No email in token payload")
            raise credentials_exception
    except JWTError as e:
        print(f"❌ JWT decode error: {e}")
        raise credentials_exception
    
    # Get a database session
    db = SessionLocal()
    try:
        # Query the database for the user
        user = crud.get_user_by_email(db, email=email)
        if user is None:
            print(f"❌ User not found for email: {email}")
            raise credentials_exception
        print(f"✅ User authenticated: {user.email}")
        return user
    finally:
        db.close()

