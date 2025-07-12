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

# Load models

def load_abstractive_model():
    print("Loading T5-base tokenizer...")
    tokenizer = AutoTokenizer.from_pretrained("t5-base")
    
    print("Loading T5-base model...")
    model = AutoModelForSeq2SeqLM.from_pretrained("t5-base")
    
    print("Creating summarization pipeline...")
    summarizer_pipeline = pipeline(
        task="summarization",
        model=model,
        tokenizer=tokenizer,
        framework="pt"
    )
    
    return summarizer_pipeline

abstractive_summarizer = load_abstractive_model()

#embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
embedding_model = SentenceTransformer('all-mpnet-base-v2')

# Helper Functions
def preprocess_text(text):
    sentences = sent_tokenize(text)
    return sentences

def generate_summary_embeddings(sentences, embeddings, num_sentences=3):
    sentence_embeddings = np.array(embeddings)
    similarity_matrix = cosine_similarity(sentence_embeddings)
    sentence_scores = np.sum(similarity_matrix, axis=1)
    ranked_sentences_with_scores = sorted(((score, index) for index, score in enumerate(sentence_scores)), reverse=True)
    summary_sentences = [sentences[index] for _, index in ranked_sentences_with_scores[:num_sentences]]
    summary = ' '.join(summary_sentences)
    return summary

def fun_embeddings(text):
    sentences = preprocess_text(text)
    embeddings = embedding_model.encode(sentences, convert_to_numpy=True, show_progress_bar=False)
    summary = generate_summary_embeddings(sentences, embeddings)
    return summary

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

#apply the abstractive summarization
def perform_abstractive_summarization(text, max_length=150, min_length=30):
    print(f"Performing summarization on input of length {len(text)} characters...")

    try:
        chunks = chunk_text(text, max_chunk_length=500)
        summaries = []

        for i, chunk in enumerate(chunks):
            print(f"Summarizing chunk {i + 1}/{len(chunks)}...")
            result = abstractive_summarizer(
                chunk,
                max_length=max_length,
                min_length=min_length,
                do_sample=False
            )
            summaries.append(result[0]['summary_text'])

        final_summary = " ".join(summaries)
        print("Generated final multi-chunk summary.")
        return final_summary

    except Exception as e:
        print(f"Error during summarization: {str(e)}")
        raise

def clean_summary(summary):
    # Remove non-ASCII 
    return re.sub(r'[^\x20-\x7E]+', '', summary)

# Routes
@app.route('/extractive', methods=['POST'])
def extractive():
    data = request.get_json()
    text = data.get('text', '')

    if not text:
        return jsonify({'error': 'No text provided.'}), 400

    summary = fun_embeddings(text)
    print(summary)
    return jsonify({'summary': summary})


# A route to handle POST requests for abstractive summaries
@app.route('/abstractive', methods=['POST'])
def abstractive():
    
    data = request.get_json()
    text = data.get('text', '')
    
    if not text:
        return jsonify({'error': 'No text provided.'}), 400

    try:
        # Generate and clean summary
        raw_summary = perform_abstractive_summarization(text)
        cleaned_summary = clean_summary(raw_summary)

        print("Final cleaned summary:", cleaned_summary)

        return jsonify({'summary': cleaned_summary})

    except Exception as e:
        return jsonify({'error': 'Failed to summarize the text.', 'details': str(e)}), 500
    
# @app.route('/hybrid', methods=['POST'])
# def hybrid_summary():
#     data = request.get_json()
#     text = data.get('text', '')

#     if not text:
#         return jsonify({'error': 'No text provided.'}), 400

#     try:
#         extractive_summary = fun_embeddings(text)

#         # Add "summarize:" prefix to help T5
#         t5_input = "summarize: " + extractive_summary.strip()

#         final_summary = perform_abstractive_summarization(t5_input, max_length=200, min_length=30)
#         cleaned = clean_summary(final_summary)

#         # ✅ Replace your current return statement with this:
#         return jsonify({
#             'extractive_summary': extractive_summary,
#             'abstractive_summary': cleaned,
#             'original_word_count': len(text.split()),
#             'extractive_word_count': len(extractive_summary.split()),
#             'abstractive_word_count': len(cleaned.split())
#         })

#     except Exception as e:
#         return jsonify({'error': 'Failed to summarize.', 'details': str(e)}), 500


if __name__ == '__main__':
    CORS(app)
    app.run(host='0.0.0.0',port=7000)