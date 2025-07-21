from flask import Flask, request, jsonify
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import nltk
import numpy as np
import torch
import os

# Setup
app = Flask(__name__)
nltk.data.path.append(os.path.join(os.getcwd(), "nltk_data"))
nltk.download('punkt', download_dir="nltk_data")
nltk.download('stopwords', download_dir="nltk_data")
stopwords = set(nltk.corpus.stopwords.words('english'))

# Abstractive model (T5-small)
abstractive_tokenizer = AutoTokenizer.from_pretrained("t5-small")
abstractive_model = AutoModelForSeq2SeqLM.from_pretrained("t5-small")

@app.route("/")
def home():
    return jsonify({"message": "Summarization API is running."})

@app.route("/abstractive", methods=["POST"])
def abstractive_summary():
    data = request.get_json()
    text = data.get("text", "")
    if not text:
        return jsonify({"error": "No text provided"}), 400

    input_text = "summarize: " + text
    input_ids = abstractive_tokenizer.encode(input_text, return_tensors="pt", truncation=True)

    summary_ids = abstractive_model.generate(
        input_ids,
        max_length=150,
        min_length=40,
        length_penalty=2.0,
        num_beams=4,
        early_stopping=True
    )
    summary = abstractive_tokenizer.decode(summary_ids[0], skip_special_tokens=True)
    return jsonify({"summary": summary})

@app.route("/extractive", methods=["POST"])
def extractive_summary():
    data = request.get_json()
    text = data.get("text", "")
    if not text:
        return jsonify({"error": "No text provided"}), 400

    # Sentence tokenization
    sentences = nltk.sent_tokenize(text)
    if len(sentences) <= 2:
        return jsonify({"summary": text})  # too short

    # TF-IDF vectorization
    vectorizer = TfidfVectorizer(stop_words=stopwords)
    X = vectorizer.fit_transform(sentences)

    # Similarity matrix
    sim_matrix = cosine_similarity(X)

    # Sentence scores: sum of similarity scores
    scores = sim_matrix.sum(axis=1)
    ranked_sentences = [sent for _, sent in sorted(zip(scores, sentences), reverse=True)]

    # Top 3 sentences
    top_n = max(1, len(sentences) // 3)
    summary = " ".join(ranked_sentences[:top_n])
    return jsonify({"summary": summary})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 7000))
    app.run(host="0.0.0.0", port=port)
