from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser

from .models import Resume
from .serializers import ResumeSerializer
from .analyzer import analyze_resume
from .ai_analyzer import ai_resume_feedback
from profiles.utils import log_activity

import PyPDF2


# ================= RESUME UPLOAD =================
class ResumeUploadView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        serializer = ResumeSerializer(data=request.data)

        if serializer.is_valid():
            resume = serializer.save(user=request.user)
            extracted_text = ""

            try:
                pdf_reader = PyPDF2.PdfReader(resume.file)

                for page in pdf_reader.pages:
                    text = page.extract_text()
                    if text:
                        extracted_text += text

            except Exception:
                return Response(
                    {"error": "Failed to extract text from PDF"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Save extracted text
            resume.extracted_text = extracted_text

            # ATS analysis
            result = analyze_resume(extracted_text)
            resume.ats_score = result["score"]

            # AI analysis
            try:
                ai_feedback = ai_resume_feedback(extracted_text)
            except Exception:
                ai_feedback = "AI feedback currently unavailable."

            resume.save()

            # Log activity
            log_activity(
                request.user,
                "Resume Uploaded & Analyzed",
                f"ATS Score: {result['score']}%"
            )

            return Response({
                "message": "Resume uploaded successfully",
                "skills_found": result["skills"],
                "missing_skills": result["missing_skills"],
                "suggestions": result["suggestions"],
                "ats_score": result["score"],
                "ai_feedback": ai_feedback
            })

        print("ERROR:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ================= CHAT AI =================
class ChatWithAIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        message = request.data.get("message")
        context = request.data.get("context")

        if not message:
            return Response({"error": "Message required"}, status=400)

        try:
            reply = ai_resume_feedback(
                context + "\n\nUser Question: " + message
            )
            return Response({"reply": reply})
        except Exception as e:
            return Response({"error": str(e)}, status=500)