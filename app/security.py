from datetime import datetime, timedelta
from typing import Optional

from jose import jwt
from passlib.context import CryptContext

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
