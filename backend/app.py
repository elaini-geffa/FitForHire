from flask import Flask, request, jsonify

import pdfplumber

from utils import match_keywords
from utils import extract_keywords_spacy
from utils import get_resume_feedback

app = Flask(__name__)

@app.route('/analyze', methods = ['POST'])

def analyze():
    resume_pdf = request.files['resume']
    job_pdf = request.files['job']

    with pdfplumber.open(resume_pdf) as pdf:
        resume_text = ""
        for page in pdf.pages:
            resume_text += page.extract_text()

    with pdfplumber.open(job_pdf) as pdf:
        job_text = ""
        for page in pdf.pages:
            job_text += page.extract_text()


    keywords = extract_keywords_spacy(job_text)
    matched_keywords, missing_keywords = match_keywords(resume_text, keywords)

    total = len(keywords)
    total_matched = len(matched_keywords)
    score = (total_matched / total) * 100 if total > 0 else 0

    feedback = get_resume_feedback(resume_text, job_text)

    return jsonify({
        'match_score': f"{score:.2f}%",
        'matched_keywords': matched_keywords,
        'missing_keywords': missing_keywords,
        'ai_feedback': feedback
    })

if __name__ == '__main__':
    app.run(debug=True)