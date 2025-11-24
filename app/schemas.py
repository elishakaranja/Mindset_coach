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
    selected_personality: str  # which coach personality the user has selected

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


# ===== PERSONALITY SCHEMAS =====
class PersonalityInfo(BaseModel):
    """
    Schema for personality information.
    """
    id: str  # e.g., "sophia", "marcus"
    name: str  # e.g., "Sophia"
    tagline: str  # Short description
    description: str  # Longer description


class PersonalityUpdate(BaseModel):
    """
    Schema for updating user's selected personality.
    """
    personality: str  # e.g., "sophia" or "marcus"


# ===== CONVERSATION SCHEMAS =====
class ConversationSummary(BaseModel):
    """
    Schema for conversation summary (without messages).
    """
    id: int
    created_at: datetime
    updated_at: Optional[datetime]
    message_count: int  # Number of messages in this conversation

    class Config:
        orm_mode = True


class ConversationDetail(BaseModel):
    """
    Schema for conversation with full message history.
    """
    id: int
    created_at: datetime
    updated_at: Optional[datetime]
    messages: List[MessageResponse]  # All messages in the conversation

    class Config:
        orm_mode = True
