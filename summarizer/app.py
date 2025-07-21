from flask import Flask, request, jsonify
from transformers import pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import os
import re

app = Flask(__name__)

# Load summarization pipeline once (DistilBART model)
abstractive_summarizer = pipeline("summarization", model="sshleifer/distilbart-cnn-12-6")

def split_sentences(text):
    sentences = re.split(r'(?<=[.!?]) +', text.strip())
    return [sent.strip() for sent in sentences if sent.strip()]

@app.route("/")
def home():
    return jsonify({"message": "Summarization API is running."})

@app.route("/abstractive", methods=["POST"])
def abstractive_summary():
    data = request.get_json()
    text = data.get("text", "")
    if not text:
        return jsonify({"error": "No text provided"}), 400

    # BART model input limit is around 1024 tokens (≈ 1024*4 characters)
    max_chunk_size = 4000  # for safety
    if len(text) > max_chunk_size:
        text = text[:max_chunk_size]

    summary_output = abstractive_summarizer(text, max_length=300, min_length=60, do_sample=False)
    summary = summary_output[0]["summary_text"]
    return jsonify({"summary": summary})

@app.route("/extractive", methods=["POST"])
def extractive_summary():
    data = request.get_json()
    text = data.get("text", "")
    if not text:
        return jsonify({"error": "No text provided"}), 400

    # Tokenize sentences
    sentences = split_sentences(text)
    if len(sentences) <= 2:
        return jsonify({"summary": text})

    # TF-IDF vectorization
    vectorizer = TfidfVectorizer(stop_words='english')
    X = vectorizer.fit_transform(sentences)

    # Similarity matrix
    sim_matrix = cosine_similarity(X)

    # Combined sentence scores
    tfidf_scores = X.sum(axis=1).A1
    sim_scores = sim_matrix.sum(axis=1)
    combined_scores = tfidf_scores + sim_scores

    ranked_sentences = [sent for _, sent in sorted(zip(combined_scores, sentences), reverse=True)]

    # Top N sentences (1/3rd of original)
    top_n = max(1, len(sentences) // 3)
    summary = " ".join(ranked_sentences[:top_n])
    return jsonify({"summary": summary})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 7000))
    app.run(host="0.0.0.0", port=port)
