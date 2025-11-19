from pydantic import BaseModel


class UserBase(BaseModel):
    email: str


class UserCreate(UserBase):#what comes in email + password 
    password: str


class User(UserBase): #what goes out  email +  id + is_active
    id: int
    is_active: bool

    class Config:
        orm_mode = True  # allow reading data from ORM objects (e.g., SQLAlchemy models)
