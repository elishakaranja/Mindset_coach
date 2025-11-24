"""
AI Service for Google Gemini integration.

Handles all AI interactions including:
- Building conversation history from database
- Injecting personality into system prompts
- Generating AI responses
"""

import google.generativeai as genai
from typing import List, Dict
from .config import settings
from .personalities import get_personality
from . import models

# Configure Gemini API
genai.configure(api_key=settings.GEMINI_API_KEY)


def build_conversation_history(messages: List[models.Message]) -> List[Dict[str, str]]:
    """
    Convert database messages to Gemini chat history format.
    
    Args:
        messages: List of Message objects from database
        
    Returns:
        List of message dictionaries in Gemini format
    """
    history = []
    for msg in messages:
        # Gemini uses "user" and "model" roles
        role = "user" if msg.role == "user" else "model"
        history.append({
            "role": role,
            "parts": [msg.content]
        })
    return history


def generate_response(
    user_message: str,
    conversation_history: List[models.Message],
    personality_name: str = "sophia"
) -> str:
    """
    Generate an AI response using Google Gemini with personality injection.
    
    Args:
        user_message: The user's current message
        conversation_history: Previous messages in this conversation
        personality_name: Name of the personality to use (default: "sophia")
        
    Returns:
        AI-generated response text
    """
    # Get personality configuration
    personality = get_personality(personality_name)
    system_prompt = personality["system_prompt"]
    
    # Initialize Gemini model
    # Using gemini-1.5-flash for free tier with 1M token context
    model = genai.GenerativeModel(
        model_name="gemini-1.5-flash",
        system_instruction=system_prompt
    )
    
    # Build chat history
    history = build_conversation_history(conversation_history)
    
    # Start chat with history
    chat = model.start_chat(history=history)
    
    # Generate response
    response = chat.send_message(user_message)
    
    return response.text


def generate_response_streaming(
    user_message: str,
    conversation_history: List[models.Message],
    personality_name: str = "sophia"
):
    """
    Generate an AI response with streaming (for future real-time updates).
    
    Args:
        user_message: The user's current message
        conversation_history: Previous messages in this conversation
        personality_name: Name of the personality to use (default: "sophia")
        
    Yields:
        Chunks of AI-generated response text
    """
    # Get personality configuration
    personality = get_personality(personality_name)
    system_prompt = personality["system_prompt"]
    
    # Initialize Gemini model
    model = genai.GenerativeModel(
        model_name="gemini-1.5-flash",
        system_instruction=system_prompt
    )
    
    # Build chat history
    history = build_conversation_history(conversation_history)
    
    # Start chat with history
    chat = model.start_chat(history=history)
    
    # Generate response with streaming
    response = chat.send_message(user_message, stream=True)
    
    for chunk in response:
        if chunk.text:
            yield chunk.text
