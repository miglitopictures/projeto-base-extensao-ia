// A generic onclick callback function.
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

chrome.runtime.onInstalled.addListener(function () {


    // A generic onclick callback function.
    chrome.contextMenus.onClicked.addListener(genericOnClick);

    // Create context menu
    chrome.contextMenus.create({
        id: 'olivia-explica', //menuItemId
        title: '🟢 OlivIA Explica',
        contexts: ["selection"],
    });
});