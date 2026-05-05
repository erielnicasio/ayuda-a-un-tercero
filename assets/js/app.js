// app.js - Lógica compartida entre todas las páginas
// Maneja: navbar dinámica, estado de auth, notificaciones, toasts

var App = {
    isSubpage: false,

    init: function() {
        this.isSubpage = window.location.pathname.includes('/pages/');
        this.updateAuthUI();
        this.updateNotifBadge();
    },

    basePath: function(path) {
        return this.isSubpage ? '../' + path : path;
    },
    pagePath: function(page) {
        return this.isSubpage ? page : 'pages/' + page;
    },

    updateAuthUI: function() {
        var user = DB.getCurrentUser();
        var authBtn = document.getElementById('auth-btn');
        var navBtns = document.querySelector('.nav-btns');
        var notifLink = document.getElementById('nav-notif-link');
        var adminLink = document.getElementById('nav-admin-link');

        if (user) {
            if (authBtn) {
                authBtn.textContent = user.name || user.email.split('@')[0];
                authBtn.href = this.pagePath('perfil.html');
                authBtn.className = 'btn btn-primary btn-sm loaded';
            }
            if (adminLink) adminLink.style.display = user.role === 'admin' ? '' : 'none';
            if (notifLink) notifLink.style.display = '';
        } else {
            if (authBtn) {
                authBtn.textContent = 'Iniciar Sesión';
                authBtn.href = this.pagePath('login.html');
                authBtn.className = 'btn btn-outline btn-sm loaded';
            }
            if (adminLink) adminLink.style.display = 'none';
            if (notifLink) notifLink.style.display = 'none';
        }
    },

    updateNotifBadge: function() {
        var user = DB.getCurrentUser();
        var badge = document.getElementById('notif-badge');
        if (!badge || !user) {
            if (badge) badge.style.display = 'none';
            return;
        }
        var userId = user.role === 'admin' ? 'admin' : user.id;
        var count = DB.getUnreadCount(userId);
        if (count > 0) {
            badge.style.display = '';
            badge.textContent = count > 9 ? '+9' : count;
        } else {
            badge.style.display = 'none';
        }
    },

    logout: function() {
        DB.logout();
        window.location.href = this.isSubpage ? '../index.html' : 'index.html';
    },

    showToast: function(msg, type) {
        type = type || 'success';
        var container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.style.cssText = 'position:fixed;top:80px;right:20px;z-index:10000;display:flex;flex-direction:column;gap:8px;';
            document.body.appendChild(container);
        }
        var colors = { success: '#10B981', error: '#EF4444', info: '#3B82F6', warning: '#F59E0B' };
        var toast = document.createElement('div');
        toast.style.cssText = 'background:' + (colors[type] || colors.success) + ';color:#fff;padding:12px 24px;border-radius:12px;font-size:0.95rem;font-weight:600;box-shadow:0 8px 24px rgba(0,0,0,0.15);animation:slideInRight 0.3s ease;max-width:350px;';
        toast.textContent = msg;
        container.appendChild(toast);
        setTimeout(function() {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.3s';
            setTimeout(function() { toast.remove(); }, 300);
        }, 3000);
    }
};

// Global toast function for backward compatibility
function showToast(msg, type) { App.showToast(msg, type); }

App.injectFooter = function() {
    if (document.getElementById('global-footer') || document.querySelector('footer')) return;
    var isSubpage = this.isSubpage;
    var bp = isSubpage ? '../' : '';
    var pp = isSubpage ? '' : 'pages/';
    var footer = document.createElement('footer');
    footer.id = 'global-footer';
    footer.style.cssText = 'background:#0f172a;color:#94a3b8;padding:48px 24px 24px;margin-top:60px;';
    footer.innerHTML = '<div style="max-width:1200px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:32px;margin-bottom:32px;">' +
        '<div><h4 style="color:white;margin-bottom:12px;font-size:1.1rem;">Ayuda a un Tercero</h4><p style="font-size:0.85rem;line-height:1.6;">Plataforma solidaria de comercio, donaciones y apoyo comunitario en República Dominicana.</p></div>' +
        '<div><h4 style="color:white;margin-bottom:12px;font-size:1rem;">Navegación</h4><div style="display:flex;flex-direction:column;gap:8px;font-size:0.85rem;"><a href="' + bp + 'index.html" style="color:#94a3b8;text-decoration:none;">Inicio</a><a href="' + pp + 'marketplace.html" style="color:#94a3b8;text-decoration:none;">Marketplace</a><a href="' + pp + 'donaciones.html" style="color:#94a3b8;text-decoration:none;">Donaciones</a><a href="' + pp + 'casos.html" style="color:#94a3b8;text-decoration:none;">Casos Sociales</a><a href="' + pp + 'impacto.html" style="color:#94a3b8;text-decoration:none;">Impacto</a></div></div>' +
        '<div><h4 style="color:white;margin-bottom:12px;font-size:1rem;">Servicios</h4><div style="display:flex;flex-direction:column;gap:8px;font-size:0.85rem;"><a href="' + pp + 'credifast.html" style="color:#94a3b8;text-decoration:none;">Préstamos</a><a href="' + pp + 'perfil.html" style="color:#94a3b8;text-decoration:none;">Mi Perfil</a><a href="' + pp + 'notificaciones.html" style="color:#94a3b8;text-decoration:none;">Notificaciones</a></div></div>' +
        '<div><h4 style="color:white;margin-bottom:12px;font-size:1rem;">Legal</h4><div style="display:flex;flex-direction:column;gap:8px;font-size:0.85rem;"><a href="' + pp + 'legal.html#terminos" style="color:#94a3b8;text-decoration:none;">Términos y Condiciones</a><a href="' + pp + 'legal.html#privacidad" style="color:#94a3b8;text-decoration:none;">Política de Privacidad</a><a href="' + pp + 'legal.html#datos" style="color:#94a3b8;text-decoration:none;">Uso de Datos</a></div></div>' +
        '</div><div style="border-top:1px solid #1e293b;padding-top:20px;text-align:center;font-size:0.8rem;"><p>&copy; 2026 Ayuda a un Tercero. Todos los derechos reservados.</p></div>';
    document.body.appendChild(footer);
};

document.addEventListener('DOMContentLoaded', function() {
    App.init();
    App.injectFooter();
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active, .modal.active').forEach(function(m) { m.classList.remove('active'); });
        ['productPreviewModal', 'cartModal', 'imageViewer', 'donationFormModal', 'vPlayer'].forEach(function(id) {
            var el = document.getElementById(id);
            if (el) { el.style.display = 'none'; el.classList.remove('active'); }
        });
    }
});
