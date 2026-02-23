// UIController.js
class OliviaUI {
    constructor() {
        this.container = null;
    }

    // This is your "Main" function to build the box
    inject() {
        if (document.getElementById('olivia-root')) return;

        this.container = document.createElement('div');
        this.container.id = 'olivia-root';
        this.container.className = 'olivia-over'; // Uses your manifest CSS
        
        // Inside your inject() method in UIController.js
        const mascotUrl = chrome.runtime.getURL("assets/olivia_icon_128.png");

        this.container.innerHTML = `
            <img src="${mascotUrl}" id="olivia-mascot" />
            <div id="olivia-header">
                <div class="header-left">
                    <span class="olivia-title">OlivIA</span>
                </div>
                <span id="olivia-close">&times;</span>
            </div>
            <div id="olivia-body">
                <div id="olivia-status">Status Message</div>
                <div id="olivia-results">
                    Hey there! I'm ready to help you learn. Select some text and I'll explain it!
                </div>
                <button id="btn-resumir">Resumir esta página</button>
            </div>
        `;

        document.body.appendChild(this.container);
        this.setupDragging();
        this.setupClosing();
        this.setupActions();
    }

    setupActions() {
        const summarizeBtn = this.container.querySelector('#btn-resumir');
        summarizeBtn.onclick = () => {
            // We dispatch a custom event that content.js can hear
            const event = new CustomEvent('olivia-summarize-page');
            window.dispatchEvent(event);
        };
    }
    
    // Helper to show the AI's answer
    // UIController.js

    displayResult(text) {
        const resultsArea = this.container.querySelector('#olivia-results');
        if (resultsArea) {
            // 1. Create a clean wrapper for the typewriter to target
            resultsArea.innerHTML = `<div class="olivia-answer"></div>`;
            const target = resultsArea.querySelector('.olivia-answer');

            typewrite(target, text);
        }
    }

    updateStatus(text) {
        const status = this.container?.querySelector('#olivia-status');
        if (status) status.innerText = text;
    }

    setupClosing() {
        this.container.querySelector('#olivia-close').onclick = () => {
            this.container.remove();
        };
    }

    setupDragging() {
        const header = this.container.querySelector('#olivia-header');
        let offsetX, offsetY;

        header.onmousedown = (e) => {
            offsetX = e.clientX - this.container.getBoundingClientRect().left;
            offsetY = e.clientY - this.container.getBoundingClientRect().top;

            const move = (e) => {
                this.container.style.left = (e.clientX - offsetX) + 'px';
                this.container.style.top = (e.clientY - offsetY) + 'px';
                this.container.style.right = 'auto';
            };

            const stop = () => {
                document.removeEventListener('mousemove', move);
                document.removeEventListener('mouseup', stop);
            };

            document.addEventListener('mousemove', move);
            document.addEventListener('mouseup', stop);
        };
    }
}