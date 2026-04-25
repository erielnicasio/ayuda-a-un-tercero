/**
 * ACCESSIBILITY & THEME ENGINE - Ayuda a un Tercero
 * Handles Dark Mode, Visual Adaptability and UI Helpers
 */

document.addEventListener('DOMContentLoaded', () => {
    initAccessibility();
    injectAccessWidget();
});

function initAccessibility() {
    // 1. Load Theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    // 2. Load Accessibility States
    const settings = ['high-contrast', 'large-text', 'dyslexia-font'];
    settings.forEach(s => {
        if (localStorage.getItem(s) === 'true') {
            document.body.classList.add(s);
        }
    });
}

function injectAccessWidget() {
    const widgetHTML = `
        <div class="access-widget">
            <button class="access-trigger" title="Menú de Accesibilidad" id="accessBtn">
                <i data-lucide="accessibility"></i>
            </button>
            <div class="access-menu" id="accessMenu">
                <div style="margin-bottom: 12px; border-bottom: 1px solid var(--gray-200); padding-bottom: 8px;">
                    <h4 style="font-size: 0.9rem; color: var(--primary-blue-mid);">Adaptabilidad</h4>
                </div>
                
                <div class="access-option" onclick="toggleTheme()">
                    <span>Modo Oscuro</span>
                    <i data-lucide="moon" id="themeIcon"></i>
                </div>

                <div class="access-option" onclick="toggleAccess('high-contrast')">
                    <span>Alto Contraste</span>
                    <i data-lucide="eye"></i>
                </div>

                <div class="access-option" onclick="toggleAccess('large-text')">
                    <span>Texto Grande</span>
                    <i data-lucide="type"></i>
                </div>

                <div class="access-option" onclick="handleTTS()">
                    <span>Lectura de Voz</span>
                    <i data-lucide="volume-2"></i>
                </div>

                <button class="btn btn-primary btn-sm" style="width: 100%; margin-top: 10px;" onclick="resetAccess()">
                    Restablecer
                </button>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', widgetHTML);

    // Initialize icons for the new widget
    if (window.lucide) lucide.createIcons();

    const btn = document.getElementById('accessBtn');
    const menu = document.getElementById('accessMenu');

    btn.addEventListener('click', () => {
        menu.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!btn.contains(e.target) && !menu.contains(e.target)) {
            menu.classList.remove('active');
        }
    });

    updateVisualStates();
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const target = current === 'light' ? 'dark' : 'light';

    document.documentElement.setAttribute('data-theme', target);
    localStorage.setItem('theme', target);
    showFeedback(`Modo ${target === 'dark' ? 'Oscuro' : 'Claro'} activado`);
}

function toggleAccess(className) {
    const isActive = document.body.classList.toggle(className);
    localStorage.setItem(className, isActive);
    updateVisualStates();
}

function updateVisualStates() {
    const options = document.querySelectorAll('.access-option');
    options.forEach(opt => {
        const text = opt.querySelector('span').innerText.toLowerCase();
        if (text.includes('contraste') && document.body.classList.contains('high-contrast')) opt.classList.add('active');
        else if (text.includes('texto') && document.body.classList.contains('large-text')) opt.classList.add('active');
        else opt.classList.remove('active');
    });
}

function handleTTS() {
    const text = document.body.innerText;
    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        showFeedback('Lectura detenida');
    } else {
        const utterance = new SpeechSynthesisUtterance("Modo de lectura activado. Haz clic en los títulos para leer secciones.");
        utterance.lang = 'es-ES';
        window.speechSynthesis.speak(utterance);
        showFeedback('Lectura activada');
    }
}

function resetAccess() {
    document.body.classList.remove('high-contrast', 'large-text', 'dyslexia-font');
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.clear();
    location.reload();
}

function showFeedback(msg) {
    // Simple notification if toast system exists, otherwise alert or console
    if (typeof showToast === 'function') {
        showToast(msg, 'success');
    } else {
        console.log('Accessibility: ' + msg);
        // Create temporary toast if not exists
        const t = document.createElement('div');
        t.style.cssText = "position:fixed; bottom:20px; right:20px; background:var(--primary-blue-mid); color:white; padding:12px 24px; border-radius:12px; z-index:10001; animation:slideUp 0.3s ease;";
        t.innerText = msg;
        document.body.appendChild(t);
        setTimeout(() => t.remove(), 3000);
    }
}
