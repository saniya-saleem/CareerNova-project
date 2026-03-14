import spacy

nlp = spacy.load("en_core_web_sm")

KEY_SKILLS = [
    "python",
    "django",
    "react",
    "javascript",
    "sql",
    "machine learning",
]


def analyze_resume(text):

    text = text.lower()

    found_skills = []

    for skill in KEY_SKILLS:
        if skill in text:
            found_skills.append(skill)

   
    score = (len(found_skills) / len(KEY_SKILLS)) * 100

    
    missing_skills = [skill for skill in KEY_SKILLS if skill not in found_skills]

    
    suggestions = []

    if "python" not in found_skills:
        suggestions.append("Consider adding Python projects or experience.")

    if "django" not in found_skills:
        suggestions.append("Add backend framework experience like Django.")

    if "react" not in found_skills:
        suggestions.append("Include frontend frameworks like React.")

    if score < 70:
        suggestions.append("Include more technical keywords relevant to your role.")

    return {
        "skills": found_skills,
        "missing_skills": missing_skills,
        "suggestions": suggestions,
        "score": round(score, 2)
    }