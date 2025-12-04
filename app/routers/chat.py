from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime
from typing import List

from .. import models, schemas, security, ai_service
from ..database import SessionLocal

# Create a router for chat-related endpoints
# prefix="/chat" means all routes in this router will start with /chat
# tags=["chat"] groups these endpoints in the API documentation
router = APIRouter(prefix="/chat", tags=["chat"])


# Dependency to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("", response_model=dict)
def send_message(
    request: schemas.ChatRequest,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    """
    Send a message to the AI coach.
    
    Flow:
    1. Check if conversation_id is provided
       - If yes: Verify it belongs to the current user
       - If no: Create a new conversation
    2. Save the user's message to the database
    3. Retrieve conversation history
    4. Generate AI response using Gemini with selected personality
    5. Save the AI's response to the database
    6. Return the response
    
    Authentication: Requires valid JWT token in Authorization header
    """
    
    # Determine which personality to use
    personality_name = request.personality_id or current_user.selected_personality or "sophia"
    
    # Step 1: Get or create conversation
    if request.conversation_id:
        # User provided a conversation_id, so retrieve it
        conversation = db.query(models.Conversation).filter(
            models.Conversation.id == request.conversation_id,
            models.Conversation.user_id == current_user.id  # Security: ensure it belongs to this user
        ).first()
        
        if not conversation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversation not found or you don't have access to it"
            )
    else:
        # No conversation_id provided, create a new conversation
        conversation = models.Conversation(user_id=current_user.id)
        db.add(conversation)
        db.commit()
        db.refresh(conversation)  # Refresh to get the auto-generated ID
    
    # Step 2: Save the user's message
    user_message = models.Message(
        conversation_id=conversation.id,
        role="user",
        content=request.message
    )
    db.add(user_message)
    db.commit()
    
    # Step 3: Retrieve conversation history (excluding the message we just added)
    conversation_history = db.query(models.Message).filter(
        models.Message.conversation_id == conversation.id,
        models.Message.id != user_message.id  # Exclude the current message
    ).order_by(models.Message.created_at).all()
    
    # Step 4: Generate AI response using Gemini with personality
    try:
        ai_response_text = ai_service.generate_response(
            user_message=request.message,
            conversation_history=conversation_history,
            personality_name=personality_name
        )
    except Exception as e:
        # If AI generation fails, provide a helpful error
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI service error: {str(e)}"
        )
    
    # Step 5: Save the AI's response
    ai_message = models.Message(
        conversation_id=conversation.id,
        role="assistant",
        content=ai_response_text
    )
    db.add(ai_message)
    db.commit()
    db.refresh(ai_message)  # Refresh to get created_at timestamp
    
    # Step 6: Return the response in frontend-expected format
    return {
        "conversation_id": conversation.id,
        "response": ai_response_text,
        "created_at": ai_message.created_at.isoformat()
    }


@router.get("/conversations", response_model=List[schemas.ConversationSummary])
def list_conversations(
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    """
    List all conversations for the current user.
    
    Returns a summary of each conversation including message count.
    """
    conversations = db.query(models.Conversation).filter(
        models.Conversation.user_id == current_user.id
    ).order_by(models.Conversation.updated_at.desc()).all()
    
    # Add message count to each conversation
    result = []
    for conv in conversations:
        message_count = db.query(func.count(models.Message.id)).filter(
            models.Message.conversation_id == conv.id
        ).scalar()
        
        result.append(schemas.ConversationSummary(
            id=conv.id,
            created_at=conv.created_at,
            updated_at=conv.updated_at,
            message_count=message_count
        ))
    
    return result


@router.get("/conversations/{conversation_id}", response_model=schemas.ConversationDetail)
def get_conversation(
    conversation_id: int,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get a specific conversation with full message history.
    
    Security: Only returns conversation if it belongs to the current user.
    """
    conversation = db.query(models.Conversation).filter(
        models.Conversation.id == conversation_id,
        models.Conversation.user_id == current_user.id
    ).first()
    
    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found or you don't have access to it"
        )
    
    # Get all messages for this conversation
    messages = db.query(models.Message).filter(
        models.Message.conversation_id == conversation_id
    ).order_by(models.Message.created_at).all()
    
    return schemas.ConversationDetail(
        id=conversation.id,
        created_at=conversation.created_at,
        updated_at=conversation.updated_at,
        messages=[schemas.MessageResponse.from_orm(msg) for msg in messages]
    )


@router.get("/history", response_model=List[schemas.MessageResponse])
def get_chat_history(
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get chat history for the current user (all messages from all conversations).
    
    Returns messages in chronological order.
    """
    messages = db.query(models.Message).join(models.Conversation).filter(
        models.Conversation.user_id == current_user.id
    ).order_by(models.Message.created_at).all()
    
    return [schemas.MessageResponse.from_orm(msg) for msg in messages]

