from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
import json
import re
from groq import Groq

client = Groq(api_key=settings.GROQ_API_KEY)


class GenerateQuestionsView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):

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
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )

            response_content = response.choices[0].message.content.strip()

            # Remove markdown code blocks like ```json
            response_content = re.sub(r"```json|```", "", response_content).strip()

            try:
                data = json.loads(response_content)
                questions = data.get("questions", [])

            except json.JSONDecodeError:

                # Fallback if AI returns numbered list
                lines = response_content.split("\n")

                questions = [
                    line.strip("0123456789.- ").strip('"')
                    for line in lines if line.strip()
                ]

            # Ensure only 5 questions returned
            questions = questions[:5]

            return Response({"questions": questions})

        except Exception as e:

            print("GROQ ERROR:", type(e).__name__, str(e))

            return Response(
                {"error": f"Failed to generate questions: {str(e)}"},
                status=500
            )