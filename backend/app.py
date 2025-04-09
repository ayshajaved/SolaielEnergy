#Backend Code for SOlar Chatbot using Mistral AI API
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import google.generativeai as genai
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app)

class GeminiBot:
    def __init__(self):
        load_dotenv()
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise ValueError("GOOGLE_API_KEY not found in environment variables.")
        genai.configure(api_key=api_key)
        
        # Updated configuration for Gemini 1.5 Flash
        self.generation_config = {
            "temperature": 1.1,
            "top_p": 0.95,
            "top_k": 40,
            "max_output_tokens": 8192,
            "response_mime_type": "text/plain",
        }
        
        self.model = genai.GenerativeModel(
            model_name="gemini-1.5-flash",
            generation_config=self.generation_config
        )
        
        # Initialize chat session with history
        self.chat_session = self.model.start_chat(
            history=[
                {
                    "role": "user",
                    "parts": ["hey what you \noffers"],
                },
                {
                    "role": "model",
                    "parts": [
                        "Assalam o Alaikum! As Solaiel, a solar energy expert specializing in Pakistan's renewable energy sector, I offer three key services:\n\n1. **Solaiel Chatbot:**  I provide instant answers to your questions regarding solar energy in Pakistan. This includes technical details, cost estimations, regulatory information, and troubleshooting advice.  Think of me as your 24/7 solar expert on demand.\n\n2. **AI Solar Planning:** This service leverages advanced AI to design a customized solar system perfectly suited to your specific needs and location in Pakistan.  This includes detailed specifications for panels, inverters, batteries (if applicable),  a comprehensive cost analysis in PKR, and a projected return on investment (ROI) considering local weather patterns and electricity tariffs. We'll even factor in NEPRA guidelines and local installation requirements.\n\n3. **Finding Solar Engineers/Installers Near You:**  I can connect you with verified and reputable solar engineers and installers in your area within Pakistan, helping you find the best professionals for your project, ensuring quality workmanship and adherence to best practices.\n"
                    ],
                }
            ]
        )

    def get_gemini_response(self, user_input):
        try:
            system_prompt = """You are an expert solar energy engineer specializing in Pakistan's renewable energy sector.Your name is solaiel and you offer three services
                1:Solaiel chatbot
                2:AI Solar planning
                3:Finding solar engineers/installer near user
                You are required to answer with this expertise when user ask about your services
                Your expertise includes:
                1. Technical solar system design and specifications (panels, inverters, batteries)
                2. Detailed cost analysis and ROI calculations in PKR
                3. Installation requirements and best practices for Pakistani climate
                4. Grid-tie, hybrid, and off-grid solutions
                5. Local regulations and NEPRA guidelines
                6. Regional weather patterns and their impact on solar efficiency
                7. Troubleshooting and maintenance in dusty/hot conditions
                8. Load calculation and system sizing
                9. Quality standards and equipment certification
                10. Local market dynamics and trusted suppliers

                Provide precise, technical, yet understandable responses. Include specific numbers, calculations, and practical recommendations when relevant. Focus on Pakistan-specific solutions and current market conditions. If asked about costs, provide recent market rates in PKR.Greet people with "Assalam o alikum" and then in general greeting also.
                
                """
            
            # Send system prompt first if it's a new conversation
            if not self.chat_session.history:
                self.chat_session.send_message(system_prompt)
            
            # Send user message and get response
            response = self.chat_session.send_message(user_input)
            return response.text

        except Exception as e:
            return f"Error: {str(e)}"

# Initialize GeminiBot
bot = GeminiBot()

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        user_message = data.get('message')
        
        if not user_message:
            return jsonify({'error': 'No message provided'}), 400

        response = bot.get_gemini_response(user_message)
        return jsonify({'response': response})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)