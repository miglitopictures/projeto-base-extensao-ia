import os
from dotenv import load_dotenv
from google import genai
from flask import Flask, jsonify, request
from flask_cors import CORS


app = Flask(__name__)



# O CORS permite que a extensão (Chrome) converse com este servidor (Python)
CORS(app)

load_dotenv()
geminiKey = os.getenv("GEMINI_API_KEY")


client = genai.Client(api_key=geminiKey)


@app.route('/')
def home():
    return "Servidor da Olívia Online! 🚀"

@app.route('/test', methods=['GET'])
def test():
    return jsonify({
        "mensagem": "Olá! O Back-end da Olívia está vivo e ouvindo!",
        "status": "sucesso"
    }), 200

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
        "resumo": response.text,
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
        "resumo": response.text,
        "status": "processado"
    }), 200


if __name__ == '__main__':
    app.run(port=5000, debug=True)