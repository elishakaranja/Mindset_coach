import hashlib
from passlib.context import CryptContext

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
