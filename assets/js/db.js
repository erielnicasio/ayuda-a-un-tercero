// DB.js - Base de Datos con localStorage para el sistema completo
// Sincroniza información entre páginas HTML usando LocalStorage.

const DB = {
    // ─── Utilidades ─────────────────────────────────────
    _uid: function() {
        return 'id-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6);
    },
    _get: function(key) {
        try { return JSON.parse(localStorage.getItem(key)) || null; } catch(e) { return null; }
    },
    _set: function(key, val) {
        localStorage.setItem(key, JSON.stringify(val));
    },
    _getArr: function(key) { return this._get(key) || []; },

    // ─── Inicialización ─────────────────────────────────
    init: function () {
        // Preservar datos existentes del sistema original
        if (!localStorage.getItem('db_prestamos')) {
            localStorage.setItem('db_prestamos', JSON.stringify([
                { id: 'CR-1102', nombre: 'Juan Pérez', tipo: 'Personal', score: '95/100', monto: '$800 (6 meses)', status: 'Pendiente' }
            ]));
        }
        if (!localStorage.getItem('db_stats')) {
            localStorage.setItem('db_stats', JSON.stringify({
                vidas_impactadas: 1245,
                donaciones_totales: 3892,
                co2_ahorrado: 450,
                casos_exitosos: 184
            }));
        }
        if (!localStorage.getItem('db_reputacion')) {
            localStorage.setItem('db_reputacion', JSON.stringify({
                puntos: 450, nivel: 'Gold',
                insignias: ['Donador Frecuente', 'Verificador IA', 'Líder Regional'],
                metas_proximas: [
                    { nombre: 'Héroe de la Red', progreso: 85 },
                    { nombre: 'Guardian Urbano', progreso: 30 }
                ]
            }));
        }
        if (!localStorage.getItem('db_casos')) {
            localStorage.setItem('db_casos', JSON.stringify([
                {
                    id: 'CS-SEED-1', titulo: "Operación Pediátrica para Lucas",
                    categoria: "Emergencia Médica", catKey: "medico",
                    story: "Lucas necesita una cirugía urgente de corazón.",
                    raised: 7500, meta: 10000,
                    img: "https://images.unsplash.com/photo-1584515933487-779824d29309?w=800",
                    status: 'Aprobado', trustLevel: 'Gold', dist: 1.2, daysLeft: 2
                },
                {
                    id: 'CS-SEED-2', titulo: "Reconstrucción Familia Díaz",
                    categoria: "Ayuda Familiar", catKey: "familiar",
                    story: "La familia Díaz perdió su casa en un reciente incendio.",
                    raised: 1200, meta: 8000,
                    img: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb0?w=800",
                    status: 'Aprobado', trustLevel: 'Silver', dist: 4.5, daysLeft: 12
                }
            ]));
        }
        if (!localStorage.getItem('db_impacto')) {
            localStorage.setItem('db_impacto', JSON.stringify([
                {
                    id: 'IMP-001', nombre: "María Rodríguez", ubicacion: "Santo Domingo Este",
                    historia: "Gracias a la silla de ruedas que recibí, ahora puedo salir al parque con mis nietos.",
                    videoUrl: "", thumb: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800",
                    categoriaIcons: ["heart", "users"], votos: 124, fecha: "2024-03-15"
                },
                {
                    id: 'IMP-002', nombre: "Juan Ramos", ubicacion: "Santiago",
                    historia: "El préstamo Credifast me permitió comprar las herramientas para mi taller.",
                    videoUrl: "", thumb: "https://images.unsplash.com/photo-1581578731548-c64695ce6958?w=800",
                    categoriaIcons: ["tool", "briefcase"], votos: 89, fecha: "2024-03-20"
                }
            ]));
        }

        // Nuevos módulos del sistema
        this._seedUsers();
        this._seedProducts();
        this._seedDonations();
        if (!localStorage.getItem('db_reports')) this._set('db_reports', []);
        if (!localStorage.getItem('db_vendor_requests')) this._set('db_vendor_requests', []);
        if (!localStorage.getItem('db_notifications')) this._set('db_notifications', []);
        if (!localStorage.getItem('db_contacts')) this._set('db_contacts', []);
    },

    // ─── Seed: Usuarios ─────────────────────────────────
    _seedUsers: function() {
        if (localStorage.getItem('db_users')) return;
        this._set('db_users', [
            { id: 'admin-001', email: 'admin@gmail.com', password: 'admin123', role: 'admin', name: 'Administrador', whatsapp: '', vendorStatus: 'none', createdAt: '2025-01-01T00:00:00.000Z' },
            { id: 'vendor-001', email: 'carlos@email.com', password: 'pass123', role: 'vendedor', name: 'Carlos García', whatsapp: '8091234567', vendorStatus: 'aprobado', createdAt: '2025-02-01T00:00:00.000Z' },
            { id: 'vendor-002', email: 'maria@email.com', password: 'pass123', role: 'vendedor', name: 'María López', whatsapp: '8097654321', vendorStatus: 'aprobado', createdAt: '2025-02-15T00:00:00.000Z' },
            { id: 'vendor-003', email: 'pedro@email.com', password: 'pass123', role: 'vendedor', name: 'Pedro Martínez', whatsapp: '8095551234', vendorStatus: 'aprobado', createdAt: '2025-03-01T00:00:00.000Z' },
            { id: 'user-001', email: 'ana@email.com', password: 'pass123', role: 'usuario', name: 'Ana Rodríguez', whatsapp: '', vendorStatus: 'none', createdAt: '2025-03-10T00:00:00.000Z' }
        ]);
    },

    // ─── Seed: 15 Productos ─────────────────────────────
    _seedProducts: function() {
        if (localStorage.getItem('db_productos')) return;
        var locations = ['Santo Domingo', 'Santiago', 'La Vega', 'San Pedro', 'Puerto Plata', 'Monte Plata'];
        var colors = ['#FF6B6B','#4ECDC4','#45B7D1','#96CEB4','#FFEAA7','#DDA0DD','#98D8C8','#F7DC6F','#BB8FCE','#85C1E9','#F0B27A','#AED6F1','#A3E4D7','#F9E79F','#D7BDE2'];
        var data = [
            { name: 'Laptop HP Pavilion 15"', price: 18500, desc: 'Laptop en excelente estado, 8GB RAM, 256GB SSD. Ideal para trabajo y estudio.', cat: 'Electrónica', v: 'vendor-001', cond: 'usado' },
            { name: 'Sofá Modular 3 Piezas', price: 12000, desc: 'Sofá modular color gris, tela premium, muy cómodo y elegante para sala.', cat: 'Hogar', v: 'vendor-002', cond: 'usado' },
            { name: 'Bicicleta Mountain Bike', price: 8500, desc: 'Bicicleta de montaña aro 29, 21 velocidades, frenos de disco.', cat: 'Deportes', v: 'vendor-003', cond: 'nuevo' },
            { name: 'iPhone 13 Pro 128GB', price: 25000, desc: 'iPhone 13 Pro en perfecto estado, batería al 92%, incluye cargador original.', cat: 'Electrónica', v: 'vendor-001', cond: 'usado' },
            { name: 'Mesa de Comedor 6 Sillas', price: 15000, desc: 'Mesa de comedor en madera de pino con 6 sillas tapizadas, color natural.', cat: 'Hogar', v: 'vendor-002', cond: 'nuevo' },
            { name: 'Zapatillas Nike Air Max', price: 3500, desc: 'Zapatillas Nike Air Max talla 42, color negro/blanco, uso mínimo.', cat: 'Ropa', v: 'vendor-003', cond: 'usado' },
            { name: 'Televisor Samsung 55" 4K', price: 22000, desc: 'Smart TV Samsung 55 pulgadas, resolución 4K, HDR, wifi integrado.', cat: 'Electrónica', v: 'vendor-001', cond: 'nuevo' },
            { name: 'Silla de Ruedas Eléctrica', price: 35000, desc: 'Silla de ruedas eléctrica plegable, batería de larga duración, control joystick.', cat: 'Salud', v: 'vendor-002', cond: 'nuevo' },
            { name: 'Set de Libros Universitarios', price: 2500, desc: 'Colección de 12 libros de administración de empresas, en buen estado.', cat: 'Educación', v: 'vendor-003', cond: 'usado' },
            { name: 'Honda Civic 2018', price: 450000, desc: 'Honda Civic 2018, automático, 65,000 km, color plateado, un solo dueño.', cat: 'Vehículos', v: 'vendor-001', cond: 'usado' },
            { name: 'Nevera Inverter LG', price: 28000, desc: 'Nevera LG Inverter 14 pies cúbicos, dispensador de agua, ahorro energético.', cat: 'Hogar', v: 'vendor-002', cond: 'nuevo' },
            { name: 'Guitarra Acústica Yamaha', price: 6000, desc: 'Guitarra acústica Yamaha F310, cuerdas de nylon, incluye funda y afinador.', cat: 'Deportes', v: 'vendor-003', cond: 'usado' },
            { name: 'Canasta Alimentos Básicos', price: 1500, desc: 'Canasta con arroz, habichuelas, aceite, azúcar y otros artículos esenciales.', cat: 'Alimentos', v: 'vendor-001', cond: 'nuevo' },
            { name: 'Vestido de Gala Talla M', price: 4500, desc: 'Vestido de gala color azul marino, talla M, usado una sola vez, impecable.', cat: 'Ropa', v: 'vendor-002', cond: 'usado' },
            { name: 'Tablet Samsung Galaxy Tab', price: 9500, desc: 'Samsung Galaxy Tab A8 10.5", 64GB, WiFi, incluye funda y cargador.', cat: 'Electrónica', v: 'vendor-003', cond: 'nuevo' }
        ];
        var users = this.getUsers();
        var products = [];
        for (var i = 0; i < data.length; i++) {
            var p = data[i];
            var vendor = users.find(function(u) { return u.id === p.v; });
            var imgs = [];
            for (var j = 0; j < 4; j++) {
                imgs.push(this._placeholderImg(p.name, colors[(i * 4 + j) % colors.length], j + 1));
            }
            products.push({
                id: 'prod-' + String(i + 1).padStart(3, '0'),
                name: p.name, price: p.price, description: p.desc,
                category: p.cat, location: locations[i % locations.length],
                condition: p.cond, images: imgs,
                vendorId: p.v, vendorName: vendor ? vendor.name : 'Vendedor',
                vendorWhatsapp: vendor ? vendor.whatsapp : '',
                status: 'aprobado', views: Math.floor(Math.random() * 200) + 10,
                createdAt: new Date(2025, 1 + Math.floor(i / 5), (i % 28) + 1).toISOString()
            });
        }
        this._set('db_productos', products);
    },

    // ─── Seed: 15 Donaciones ────────────────────────────
    _seedDonations: function() {
        if (localStorage.getItem('db_donaciones_v2')) return;
        var data = [
            { nombre: 'Luis', apellido: 'Fernández', edad: 45, numero: '8091112233', correo: 'luis@email.com', motivo: 'Necesito medicamentos para tratamiento de diabetes, no cuento con recursos económicos.' },
            { nombre: 'Carmen', apellido: 'Reyes', edad: 62, numero: '8092223344', correo: 'carmen@email.com', motivo: 'Solicito ayuda con alimentos para mi familia de 5 personas, quedé sin empleo.' },
            { nombre: 'José', apellido: 'Ramírez', edad: 28, numero: '8093334455', correo: 'jose@email.com', motivo: 'Necesito una silla de ruedas para mi madre que tuvo un accidente.' },
            { nombre: 'Marta', apellido: 'Sánchez', edad: 55, numero: '8094445566', correo: 'marta@email.com', motivo: 'Pido apoyo con útiles escolares para mis 3 hijos que inician el año escolar.' },
            { nombre: 'Roberto', apellido: 'Díaz', edad: 38, numero: '8095556677', correo: 'roberto@email.com', motivo: 'Perdí mi vivienda en las inundaciones, necesito ayuda con materiales de construcción.' },
            { nombre: 'Sofía', apellido: 'Castillo', edad: 22, numero: '8096667788', correo: 'sofia@email.com', motivo: 'Busco apoyo para pagar la matrícula universitaria, soy estudiante de medicina.' },
            { nombre: 'Miguel', apellido: 'Torres', edad: 70, numero: '8097778899', correo: 'miguel@email.com', motivo: 'Necesito ayuda con el pago de cirugía de cataratas, no puedo costearla.' },
            { nombre: 'Patricia', apellido: 'Vega', edad: 33, numero: '8098889900', correo: 'patricia@email.com', motivo: 'Solicito donación de ropa y zapatos para mis hijos, tenemos recursos muy limitados.' },
            { nombre: 'Eduardo', apellido: 'Morales', edad: 48, numero: '8091239876', correo: 'eduardo@email.com', motivo: 'Pido ayuda para reparar el techo de mi casa que fue dañado por la tormenta.' },
            { nombre: 'Lucía', apellido: 'Peña', edad: 25, numero: '8094567890', correo: 'lucia@email.com', motivo: 'Necesito una computadora para trabajar desde casa, soy madre soltera.' },
            { nombre: 'Fernando', apellido: 'Herrera', edad: 58, numero: '8097891234', correo: 'fernando@email.com', motivo: 'Solicito medicamentos y asistencia médica, padezco de hipertensión y no tengo seguro.' },
            { nombre: 'Isabel', apellido: 'Guzmán', edad: 40, numero: '8092345678', correo: 'isabel@email.com', motivo: 'Necesito ayuda con alimentos y artículos de bebé, tengo un recién nacido.' },
            { nombre: 'Andrés', apellido: 'Mejía', edad: 19, numero: '8095678901', correo: 'andres@email.com', motivo: 'Busco apoyo para comprar instrumentos musicales, doy clases gratuitas a niños del barrio.' },
            { nombre: 'Rosa', apellido: 'Paulino', edad: 65, numero: '8098901234', correo: 'rosa@email.com', motivo: 'Solicito ayuda con la compra de un tanque de gas y estufa, cocino con leña.' },
            { nombre: 'Daniel', apellido: 'Núñez', edad: 30, numero: '8091234500', correo: 'daniel@email.com', motivo: 'Necesito una prótesis para mi pierna, tuve un accidente laboral y no puedo trabajar.' }
        ];
        var donations = [];
        for (var i = 0; i < data.length; i++) {
            var d = data[i];
            donations.push({
                id: 'don-' + String(i + 1).padStart(3, '0'),
                nombre: d.nombre, apellido: d.apellido, edad: d.edad,
                numero: d.numero, correo: d.correo, motivo: d.motivo,
                status: i < 5 ? 'aprobado' : 'pendiente',
                createdAt: new Date(2025, 2, (i % 28) + 1).toISOString()
            });
        }
        this._set('db_donaciones_v2', donations);
    },

    _placeholderImg: function(name, bg, num) {
        var c = document.createElement('canvas');
        c.width = 400; c.height = 300;
        var ctx = c.getContext('2d');
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, 400, 300);
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.beginPath(); ctx.arc(200, 150, 80, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(name.substring(0, 22), 200, 145);
        ctx.font = '13px sans-serif';
        ctx.fillText('Imagen ' + num, 200, 168);
        return c.toDataURL('image/jpeg', 0.7);
    },

    // ─── Usuarios ───────────────────────────────────────
    getUsers: function() { return this._getArr('db_users'); },
    findUserByEmail: function(email) {
        return this.getUsers().find(function(u) { return u.email.toLowerCase() === email.toLowerCase(); });
    },
    registerUser: function(email, password) {
        if (this.findUserByEmail(email)) return { error: 'El correo ya está registrado.' };
        var user = {
            id: this._uid(), email: email, password: password,
            role: 'usuario', name: email.split('@')[0],
            whatsapp: '', vendorStatus: 'none',
            createdAt: new Date().toISOString()
        };
        var users = this.getUsers();
        users.push(user);
        this._set('db_users', users);
        return { user: user };
    },
    loginUser: function(email, password) {
        var user = this.findUserByEmail(email);
        if (!user) return { error: 'Correo no encontrado.' };
        if (user.password !== password) return { error: 'Contraseña incorrecta.' };
        this._set('db_current_user', user);
        return { user: user };
    },
    getCurrentUser: function() { return this._get('db_current_user'); },
    setCurrentUser: function(u) { this._set('db_current_user', u); },
    logout: function() { localStorage.removeItem('db_current_user'); },
    refreshCurrentUser: function() {
        var cu = this.getCurrentUser();
        if (!cu) return null;
        var fresh = this.getUsers().find(function(u) { return u.id === cu.id; });
        if (fresh) this.setCurrentUser(fresh);
        return fresh;
    },
    updateUser: function(id, data) {
        var users = this.getUsers();
        var idx = users.findIndex(function(u) { return u.id === id; });
        if (idx === -1) return null;
        Object.assign(users[idx], data);
        this._set('db_users', users);
        return users[idx];
    },

    // ─── Productos (nuevo sistema completo) ─────────────
    getProductos: function() { return this._getArr('db_productos'); },
    getApprovedProducts: function() {
        return this.getProductos().filter(function(p) { return p.status === 'aprobado'; });
    },
    addProduct: function(product) {
        product.id = this._uid();
        product.status = 'pendiente';
        product.views = 0;
        product.createdAt = new Date().toISOString();
        var list = this.getProductos();
        list.push(product);
        this._set('db_productos', list);
        return product;
    },
    updateProduct: function(id, data) {
        var list = this.getProductos();
        var idx = list.findIndex(function(p) { return p.id === id; });
        if (idx === -1) return null;
        Object.assign(list[idx], data);
        this._set('db_productos', list);
        return list[idx];
    },
    deleteProduct: function(id) {
        var list = this.getProductos().filter(function(p) { return p.id !== id; });
        this._set('db_productos', list);
    },
    findProduct: function(id) {
        return this.getProductos().find(function(p) { return p.id === id; }) || null;
    },

    // ─── Donaciones (nuevo sistema v2) ──────────────────
    getDonacionesV2: function() { return this._getArr('db_donaciones_v2'); },
    getApprovedDonations: function() {
        return this.getDonacionesV2().filter(function(d) { return d.status === 'aprobado'; });
    },
    addDonation: function(don) {
        don.id = this._uid();
        don.status = 'pendiente';
        don.createdAt = new Date().toISOString();
        var list = this.getDonacionesV2();
        list.push(don);
        this._set('db_donaciones_v2', list);
        return don;
    },
    updateDonation: function(id, data) {
        var list = this.getDonacionesV2();
        var idx = list.findIndex(function(d) { return d.id === id; });
        if (idx === -1) return null;
        Object.assign(list[idx], data);
        this._set('db_donaciones_v2', list);
        return list[idx];
    },

    // ─── Solicitudes de Vendedor ────────────────────────
    getVendorRequests: function() { return this._getArr('db_vendor_requests'); },
    addVendorRequest: function(req) {
        req.id = this._uid();
        req.status = 'pendiente';
        req.createdAt = new Date().toISOString();
        var list = this.getVendorRequests();
        list.push(req);
        this._set('db_vendor_requests', list);
        this.updateUser(req.userId, { vendorStatus: 'pendiente' });
        var cu = this.getCurrentUser();
        if (cu && cu.id === req.userId) { cu.vendorStatus = 'pendiente'; this.setCurrentUser(cu); }
        this.addNotification({ userId: 'admin', type: 'vendor_request', message: 'Nueva solicitud de vendedor: ' + req.userName + ' (' + req.userEmail + ')' });
        return req;
    },
    approveVendor: function(requestId) {
        var list = this.getVendorRequests();
        var req = list.find(function(r) { return r.id === requestId; });
        if (!req) return;
        req.status = 'aprobado';
        this._set('db_vendor_requests', list);
        this.updateUser(req.userId, { role: 'vendedor', vendorStatus: 'aprobado', whatsapp: req.whatsapp });
        this.addNotification({ userId: req.userId, type: 'vendor_approved', message: 'Tu solicitud de vendedor ha sido aprobada. Ya puedes publicar productos.' });
    },
    rejectVendor: function(requestId) {
        var list = this.getVendorRequests();
        var req = list.find(function(r) { return r.id === requestId; });
        if (!req) return;
        req.status = 'rechazado';
        this._set('db_vendor_requests', list);
        this.updateUser(req.userId, { vendorStatus: 'rechazado' });
        this.addNotification({ userId: req.userId, type: 'vendor_rejected', message: 'Tu solicitud de vendedor ha sido rechazada.' });
    },

    // ─── Reportes ───────────────────────────────────────
    getReports: function() { return this._getArr('db_reports'); },
    addReport: function(report) {
        report.id = this._uid();
        report.status = 'pendiente';
        report.response = '';
        report.createdAt = new Date().toISOString();
        var list = this.getReports();
        list.push(report);
        this._set('db_reports', list);
        this.addNotification({ userId: 'admin', type: 'report_received', message: 'Nuevo reporte: ' + report.reason + ' — Producto: ' + report.productName });
        return report;
    },
    updateReport: function(id, data) {
        var list = this.getReports();
        var idx = list.findIndex(function(r) { return r.id === id; });
        if (idx === -1) return null;
        Object.assign(list[idx], data);
        this._set('db_reports', list);
        return list[idx];
    },
    deleteReport: function(id) {
        var list = this.getReports().filter(function(r) { return r.id !== id; });
        this._set('db_reports', list);
    },

    // ─── Contactos WhatsApp ─────────────────────────────
    getContacts: function() { return this._getArr('db_contacts'); },
    addContact: function(contact) {
        contact.id = this._uid();
        contact.createdAt = new Date().toISOString();
        var list = this.getContacts();
        list.push(contact);
        this._set('db_contacts', list);
        this.addNotification({ userId: 'admin', type: 'contact_received', message: 'Nuevo contacto WhatsApp: ' + contact.buyerName + ' → ' + contact.productName });
        return contact;
    },

    // ─── Notificaciones ─────────────────────────────────
    getNotifications: function(userId) {
        var all = this._getArr('db_notifications');
        if (!userId) return all;
        return all.filter(function(n) { return n.userId === userId || n.userId === 'all'; });
    },
    addNotification: function(notif) {
        notif.id = this._uid();
        notif.read = false;
        notif.createdAt = new Date().toISOString();
        var list = this._getArr('db_notifications');
        list.push(notif);
        this._set('db_notifications', list);
        return notif;
    },
    markNotifRead: function(id) {
        var list = this._getArr('db_notifications');
        var n = list.find(function(x) { return x.id === id; });
        if (n) { n.read = true; this._set('db_notifications', list); }
    },
    markAllNotifsRead: function(userId) {
        var list = this._getArr('db_notifications');
        list.forEach(function(n) {
            if ((n.userId === userId || n.userId === 'all' || n.userId === 'admin') && !n.read) n.read = true;
        });
        this._set('db_notifications', list);
    },
    getUnreadCount: function(userId) {
        return this.getNotifications(userId).filter(function(n) { return !n.read; }).length;
    },

    // ─── Estadísticas del Sistema ───────────────────────
    getSystemStats: function() {
        var products = this.getProductos();
        return {
            totalUsers: this.getUsers().length,
            totalVendors: this.getUsers().filter(function(u) { return u.role === 'vendedor'; }).length,
            totalProducts: products.length,
            totalDonations: this.getDonacionesV2().length,
            totalReports: this.getReports().length,
            totalContacts: this.getContacts().length,
            topViewed: products.slice().sort(function(a, b) { return (b.views || 0) - (a.views || 0); }).slice(0, 5)
        };
    },

    // ─── Módulos originales preservados ─────────────────
    getImpacto: function () { return JSON.parse(localStorage.getItem('db_impacto')) || []; },
    saveImpacto: function (historia) {
        var list = this.getImpacto();
        historia.id = 'IMP-' + Math.floor(Math.random() * 9000 + 1000);
        historia.votos = 0;
        historia.fecha = new Date().toISOString().split('T')[0];
        list.push(historia);
        localStorage.setItem('db_impacto', JSON.stringify(list));
        return historia;
    },
    voteImpacto: function (id) {
        var list = this.getImpacto();
        var idx = list.findIndex(function(i) { return i.id === id; });
        if (idx !== -1) { list[idx].votos++; localStorage.setItem('db_impacto', JSON.stringify(list)); }
    },
    deleteImpacto: function (id) {
        var list = this.getImpacto().filter(function(i) { return i.id !== id; });
        localStorage.setItem('db_impacto', JSON.stringify(list));
    },
    getStats: function () {
        return JSON.parse(localStorage.getItem('db_stats')) || { vidas_impactadas: 0, donaciones_totales: 0, co2_ahorrado: 0, casos_exitosos: 0 };
    },
    updateStats: function (key, increment) {
        if (increment === undefined) increment = 1;
        var stats = this.getStats();
        if (stats[key] !== undefined) { stats[key] += increment; localStorage.setItem('db_stats', JSON.stringify(stats)); }
    },
    getReputation: function () {
        return JSON.parse(localStorage.getItem('db_reputacion')) || { puntos: 0, nivel: 'Silver', insignias: [], metas_proximas: [] };
    },
    addPoints: function (amount) {
        var rep = this.getReputation();
        rep.puntos += amount;
        if (rep.puntos > 500) rep.nivel = 'Gold';
        localStorage.setItem('db_reputacion', JSON.stringify(rep));
    },
    getPrestamos: function () { return JSON.parse(localStorage.getItem('db_prestamos')) || []; },
    savePrestamo: function (prestamo) {
        var list = this.getPrestamos();
        prestamo.id = 'CR-' + Math.floor(Math.random() * 9000 + 1000);
        prestamo.status = 'Pendiente';
        list.push(prestamo);
        localStorage.setItem('db_prestamos', JSON.stringify(list));
        return prestamo;
    },
    updatePrestamoStatus: function (id, newStatus) {
        var list = this.getPrestamos();
        var idx = list.findIndex(function(i) { return i.id === id; });
        if (idx !== -1) { list[idx].status = newStatus; localStorage.setItem('db_prestamos', JSON.stringify(list)); }
    },
    getMarketplace: function () { return JSON.parse(localStorage.getItem('db_marketplace')) || []; },
    saveMarketplace: function (item) {
        var list = this.getMarketplace();
        item.id = 'MK-' + Math.floor(Math.random() * 9000 + 1000);
        item.status = 'En Revisión';
        list.push(item);
        localStorage.setItem('db_marketplace', JSON.stringify(list));
        return item;
    },
    updateMarketplaceStatus: function (id, newStatus) {
        var list = this.getMarketplace();
        var idx = list.findIndex(function(i) { return i.id === id; });
        if (idx !== -1) { list[idx].status = newStatus; localStorage.setItem('db_marketplace', JSON.stringify(list)); }
    },
    getDonaciones: function () { return JSON.parse(localStorage.getItem('db_donaciones')) || []; },
    saveDonacion: function (item) {
        var list = this.getDonaciones();
        item.id = 'DN-' + Math.floor(Math.random() * 9000 + 1000);
        item.status = 'En Revisión';
        list.push(item);
        localStorage.setItem('db_donaciones', JSON.stringify(list));
        return item;
    },
    updateDonacionStatus: function (id, newStatus) {
        var list = this.getDonaciones();
        var idx = list.findIndex(function(i) { return i.id === id; });
        if (idx !== -1) { list[idx].status = newStatus; localStorage.setItem('db_donaciones', JSON.stringify(list)); }
    },
    getCasos: function () { return JSON.parse(localStorage.getItem('db_casos')) || []; },
    saveCaso: function (caso) {
        var list = this.getCasos();
        caso.id = 'CS-' + Math.floor(Math.random() * 9000 + 1000);
        caso.status = 'En Revisión';
        var text = ((caso.title || '') + " " + (caso.desc || '')).toLowerCase();
        if (text.includes('urgente') || text.includes('cirugía') || text.includes('emergencia') || text.includes('crítico')) {
            caso.aiUrgency = 'High'; caso.daysLeft = 3;
        } else {
            caso.aiUrgency = 'Normal'; caso.daysLeft = 15;
        }
        list.push(caso);
        localStorage.setItem('db_casos', JSON.stringify(list));
        return caso;
    },
    updateCasoStatus: function (id, newStatus) {
        var list = this.getCasos();
        var idx = list.findIndex(function(i) { return i.id === id; });
        if (idx !== -1) { list[idx].status = newStatus; localStorage.setItem('db_casos', JSON.stringify(list)); }
    },
    updateCasoAmount: function (idOrTitle, amount) {
        var list = this.getCasos();
        var idx = list.findIndex(function(i) { return i.id === idOrTitle || i.titulo === idOrTitle; });
        if (idx !== -1) {
            list[idx].raised = (parseFloat(list[idx].raised) || 0) + parseFloat(amount);
            localStorage.setItem('db_casos', JSON.stringify(list));
            return list[idx];
        }
        return null;
    }
};

DB.init();
