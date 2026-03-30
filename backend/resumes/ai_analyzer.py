import os
from groq import Groq

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def ai_resume_feedback(text):

    print("🚀 FUNCTION CALLED")

    try:
        response = client.chat.completions.create(
            model="llama3-70b-8192",   # ✅ FIXED MODEL
            messages=[
                {"role": "user", "content": text}
            ],
            max_tokens=200
        )

        print("✅ AI RESPONSE SUCCESS")

        return response.choices[0].message.content

    except Exception as e:
        print("🔥🔥🔥 AI ERROR HERE:", str(e))
        return "AI FAILED"