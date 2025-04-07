#Backend Code for SOlar Chatbot using Mistral AI API
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from mistralai import Mistral
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

class MistralBot:
    def __init__(self):
        load_dotenv()
        api_key = os.getenv("Mistral_API_KEY")
        if not api_key:
            raise ValueError("Mistral_API_KEY not found in environment variables.")
        self.client = Mistral(api_key=api_key)

    def get_mistral_response(self, user_input):
        try:
            response = self.client.chat.complete(
                model="mistral-small",
                messages=[
                    {"role": "system", "content": "You are a helpful assistant specialized in solar energy solutions. Provide accurate and informative responses about solar technology, installation, maintenance, and benefits."},
                    {"role": "user", "content": user_input}
                ],
                max_tokens=150,
                temperature=0.7
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            return f"Error: {str(e)}"

# Initialize MistralBot
bot = MistralBot()

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        user_message = data.get('message')
        
        if not user_message:
            return jsonify({'error': 'No message provided'}), 400

        response = bot.get_mistral_response(user_message)
        return jsonify({'response': response})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)