from flask import Flask, request, jsonify

import pdfplumber

from utils import match_keywords
from utils import extract_keywords_spacy
from utils import get_resume_feedback

from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route('/analyze', methods = ['POST'])

def analyze():
    try:
        resume_pdf = request.files['resume']
        job_pdf = request.files['job']
        print("Files received:", resume_pdf, job_pdf)

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
    
    except Exception as e:
        print("ERROR:", str(e))
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)