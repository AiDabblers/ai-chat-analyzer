from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline

app = Flask(__name__)
CORS(app)

# Load Hugging Face emotion detection pipeline
emotion_classifier = pipeline("text-classification", model="michellejieli/emotion_text_classifier")


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
    user_input = request.json.get('message')
    ai_enabled = request.json.get('ai_enabled')

    # Check if AI emotion detection is enabled
    if ai_enabled:
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
