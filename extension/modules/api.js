/**
 * @fileoverview Módulo de comunicação com a API da OlívIA.
 * Centraliza as chamadas de rede para o servidor Python/Flask.
 */
const OliviaAPI = {
    serverUrl: "http://localhost:5000",
    
    /**
     * Envia um texto ao servidor Flask para processamento e retorna a resposta da OlivIA.
     * @param {string} endpoint - O caminho da API (ex: 'simplify' ou 'explain').
     * @param {string} text - O conteúdo que a OlívIA deve analisar.
     * @returns {Promise<Object>} Objeto contendo resposta do servidor {status: "success"|"error", message: string}.
     */
    askOlivia: async function(endpoint, text) {
        // limite de segurança aqui para proteger a chamada
        const limitedText = text.substring(0, 12000);

        try {
            const response = await fetch(`${this.serverUrl}/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: limitedText }),
            });

            if (!response.ok) {
                throw new Error(`Erro no Servidor Python: ${response.status}`);
            }

            const data = await response.json();

            // Padronizamos o retorno para o content.js não ter que adivinhar
            return { 
                status: "success", 
                message: data.message 
            };

        } catch (err) {
            console.error("Erro na chamada da API:", err);
            return { 
                status: "error", 
                message: "Não consegui falar com a OlívIA agora." 
            };
        }
    }
};