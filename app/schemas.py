from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

#You don't write any validation code! - pydantics magic
# ===== USER SCHEMAS =====
class UserBase(BaseModel):
    email: str


class UserCreate(UserBase):  # what comes in: email + password
    password: str


class User(UserBase):  # what goes out: email + id + is_active
    id: int
    is_active: bool

    class Config:
        orm_mode = True  # allow reading data from ORM objects (e.g., SQLAlchemy models)


# ===== CHAT SCHEMAS =====
class ChatRequest(BaseModel):
    """
    Schema for incoming chat requests from the client.
    
    Fields:
    - message: The user's message text
    - conversation_id: Optional. If provided, continues an existing conversation.
                       If None, creates a new conversation.
    """
    message: str
    conversation_id: Optional[int] = None  # None = new conversation, int = continue existing


class MessageResponse(BaseModel):
    """
    Schema for a single message in the response.
    Used to return message history or individual messages.
    """
    id: int
    role: str  # "user" or "assistant"
    content: str
    created_at: datetime

    class Config:
        orm_mode = True  # Allows Pydantic to read from SQLAlchemy Message objects


class ChatResponse(BaseModel):
    """
    Schema for the API's response to a chat request.
    
    Fields:
    - conversation_id: The ID of the conversation (new or existing)
    - message: The AI's response message
    - created_at: When the AI's message was created
    """
    conversation_id: int
    message: str  # The AI's response text
    created_at: datetime


# ===== CONVERSATION SCHEMAS =====
class ConversationSummary(BaseModel):
    """
    Schema for conversation list summaries.
    """
    id: int
    created_at: datetime
    updated_at: datetime
    message_count: int

    class Config:
        orm_mode = True


class ConversationDetail(BaseModel):
    """
    Schema for detailed conversation view with all messages.
    """
    id: int
    created_at: datetime
    updated_at: datetime
    messages: List[MessageResponse]

    class Config:
        orm_mode = True
