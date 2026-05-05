import re

with open('pages/credifast.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace styles
new_styles = '''<style>
        :root {
            --glass-bg: var(--bg-white);
            --glass-border: rgba(0, 0, 0, 0.1);
        }

        .credifast-main {
            padding-top: calc(var(--nav-height) + 40px);
            position: relative;
            overflow: hidden;
            background: var(--bg-white);
        }

        /* Decorative Background Elements */
        .blob {
            position: absolute;
            width: 500px;
            height: 500px;
            background: radial-gradient(circle, rgba(10, 25, 47, 0.05) 0%, transparent 70%);
            filter: blur(60px);
            z-index: 0;
        }
        .blob-1 { top: -100px; right: -100px; }
        .blob-2 { bottom: -100px; left: -100px; background: radial-gradient(circle, rgba(255, 127, 50, 0.05) 0%, transparent 70%); }

        /* Hero Section */
        .cred-hero {
            display: grid;
            grid-template-columns: 1.2fr 0.8fr;
            gap: 60px;
            align-items: center;
            padding: 80px 0;
            position: relative;
            z-index: 1;
        }

        .cred-content h1 {
            font-size: 4.5rem;
            line-height: 1.1;
            margin-bottom: 24px;
            color: var(--primary-blue);
            font-weight: 800;
        }

        .cred-content h1 span {
            background: linear-gradient(135deg, var(--accent-orange) 0%, #e65c00 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .cred-content p {
            font-size: 1.25rem;
            color: var(--text-muted);
            max-width: 600px;
            margin-bottom: 40px;
            line-height: 1.8;
        }

        /* Premium Simulator Card */
        .premium-sim {
            background: white;
            border: 1px solid rgba(0, 0, 0, 0.05);
            border-radius: 32px;
            padding: 40px;
            box-shadow: var(--shadow-premium);
            position: relative;
        }

        .sim-tag {
            background: var(--primary-blue-light);
            color: var(--primary-blue);
            padding: 6px 12px;
            border-radius: 99px;
            font-size: 0.8rem;
            font-weight: 700;
            display: inline-block;
            margin-bottom: 20px;
            border: 1px solid rgba(10, 25, 47, 0.1);
        }

        .sim-field { margin-bottom: 32px; }

        .sim-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
        }

        .sim-header label {
            font-size: 0.9rem;
            font-weight: 600;
            color: var(--text-muted);
        }

        .sim-header .val {
            font-size: 1.5rem;
            font-weight: 800;
            color: var(--primary-blue);
        }

        /* Modern Range Input */
        input[type='range'].modern-range {
            -webkit-appearance: none;
            width: 100%;
            height: 6px;
            background: #E2E8F0;
            border-radius: 10px;
            outline: none;
        }

        input[type='range'].modern-range::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 24px;
            height: 24px;
            background: white;
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            border: 4px solid var(--primary-blue);
            transition: 0.2s ease;
        }

        .sim-results-box {
            background: var(--bg-light);
            border-radius: 24px;
            padding: 24px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 30px;
        }

        .res-item .label {
            font-size: 0.75rem;
            color: var(--text-muted);
            margin-bottom: 4px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .res-item .value {
            font-size: 1.25rem;
            font-weight: 800;
            color: var(--primary-blue);
        }

        /* Plans Section */
        .plans-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 32px;
            margin-top: 100px;
            padding-bottom: 100px;
        }

        .premium-plan {
            background: white;
            border: 1px solid rgba(0, 0, 0, 0.05);
            border-radius: 32px;
            padding: 48px;
            transition: var(--transition);
            position: relative;
            overflow: hidden;
            box-shadow: var(--shadow-soft);
        }

        .premium-plan:hover {
            transform: translateY(-10px);
            box-shadow: var(--shadow-premium);
            border-color: rgba(10, 25, 47, 0.1);
        }

        .premium-plan.featured {
            background: var(--primary-blue);
            border: none;
            box-shadow: var(--shadow-premium);
        }

        .premium-plan.featured * { color: white; }

        .plan-icon {
            width: 64px;
            height: 64px;
            background: var(--bg-light);
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 32px;
            font-size: 2rem;
            color: var(--primary-blue);
        }

        .premium-plan.featured .plan-icon {
            background: rgba(255, 255, 255, 0.1);
            color: white;
        }

        .plan-price {
            font-size: 3rem;
            font-weight: 800;
            margin: 24px 0;
            color: var(--primary-blue);
        }

        .premium-plan.featured .plan-price {
            color: white;
        }

        .plan-price span {
            font-size: 1rem;
            opacity: 0.6;
        }

        .features-list {
            margin: 32px 0;
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        .feature {
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 0.95rem;
            color: var(--text-muted);
        }
        
        .premium-plan.featured .feature {
            color: rgba(255,255,255,0.8);
        }

        .feature i { color: #10B981; }

        /* Modal Styles */
        .modal-overlay {
            position: fixed;
            inset: 0;
            background: rgba(10, 25, 47, 0.5);
            backdrop-filter: blur(10px);
            z-index: 2000;
            display: none;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .modal-overlay.active { display: flex; }

        .modal-content {
            background: white;
            width: 100%;
            max-width: 600px;
            border-radius: 32px;
            padding: 48px;
            border: 1px solid rgba(0, 0, 0, 0.1);
            position: relative;
            box-shadow: var(--shadow-premium);
            color: var(--text-dark);
        }

        .modal-content h2 {
            color: var(--primary-blue);
        }

        .modal-content p {
            color: var(--text-muted);
        }

        @media (max-width: 1024px) {
            .cred-hero { grid-template-columns: 1fr; text-align: center; }
            .cred-content p { margin: 0 auto 40px; }
            .cred-content h1 { font-size: 3.5rem; }
        }
    </style>'''

content = re.sub(r'<style>.*?</style>', new_styles, content, flags=re.DOTALL)

# Replace body tag
content = content.replace('<body class="scrolled">', '<body>')

# Replace navbar
navbar_html = '''    <nav class="navbar">
        <div class="container nav-content">
            <a href="../index.html" class="logo">
                <i data-lucide="heart" style="color: var(--accent-orange);"></i>
                Ayuda<span>Tercero</span>
            </a>
            <div class="nav-links">
                <a href="../index.html">Inicio</a>
                <a href="marketplace.html">Marketplace</a>
                <a href="donaciones.html">Donaciones</a>
                <a href="credifast.html">Préstamos</a>
                <a href="casos.html">Casos Sociales</a>
                <a href="impacto.html">Impacto</a>
            </div>
            <div class="nav-btns">
                <a href="perfil.html" class="btn btn-outline btn-sm">Mi Billetera</a>
            </div>
        </div>
    </nav>'''
content = re.sub(r'<nav class="navbar.*?<\/nav>', navbar_html, content, flags=re.DOTALL)

# Replace inline styles for buttons
content = content.replace('style="background: var(--brand-gradient);"', '')
content = content.replace('style="border-color: rgba(255,255,255,0.1); color: white;"', '')
content = content.replace('style="width: 100%; justify-content: center; background: white; color: #020617; font-weight: 800;"', 'style="width: 100%; justify-content: center;"')
content = content.replace('style="width: 100%; border-color: rgba(255,255,255,0.1); color: white;"', 'style="width: 100%;"')
content = content.replace('style="width: 100%; background: white; color: #2563EB;"', 'style="width: 100%; background: white; color: var(--primary-blue);"')

# Inputs in simulator and modals
content = content.replace('background: #1E293B; border: 1px solid rgba(255,255,255,0.1); color: white;', 'background: var(--bg-light); border: 1px solid rgba(0,0,0,0.1); color: var(--text-dark);')

# Mis compromisos plan panel
content = content.replace('background: rgba(30, 41, 59, 0.2);', 'background: var(--bg-light); border-color: rgba(0,0,0,0.05);')

# Dashboard text
content = content.replace('<h2 style="font-size: 1.8rem;">', '<h2 style="font-size: 1.8rem; color: var(--primary-blue);">')

# Modal text and buttons
content = content.replace('color: #94A3B8;', 'color: var(--text-muted);')
content = content.replace('color: white;', 'color: var(--text-dark);')
content = content.replace('style="position: absolute; top: 20px; right: 20px; background: none; border: none; color: white; font-size: 1.5rem; cursor: pointer;"', 'style="position: absolute; top: 20px; right: 20px; background: none; border: none; color: var(--primary-blue); font-size: 1.5rem; cursor: pointer;"')
content = content.replace('style="width: 100%; background: var(--brand-gradient); margin-top: 10px;"', 'style="width: 100%; margin-top: 10px;"')

# Fix table header colors
content = content.replace('background: rgba(255,255,255,0.05);', 'background: rgba(0,0,0,0.05);')
content = content.replace('border: 1px solid rgba(255,255,255,0.05);', 'border: 1px solid rgba(0,0,0,0.05);')
content = content.replace('border-bottom: 1px solid rgba(255,255,255,0.05);', 'border-bottom: 1px solid rgba(0,0,0,0.05);')


# Footer replacement
footer_html = '''    <footer class="footer">
        <div class="container">
            <div class="footer-grid">
                <div class="footer-about">
                    <a href="../index.html" class="logo" style="margin-bottom: 24px;">
                        <i data-lucide="heart" style="color: var(--accent-orange);"></i>
                        Ayuda<span>Tercero</span>
                    </a>
                    <p style="color: var(--text-muted);">Liderando la revolución de la ayuda comunitaria a través de un ecosistema solidario justo y transparente.</p>
                </div>
                <div>
                    <h4>Recursos</h4>
                    <ul style="margin-top: 16px;">
                        <li><a href="../index.html#como-funciona">Cómo funciona</a></li>
                        <li><a href="casos.html">Casos sociales</a></li>
                        <li><a href="reportes.html">Transparencia</a></li>
                    </ul>
                </div>
                <div>
                    <h4>Compañía</h4>
                    <ul style="margin-top: 16px;">
                        <li><a href="sobre-nosotros.html">Sobre nosotros</a></li>
                        <li><a href="impacto.html">Impacto</a></li>
                        <li><a href="../index.html#contacto">Contacto</a></li>
                    </ul>
                </div>
                <div>
                    <h4>Legal</h4>
                    <ul style="margin-top: 16px;">
                        <li><a href="privacidad.html">Privacidad</a></li>
                        <li><a href="terminos.html">Términos</a></li>
                        <li><a href="cookies.html">Cookies</a></li>
                    </ul>
                </div>
            </div>
            <div style="border-top: 1px solid var(--bg-light); margin-top: 60px; padding-top: 40px; text-align: center; color: var(--text-muted); font-size: 0.9rem;">
                © 2026 Ayuda a un Tercero. Todos los derechos reservados.
            </div>
        </div>
    </footer>'''
content = re.sub(r'<footer class="site-footer">.*?<\/footer>', footer_html, content, flags=re.DOTALL)

with open('pages/credifast.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('Success')
