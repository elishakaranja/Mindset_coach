from datetime import timedelta
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from . import crud, models, schemas, security
from sqlalchemy.exc import IntegrityError
from .config import settings
from .database import SessionLocal, engine
from .routers import chat  # Import the chat router

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Include the chat router
# This makes all routes in the chat router available under /chat
app.include_router(chat.router)


# Dependency
def get_db():
    db = SessionLocal()#creates a new database session per request 
    try:
        yield db #provides db session to path operation functions/endpoint func
    finally:
        db.close()


@app.post("/token")
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, email=form_data.username)
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        # 409 Conflict is a more appropriate status code for duplicate resources
        raise HTTPException(status_code=409, detail="Email already registered")
    try:
        return crud.create_user(db=db, user=user)
    except IntegrityError:
        # Handle race conditions where the unique constraint is violated
        raise HTTPException(status_code=409, detail="Email already registered")


@app.get("/")
def read_root():
    return {"message": "Welcome to the Mindset Coach API"}
