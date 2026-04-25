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
    var options = document.querySelectorAll('.access-option');
    options.forEach(function(opt) {
        var text = opt.querySelector('span').innerText.toLowerCase();
        opt.classList.remove('active');
        if (text.includes('contraste') && document.body.classList.contains('high-contrast')) opt.classList.add('active');
        if (text.includes('texto') && document.body.classList.contains('large-text')) opt.classList.add('active');
        if (text.includes('oscuro') && document.documentElement.getAttribute('data-theme') === 'dark') opt.classList.add('active');
        if (text.includes('voz') && _ttsEnabled) opt.classList.add('active');
    });
}

var _ttsEnabled = localStorage.getItem('tts-enabled') === 'true';

function handleTTS() {
    _ttsEnabled = !_ttsEnabled;
    localStorage.setItem('tts-enabled', _ttsEnabled);
    if (_ttsEnabled) {
        showFeedback('Lectura por voz activada. Haz clic en cualquier texto.');
        enableClickTTS();
    } else {
        window.speechSynthesis.cancel();
        showFeedback('Lectura por voz desactivada');
        disableClickTTS();
    }
    updateVisualStates();
}

function _ttsClickHandler(e) {
    var el = e.target;
    var text = (el.innerText || el.textContent || '').trim();
    if (!text || text.length < 2) return;
    window.speechSynthesis.cancel();
    var utt = new SpeechSynthesisUtterance(text);
    utt.lang = 'es-ES';
    window.speechSynthesis.speak(utt);
}

function enableClickTTS() {
    document.body.addEventListener('click', _ttsClickHandler, true);
}

function disableClickTTS() {
    document.body.removeEventListener('click', _ttsClickHandler, true);
}

if (_ttsEnabled) enableClickTTS();

function resetAccess() {
    document.body.classList.remove('high-contrast', 'large-text', 'dyslexia-font');
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
    localStorage.removeItem('high-contrast');
    localStorage.removeItem('large-text');
    localStorage.removeItem('dyslexia-font');
    localStorage.removeItem('tts-enabled');
    _ttsEnabled = false;
    disableClickTTS();
    window.speechSynthesis.cancel();
    updateVisualStates();
    showFeedback('Ajustes restablecidos');
}

function showFeedback(msg) {
    if (typeof App !== 'undefined' && App.showToast) {
        App.showToast(msg, 'info');
    } else {
        var t = document.createElement('div');
        t.style.cssText = "position:fixed; bottom:20px; right:20px; background:#2563eb; color:white; padding:12px 24px; border-radius:12px; z-index:10001; font-weight:600; font-size:0.9rem;";
        t.innerText = msg;
        document.body.appendChild(t);
        setTimeout(function() { t.remove(); }, 3000);
    }
}
