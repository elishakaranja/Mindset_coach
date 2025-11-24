from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Personality selection: which coach personality the user prefers
    # Default is "sophia" (warm but pushy)
    selected_personality = Column(String, default="sophia", nullable=False)
    
    # Relationship: One User has many Conversations
    # This creates a Python attribute `conversations` on User objects
    # back_populates="user" means Conversation will have a `user` attribute
    conversations = relationship("Conversation", back_populates="user")


class Conversation(Base):
    """
    Represents a conversation thread between a user and the AI coach.
    Each user can have multiple conversations (e.g., different topics or sessions).
    """
    __tablename__ = "conversations"

    id = Column(Integer, primary_key=True, index=True)
    
    # Foreign Key: Links this conversation to a specific user
    # ForeignKey("users.id") means this column references the `id` column in the `users` table
    # nullable=False ensures every conversation MUST belong to a user
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Timestamps for tracking when conversations are created/updated
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships:
    # 1. Many-to-One: This conversation belongs to one User
    user = relationship("User", back_populates="conversations")
    
    # 2. One-to-Many: This conversation has many Messages
    messages = relationship("Message", back_populates="conversation", cascade="all, delete-orphan")
    # cascade="all, delete-orphan" means: if we delete a conversation, delete all its messages too


class Message(Base):
    """
    Represents a single message in a conversation.
    Messages can be from the user or from the AI coach.
    """
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    
    # Foreign Key: Links this message to a specific conversation
    conversation_id = Column(Integer, ForeignKey("conversations.id"), nullable=False)
    
    # The role of who sent the message: "user" or "assistant"
    role = Column(String, nullable=False)  # "user" or "assistant"
    
    # The actual message content
    # Using Text instead of String for potentially long messages
    content = Column(Text, nullable=False)
    
    # Timestamp for when the message was created
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationship: Many-to-One - This message belongs to one Conversation
    conversation = relationship("Conversation", back_populates="messages")
