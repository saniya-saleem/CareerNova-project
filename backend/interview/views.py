from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
from profiles.utils import log_activity  # ← add this
import json
import re
from groq import Groq
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
from groq import Groq
import json

class GenerateQuestionsView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if not settings.GROQ_API_KEY:
            return Response({"error": "Groq API key not configured"}, status=500)

        client = Groq(api_key=settings.GROQ_API_KEY)
        role = request.data.get("role")

        if not role:
            return Response({"error": "Role is required"}, status=400)

        try:
            prompt = f"""
Generate exactly 5 interview questions for a {role} developer.

Return ONLY valid JSON in this format:

{{
  "questions": [
    "question1",
    "question2",
    "question3",
    "question4",
    "question5"
  ]
}}
"""
            response = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[{"role": "user", "content": prompt}]
            )

            response_content = response.choices[0].message.content.strip()
            response_content = re.sub(r"```json|```", "", response_content).strip()

            try:
                data = json.loads(response_content)
                questions = data.get("questions", [])
            except json.JSONDecodeError:
                lines = response_content.split("\n")
                questions = [
                    line.strip("0123456789.- ").strip('"')
                    for line in lines if line.strip()
                ]

            questions = questions[:5]

            log_activity(
                request.user,
                "AI Mock Interview Started",
                f"Role: {role} Developer"
            )

            return Response({"questions": questions})

        except Exception as e:
            print("GROQ ERROR:", type(e).__name__, str(e))
            return Response(
                {"error": f"Failed to generate questions: {str(e)}"},
                status=500
            )
            
class EvaluateAnswersView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if not settings.GROQ_API_KEY:
            return Response({"error": "Groq API key not configured"}, status=500)

        answers = request.data.get("answers")

        if not answers:
            return Response({"error": "Answers are required"}, status=400)

        client = Groq(api_key=settings.GROQ_API_KEY)

        prompt = f"""
        You are a senior technical interviewer.

        Evaluate the candidate answers.

        Return ONLY valid JSON.

        Format:

        {{
        "score": 85,
        "strengths": ["..."],
        "weaknesses": ["..."],
        "suggestions": ["..."]
        }}

        Answers:
        {json.dumps(answers, indent=2)}
        """

        try:
            response = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[{"role": "user", "content": prompt}]
            )

            content = response.choices[0].message.content.strip()

           
            content = content.replace("```json", "").replace("```", "").strip()

            print("AI RESPONSE:", content)

            result = json.loads(content)

            return Response(result)

        except json.JSONDecodeError:
            print("INVALID JSON FROM AI:", content)
            return Response({
                "score": 70,
                "strengths": ["Answer attempted"],
                "weaknesses": ["AI response parsing failed"],
                "suggestions": ["Improve explanation"]
            })

        except Exception as e:
            print("EVALUATION ERROR:", str(e))
            return Response({"error": str(e)}, status=500)



class SpeechToTextView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        audio_file = request.FILES.get("audio")

        if not audio_file:
            return Response({"error": "No audio file"}, status=400)

        if not settings.GROQ_API_KEY:
            return Response({"error": "Groq API key not configured"}, status=500)

        try:
            client = Groq(api_key=settings.GROQ_API_KEY)

            # transcription = client.audio.transcriptions.create(
            #     file=(audio_file.name, audio_file.read(), audio_file.content_type),
            #     model="whisper-large-v3",
            #     response_format="text",
            # )
            
            transcription = client.audio.transcriptions.create(
                file=(audio_file.name, audio_file.read(), audio_file.content_type),
                model="whisper-large-v3",
                response_format="text",
                prompt="Interview answer about software development.",  # ✅ add this line only
            )
              

            return Response({"text": transcription})

        except Exception as e:
            print("🔥 SPEECH ERROR:", type(e).__name__, str(e))
            return Response({"error": str(e)}, status=500)