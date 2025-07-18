from flask import Flask, request, jsonify
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, pipeline
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import nltk
from nltk.tokenize import sent_tokenize
from nltk.corpus import stopwords
from flask_cors import CORS
import re

nltk.download('punkt')
nltk.download('stopwords')

app = Flask(__name__)
CORS(app)

# Load T5 model for abstractive summarization
def load_abstractive_model():
    tokenizer = AutoTokenizer.from_pretrained("t5-base")
    model = AutoModelForSeq2SeqLM.from_pretrained("t5-base")
    summarizer_pipeline = pipeline(
        task="summarization",
        model=model,
        tokenizer=tokenizer,
        framework="pt"
    )
    return summarizer_pipeline

abstractive_summarizer = load_abstractive_model()

# Load sentence transformer for extractive summarization
embedding_model = SentenceTransformer('all-mpnet-base-v2')

def preprocess_text(text):
    return sent_tokenize(text)

def generate_summary_embeddings(sentences, embeddings, num_sentences=3):
    similarity_matrix = cosine_similarity(embeddings)
    scores = np.sum(similarity_matrix, axis=1)
    ranked = sorted(((score, idx) for idx, score in enumerate(scores)), reverse=True)
    summary = ' '.join(sentences[idx] for _, idx in ranked[:num_sentences])
    return summary

def fun_embeddings(text):
    sentences = preprocess_text(text)
    embeddings = embedding_model.encode(sentences, convert_to_numpy=True, show_progress_bar=False)
    return generate_summary_embeddings(sentences, embeddings)

def chunk_text(text, max_chunk_length=500):
    sentences = sent_tokenize(text)
    chunks, current_chunk = [], ""

    for sentence in sentences:
        if len(current_chunk) + len(sentence) < max_chunk_length:
            current_chunk += " " + sentence
        else:
            chunks.append(current_chunk.strip())
            current_chunk = sentence

    if current_chunk:
        chunks.append(current_chunk.strip())

    return chunks

def perform_abstractive_summarization(text, max_length=150, min_length=30):
    chunks = chunk_text(text)
    summaries = []

    for chunk in chunks:
        result = abstractive_summarizer(
            chunk,
            max_length=max_length,
            min_length=min_length,
            do_sample=False
        )
        summaries.append(result[0]['summary_text'])

    return " ".join(summaries)

def clean_summary(summary):
    return re.sub(r'[^\x20-\x7E]+', '', summary)

@app.route('/extractive', methods=['POST'])
def extractive():
    data = request.get_json()
    text = data.get('text', '')

    if not text:
        return jsonify({'error': 'No text provided.'}), 400

    summary = fun_embeddings(text)
    return jsonify({'summary': summary})

@app.route('/abstractive', methods=['POST'])
def abstractive():
    data = request.get_json()
    text = data.get('text', '')

    if not text:
        return jsonify({'error': 'No text provided.'}), 400

    try:
        raw_summary = perform_abstractive_summarization(text)
        cleaned = clean_summary(raw_summary)
        return jsonify({'summary': cleaned})
    except Exception as e:
        return jsonify({'error': 'Failed to summarize the text.', 'details': str(e)}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
