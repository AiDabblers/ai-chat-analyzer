import unittest
import json
from App import app


class FlaskAppTestCase(unittest.TestCase):
    def setUp(self):
        # Create a test client
        self.app = app.test_client()
        self.app.testing = True

    def test_chat_endpoint_with_emotion_detection(self):
        # Test the /chat endpoint with emotion detection enabled
        payload = {
            "message": "I am very happy today!",
            "ai_enabled": True
        }
        response = self.app.post('/chat', data=json.dumps(payload), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        print("With Emotion Detection Enabled:", data)
        self.assertIn("emotion", data)
        self.assertNotEqual(data["emotion"], "Emotion detection is disabled.")

    def test_chat_endpoint_without_emotion_detection(self):
        # Test the /chat endpoint with emotion detection disabled
        payload = {
            "message": "I am very happy today!",
            "ai_enabled": False
        }
        response = self.app.post('/chat', data=json.dumps(payload), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        print("Without Emotion Detection Enabled:", data)
        self.assertIn("emotion", data)
        self.assertEqual(data["emotion"], "Emotion detection is disabled.")

    def test_chat_endpoint_invalid_request(self):
        # Test the /chat endpoint with an invalid request
        payload = {
            "message": "I am very happy today!"
            # Missing 'ai_enabled' field
        }
        response = self.app.post('/chat', data=json.dumps(payload), content_type='application/json')
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.data)
        print("Invalid Request:", data)
        self.assertIn("error", data)
        self.assertEqual(data["error"], "Invalid request. Must contain 'message' and 'ai_enabled' fields.")


if __name__ == '__main__':
    unittest.main()
