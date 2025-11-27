"""
Test script to verify the full AI workflow.
Tests: Database connection, User creation, AI response generation.
"""

import sys
import os

# Add project to path
sys.path.insert(0, '/home/elishadominicc/projects/mindset_coach')

from app.database import SessionLocal, engine
from app import models, crud, schemas, ai_service
from sqlalchemy import text

def test_database():
    """Test database connection."""
    print("=" * 50)
    print("Testing Database Connection...")
    print("=" * 50)
    try:
        # Create tables
        models.Base.metadata.create_all(bind=engine)
        print("✓ Database tables created successfully")
        
        # Test connection
        db = SessionLocal()
        db.execute(text("SELECT 1"))
        db.close()
        print("✓ Database connection successful")
        return True
    except Exception as e:
        print(f"✗ Database error: {e}")
        return False

def test_user_creation():
    """Test user creation."""
    print("\n" + "=" * 50)
    print("Testing User Creation...")
    print("=" * 50)
    try:
        db = SessionLocal()
        
        # Try to create a test user
        test_email = "aitest@example.com"
        
        # Delete if exists
        existing = db.query(models.User).filter(models.User.email == test_email).first()
        if existing:
            db.delete(existing)
            db.commit()
            print(f"  Deleted existing user: {test_email}")
        
        # Create new user
        user_create = schemas.UserCreate(email=test_email, password="testpass123")
        user = crud.create_user(db, user_create)
        print(f"✓ User created: {user.email} (ID: {user.id})")
        
        db.close()
        return user.id
    except Exception as e:
        print(f"✗ User creation error: {e}")
        import traceback
        traceback.print_exc()
        return None

def test_ai_response(user_id):
    """Test AI response generation."""
    print("\n" + "=" * 50)
    print("Testing AI Response Generation...")
    print("=" * 50)
    try:
        db = SessionLocal()
        
        # Create a conversation
        conversation = models.Conversation(user_id=user_id)
        db.add(conversation)
        db.commit()
        db.refresh(conversation)
        print(f"✓ Conversation created (ID: {conversation.id})")
        
        # Test message
        test_message = "Hi! Can you help me feel more confident?"
        print(f"  User message: {test_message}")
        
        # Generate AI response
        print("  Generating AI response...")
        response = ai_service.generate_response(
            user_message=test_message,
            conversation_history=[],
            personality_name="sophia"
        )
        
        print(f"✓ AI Response received ({len(response)} characters)")
        print(f"\n  AI Response Preview:")
        print(f"  {'-' * 46}")
        preview = response[:200] + "..." if len(response) > 200 else response
        print(f"  {preview}")
        print(f"  {'-' * 46}")
        
        db.close()
        return True
    except Exception as e:
        print(f"✗ AI response error: {e}")
        import traceback
        traceback.print_exc()
        return False

def main():
    print("\n🧠 MINDSET COACH - AI INTEGRATION TEST 🧠\n")
    
    # Test 1: Database
    if not test_database():
        print("\n❌ Database test failed. Fix database issues first.")
        return
    
    # Test 2: User Creation
    user_id = test_user_creation()
    if not user_id:
        print("\n❌ User creation test failed.")
        return
    
    # Test 3: AI Response
    if not test_ai_response(user_id):
        print("\n❌ AI response test failed.")
        return
    
    print("\n" + "=" * 50)
    print("✅ ALL TESTS PASSED! AI IS WORKING!")
    print("=" * 50)

if __name__ == "__main__":
    main()
