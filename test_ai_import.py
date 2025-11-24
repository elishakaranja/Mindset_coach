import google.generativeai as genai
try:
    print("Import successful")
    model = genai.GenerativeModel('gemini-1.5-flash')
    print("Model initialized")
except Exception as e:
    print(f"Error: {e}")
