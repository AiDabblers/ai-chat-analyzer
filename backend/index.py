import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from huggingface_hub import login
from transformers import pipeline, AutoModelForSequenceClassification, AutoTokenizer

app = Flask(__name__)
CORS(app)

# Securely get the Hugging Face token from the environment
huggingface_token = os.getenv('HF_TOKEN')
if huggingface_token:
    login(token=huggingface_token)

# Load Hugging Face emotion detection pipeline
try:
    model_name = "michellejieli/emotion_text_classifier"
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForSequenceClassification.from_pretrained(model_name)
    emotion_classifier = pipeline("text-classification", model=model, tokenizer=tokenizer)
except Exception as e:
    print(f"Error loading model: {e}")
    emotion_classifier = None

@app.route('/', methods=['GET'])
def hello():
    return "hello world!"

@app.route('/chat', methods=['POST'])
def chat():
    """
    Handle chat requests, process the message, and detect emotions.

    This function receives a POST request with a message and a flag indicating whether AI emotion detection is enabled.
    If enabled, it processes the message using a Hugging Face model to detect the emotion. The detected emotion or a
    message indicating that emotion detection is disabled is then returned in the response.

    Returns:
        JSON response containing the original message and detected emotion.
    """
    if not request.json or 'message' not in request.json or 'ai_enabled' not in request.json:
        return jsonify({"error": "Invalid request. Must contain 'message' and 'ai_enabled' fields."}), 400

    user_input = request.json.get('message')
    ai_enabled = request.json.get('ai_enabled')

    # Check if AI emotion detection is enabled
    if ai_enabled and emotion_classifier:
        result = emotion_classifier(user_input)
        emotion = result[0]['label']
    else:
        emotion = "Emotion detection is disabled."

    # Create response dictionary
    response = {
        "message": user_input,
        "emotion": emotion
    }

    return jsonify(response)


if __name__ == '__main__':
    app.run(debug=True)
