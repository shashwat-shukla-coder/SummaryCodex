from flask import Flask, request, jsonify
# from transformers import pipeline  , No longer using abstractive summarization due to deployment memory issue of 512 ram
import re
from numpy import mean
from rank_bm25 import BM25Okapi
import os


app = Flask(__name__)

# Removed HuggingFace model loading
# abstractive_summarizer = pipeline("summarization", model="sshleifer/distilbart-cnn-12-6")

#sentence splitter (regex) in place of nltk.tokenize to avoid extra dependency and memory usage
def split_sentences(text):
    sentences = re.split(r'(?<=[.!?])\s+(?=[A-Z0-9"])', text.strip())
    return [s.strip() for s in sentences if s.strip()]

# BM25 helper function
def tokenize(text):
    return re.findall(r'\b\w+\b', text.lower())


@app.route("/")
def home():
    return jsonify({"message": "Summarization API is running."})

# abstractive route removed completely due to render deployment memory issues 512mb
# Uncomment the following code if you want to re-enable abstractive summarization
# Note: Ensure your deployment environment has sufficient memory to handle this model.
# @app.route("/abstractive", methods=["POST"])
# def abstractive_summary():
#     data = request.get_json()
#     text = data.get("text", "")
#     if not text:
#         return jsonify({"error": "No text provided"}), 400
#
#     # BART model input limit is around 1024 tokens (≈ 1024*4 characters)
#     max_chunk_size = 4000  # for safety
#     if len(text) > max_chunk_size:
#         text = text[:max_chunk_size]
#
#     summary_output = abstractive_summarizer(text, max_length=300, min_length=60, do_sample=False)
#     summary = summary_output[0]["summary_text"]
#     return jsonify({"summary": summary})


@app.route("/extractive", methods=["POST"])
def extractive_summary():
    data = request.get_json()
    text = data.get("text", "")
    if not text:
        return jsonify({"error": "No text provided"}), 400

    sentences = split_sentences(text)
    if len(sentences) < 2:
        return jsonify({"summary": text})

    tokenized_sentences = [tokenize(sent) for sent in sentences]
    bm25 = BM25Okapi(tokenized_sentences)

    # Score each sentence to all for comparrson
    sentence_scores = []
    all_tokens = [word for sent in tokenized_sentences for word in sent]
    unique_tokens = list(set(all_tokens))

    for i, sent_tokens in enumerate(tokenized_sentences):
        score = mean(bm25.get_scores(sent_tokens))
        coverage = len(set(sent_tokens) & set(unique_tokens)) / len(unique_tokens)
        combined_score = 0.7 * score + 0.3 * coverage
        sentence_scores.append((combined_score, i))


    ranked = sorted(sentence_scores, reverse=True)
    if len(sentences) <= 5:
        top_n = min(len(sentences), 2)
    else:
        top_n = max(1, int(len(sentences) * 0.4))

    selected_indexes = sorted([idx for _, idx in ranked[:top_n]])
    summary = " ".join([sentences[i] for i in selected_indexes])
    return jsonify({"summary": summary})


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 7000))
    app.run(host="0.0.0.0", port=port)
