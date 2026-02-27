/**
 * @fileoverview Módulo de extração de dados (Scraper).
 * Responsável por limpar o DOM e extrair o texto relevante da página.
 */
const Scraper = {
    /**
     * Remove espaços extras e limpa quebras de linha de uma string.
     * @param {string} str - O texto bruto capturado da página.
     * @returns {string} O texto formatado e limpo.
     */
    normalizeText: (str) => {
        return str ? str.replace(/\s+/g, ' ').trim() : "";
    },

    /**
     * Captura o conteúdo principal da aba ativa e remove elementos irrelevantes (ads, menus).
     * @returns {string} O texto final pronto para ser enviado à API.
     */
    getCleanPageText: function() {
        // Localiza o melhor container
        const main = document.querySelector('main') || document.querySelector('article') || 
                     document.querySelector('#content') || document.body;
        
        // Clona e limpa o HTML
        const clone = main.cloneNode(true);
        const noise = clone.querySelectorAll('nav, header, footer, script, style, ad, .menu, .sidebar');
        noise.forEach(el => el.remove());

        // Pega o texto e já passa pela normalização antes de retornar
        return this.normalizeText(clone.innerText);
    }
};