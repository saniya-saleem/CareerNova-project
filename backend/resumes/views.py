from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework.response import Response
from rest_framework import status

from .models import Resume
from .serializers import ResumeSerializer
from .analyzer import analyze_resume

import PyPDF2


class ResumeUploadView(APIView):
    permission_classes = [IsAuthenticated]

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

            resume.extracted_text = extracted_text

            result = analyze_resume(extracted_text)

            resume.ats_score = result["score"]

            resume.save()

            return Response({
                "message": "Resume uploaded successfully",
                "skills_found": result["skills"],
                "missing_skills": result["missing_skills"],   # ⭐ added
                "suggestions": result["suggestions"],         # ⭐ added
                "ats_score": result["score"]
            })

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)