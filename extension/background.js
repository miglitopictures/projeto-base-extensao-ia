/**
 * @fileoverview Service Worker da Extensão (Background).
 * Atua como o intermediário entre as APIs do Chrome (menus, ícone) e o código da página.
 */

/**
 * Escuta o clique no ícone da extensão na barra de ferramentas.
 * @param {chrome.tabs.Tab} tab - A aba onde o usuário clicou no ícone.
 */
chrome.action.onClicked.addListener((tab) => {
    
    // Verifica se a aba tem um ID válido e se não é uma página restrita (como chrome://)
    if (tab.id) {
        chrome.tabs.sendMessage(tab.id, { action: "show_olivia" }, (response) => {
            // Tratamento de erro caso o content script não esteja pronto
            if (chrome.runtime.lastError) {
                console.warn("A OlivIA não pode ser carregada nesta página: ", chrome.runtime.lastError.message);
            }
        });
    }
});


/**
 * Processa cliques nos itens do menu de contexto (botão direito).
 * @param {chrome.contextMenus.OnClickData} info - Dados sobre o item clicado e o texto selecionado.
 * @param {chrome.tabs.Tab} tab - A aba onde o menu foi acionado.
 */
function genericOnClick(info, tab) {
    if (info.menuItemId === "olivia-explica"){
        //Logica de perguntar para olivia
        console.log('perguntou pra olivia sobre: \"' + info.selectionText + "\"");
        // 2. Envia uma mensagem para o content.js que está naquela aba
        chrome.tabs.sendMessage(tab.id, { action: "explain_selection", text: info.selectionText }, (response) => {
            if (response) {
                console.log("background.js recebeu o sinal de content.js!")
                console.log(response)
            }
        });
    }
}

/**
 * Configuração inicial da extensão durante a instalação ou atualização.
 * Cria os menus de contexto e registra os ouvintes de eventos.
 */
chrome.runtime.onInstalled.addListener(function () {

    // Registra a função de tratamento de cliques no menu
    chrome.contextMenus.onClicked.addListener(genericOnClick);

    /**
     * Cria menu de contexto para explicar seleções de texto.
     * Aparece apenas quando o usuário destaca (seleciona) um texto na página.
     */
    chrome.contextMenus.create({
        id: 'olivia-explica', //menuItemId
        title: '🟢 OlivIA Explica',
        contexts: ["selection"],
    });
});