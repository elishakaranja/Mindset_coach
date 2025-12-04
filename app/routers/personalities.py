from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from .. import models, schemas, security
from ..database import SessionLocal
from ..personalities import list_personalities, get_personality

# Create a router for personality-related endpoints
router = APIRouter(prefix="/personalities", tags=["personalities"])


# Dependency to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("", response_model=List[schemas.PersonalityInfo])
def get_personalities():
    """
    List all available coach personalities.
    
    Returns personality information including name, tagline, and description.
    Does NOT include system prompts (those are internal).
    """
    personalities = list_personalities()
    return [schemas.PersonalityInfo(**p) for p in personalities]


@router.put("/me", response_model=schemas.User)
def update_my_personality(
    personality_update: schemas.PersonalityUpdate,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update the current user's selected personality.
    
    This changes which coach personality the user will interact with
    in future conversations.
    """
    # Validate that the personality exists
    try:
        get_personality(personality_update.personality)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    
    # Update user's personality
    current_user.selected_personality = personality_update.personality
    db.commit()
    db.refresh(current_user)
    
    return current_user
