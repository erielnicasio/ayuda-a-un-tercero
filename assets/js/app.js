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
                authBtn.className = 'btn btn-primary btn-sm';
            }
            if (adminLink) adminLink.style.display = user.role === 'admin' ? '' : 'none';
            if (notifLink) notifLink.style.display = '';
        } else {
            if (authBtn) {
                authBtn.textContent = 'Iniciar Sesión';
                authBtn.href = this.pagePath('login.html');
                authBtn.className = 'btn btn-outline btn-sm';
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

document.addEventListener('DOMContentLoaded', function() {
    App.init();
});
