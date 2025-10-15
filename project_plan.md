# 🧠 AI Mindset Coach — Project Plan

## 📝 Vision
This project is to build an AI-powered mindset coach that goes beyond a simple chatbot. It is a helper that is invested in your life, helping you understand your goals, fears, and dreams. It actively asks questions, challenges limiting beliefs, and builds frameworks to work through challenges. The ultimate goal is to create an application that, after just a few days of use, can lead to major improvements in a user's self-concept, confidence, and happiness.

---

## 🎯 Project Goals
1. 🧭 **Build a Functional MVP:** Create a working version of the coach that allows users to have meaningful, stateful conversations.
2. 📚 **Learn FastAPI:** Use this project as a hands-on opportunity to learn and master the FastAPI framework and modern backend development practices.
3. 🤝 **Establish a Mentorship-Based Workflow:** Collaborate with Gemini as a mentor and guide, who will provide explanations, suggest documentation, and assign tasks to facilitate deep learning.
4. ✨ **Design for Personalization:** Create a system where users can choose a coach personality that suits them, and the AI learns and adapts over time.
5. 🧱 **Strong Foundation:** Build a solid architectural foundation that can be extended in the future with more advanced features.

---

## 🤝 Our Mentorship and Learning Model
This project is a collaborative learning experience. Our roles are defined as follows:

- **Your Role (The Developer):** You are the project owner and lead developer. You'll be writing code, making decisions, and driving the project forward.
- **My Role (Gemini - Your AI Mentor):** I will act as your senior technical guide. My goal is to help you learn FastAPI and build this project effectively.

To achieve this, I will:
- **Guide, Not Just Do:** I will explain the "why" behind technical decisions, architectural patterns, and code.
- **Encourage Deeper Learning:** If we encounter a new or complex topic, I will suggest you read specific official documentation (from FastAPI, Python, etc.). This is to help you build a fundamental understanding.
- **Assign Tasks:** To help you learn by doing, I may show you how to do something first, and then ask you to implement a similar feature yourself. We will review the work together.

---

## 🔄 Development Workflow & Checkpoints

To maintain a clean and organized development process:

- **Checkpoints:** We will use this `project_plan.md` as a live document. As we complete tasks, we will mark them as done (`[x]`). This helps us track progress and serves as a checkpoint for our context.
- **Version Control:** After reaching a stable checkpoint (e.g., finishing a feature or a significant setup step), I will remind you to commit your changes to Git. This is a crucial habit for safe and professional software development.

---

## 🧰 Tech Stack
- **Backend:** FastAPI (Python)
- **Database:** PostgreSQL (using SQLAlchemy for the ORM)
- **AI / LLM:** Oracle Generative AI (or a similar large language model)
- **Authentication:** JWT-based authentication for users.
- **Future Frontend:** React or a similar modern JavaScript framework.

---

## 🚀 Development Phases (4-6 Week Timeline)

### **MVP 1: The Core Coaching Experience (Weeks 1-4)**
This is the main goal for our initial timeframe. By the end of this phase, we will have a usable application with the core features.

- [ ] **Project Setup:**
    - [x] Scaffold the initial FastAPI project structure.
    - [x] Set up a local PostgreSQL database using Docker.
    - [ ] Integrate SQLAlchemy and create initial database models (Users, Conversations).
- [ ] **Core API Endpoints:**
    - [ ] `/users`: Endpoints for user registration and login (authentication).
    - [ ] `/chat`: The main endpoint to handle conversational turns with the AI coach.
    - [ ] `/personalities`: An endpoint to list and choose a coach personality.
- [ ] **AI & Personality:**
    - [ ] Create a configuration file for coach personalities (e.g., Sophia and Marcus).
    - [ ] Integrate the Generative AI model to power the chat.
    - [ ] Implement logic to inject the selected personality into the AI's system prompt.
- [ ] **Memory:**
    - [ ] Store conversation history in the database.
    - [ ] Ensure the AI can access past messages to maintain context in a conversation.
- [ ] **Minimal Frontend:**
    - [ ] Create a very basic web interface (eg a scaffolded React app) to interact with the backend API.

### **Future Goals (Post-MVP)**
These are features we can work on after the core MVP is complete and stable.

- [ ] **RAG Integration:**
    - [ ] Curate a knowledge base of psychology research papers and articles.
    - [ ] Implement a RAG pipeline to allow the coach to pull in and cite evidence-based information in its responses.
- [ ] **Proactive Check-ins / Notifications:**
    - [ ] Design a system for the coach to send non-intrusive notifications to check in with the user.
    - [ ] This could be based on time, or triggered by events in the conversation.
- [ ] **Advanced Personalization & Memory:**
    - [ ] Develop a more sophisticated memory system for the AI to track user's long-term goals, stated fears, and progress.
- [ ] **Full-Fledged Frontend:**
    - [ ] Build out the polished React-based user interface.
- [ ] **Voice Support:**
    - [ ] Integrate text-to-speech and speech-to-text for a voice-based coaching experience.

---

## ✅ Next Steps
1. ✅ **Finalize Plan:** We have reviewed and updated the project plan.
2. 🧱 **Scaffold Project:** Set up the FastAPI project structure.
3. 🐳 **Database Setup:** Get PostgreSQL running in Docker.
4. ✍️ **Initial Models:** Define the first database models with SQLAlchemy.
5. 🔌 **Connect AI:** Integrate the core AI service.