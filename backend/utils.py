import os
import re
import spacy
from azure.ai.inference import ChatCompletionsClient
from spacy.matcher import Matcher
from azure.ai.inference.models import SystemMessage, UserMessage
from azure.core.credentials import AzureKeyCredential
from dotenv import load_dotenv

load_dotenv()
nlp = spacy.load("en_core_web_sm")

endpoint = "https://models.github.ai/inference"
model = "openai/gpt-4.1"
token = os.environ["GITHUB_TOKEN"]

client = ChatCompletionsClient(
    endpoint=endpoint,
    credential=AzureKeyCredential(token),
)

def get_resume_feedback(resume_text, job_text):
    prompt = f"""
You are an AI job coach. Compare the following resume and job description. Suggest how the resume can be improved to better match the job. List any missing skills, better ways to phrase vague experience, or things to emphasize. Suggest an updated resume to better display skills.

--- Resume ---
{resume_text}

--- Job Description ---
{job_text}

Provide your feedback as a bullet list.
"""

    response = client.complete(
        model=model,
        messages=[
            SystemMessage(content="You are a helpful assistant."),
            UserMessage(content=prompt),
        ],
        temperature=0.7,
        top_p=1
    )

    return response.choices[0].message.content

# Utilities for keyword extraction
def clean_and_tokenize(text):
    text = text.lower()
    text = re.sub(r'[^a-z\s]', '', text)
    return text.split()


def extract_keywords_spacy(text):
    doc = nlp(text.lower())
    keywords = set()

    # 1. Keep named entities that are likely skills/tools (ORG, PRODUCT, WORK_OF_ART, etc.)
    relevant_ents = {"ORG", "PRODUCT", "WORK_OF_ART", "EVENT", "LANGUAGE"}
    for ent in doc.ents:
        if ent.label_ in relevant_ents and len(ent.text) > 2:
            keywords.add(ent.text.strip())

    # 2. Match compound nouns like "data analysis", "project management"
    matcher = Matcher(nlp.vocab)
    pattern = [
        {"POS": "NOUN", "OP": "?"},
        {"POS": "NOUN"}
    ]
    matcher.add("NOUN_COMPOUNDS", [pattern])
    matches = matcher(doc)

    for _, start, end in matches:
        span = doc[start:end]
        if not span.text in nlp.Defaults.stop_words and len(span.text) > 2:
            keywords.add(span.text.strip())

    # 3. Remove short or stopword-like keywords
    keywords = [kw for kw in keywords if len(kw) > 2 and kw.lower() not in nlp.Defaults.stop_words]

    return list(keywords)

def match_keywords(resume_text, keywords):
    resume_text_lower = resume_text.lower()
    matched = []
    missing = []

    for kw in keywords:
        if kw.lower() in resume_text_lower:
            matched.append(kw)
        else:
            missing.append(kw)
    return matched, missing