import spacy

nlp = spacy.load("en_core_web_sm")

KEY_SKILLS = [

# programming languages
"python","java","c","c++","c#","javascript","typescript","go","rust","php","kotlin","swift",

# frontend
"react","angular","vue","html","css","tailwind","bootstrap",

# backend
"django","flask","node","express","spring","laravel",".net",

# databases
"sql","mysql","postgresql","mongodb","redis","firebase",

# devops
"docker","kubernetes","aws","azure","gcp","ci/cd","jenkins","linux",

# data
"machine learning","deep learning","pandas","numpy","tensorflow","pytorch",

# mobile
"android","flutter","react native","ios",

# tools
"git","github","bitbucket","jira","rest api","graphql"
]


def analyze_resume(text):

    text = text.lower()
    doc = nlp(text)

    found_skills = []
    suggestions = []

   
    for skill in KEY_SKILLS:
        if skill in text:
            found_skills.append(skill)

    missing_skills = [skill for skill in KEY_SKILLS if skill not in found_skills]

    skill_score = (len(found_skills) / len(KEY_SKILLS)) * 60


  
    sections = {
        "education": "education" in text,
        "experience": "experience" in text or "work experience" in text,
        "skills": "skills" in text,
        "projects": "project" in text
    }

    section_score = 0

    for section, exists in sections.items():
        if exists:
            section_score += 10
        else:
            suggestions.append(f"Add a {section.capitalize()} section to strengthen your resume.")


 
    if "intern" in text or "developer" in text or "engineer" in text:
        experience_score = 10
    else:
        experience_score = 0
        suggestions.append("Add internship or work experience.")


    score = skill_score + section_score + experience_score


    if "python" not in found_skills:
        suggestions.append("Consider adding Python projects or experience.")

    if "django" not in found_skills:
        suggestions.append("Add backend framework experience like Django.")

    if "react" not in found_skills:
        suggestions.append("Include frontend frameworks like React.")


    return {
        "skills": found_skills,
        "missing_skills": missing_skills[:5],
        "suggestions": suggestions,
        "score": round(score)
    }