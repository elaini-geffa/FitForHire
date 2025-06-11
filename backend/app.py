from flask import Flask, request, jsonify

import pdfplumber

from utils import clean_and_tokenize
from utils import extract_keywords
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

    resume_words = clean_and_tokenize(resume_text)
    keywords = extract_keywords(job_text)
    matched_keywords = []
    missing_keywords = []
    total = len(keywords)
    total_matched = len(matched_keywords)
    score = 0

    for keyword in keywords:
        if keyword in resume_words:
            matched_keywords.append(keyword)
            total_matched += 1
        else:
            missing_keywords.append(keyword)

    score += total_matched / total * 100

    feedback = get_resume_feedback(resume_text, job_text)

    return jsonify({
        'match_score': str(score) + '%', 
        'matched_keywords': matched_keywords,
        'missing_keywords': missing_keywords,
        'ai_feedback': feedback
    })

if __name__ == '__main__':
    app.run(debug=True)