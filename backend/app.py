import os
from dotenv import load_dotenv
from google import genai
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)

CORS(app) # O CORS permite que a extensão (Chrome) converse com este servidor (Python)

load_dotenv() # Pega as variavei sensívei do arquivo .env

geminiKey = os.getenv("GEMINI_API_KEY") 
client = genai.Client(api_key=geminiKey) # Inicialização do Cliente Gemini

#-------


@app.route('/')
def home():
    return "Servidor da Olívia Online! 🚀"


@app.route('/simplify', methods=['POST']) # Aceita apenas POST
def simplify():
    dados = request.get_json()
    texto_recebido = dados.get('text', '')
    
    print(f"Recebi {len(texto_recebido)} caracteres para processar!")

    response = client.models.generate_content(
            model="gemini-2.5-flash", 
            contents=f"Você é OlívIA uma assistente de estudos para criaças de 5 a 10 anos com TEA e TDAH, explique de maneira simplificada em ate 5 frases (não responda com markdown): {texto_recebido}"
        )

    print(response.text)

    return jsonify({
        "message": response.text,
        "status": "processado"
    }), 200


@app.route('/explain', methods=['POST']) # Aceita apenas POST
def explain():
    dados = request.get_json()
    texto_recebido = dados.get('text', '')

    print(f"Recebi {len(texto_recebido)} caracteres para processar!")

    response = client.models.generate_content(
            model="gemini-2.5-flash", 
            contents=f"Você é OlívIA uma assistente de estudos para criaças de 5 a 10 anos com TEA e TDAH, explique de maneira simplificada em até 3 frases: {texto_recebido}"
        )

    print(response.text)

    return jsonify({
        "message": response.text,
        "status": "processado"
    }), 200


if __name__ == '__main__':
    app.run(port=5000, debug=True)