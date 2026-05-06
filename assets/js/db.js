// DB.js - Base de Datos con localStorage para el sistema completo
var DB = {
    _uid: function() { return 'id-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6); },
    _get: function(key) { try { return JSON.parse(localStorage.getItem(key)) || null; } catch(e) { return null; } },
    _set: function(key, val) { localStorage.setItem(key, JSON.stringify(val)); },
    _getArr: function(key) { return this._get(key) || []; },
    _getSession: function(key) { try { return JSON.parse(sessionStorage.getItem(key)) || null; } catch(e) { return null; } },
    _setSession: function(key, val) { sessionStorage.setItem(key, JSON.stringify(val)); },
    _getSessionArr: function(key) { return this._getSession(key) || []; },

    init: function() {
        this._ensureAdmin();
        this._seedUsers();
        this._seedProducts();
        this._seedDonations();
        this._seedCasos();
        this._seedImpacto();
        this._seedPrestamos();
        if (!localStorage.getItem('db_reports')) this._set('db_reports', []);
        if (!localStorage.getItem('db_vendor_requests')) this._set('db_vendor_requests', []);
        if (!localStorage.getItem('db_notifications')) this._set('db_notifications', []);
        if (!localStorage.getItem('db_contacts')) this._set('db_contacts', []);
        if (!localStorage.getItem('db_cart')) this._set('db_cart', []);
        if (!localStorage.getItem('db_stats')) {
            this._set('db_stats', { vidas_impactadas: 1245, donaciones_totales: 3892, co2_ahorrado: 450, casos_exitosos: 184 });
        }
        if (!localStorage.getItem('db_reputacion')) {
            this._set('db_reputacion', { puntos: 450, nivel: 'Gold', insignias: ['Donador Frecuente', 'Verificador IA', 'Líder Regional'], metas_proximas: [{ nombre: 'Héroe de la Red', progreso: 85 }, { nombre: 'Guardian Urbano', progreso: 30 }] });
        }
    },

    _ensureAdmin: function() {
        var users = this._getArr('db_users');
        var admin = users.find(function(u) { return u.email === 'admin@gmail.com'; });
        if (!admin) {
            users.push({
                id: 'admin-001', email: 'admin@gmail.com', password: 'admin123',
                role: 'admin', name: 'Administrador', whatsapp: '',
                vendorStatus: 'none', createdAt: '2025-01-01T00:00:00.000Z'
            });
            this._set('db_users', users);
        }
    },

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

    _seedProducts: function() {
        if (localStorage.getItem('db_productos_v2')) return;
        localStorage.removeItem('db_productos');
        var locs = [
            { name: 'Santo Domingo', lat: 18.4861, lng: -69.9312 },
            { name: 'Santiago', lat: 19.4517, lng: -70.6970 },
            { name: 'La Vega', lat: 19.2210, lng: -70.5298 },
            { name: 'San Pedro', lat: 18.4539, lng: -69.3086 },
            { name: 'Puerto Plata', lat: 19.7934, lng: -70.6884 },
            { name: 'Monte Plata', lat: 18.8073, lng: -69.7839 }
        ];
        var plans = ['Básico', 'Emprendedor Pro', 'Comunidad Plus'];
        var data = [
            { name: 'Laptop HP Pavilion 15"', price: 18500, desc: 'Laptop en excelente estado, 8GB RAM, 256GB SSD. Ideal para trabajo y estudio.', cat: 'Electrónica', v: 'vendor-001', cond: 'usado', plan: 'Emprendedor Pro',
              img: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600' },
            { name: 'Sofá Modular 3 Piezas', price: 12000, desc: 'Sofá modular color gris, tela premium, muy cómodo y elegante para sala.', cat: 'Hogar', v: 'vendor-002', cond: 'usado', plan: 'Básico',
              img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600' },
            { name: 'Bicicleta Mountain Bike', price: 8500, desc: 'Bicicleta de montaña aro 29, 21 velocidades, frenos de disco.', cat: 'Deportes', v: 'vendor-003', cond: 'nuevo', plan: 'Comunidad Plus',
              img: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=600' },
            { name: 'iPhone 13 Pro 128GB', price: 25000, desc: 'iPhone 13 Pro en perfecto estado, batería al 92%, incluye cargador original.', cat: 'Electrónica', v: 'vendor-001', cond: 'usado', plan: 'Comunidad Plus',
              img: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600' },
            { name: 'Mesa de Comedor 6 Sillas', price: 15000, desc: 'Mesa de comedor en madera de pino con 6 sillas tapizadas, color natural.', cat: 'Hogar', v: 'vendor-002', cond: 'nuevo', plan: 'Emprendedor Pro',
              img: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600' },
            { name: 'Zapatillas Nike Air Max', price: 3500, desc: 'Zapatillas Nike Air Max talla 42, color negro/blanco, uso mínimo.', cat: 'Ropa', v: 'vendor-003', cond: 'usado', plan: 'Básico',
              img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600' },
            { name: 'Televisor Samsung 55" 4K', price: 22000, desc: 'Smart TV Samsung 55 pulgadas, resolución 4K, HDR, wifi integrado.', cat: 'Electrónica', v: 'vendor-001', cond: 'nuevo', plan: 'Comunidad Plus',
              img: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600' },
            { name: 'Silla de Ruedas Eléctrica', price: 35000, desc: 'Silla de ruedas eléctrica plegable, batería de larga duración, control joystick.', cat: 'Salud', v: 'vendor-002', cond: 'nuevo', plan: 'Emprendedor Pro',
              img: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=600' },
            { name: 'Set de Libros Universitarios', price: 2500, desc: 'Colección de 12 libros de administración de empresas, en buen estado.', cat: 'Educación', v: 'vendor-003', cond: 'usado', plan: 'Básico',
              img: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600' },
            { name: 'Honda Civic 2018', price: 450000, desc: 'Honda Civic 2018, automático, 65,000 km, color plateado, un solo dueño.', cat: 'Vehículos', v: 'vendor-001', cond: 'usado', plan: 'Comunidad Plus',
              img: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600' },
            { name: 'Nevera Inverter LG', price: 28000, desc: 'Nevera LG Inverter 14 pies cúbicos, dispensador de agua, ahorro energético.', cat: 'Hogar', v: 'vendor-002', cond: 'nuevo', plan: 'Emprendedor Pro',
              img: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=600' },
            { name: 'Guitarra Acústica Yamaha', price: 6000, desc: 'Guitarra acústica Yamaha F310, cuerdas de nylon, incluye funda y afinador.', cat: 'Deportes', v: 'vendor-003', cond: 'usado', plan: 'Básico',
              img: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=600' },
            { name: 'Canasta Alimentos Básicos', price: 1500, desc: 'Canasta con arroz, habichuelas, aceite, azúcar y otros artículos esenciales.', cat: 'Alimentos', v: 'vendor-001', cond: 'nuevo', plan: 'Básico',
              img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600' },
            { name: 'Vestido de Gala Talla M', price: 4500, desc: 'Vestido de gala color azul marino, talla M, usado una sola vez, impecable.', cat: 'Ropa', v: 'vendor-002', cond: 'usado', plan: 'Emprendedor Pro',
              img: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600' },
            { name: 'Tablet Samsung Galaxy Tab', price: 9500, desc: 'Samsung Galaxy Tab A8 10.5", 64GB, WiFi, incluye funda y cargador.', cat: 'Electrónica', v: 'vendor-003', cond: 'nuevo', plan: 'Comunidad Plus',
              img: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600' },
            // +20 new products
            { name: 'Diseño Web Emprendedor', price: 8000, desc: 'Servicio de diseño web profesional para emprendedores. Incluye dominio y hosting por 1 año.', cat: 'Educación', v: 'vendor-001', cond: 'nuevo', plan: 'Comunidad Plus',
              img: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=600' },
            { name: 'Café Tostado Monte Plata', price: 450, desc: 'Café orgánico tostado artesanalmente en Monte Plata, bolsa de 1 libra.', cat: 'Alimentos', v: 'vendor-002', cond: 'nuevo', plan: 'Emprendedor Pro',
              img: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600' },
            { name: 'Escritorio de Oficina', price: 5500, desc: 'Escritorio moderno de oficina en melamina con cajones laterales, color blanco.', cat: 'Hogar', v: 'vendor-003', cond: 'nuevo', plan: 'Básico',
              img: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600' },
            { name: 'Mochila Escolar Infantil', price: 800, desc: 'Mochila escolar resistente con diseño colorido para niños de 6-12 años.', cat: 'Educación', v: 'vendor-001', cond: 'nuevo', plan: 'Básico',
              img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600' },
            { name: 'Aire Acondicionado Inverter 12K BTU', price: 16500, desc: 'Aire acondicionado split inverter 12,000 BTU, bajo consumo energético.', cat: 'Electrónica', v: 'vendor-002', cond: 'nuevo', plan: 'Comunidad Plus',
              img: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600' },
            { name: 'Juego de Sábanas King', price: 1200, desc: 'Juego de sábanas tamaño King, algodón egipcio 400 hilos, color blanco.', cat: 'Hogar', v: 'vendor-003', cond: 'nuevo', plan: 'Emprendedor Pro',
              img: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600' },
            { name: 'Camiseta Polo Ralph Lauren', price: 2800, desc: 'Camiseta polo original talla L, color azul marino, nueva con etiquetas.', cat: 'Ropa', v: 'vendor-001', cond: 'nuevo', plan: 'Emprendedor Pro',
              img: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600' },
            { name: 'Licuadora Industrial Oster', price: 3200, desc: 'Licuadora industrial Oster de 16 velocidades, vaso de vidrio, motor potente.', cat: 'Electrónica', v: 'vendor-002', cond: 'nuevo', plan: 'Básico',
              img: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=600' },
            { name: 'Pelota de Fútbol Adidas', price: 1800, desc: 'Pelota oficial Adidas para fútbol, tamaño 5, cosida a mano.', cat: 'Deportes', v: 'vendor-003', cond: 'nuevo', plan: 'Básico',
              img: 'https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=600' },
            { name: 'Muñeca Barbie Colección', price: 1500, desc: 'Muñeca Barbie edición especial coleccionista, caja sellada original.', cat: 'Hogar', v: 'vendor-001', cond: 'nuevo', plan: 'Emprendedor Pro',
              img: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=600' },
            { name: 'Arroz Premium 25 Libras', price: 600, desc: 'Saco de arroz selecto de 25 libras, grano largo, primera calidad.', cat: 'Alimentos', v: 'vendor-002', cond: 'nuevo', plan: 'Básico',
              img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600' },
            { name: 'Botas de Cuero Artesanales', price: 4200, desc: 'Botas de cuero genuino hechas a mano, talla 40, color marrón.', cat: 'Ropa', v: 'vendor-003', cond: 'nuevo', plan: 'Comunidad Plus',
              img: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600' },
            { name: 'Monitor Dell 24" Full HD', price: 8500, desc: 'Monitor Dell 24 pulgadas, resolución Full HD 1080p, panel IPS, HDMI.', cat: 'Electrónica', v: 'vendor-001', cond: 'usado', plan: 'Emprendedor Pro',
              img: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600' },
            { name: 'Juego de Ollas T-fal 10 Piezas', price: 3800, desc: 'Set de ollas antiadherentes T-fal de 10 piezas con tapas de vidrio.', cat: 'Hogar', v: 'vendor-002', cond: 'nuevo', plan: 'Básico',
              img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600' },
            { name: 'Enciclopedia Infantil Ilustrada', price: 1200, desc: 'Enciclopedia de 6 tomos para niños, ilustrada a color, temas variados.', cat: 'Educación', v: 'vendor-003', cond: 'nuevo', plan: 'Básico',
              img: 'https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=600' },
            { name: 'Ventilador de Torre Honeywell', price: 2200, desc: 'Ventilador de torre oscilante con control remoto y temporizador.', cat: 'Electrónica', v: 'vendor-001', cond: 'nuevo', plan: 'Emprendedor Pro',
              img: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600' },
            { name: 'Cuna de Bebé Convertible', price: 7500, desc: 'Cuna convertible que se transforma en cama infantil, madera sólida.', cat: 'Hogar', v: 'vendor-002', cond: 'nuevo', plan: 'Comunidad Plus',
              img: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600' },
            { name: 'Patineta Longboard', price: 3500, desc: 'Longboard profesional de maple canadiense, ruedas suaves para cruising.', cat: 'Deportes', v: 'vendor-003', cond: 'nuevo', plan: 'Emprendedor Pro',
              img: 'https://images.unsplash.com/photo-1547447134-cd3f5c716030?w=600' },
            { name: 'Aceite de Oliva Extra Virgen 1L', price: 350, desc: 'Aceite de oliva extra virgen importado de España, botella de 1 litro.', cat: 'Alimentos', v: 'vendor-001', cond: 'nuevo', plan: 'Básico',
              img: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600' },
            { name: 'Chaqueta Deportiva Under Armour', price: 3200, desc: 'Chaqueta deportiva Under Armour talla L, tejido transpirable, color gris.', cat: 'Ropa', v: 'vendor-002', cond: 'nuevo', plan: 'Comunidad Plus',
              img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600' }
        ];
        var users = this.getUsers();
        var products = [];
        for (var i = 0; i < data.length; i++) {
            var p = data[i];
            var vendor = users.find(function(u) { return u.id === p.v; });
            var loc = locs[i % locs.length];
            var imgs = [p.img, p.img, p.img, p.img];
            products.push({
                id: 'prod-' + String(i + 1).padStart(3, '0'),
                name: p.name, price: p.price, description: p.desc,
                category: p.cat, location: loc.name,
                lat: loc.lat + (Math.random() - 0.5) * 0.05,
                lng: loc.lng + (Math.random() - 0.5) * 0.05,
                condition: p.cond, images: imgs, plan: p.plan || 'Básico',
                vendorId: p.v, vendorName: vendor ? vendor.name : 'Vendedor',
                vendorWhatsapp: vendor ? vendor.whatsapp : '',
                status: 'aprobado', views: Math.floor(Math.random() * 200) + 10,
                createdAt: new Date(2025, 1 + Math.floor(i / 5), (i % 28) + 1).toISOString()
            });
        }
        this._set('db_productos', products);
        localStorage.setItem('db_productos_v2', '1');
    },

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

    _seedCasos: function() {
        if (localStorage.getItem('db_casos_v2')) return;
        localStorage.removeItem('db_casos');
        this._set('db_casos', [
            { id: 'CS-001', titulo: 'Operación Pediátrica para Lucas', categoria: 'Emergencia Médica', catKey: 'medico', story: 'Lucas, de 4 años, necesita una cirugía urgente de corazón. Su familia no cuenta con los recursos necesarios para cubrir los gastos médicos.', raised: 7500, meta: 10000, img: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=800', status: 'Aprobado', trustLevel: 'Gold', dist: 1.2, daysLeft: 2, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
            { id: 'CS-002', titulo: 'Reconstrucción Familia Díaz', categoria: 'Ayuda Familiar', catKey: 'familiar', story: 'La familia Díaz perdió su casa en un reciente incendio. Necesitan ayuda para reconstruir su hogar y recuperar sus pertenencias.', raised: 1200, meta: 8000, img: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800', status: 'Aprobado', trustLevel: 'Silver', dist: 4.5, daysLeft: 12, videoUrl: 'https://www.youtube.com/embed/3JZ_D3ELwOQ' },
            { id: 'CS-003', titulo: 'Útiles Escolares para 50 Niños', categoria: 'Educación', catKey: 'educacion', story: '50 niños de la comunidad Los Girasoles necesitan útiles escolares para iniciar el año escolar. Muchas familias no pueden costearlos.', raised: 3200, meta: 5000, img: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800', status: 'Aprobado', trustLevel: 'Gold', dist: 2.8, daysLeft: 8, videoUrl: 'https://www.youtube.com/embed/L_jWHffIx5E' },
            { id: 'CS-004', titulo: 'Cirugía de Cadera Doña Mercedes', categoria: 'Emergencia Médica', catKey: 'medico', story: 'Doña Mercedes, de 72 años, necesita una cirugía de reemplazo de cadera. Lleva meses sin poder caminar y necesita ayuda urgente.', raised: 15000, meta: 25000, img: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800', status: 'Aprobado', trustLevel: 'Gold', dist: 3.1, daysLeft: 5, videoUrl: 'https://www.youtube.com/embed/ZbZSe6N_BXs' },
            { id: 'CS-005', titulo: 'Taller de Costura Comunitario', categoria: 'Emprendimiento', catKey: 'emprendimiento', story: 'Un grupo de 15 mujeres del barrio Villa Mella buscan crear un taller de costura para generar ingresos y ser independientes económicamente.', raised: 800, meta: 12000, img: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800', status: 'Aprobado', trustLevel: 'Silver', dist: 5.0, daysLeft: 20, videoUrl: 'https://www.youtube.com/embed/9bZkp7q19f0' },
            { id: 'CS-006', titulo: 'Alimentos para Refugio Animal', categoria: 'Animales', catKey: 'animales', story: 'El refugio "Patitas Felices" necesita alimento para más de 80 perros y gatos rescatados. Los suministros se están agotando.', raised: 2100, meta: 4000, img: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800', status: 'Aprobado', trustLevel: 'Silver', dist: 1.8, daysLeft: 7, videoUrl: 'https://www.youtube.com/embed/2Vv-BfVoq4g' },
            { id: 'CS-007', titulo: 'Rehabilitación para Joven Deportista', categoria: 'Emergencia Médica', catKey: 'medico', story: 'Carlos, un joven atleta de 19 años, sufrió una lesión grave en la rodilla durante una competencia. Necesita rehabilitación especializada.', raised: 5500, meta: 8000, img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800', status: 'Aprobado', trustLevel: 'Gold', dist: 6.2, daysLeft: 15, videoUrl: 'https://www.youtube.com/embed/kJQP7kiw5Fk' },
            { id: 'CS-008', titulo: 'Biblioteca Infantil Comunitaria', categoria: 'Educación', catKey: 'educacion', story: 'La comunidad de Haina necesita una biblioteca infantil. Los niños no tienen acceso a libros y materiales de lectura.', raised: 1800, meta: 6000, img: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800', status: 'Aprobado', trustLevel: 'Silver', dist: 3.5, daysLeft: 25, videoUrl: 'https://www.youtube.com/embed/RgKAFK5djSk' },
            { id: 'CS-009', titulo: 'Vivienda para Madre Soltera', categoria: 'Ayuda Familiar', catKey: 'familiar', story: 'María, madre soltera de 3 hijos, vive en condiciones precarias. Necesita materiales para construir una vivienda digna.', raised: 4200, meta: 15000, img: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800', status: 'Aprobado', trustLevel: 'Gold', dist: 7.0, daysLeft: 30, videoUrl: 'https://www.youtube.com/embed/fJ9rUzIMcZQ' },
            { id: 'CS-010', titulo: 'Equipo Médico para Clínica Rural', categoria: 'Emergencia Médica', catKey: 'medico', story: 'La clínica rural de Los Alcarrizos necesita equipos médicos básicos para atender a más de 2,000 personas de la comunidad.', raised: 8900, meta: 20000, img: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800', status: 'Aprobado', trustLevel: 'Gold', dist: 4.0, daysLeft: 18, videoUrl: 'https://www.youtube.com/embed/JGwWNGJdvx8' },
            { id: 'CS-011', titulo: 'Prótesis para Trabajador Agrícola', categoria: 'Emergencia Médica', catKey: 'medico', story: 'Don Ramón perdió su mano derecha en un accidente agrícola. Necesita una prótesis funcional para poder trabajar y mantener a su familia.', raised: 6200, meta: 18000, img: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800', status: 'Aprobado', trustLevel: 'Gold', dist: 5.5, daysLeft: 22, videoUrl: 'https://www.youtube.com/embed/60ItHLz5WEA' },
            { id: 'CS-012', titulo: 'Comedor Infantil Los Girasoles', categoria: 'Ayuda Familiar', catKey: 'familiar', story: 'El comedor comunitario Los Girasoles alimenta a 120 niños diariamente. Los recursos se están agotando y necesitan apoyo urgente.', raised: 3800, meta: 7000, img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800', status: 'Aprobado', trustLevel: 'Gold', dist: 2.3, daysLeft: 10, videoUrl: 'https://www.youtube.com/embed/hT_nvWreIhg' },
            { id: 'CS-013', titulo: 'Becas para Estudiantes de Medicina', categoria: 'Educación', catKey: 'educacion', story: '8 jóvenes brillantes de Monte Plata fueron aceptados en la universidad pero no pueden costear la matrícula de medicina.', raised: 12000, meta: 30000, img: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800', status: 'Aprobado', trustLevel: 'Gold', dist: 8.0, daysLeft: 35, videoUrl: 'https://www.youtube.com/embed/OPf0YbXqDm0' },
            { id: 'CS-014', titulo: 'Panadería Solidaria Barrio Nuevo', categoria: 'Emprendimiento', catKey: 'emprendimiento', story: 'Un grupo de madres solteras quiere abrir una panadería comunitaria para generar empleo y alimentar a familias necesitadas.', raised: 2500, meta: 9000, img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800', status: 'Aprobado', trustLevel: 'Silver', dist: 3.8, daysLeft: 28, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
            { id: 'CS-015', titulo: 'Rescate y Esterilización Animal', categoria: 'Animales', catKey: 'animales', story: 'La fundación "Huellas de Amor" necesita fondos para esterilizar 200 perros y gatos callejeros y reducir la sobrepoblación animal.', raised: 1500, meta: 5000, img: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800', status: 'Aprobado', trustLevel: 'Silver', dist: 4.2, daysLeft: 16, videoUrl: 'https://www.youtube.com/embed/3JZ_D3ELwOQ' },
            { id: 'CS-016', titulo: 'Agua Potable para La Cueva', categoria: 'Ayuda Familiar', catKey: 'familiar', story: 'La comunidad de La Cueva no tiene acceso a agua potable. Se necesita construir un pozo y sistema de distribución para 300 familias.', raised: 18000, meta: 35000, img: 'https://images.unsplash.com/photo-1517646287270-a5a0616a391c?w=800', status: 'Aprobado', trustLevel: 'Gold', dist: 12.0, daysLeft: 45, videoUrl: 'https://www.youtube.com/embed/L_jWHffIx5E' },
            { id: 'CS-017', titulo: 'Centro de Computación Comunitario', categoria: 'Educación', catKey: 'educacion', story: 'Los jóvenes de Sabana Grande necesitan un centro con computadoras para estudiar y hacer sus tareas. Actualmente no tienen acceso a internet.', raised: 4500, meta: 12000, img: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800', status: 'Aprobado', trustLevel: 'Silver', dist: 6.5, daysLeft: 30, videoUrl: 'https://www.youtube.com/embed/ZbZSe6N_BXs' },
            { id: 'CS-018', titulo: 'Taller de Carpintería Juvenil', categoria: 'Emprendimiento', catKey: 'emprendimiento', story: '20 jóvenes en riesgo social quieren aprender carpintería como oficio. Necesitan herramientas y materiales para iniciar el taller.', raised: 3000, meta: 8000, img: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=800', status: 'Aprobado', trustLevel: 'Silver', dist: 5.8, daysLeft: 20, videoUrl: 'https://www.youtube.com/embed/9bZkp7q19f0' },
            { id: 'CS-019', titulo: 'Sillas de Ruedas para Ancianos', categoria: 'Emergencia Médica', catKey: 'medico', story: '15 ancianos del asilo San José necesitan sillas de ruedas. Muchos no pueden moverse sin ayuda y dependen de voluntarios.', raised: 7800, meta: 15000, img: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800', status: 'Aprobado', trustLevel: 'Gold', dist: 3.0, daysLeft: 14, videoUrl: 'https://www.youtube.com/embed/2Vv-BfVoq4g' },
            { id: 'CS-020', titulo: 'Huerto Urbano para la Comunidad', categoria: 'Emprendimiento', catKey: 'emprendimiento', story: 'Vecinos de Monte Plata quieren crear un huerto urbano para producir alimentos orgánicos y generar sustento para 40 familias.', raised: 1200, meta: 6000, img: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800', status: 'Aprobado', trustLevel: 'Silver', dist: 2.0, daysLeft: 25, videoUrl: 'https://www.youtube.com/embed/kJQP7kiw5Fk' }
        ]);
        localStorage.setItem('db_casos_v2', '1');
    },

    _seedImpacto: function() {
        // Always reseed impact data to ensure latest titles are used
        // Comment out the guard that prevents re‑seeding when data already exists
        // if (localStorage.getItem('db_impacto_v2')) return;
        localStorage.removeItem('db_impacto');
        this._set('db_impacto', [
            { id: 'IMP-001', nombre: 'Ayuda a un Tercero', ubicacion: 'Politécnico Rosario Rojas', historia: 'El centro se siente muy agradecido; me parece un regalo perfecto para nosotros y para el área de redes, que es la que más lo va a aprovechar. Muchísimas gracias por su donación.', videoUrl: 'https://www.youtube.com/embed/DSnf-n_gKWg', thumb: 'https://img.youtube.com/vi/DSnf-n_gKWg/hqdefault.jpg', categoriaIcons: ['heart', 'monitor'], votos: 95, fecha: '2024-05-05' },
            { id: 'IMP-002', nombre: 'Ayuda a un Tercero', ubicacion: 'Politécnico Rosario Rojas', historia: 'Entregamos mochilas, ropa, lápices, cuadernos y hasta pelotas para que los estudiantes tengan tanto con qué vestir como con qué escribir y reforzar sus conocimientos.', videoUrl: 'https://www.youtube.com/embed/QSxU_52jrp8', thumb: 'https://img.youtube.com/vi/QSxU_52jrp8/hqdefault.jpg', categoriaIcons: ['gift', 'book'], votos: 112, fecha: '2024-05-05' },
            { id: 'IMP-003', nombre: 'Luz Peña', ubicacion: 'La Vega', historia: 'Recibí medicamentos para mi tratamiento de cáncer gracias a una donación de la comunidad. Ahora puedo continuar con mi vida y cuidar a mis hijos.', videoUrl: 'https://www.youtube.com/embed/DSnf-n_gKWg', thumb: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800', categoriaIcons: ['heart', 'activity'], votos: 156, fecha: '2024-04-10' },
            { id: 'IMP-004', nombre: 'Carlos Medina', ubicacion: 'Puerto Plata', historia: 'Pude iniciar mi negocio de comida gracias al microcrédito. Ahora empleo a 3 personas del barrio y alimentamos a la comunidad.', videoUrl: 'https://www.youtube.com/embed/QSxU_52jrp8', thumb: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800', categoriaIcons: ['briefcase', 'trending-up'], votos: 201, fecha: '2024-05-01' },
            { id: 'IMP-005', nombre: 'Ana Lucía Torres', ubicacion: 'San Pedro de Macorís', historia: 'Los útiles escolares donados permitieron que mis 3 hijos continuaran sus estudios sin interrupciones. Estamos muy agradecidos.', videoUrl: 'https://www.youtube.com/embed/DSnf-n_gKWg', thumb: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800', categoriaIcons: ['book', 'users'], votos: 178, fecha: '2024-05-15' },
            { id: 'IMP-006', nombre: 'Roberto Féliz', ubicacion: 'Monte Plata', historia: 'Después del huracán perdimos todo. La comunidad nos ayudó a reconstruir nuestra casa en 2 meses. Ahora tenemos un hogar seguro.', videoUrl: 'https://www.youtube.com/embed/QSxU_52jrp8', thumb: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800', categoriaIcons: ['home', 'heart'], votos: 245, fecha: '2024-06-01' },
            { id: 'IMP-007', nombre: 'Francisca Reyes', ubicacion: 'Higüey', historia: 'La beca universitaria que recibí me permitió terminar mi carrera de enfermería. Ahora trabajo en el hospital local ayudando a otros.', videoUrl: 'https://www.youtube.com/embed/DSnf-n_gKWg', thumb: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800', categoriaIcons: ['award', 'book'], votos: 312, fecha: '2024-06-20' },
            { id: 'IMP-008', nombre: 'Miguel Ángel Sosa', ubicacion: 'Baní', historia: 'Gracias al apoyo recibido, mi cooperativa agrícola ahora produce alimentos para toda la comunidad. Del campo a la mesa.', videoUrl: 'https://www.youtube.com/embed/QSxU_52jrp8', thumb: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800', categoriaIcons: ['sun', 'users'], votos: 187, fecha: '2024-07-10' },
            { id: 'IMP-009', nombre: 'Juana Martínez', ubicacion: 'Santo Domingo Norte', historia: 'Gracias a la donación de una lavadora, ahora puedo lavar la ropa de mis 5 hijos sin tener que ir al río. Un cambio increíble para nosotros.', videoUrl: 'https://www.youtube.com/embed/DSnf-n_gKWg', thumb: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800', categoriaIcons: ['heart', 'home'], votos: 134, fecha: '2024-07-20' },
            { id: 'IMP-010', nombre: 'Pedro Almonte', ubicacion: 'Santiago', historia: 'El taller de carpintería que montamos con el apoyo de la plataforma ya genera empleo para 5 jóvenes del barrio.', videoUrl: 'https://www.youtube.com/embed/QSxU_52jrp8', thumb: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=800', categoriaIcons: ['tool', 'briefcase'], votos: 89, fecha: '2024-08-01' },
            { id: 'IMP-011', nombre: 'Doña Teresa', ubicacion: 'Moca', historia: 'A mis 78 años recibí una silla de ruedas nueva. Ahora puedo ir a misa los domingos y visitar a mis vecinas.', videoUrl: 'https://www.youtube.com/embed/DSnf-n_gKWg', thumb: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800', categoriaIcons: ['heart', 'users'], votos: 267, fecha: '2024-08-15' },
            { id: 'IMP-012', nombre: 'Marcos Familia', ubicacion: 'Bonao', historia: 'Nuestro comedor comunitario sirve 200 platos al día gracias a las donaciones de alimentos que recibimos cada semana.', videoUrl: 'https://www.youtube.com/embed/QSxU_52jrp8', thumb: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800', categoriaIcons: ['heart', 'coffee'], votos: 345, fecha: '2024-08-25' },
            { id: 'IMP-013', nombre: 'Escuela Los Pinos', ubicacion: 'San Cristóbal', historia: 'Recibimos 50 uniformes escolares donados. Los niños están felices de tener ropa nueva para ir a la escuela.', videoUrl: 'https://www.youtube.com/embed/DSnf-n_gKWg', thumb: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800', categoriaIcons: ['book', 'gift'], votos: 198, fecha: '2024-09-01' },
            { id: 'IMP-014', nombre: 'Luis Corporán', ubicacion: 'La Romana', historia: 'Con el microcrédito abrí mi barbería. Ya tengo clientela fija y puedo mantener a mi familia dignamente.', videoUrl: 'https://www.youtube.com/embed/QSxU_52jrp8', thumb: 'https://images.unsplash.com/photo-1585747860019-8e8b2c1cd6b8?w=800', categoriaIcons: ['briefcase', 'trending-up'], votos: 156, fecha: '2024-09-10' },
            { id: 'IMP-015', nombre: 'Familia González', ubicacion: 'Azua', historia: 'Recibimos materiales de construcción para reparar el techo que se voló con la tormenta. Ahora dormimos seguros.', videoUrl: 'https://www.youtube.com/embed/DSnf-n_gKWg', thumb: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800', categoriaIcons: ['home', 'heart'], votos: 289, fecha: '2024-09-20' },
            { id: 'IMP-016', nombre: 'Centro de Salud Barrio Nuevo', ubicacion: 'Monte Plata', historia: 'Con los equipos médicos donados ahora podemos atender emergencias sin tener que enviar pacientes a la capital.', videoUrl: 'https://www.youtube.com/embed/QSxU_52jrp8', thumb: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800', categoriaIcons: ['activity', 'heart'], votos: 412, fecha: '2024-10-01' },
            { id: 'IMP-017', nombre: 'Rosa María Peña', ubicacion: 'Barahona', historia: 'La máquina de coser que me donaron me permitió empezar mi propio negocio. Ahora hago uniformes escolares para la comunidad.', videoUrl: 'https://www.youtube.com/embed/DSnf-n_gKWg', thumb: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800', categoriaIcons: ['briefcase', 'gift'], votos: 167, fecha: '2024-10-15' },
            { id: 'IMP-018', nombre: 'Club Deportivo Monte Plata', ubicacion: 'Monte Plata', historia: 'Con los balones y equipos deportivos donados, 40 niños ahora practican fútbol y béisbol después de clases.', videoUrl: 'https://www.youtube.com/embed/QSxU_52jrp8', thumb: 'https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=800', categoriaIcons: ['activity', 'users'], votos: 223, fecha: '2024-10-25' },
            { id: 'IMP-019', nombre: 'Doña Carmen Reyes', ubicacion: 'Cotuí', historia: 'Recibí una nevera donada que me permite conservar los alimentos de mis nietos. Ya no se nos daña la comida.', videoUrl: 'https://www.youtube.com/embed/DSnf-n_gKWg', thumb: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=800', categoriaIcons: ['home', 'heart'], votos: 145, fecha: '2024-11-05' },
            { id: 'IMP-020', nombre: 'Biblioteca Comunitaria Los Girasoles', ubicacion: 'Haina', historia: 'Con los libros donados creamos una biblioteca para los niños del barrio. Ahora leen y hacen sus tareas aquí todos los días.', videoUrl: 'https://www.youtube.com/embed/QSxU_52jrp8', thumb: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800', categoriaIcons: ['book', 'users'], votos: 278, fecha: '2024-11-15' },
            { id: 'IMP-021', nombre: 'Fundación Esperanza', ubicacion: 'San Juan', historia: 'El programa de becas financiado por la plataforma permitió que 12 jóvenes entraran a la universidad este año.', videoUrl: 'https://www.youtube.com/embed/DSnf-n_gKWg', thumb: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800', categoriaIcons: ['award', 'book'], votos: 356, fecha: '2024-11-25' },
            { id: 'IMP-022', nombre: 'Cooperativa Agropecuaria', ubicacion: 'Constanza', historia: 'Con las herramientas agrícolas donadas nuestra cooperativa de 20 familias ahora produce verduras orgánicas para la comunidad.', videoUrl: 'https://www.youtube.com/embed/QSxU_52jrp8', thumb: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800', categoriaIcons: ['sun', 'trending-up'], votos: 189, fecha: '2024-12-01' }
        ]);
        localStorage.setItem('db_impacto_v2', '1');
    },

    _seedPrestamos: function() {
        if (localStorage.getItem('db_prestamos')) return;
        this._set('db_prestamos', [
            { id: 'CR-1102', nombre: 'Juan Pérez', tipo: 'Personal', score: '95/100', monto: '$800 (6 meses)', status: 'Pendiente', fecha: '2025-01-15' },
            { id: 'CR-2205', nombre: 'María Santos', tipo: 'Microcrédito', score: '88/100', monto: '$1,200 (12 meses)', status: 'Aprobado', fecha: '2025-02-01' },
            { id: 'CR-3308', nombre: 'Carlos Almonte', tipo: 'Emprendimiento', score: '92/100', monto: '$2,500 (18 meses)', status: 'Aprobado', fecha: '2025-02-20' },
            { id: 'CR-4411', nombre: 'Ana Belén Cruz', tipo: 'Personal', score: '78/100', monto: '$500 (3 meses)', status: 'Pendiente', fecha: '2025-03-05' },
            { id: 'CR-5514', nombre: 'Pedro Jiménez', tipo: 'Emergencia', score: '85/100', monto: '$350 (3 meses)', status: 'Pagado', fecha: '2024-11-10' }
        ]);
    },

    // ─── Usuarios ───────────────────────────────────────
    getUsers: function() { return this._getArr('db_users'); },
    findUserByEmail: function(email) {
        return this.getUsers().find(function(u) { return u.email.toLowerCase() === email.toLowerCase(); });
    },
    registerUser: function(email, password) {
        if (this.findUserByEmail(email)) return { error: 'El correo ya está registrado.' };
        var user = { id: this._uid(), email: email, password: password, role: 'usuario', name: email.split('@')[0], whatsapp: '', vendorStatus: 'none', createdAt: new Date().toISOString() };
        var users = this.getUsers(); users.push(user); this._set('db_users', users);
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
    logout: function() { localStorage.removeItem('db_current_user'); this.clearCart(); },
    refreshCurrentUser: function() {
        var cu = this.getCurrentUser(); if (!cu) return null;
        var fresh = this.getUsers().find(function(u) { return u.id === cu.id; });
        if (fresh) this.setCurrentUser(fresh); return fresh;
    },
    updateUser: function(id, data) {
        var users = this.getUsers();
        var idx = users.findIndex(function(u) { return u.id === id; });
        if (idx === -1) return null;
        Object.assign(users[idx], data); this._set('db_users', users); return users[idx];
    },

    // ─── Productos ──────────────────────────────────────
    getProductos: function() { return this._getArr('db_productos'); },
    getApprovedProducts: function() { return this.getProductos().filter(function(p) { return p.status === 'aprobado'; }); },
    addProduct: function(product) {
        product.id = this._uid(); product.status = 'pendiente'; product.views = 0; product.createdAt = new Date().toISOString();
        var list = this.getProductos(); list.push(product); this._set('db_productos', list); return product;
    },
    updateProduct: function(id, data) {
        var list = this.getProductos(); var idx = list.findIndex(function(p) { return p.id === id; });
        if (idx === -1) return null; Object.assign(list[idx], data); this._set('db_productos', list); return list[idx];
    },
    deleteProduct: function(id) { this._set('db_productos', this.getProductos().filter(function(p) { return p.id !== id; })); },
    findProduct: function(id) { return this.getProductos().find(function(p) { return p.id === id; }) || null; },

    // ─── Donaciones v2 ──────────────────────────────────
    getDonacionesV2: function() { return this._getArr('db_donaciones_v2'); },
    getApprovedDonations: function() { return this.getDonacionesV2().filter(function(d) { return d.status === 'aprobado'; }); },
    addDonation: function(don) {
        don.id = this._uid(); don.status = 'pendiente'; don.createdAt = new Date().toISOString();
        var list = this.getDonacionesV2(); list.push(don); this._set('db_donaciones_v2', list); return don;
    },
    updateDonation: function(id, data) {
        var list = this.getDonacionesV2(); var idx = list.findIndex(function(d) { return d.id === id; });
        if (idx === -1) return null; Object.assign(list[idx], data); this._set('db_donaciones_v2', list); return list[idx];
    },

    // ─── Solicitudes de Vendedor ────────────────────────
    getVendorRequests: function() { return this._getArr('db_vendor_requests'); },
    addVendorRequest: function(req) {
        req.id = this._uid(); req.status = 'pendiente'; req.createdAt = new Date().toISOString();
        var list = this.getVendorRequests(); list.push(req); this._set('db_vendor_requests', list);
        this.updateUser(req.userId, { vendorStatus: 'pendiente' });
        var cu = this.getCurrentUser();
        if (cu && cu.id === req.userId) { cu.vendorStatus = 'pendiente'; this.setCurrentUser(cu); }
        this.addNotification({ userId: 'admin', type: 'vendor_request', message: 'Nueva solicitud de vendedor: ' + req.userName });
        return req;
    },
    approveVendor: function(requestId) {
        var list = this.getVendorRequests(); var req = list.find(function(r) { return r.id === requestId; });
        if (!req) return; req.status = 'aprobado'; this._set('db_vendor_requests', list);
        this.updateUser(req.userId, { role: 'vendedor', vendorStatus: 'aprobado', whatsapp: req.whatsapp });
        this.addNotification({ userId: req.userId, type: 'vendor_approved', message: 'Tu solicitud de vendedor ha sido aprobada.' });
    },
    rejectVendor: function(requestId) {
        var list = this.getVendorRequests(); var req = list.find(function(r) { return r.id === requestId; });
        if (!req) return; req.status = 'rechazado'; this._set('db_vendor_requests', list);
        this.updateUser(req.userId, { vendorStatus: 'rechazado' });
        this.addNotification({ userId: req.userId, type: 'vendor_rejected', message: 'Tu solicitud de vendedor ha sido rechazada.' });
    },

    // ─── Reportes ───────────────────────────────────────
    getReports: function() { return this._getArr('db_reports'); },
    addReport: function(report) {
        report.id = this._uid(); report.status = 'pendiente'; report.response = ''; report.createdAt = new Date().toISOString();
        var list = this.getReports(); list.push(report); this._set('db_reports', list);
        this.addNotification({ userId: 'admin', type: 'report_received', message: 'Nuevo reporte: ' + report.reason + ' — ' + report.productName });
        return report;
    },
    updateReport: function(id, data) {
        var list = this.getReports(); var idx = list.findIndex(function(r) { return r.id === id; });
        if (idx === -1) return null; Object.assign(list[idx], data); this._set('db_reports', list); return list[idx];
    },
    deleteReport: function(id) { this._set('db_reports', this.getReports().filter(function(r) { return r.id !== id; })); },

    // ─── Contactos WhatsApp ─────────────────────────────
    getContacts: function() { return this._getArr('db_contacts'); },
    addContact: function(contact) {
        contact.id = this._uid(); contact.createdAt = new Date().toISOString();
        var list = this.getContacts(); list.push(contact); this._set('db_contacts', list);
        this.addNotification({ userId: 'admin', type: 'contact_received', message: 'Contacto WhatsApp: ' + contact.buyerName + ' → ' + contact.productName });
        return contact;
    },

    // ─── Carrito ─────────────────────────────────────────
    getCart: function() { return this._getSessionArr('db_cart'); },
    addToCart: function(productId) {
        var cart = this.getCart();
        var existing = cart.find(function(c) { return c.productId === productId; });
        if (existing) { existing.qty++; } else { cart.push({ productId: productId, qty: 1 }); }
        this._setSession('db_cart', cart); return cart;
    },
    removeFromCart: function(productId) {
        this._setSession('db_cart', this.getCart().filter(function(c) { return c.productId !== productId; }));
    },
    updateCartQty: function(productId, qty) {
        var cart = this.getCart();
        var item = cart.find(function(c) { return c.productId === productId; });
        if (item) { if (qty <= 0) { this.removeFromCart(productId); return; } item.qty = qty; this._setSession('db_cart', cart); }
    },
    clearCart: function() { this._setSession('db_cart', []); },
    getCartTotal: function() {
        var cart = this.getCart(); var self = this; var total = 0;
        cart.forEach(function(c) { var p = self.findProduct(c.productId); if (p) total += p.price * c.qty; });
        return total;
    },
    getCartCount: function() {
        var count = 0; this.getCart().forEach(function(c) { count += c.qty; }); return count;
    },

    // ─── Notificaciones ─────────────────────────────────
    getNotifications: function(userId) {
        var all = this._getArr('db_notifications');
        if (!userId) return all;
        return all.filter(function(n) { return n.userId === userId || n.userId === 'all'; });
    },
    addNotification: function(notif) {
        notif.id = this._uid(); notif.read = false; notif.createdAt = new Date().toISOString();
        var list = this._getArr('db_notifications'); list.push(notif); this._set('db_notifications', list); return notif;
    },
    markNotifRead: function(id) {
        var list = this._getArr('db_notifications');
        var n = list.find(function(x) { return x.id === id; });
        if (n) { n.read = true; this._set('db_notifications', list); }
    },
    markAllNotifsRead: function(userId) {
        var list = this._getArr('db_notifications');
        list.forEach(function(n) { if ((n.userId === userId || n.userId === 'all' || n.userId === 'admin') && !n.read) n.read = true; });
        this._set('db_notifications', list);
    },
    getUnreadCount: function(userId) { return this.getNotifications(userId).filter(function(n) { return !n.read; }).length; },

    // ─── Estadísticas ───────────────────────────────────
    getSystemStats: function() {
        var products = this.getProductos();
        return {
            totalUsers: this.getUsers().length, totalVendors: this.getUsers().filter(function(u) { return u.role === 'vendedor'; }).length,
            totalProducts: products.length, totalDonations: this.getDonacionesV2().length,
            totalReports: this.getReports().length, totalContacts: this.getContacts().length,
            topViewed: products.slice().sort(function(a, b) { return (b.views || 0) - (a.views || 0); }).slice(0, 5)
        };
    },

    // ─── Módulos originales preservados ─────────────────
    getImpacto: function() { return JSON.parse(localStorage.getItem('db_impacto')) || []; },
    saveImpacto: function(h) { var l = this.getImpacto(); h.id = 'IMP-' + Math.floor(Math.random() * 9000 + 1000); h.votos = 0; h.fecha = new Date().toISOString().split('T')[0]; l.push(h); localStorage.setItem('db_impacto', JSON.stringify(l)); return h; },
    voteImpacto: function(id) { var l = this.getImpacto(); var i = l.findIndex(function(x) { return x.id === id; }); if (i !== -1) { l[i].votos++; localStorage.setItem('db_impacto', JSON.stringify(l)); } },
    deleteImpacto: function(id) { localStorage.setItem('db_impacto', JSON.stringify(this.getImpacto().filter(function(x) { return x.id !== id; }))); },
    getStats: function() { return JSON.parse(localStorage.getItem('db_stats')) || { vidas_impactadas: 0, donaciones_totales: 0, co2_ahorrado: 0, casos_exitosos: 0 }; },
    updateStats: function(key, inc) { if (inc === undefined) inc = 1; var s = this.getStats(); if (s[key] !== undefined) { s[key] += inc; localStorage.setItem('db_stats', JSON.stringify(s)); } },
    getReputation: function() { return JSON.parse(localStorage.getItem('db_reputacion')) || { puntos: 0, nivel: 'Silver', insignias: [], metas_proximas: [] }; },
    addPoints: function(amount) { var r = this.getReputation(); r.puntos += amount; if (r.puntos > 500) r.nivel = 'Gold'; localStorage.setItem('db_reputacion', JSON.stringify(r)); },
    getPrestamos: function() { return JSON.parse(localStorage.getItem('db_prestamos')) || []; },
    savePrestamo: function(p) { 
        var l = this.getPrestamos(); 
        p.id = 'CR-' + Math.floor(Math.random() * 9000 + 1000); 
        p.status = 'Pendiente'; 
        p.montoOriginal = p.monto;
        l.push(p); 
        localStorage.setItem('db_prestamos', JSON.stringify(l)); 
        if(this.addNotification) {
            this.addNotification({
                userId: 'admin',
                type: 'prestamo_request',
                message: 'Nueva solicitud de préstamo de: ' + (p.nombre || 'Usuario')
            });
        }
        return p; 
    },
    updatePrestamoStatus: function(id, s) { 
        var l = this.getPrestamos(); 
        var i = l.findIndex(function(x) { return x.id === id; }); 
        if (i !== -1) { 
            l[i].status = s; 
            localStorage.setItem('db_prestamos', JSON.stringify(l)); 
            if(this.addNotification && l[i].userId) {
                var action = s === 'Aprobado' ? 'aprobada' : (s === 'Rechazado' ? 'rechazada' : 'actualizada');
                var typeStr = s === 'Aprobado' ? 'prestamo_approved' : (s === 'Rechazado' ? 'prestamo_rejected' : 'prestamo_update');
                this.addNotification({
                    userId: l[i].userId,
                    type: typeStr,
                    message: 'Tu solicitud de préstamo ha sido ' + action + '.'
                });
            }
        } 
    },
    getMarketplace: function() { return JSON.parse(localStorage.getItem('db_marketplace')) || []; },
    saveMarketplace: function(item) { var l = this.getMarketplace(); item.id = 'MK-' + Math.floor(Math.random() * 9000 + 1000); item.status = 'En Revisión'; l.push(item); localStorage.setItem('db_marketplace', JSON.stringify(l)); return item; },
    updateMarketplaceStatus: function(id, s) { var l = this.getMarketplace(); var i = l.findIndex(function(x) { return x.id === id; }); if (i !== -1) { l[i].status = s; localStorage.setItem('db_marketplace', JSON.stringify(l)); } },
    getDonaciones: function() { return JSON.parse(localStorage.getItem('db_donaciones')) || []; },
    saveDonacion: function(item) { var l = this.getDonaciones(); item.id = 'DN-' + Math.floor(Math.random() * 9000 + 1000); item.status = 'En Revisión'; l.push(item); localStorage.setItem('db_donaciones', JSON.stringify(l)); return item; },
    updateDonacionStatus: function(id, s) { var l = this.getDonaciones(); var i = l.findIndex(function(x) { return x.id === id; }); if (i !== -1) { l[i].status = s; localStorage.setItem('db_donaciones', JSON.stringify(l)); } },
    getCasos: function() { return JSON.parse(localStorage.getItem('db_casos')) || []; },
    saveCaso: function(caso) { var l = this.getCasos(); caso.id = 'CS-' + Math.floor(Math.random() * 9000 + 1000); caso.status = 'En Revisión'; var t = ((caso.title || '') + ' ' + (caso.desc || '')).toLowerCase(); if (t.includes('urgente') || t.includes('cirugía') || t.includes('emergencia')) { caso.aiUrgency = 'High'; caso.daysLeft = 3; } else { caso.aiUrgency = 'Normal'; caso.daysLeft = 15; } l.push(caso); localStorage.setItem('db_casos', JSON.stringify(l)); return caso; },
    updateCasoStatus: function(id, s) { var l = this.getCasos(); var i = l.findIndex(function(x) { return x.id === id; }); if (i !== -1) { l[i].status = s; localStorage.setItem('db_casos', JSON.stringify(l)); } },
    updateCasoAmount: function(idOrTitle, amount) { var l = this.getCasos(); var i = l.findIndex(function(x) { return x.id === idOrTitle || x.titulo === idOrTitle; }); if (i !== -1) { l[i].raised = (parseFloat(l[i].raised) || 0) + parseFloat(amount); localStorage.setItem('db_casos', JSON.stringify(l)); return l[i]; } return null; }
};

DB.init();
