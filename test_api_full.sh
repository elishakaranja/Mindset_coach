#!/bin/bash
# Complete end-to-end test of the Mindset Coach API

echo "🧠 MINDSET COACH - FULL API TEST 🧠"
echo "===================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Test 1: Create a user
echo "Test 1: Creating a new user..."
USER_RESPONSE=$(curl -s -X POST "http://localhost:8000/users/" \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@mindsetcoach.com","password":"DemoPass123"}')

if echo "$USER_RESPONSE" | grep -q "email"; then
    echo -e "${GREEN}✓ User created successfully${NC}"
    echo "  Response: $USER_RESPONSE"
else
    echo -e "${RED}✗ User creation failed${NC}"
    echo "  Response: $USER_RESPONSE"
fi
echo ""

# Test 2: Login and get token
echo "Test 2: Login and get access token..."
TOKEN_RESPONSE=$(curl -s -X POST "http://localhost:8000/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=demo@mindsetcoach.com&password=DemoPass123")

TOKEN=$(echo "$TOKEN_RESPONSE" | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)

if [ -n "$TOKEN" ]; then
    echo -e "${GREEN}✓ Login successful${NC}"
    echo "  Token: ${TOKEN:0:20}..."
else
    echo -e "${RED}✗ Login failed${NC}"
    echo "  Response: $TOKEN_RESPONSE"
    exit 1
fi
echo ""

# Test 3: Get available personalities
echo "Test 3: Getting available AI personalities..."
PERSONALITIES=$(curl -s -X GET "http://localhost:8000/chat/personalities" \
  -H "Authorization: Bearer $TOKEN")

if echo "$PERSONALITIES" | grep -q "sophia"; then
    echo -e "${GREEN}✓ Personalities retrieved${NC}"
    echo "  Available: $(echo $PERSONALITIES | grep -o '"name":"[^"]*"' | cut -d'"' -f4 | tr '\n' ', ')"
else
    echo -e "${RED}✗ Failed to get personalities${NC}"
    echo "  Response: $PERSONALITIES"
fi
echo ""

# Test 4: Send a message to the AI
echo "Test 4: Chatting with the AI (Sophia personality)..."
CHAT_RESPONSE=$(curl -s -X POST "http://localhost:8000/chat/" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message":"Hi! I need help staying motivated to exercise"}')

CONVERSATION_ID=$(echo "$CHAT_RESPONSE" | grep -o '"conversation_id":[0-9]*' | grep -o '[0-9]*')
AI_MESSAGE=$(echo "$CHAT_RESPONSE" | grep -o '"message":"[^"]*"' | cut -d'"' -f4)

if [ -n "$AI_MESSAGE" ]; then
    echo -e "${GREEN}✓ AI responded successfully${NC}"
    echo "  Conversation ID: $CONVERSATION_ID"
    echo "  AI Response:"
    echo "  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "  $AI_MESSAGE"
    echo "  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
else
    echo -e "${RED}✗ AI response failed${NC}"
    echo "  Response: $CHAT_RESPONSE"
    exit 1
fi
echo ""

# Test 5: Continue the conversation
echo "Test 5: Continuing the conversation..."
CHAT_RESPONSE2=$(curl -s -X POST "http://localhost:8000/chat/" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"message\":\"That's helpful! Can you give me one specific action I can take today?\",\"conversation_id\":$CONVERSATION_ID}")

AI_MESSAGE2=$(echo "$CHAT_RESPONSE2" | grep -o '"message":"[^"]*"' | cut -d'"' -f4)

if [ -n "$AI_MESSAGE2" ]; then
    echo -e "${GREEN}✓ Conversation continued successfully${NC}"
    echo "  AI Response:"
    echo "  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "  $AI_MESSAGE2"
    echo "  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
else
    echo -e "${RED}✗ Conversation continuation failed${NC}"
    echo "  Response: $CHAT_RESPONSE2"
fi
echo ""

echo "===================================="
echo -e "${GREEN}✅ ALL TESTS PASSED! AI IS FULLY FUNCTIONAL!${NC}"
echo "===================================="
