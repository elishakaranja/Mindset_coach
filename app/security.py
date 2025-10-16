import hashlib
from datetime import datetime, timedelta
from jose import jwt
from passlib.context import CryptContext

from .config import settings

# Create a CryptContext for password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def _prehash_password(password: str) -> str:
    """Pre-hashes a password using SHA-256 before passing to bcrypt."""
    sha256_hash = hashlib.sha256(password.encode('utf-8')).hexdigest()
    return sha256_hash


def verify_password(plain_password, hashed_password):
    pre_hashed_plain_password = _prehash_password(plain_password)
    return pwd_context.verify(pre_hashed_plain_password, hashed_password)


def get_password_hash(password):
    pre_hashed_password = _prehash_password(password)
    return pwd_context.hash(pre_hashed_password)


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt
