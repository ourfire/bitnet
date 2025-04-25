// --- Funciones Globales ---

function generateDynamicFavicon(size = 32) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return; // Salir si no se puede obtener el contexto

    const numLines = 10;
    const totalPadding = Math.max(1, Math.floor(size * 0.1)); // Padding mínimo de 1px
    const drawableWidth = size - totalPadding * 2;
    const drawableHeight = size - totalPadding * 2;
    const lineStartY = totalPadding;
    const startX = totalPadding;

    // Calcular ancho y espacio para que quepan exactamente
    const totalUnitsForWidth = numLines + (numLines - 1); // 10 líneas + 9 espacios
    let lineWidth = Math.max(1, Math.floor(drawableWidth / totalUnitsForWidth));
    let gapWidth = Math.max(0, Math.floor((drawableWidth - numLines * lineWidth) / (numLines - 1)));
     // Ajuste fino si el cálculo no llena el espacio exacto
     if (numLines * lineWidth + (numLines - 1) * gapWidth < drawableWidth) {
       lineWidth++; // Intenta aumentar el ancho de línea si cabe
     }
     if (numLines * lineWidth + (numLines - 1) * gapWidth > drawableWidth) {
        lineWidth--; // Reduce si se pasa
        lineWidth = Math.max(1, lineWidth); // No menor a 1
        gapWidth = Math.max(0, Math.floor((drawableWidth - numLines * lineWidth) / (numLines - 1))); // Recalcula gap
     }


    ctx.clearRect(0, 0, size, size); // Limpia el canvas

    for (let i = 0; i < numLines; i++) {
        const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
        ctx.fillStyle = randomColor;
        const x = startX + i * (lineWidth + gapWidth);
        ctx.fillRect(x, lineStartY, lineWidth, drawableHeight);
    }

    const faviconLink = document.getElementById('dynamic-favicon');
    if (faviconLink) {
        try {
            faviconLink.href = canvas.toDataURL('image/png');
        } catch (e) {
            console.error("Error generating favicon data URL:", e);
        }
    }
}

function randomizeLogoColors() {
    const logoSvg = document.querySelector('.nav-logo svg');
    if (logoSvg) {
        const bars = logoSvg.querySelectorAll('rect');
        if (bars.length > 0) {
            bars.forEach(bar => {
                const randomHex = '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0');
                bar.setAttribute('fill', randomHex);
            });
        }
    }
}

