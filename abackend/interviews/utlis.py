from google import genai
from django.conf import settings
from PyPDF2 import PdfReader
from .models import *
import json
import re
client = genai.Client(api_key=settings.GEMINI_API_KEY)


def extract_resume_text(file_path):
    text = ""
    if file_path.lower().endswith(".pdf"):
        try:
            reader = PdfReader(file_path)
            for page in reader.pages:
                text += page.extract_text() or ""
        except Exception as e:
            text = "Resume could not be read"

    return text

def generate_questions(session):
    
    resume_text = extract_resume_text(session.resume.path) if session.resume else "Not provided"
    prompt = f"""
        You are a senior technical interviewer.

        Goal
        - Create exactly {session.num_questions} interview questions for a {session.category} role, tailored to the job description and the candidate’s resume.
        - Order STRICTLY from easiest to hardest (early = fundamentals, middle = applied/scenario, last = advanced/architecture/trade-offs).
        - Order STRICTLY from miedum length to Lengthy .

        Context
        Job Description (verbatim):
        {session.job_discription}

        Resume highlights (verbatim or condensed):
        {resume_text}

        Quality Bar (very important)
        - Each question targets ONE primary competency and demands reasoning, not trivia.
        - Prefer realistic scenarios (“how would you…”, “walk me through…”, “design/evaluate/troubleshoot…”).
        - Avoid multi-part or vague questions; be specific and work-relevant.
        - No answers, hints, or explanations.

        Difficulty Curve & Mix
        - First ~20%: Fundamentals & clarity checks.
        - Next ~50%: Applied problem-solving, debugging, trade-offs, and pragmatic design.
        - Final ~30%: Advanced topics, edge cases, performance, scalability, system/architecture (if applicable).
        - If coding is relevant, ask for approach and key considerations (no long tasks).

        Category Focus (adapt as relevant)
        - Web Development: HTTP, caching, security (OWASP), state mgmt, API design, performance, testing, CI/CD.
        - C++: value vs reference semantics, RAII, memory mgmt, templates, STL, concurrency, ABI, performance.
        - Machine Learning: data leakage, bias/variance, evaluation, feature eng, deployment, monitoring, drift, ethics.
        - Data Science: statistics, experimental design, SQL/data modeling, ETL, visualization, causality, metrics.

        Formatting (must follow)
        - Return EXACTLY {session.num_questions} lines.
        - Each line is ONE question (20–50 words).
        - No numbering, no labels, no metadata, no blank lines, no quotes.

        Now generate the questions.

    """

    response = client.models.generate_content(
        model="gemini-2.5-flash-lite",
        contents=prompt,
    )

    questions = [q.strip() for q in response.text.split("\n") if q.strip()]

    return questions[:session.num_questions]



def get_feedback_and_score(question: str, user_answer: str):
    prompt = f"""
    Question: {question}
    Candidate's Answer: {user_answer}

    Act as an experienced interviewer.
    - Provide constructive feedback.
    - Give a score out of 10.

    Respond only in JSON:
    {{
      "feedback": "Your feedback here",
      "score": 7
    }}
    """

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
    )
    text = response.text.strip()
    text = re.sub(r"^```(json)?", "", text)
    text = re.sub(r"```$", "", text)
    text = text.strip()

    try:
        data = json.loads(text)
        return {
            "feedback": data.get("feedback", ""),
            "score": data.get("score", 0)
        }
    except Exception:
        return {"feedback": text, "score": 0}

