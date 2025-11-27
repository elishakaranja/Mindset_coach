"""Simple direct test of AI service."""
import sys
sys.path.insert(0, '/home/elishadominicc/projects/mindset_coach')

from app import ai_service

print("🧠 Testing Google Gemini AI Integration...\n")

try:
    # Test 1: Simple AI response
    print("Test Message: 'Hi! Can you help me feel more confident?'")
    print("Generating AI response with Sophia personality...\n")
    
    response = ai_service.generate_response(
        user_message="Hi! Can you help me feel more confident?",
        conversation_history=[],
        personality_name="sophia"
    )
    
    print("✅ AI IS WORKING!")
    print(f"\nAI Response ({len(response)} characters):")
    print("=" * 60)
    print(response)
    print("=" * 60)
    
except Exception as e:
    print(f"❌ AI Error: {e}")
    import traceback
    traceback.print_exc()
