
// Aguarda o carregamento do popup
document.getElementById('btn-resumir').addEventListener('click', async () => {
	const status = document.getElementById('status');
	const paragraph = document.getElementById('response');
	status.innerText = "Chamando a Olívia...";

	// 1. Encontra a aba que está aberta agora
	const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

	// 2. Envia uma mensagem para o content.js que está naquela aba
	chrome.tabs.sendMessage(tab.id, { action: "simplify_page" }, (response) => {
		if (response) {
			console.log("popup.js recebeu o sinal de content.js!")
			console.log(response.message)
			typewrite(paragraph, response.message)
			status.innerText = "Olívia recebeu o sinal!";
		}
	});
});

document.getElementById('btn-show-olivia').addEventListener('click', async () => {

	const status = document.getElementById('status');
	// 1. Encontra a aba que está aberta agora
	const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

	// 2. Envia uma mensagem para o content.js que está naquela aba
	chrome.tabs.sendMessage(tab.id, { action: "show_olivia" }, (response) => {
		if (response) {
			status.innerText = "Div deveria ser acidionada!";
		}
	});
});