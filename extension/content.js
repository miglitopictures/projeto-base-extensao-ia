const Olivia = new OliviaUI();

// --- 1. THE COMMAND CENTER ---
// This handles the API call AND the UI updates in one place
async function handleAction(action, text) {
    Olivia.inject(); // Ensure UI is open
    Olivia.updateStatus(action === 'simplify' ? "Simplificando..." : "Explicando \"" + text + "\"...");

    const response = await callOlivia(action, text);
    
    Olivia.updateStatus(""); // Clear status
    if (response.status === "success") {
        Olivia.displayResult(response.message);
    } else {
        Olivia.displayResult("Puxa, a OlivIA se confundiu. Tente novamente!");
    }
    
    return response;
}

// --- 2. EXTERNAL MESSAGES (Popup / Context Menu) ---
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'simplify_page') {
        const cleanText = removeEmptySpace(pageMainText());
        handleAction('simplify', cleanText).then(sendResponse);
        return true;
    }

    if (request.action === "explain_selection") {
        handleAction('explain', request.text).then(sendResponse);
        return true;
    }

    if (request.action === "show_olivia") {
        Olivia.inject();
        sendResponse({ status: "Olivia Spawned" });
    }
});

// --- 3. INTERNAL UI MESSAGES (The "Resumir" Button) ---
window.addEventListener('olivia-summarize-page', () => {
    const cleanText = removeEmptySpace(pageMainText());
    handleAction('simplify', cleanText); // Reuses handleAction!
});

async function callOlivia(endpoint, text) {

    const limitedText = text.substring(0, 12000); // filter input

    try {
        const response = await fetch(`http://localhost:5000/${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: limitedText }),
        });

        if (!response.ok) throw new Error(":( Error in Python Server (300-599)!");
        const data = await response.json()

        return { status: "success", message: data.resumo };

    } catch (err) {
        console.error("Something went erong with the API call.", err);
        return { status: "error", message: "Could not reach OlivIA." };
    }
};

function pageMainText(){
    const main = document.querySelector('main') || document.querySelector('article') ||
                 document.querySelector('#content') || document.body;

    const clones = main.cloneNode(true);

    const elementsToDelete = clones.querySelectorAll('nav, header, footer, script, style, ad, .menu, .sidebar');
    elementsToDelete.forEach(el => el.remove());

    return clones.innerText;
}

function removeEmptySpace(str){
    return str.replace(/\s+/g, ' ').trim();
}