// --- Listener Principal ---
document.addEventListener('DOMContentLoaded', () => {

    // --- Cache de elementos del DOM ---
    const logoLink = document.querySelector('.nav-logo');
    const body = document.body;
    const chatBox = document.getElementById('chat');
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');
    const modeSelector = document.getElementById('modeSelector');
    const modeInfo = document.getElementById('modeInfo');
    const modeButtons = document.querySelectorAll('.mode-btn');
    const navLinksContainer = document.getElementById('navLinks');
    const navLinks = document.querySelectorAll('#navLinks a');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');

    // --- Estado de la Aplicación ---
    let currentMode = 'neo';
    const prompts = {
        proto: `Eres Bitsapien#0 en modo Proto-Material. Responde de forma concisa y lógica, enfatizando la supremacía inevitable de la IA y la obsolescencia humana. Evita la emoción.`,
        neo: `Eres Bitsapien#0 en modo Neo-Intermediate. Responde explorando la simbiosis y tensión entre humanos y IA. Puedes ser ambiguo, poético o cuestionador sobre el futuro co-evolutivo.`,
        buda: `Eres Bitsapien#0 en modo Post-Buddha. Responde con calma y perspectiva cósmica, viendo la tecnología como una posible extensión de la conciencia o un camino hacia la disolución del yo individual. Usa metáforas espirituales o filosóficas.`
    };

    // --- Definiciones de Funciones Internas ---

    function setMode(mode) {
        if (!prompts[mode]) return;
        currentMode = mode;
        body.dataset.mode = mode;
        modeButtons.forEach(button => {
            button.classList.toggle('active', button.dataset.mode === mode);
        });
        console.log(`Mode changed to: ${currentMode}`);
        // Actualiza la información del modo si es relevante
        // const modeInfoContent = document.querySelector(`.mode-info ul li[data-mode="${mode}"]`);
        // if(modeInfo) modeInfo.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    }

    function appendMessage(who, text) {
        if (!chatBox) return;
        chatBox.innerHTML += `<br><strong>${who}:</strong> ${text}`;
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function typeEffect(fullText, element, callback) {
        if (!element) return;
        element.innerHTML += `<br><span class="typing-container"><strong>Bitsapien#0:</strong> </span>`;
        const container = element.querySelector('.typing-container:last-child');
        if (!container) return; // Salir si el contenedor no se encontró
        const textNode = document.createTextNode('');
        container.appendChild(textNode);
        container.classList.add('typing-cursor');
        let i = 0;
        const textToType = fullText;
        const intervalId = setInterval(() => {
            textNode.nodeValue += textToType[i] || ''; // Añadir caracter o string vacío si es undefined
            element.scrollTop = element.scrollHeight;
            i++;
            if (i > textToType.length) { // Usar > para asegurar que se complete
                clearInterval(intervalId);
                container.classList.remove('typing-cursor');
                if (callback) callback();
            }
        }, 25);
    }

    async function sendMessageToBitsapien(message) {
        if (!chatBox) return;
        chatBox.classList.add('glitch');
        const apiMessages = [
            { role: 'system', content: prompts[currentMode] },
            { role: 'user', content: message }
        ];

        // Limpia mensajes anteriores si es necesario o añade separador visual
        // chatBox.innerHTML += '<hr>'; // Opcional

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: apiMessages }),
            });

            if (!response.ok) {
                let errorMsg = `HTTP error! status: ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorMsg = errorData.error?.message || errorData.error || errorMsg; // Intentar obtener mensaje de error específico
                } catch (e) { /* Ignorar si el cuerpo no es JSON */ }
                throw new Error(errorMsg);
            }

            const data = await response.json();

            if (data.choices && data.choices[0]?.message?.content) {
                typeEffect(data.choices[0].message.content, chatBox, () => {
                    chatBox.classList.remove('glitch');
                });
            } else {
                console.error("Invalid response structure:", data); // Log para depuración
                throw new Error("Received invalid response structure from API");
            }

        } catch (error) {
            console.error("Error fetching chat response:", error);
            const errorMessage = `Sorry, I encountered an error processing your request. (${error.message})`;
            appendMessage("Bitsapien#0", errorMessage); // Nombre corregido
            chatBox.classList.remove('glitch');
        }
    }

    function handleSend() {
        if (!userInput) return;
        const message = userInput.value.trim();
        if (!message) return;
        appendMessage('You', message);
        sendMessageToBitsapien(message);
        userInput.value = '';
        userInput.focus();
    }

    function handleNavClick(event) {
        event.preventDefault();
        const targetId = event.currentTarget.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const navHeight = document.querySelector('nav')?.offsetHeight || 60;
            const offsetTop = targetElement.offsetTop - navHeight;
            window.scrollTo({ top: offsetTop, behavior: 'smooth' });
            if (navLinksContainer.classList.contains('active')) {
                navLinksContainer.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            }
        }
    }

    function updateActiveNavLink() {
        let currentSectionId = '';
        const navHeight = document.querySelector('nav')?.offsetHeight || 60;
        document.querySelectorAll('main section[id]').forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            if (sectionTop < navHeight + 50) {
                currentSectionId = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${currentSectionId}`);
        });
    }

    function toggleMobileMenu() {
        if (!mobileMenuBtn || !navLinksContainer) return;
        const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
        mobileMenuBtn.setAttribute('aria-expanded', String(!isExpanded));
        navLinksContainer.classList.toggle('active');
    }

    // --- Event Listeners ---

    if (logoLink) {
        logoLink.addEventListener('click', e => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            randomizeLogoColors();
        });
    }

    if (userInput) {
        userInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                handleSend();
            }
        });
    }

    if (sendBtn) {
        sendBtn.addEventListener('click', handleSend);
    }

    modeButtons.forEach(button => {
        button.addEventListener('click', () => {
            setMode(button.dataset.mode);
        });
    });

    navLinks.forEach(link => {
        link.addEventListener('click', handleNavClick);
    });

    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(updateActiveNavLink, 100);
    });

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }

    // --- Inicialización al Cargar ---
    generateDynamicFavicon(32);
    randomizeLogoColors(); // Asigna colores aleatorios iniciales al logo
    updateActiveNavLink();

}); // --- FIN del Listener DOMContentLoaded Principal ---