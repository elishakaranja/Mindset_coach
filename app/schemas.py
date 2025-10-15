from pydantic import BaseModel


class UserBase(BaseModel):
    email: str


class UserCreate(UserBase):#what comes in email + password 
    password: str


class User(UserBase): #what goes out  email +  id + is_active
    id: int
    is_active: bool

    class Config:
        orm_mode = True# "Be flexible! You might be given a database object instead of a dictionary. If
     #so, try to read the data using attributes (like .email) instead of keys."
