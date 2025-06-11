from flask import Flask, request, jsonify
import pdfplumber

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

    return jsonify({
        'resume_text': resume_text[:300], 
        'job_text': job_text[:300]
    })

if __name__ == '__main__':
    app.run(debug=True)