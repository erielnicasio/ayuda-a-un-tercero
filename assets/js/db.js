// DB.js - Base de Datos con localStorage para el sistema completo
var DB = {
    _uid: function() { return 'id-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6); },
    _get: function(key) { try { return JSON.parse(localStorage.getItem(key)) || null; } catch(e) { return null; } },
    _set: function(key, val) { localStorage.setItem(key, JSON.stringify(val)); },
    _getArr: function(key) { return this._get(key) || []; },

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
        if (localStorage.getItem('db_productos')) return;
        var locs = [
            { name: 'Santo Domingo', lat: 18.4861, lng: -69.9312 },
            { name: 'Santiago', lat: 19.4517, lng: -70.6970 },
            { name: 'La Vega', lat: 19.2210, lng: -70.5298 },
            { name: 'San Pedro', lat: 18.4539, lng: -69.3086 },
            { name: 'Puerto Plata', lat: 19.7934, lng: -70.6884 },
            { name: 'Monte Plata', lat: 18.8073, lng: -69.7839 }
        ];
        var data = [
            { name: 'Laptop HP Pavilion 15"', price: 18500, desc: 'Laptop en excelente estado, 8GB RAM, 256GB SSD. Ideal para trabajo y estudio.', cat: 'Electrónica', v: 'vendor-001', cond: 'usado',
              img: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600' },
            { name: 'Sofá Modular 3 Piezas', price: 12000, desc: 'Sofá modular color gris, tela premium, muy cómodo y elegante para sala.', cat: 'Hogar', v: 'vendor-002', cond: 'usado',
              img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600' },
            { name: 'Bicicleta Mountain Bike', price: 8500, desc: 'Bicicleta de montaña aro 29, 21 velocidades, frenos de disco.', cat: 'Deportes', v: 'vendor-003', cond: 'nuevo',
              img: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=600' },
            { name: 'iPhone 13 Pro 128GB', price: 25000, desc: 'iPhone 13 Pro en perfecto estado, batería al 92%, incluye cargador original.', cat: 'Electrónica', v: 'vendor-001', cond: 'usado',
              img: 'https://images.unsplash.com/photo-1632661674596-df8be59a8056?w=600' },
            { name: 'Mesa de Comedor 6 Sillas', price: 15000, desc: 'Mesa de comedor en madera de pino con 6 sillas tapizadas, color natural.', cat: 'Hogar', v: 'vendor-002', cond: 'nuevo',
              img: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600' },
            { name: 'Zapatillas Nike Air Max', price: 3500, desc: 'Zapatillas Nike Air Max talla 42, color negro/blanco, uso mínimo.', cat: 'Ropa', v: 'vendor-003', cond: 'usado',
              img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600' },
            { name: 'Televisor Samsung 55" 4K', price: 22000, desc: 'Smart TV Samsung 55 pulgadas, resolución 4K, HDR, wifi integrado.', cat: 'Electrónica', v: 'vendor-001', cond: 'nuevo',
              img: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600' },
            { name: 'Silla de Ruedas Eléctrica', price: 35000, desc: 'Silla de ruedas eléctrica plegable, batería de larga duración, control joystick.', cat: 'Salud', v: 'vendor-002', cond: 'nuevo',
              img: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=600' },
            { name: 'Set de Libros Universitarios', price: 2500, desc: 'Colección de 12 libros de administración de empresas, en buen estado.', cat: 'Educación', v: 'vendor-003', cond: 'usado',
              img: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600' },
            { name: 'Honda Civic 2018', price: 450000, desc: 'Honda Civic 2018, automático, 65,000 km, color plateado, un solo dueño.', cat: 'Vehículos', v: 'vendor-001', cond: 'usado',
              img: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600' },
            { name: 'Nevera Inverter LG', price: 28000, desc: 'Nevera LG Inverter 14 pies cúbicos, dispensador de agua, ahorro energético.', cat: 'Hogar', v: 'vendor-002', cond: 'nuevo',
              img: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=600' },
            { name: 'Guitarra Acústica Yamaha', price: 6000, desc: 'Guitarra acústica Yamaha F310, cuerdas de nylon, incluye funda y afinador.', cat: 'Deportes', v: 'vendor-003', cond: 'usado',
              img: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=600' },
            { name: 'Canasta Alimentos Básicos', price: 1500, desc: 'Canasta con arroz, habichuelas, aceite, azúcar y otros artículos esenciales.', cat: 'Alimentos', v: 'vendor-001', cond: 'nuevo',
              img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600' },
            { name: 'Vestido de Gala Talla M', price: 4500, desc: 'Vestido de gala color azul marino, talla M, usado una sola vez, impecable.', cat: 'Ropa', v: 'vendor-002', cond: 'usado',
              img: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600' },
            { name: 'Tablet Samsung Galaxy Tab', price: 9500, desc: 'Samsung Galaxy Tab A8 10.5", 64GB, WiFi, incluye funda y cargador.', cat: 'Electrónica', v: 'vendor-003', cond: 'nuevo',
              img: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600' }
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
                condition: p.cond, images: imgs,
                vendorId: p.v, vendorName: vendor ? vendor.name : 'Vendedor',
                vendorWhatsapp: vendor ? vendor.whatsapp : '',
                status: 'aprobado', views: Math.floor(Math.random() * 200) + 10,
                createdAt: new Date(2025, 1 + Math.floor(i / 5), (i % 28) + 1).toISOString()
            });
        }
        this._set('db_productos', products);
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
        if (localStorage.getItem('db_casos')) return;
        this._set('db_casos', [
            { id: 'CS-001', titulo: 'Operación Pediátrica para Lucas', categoria: 'Emergencia Médica', catKey: 'medico', story: 'Lucas, de 4 años, necesita una cirugía urgente de corazón. Su familia no cuenta con los recursos necesarios para cubrir los gastos médicos.', raised: 7500, meta: 10000, img: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=800', status: 'Aprobado', trustLevel: 'Gold', dist: 1.2, daysLeft: 2 },
            { id: 'CS-002', titulo: 'Reconstrucción Familia Díaz', categoria: 'Ayuda Familiar', catKey: 'familiar', story: 'La familia Díaz perdió su casa en un reciente incendio. Necesitan ayuda para reconstruir su hogar y recuperar sus pertenencias.', raised: 1200, meta: 8000, img: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb0?w=800', status: 'Aprobado', trustLevel: 'Silver', dist: 4.5, daysLeft: 12 },
            { id: 'CS-003', titulo: 'Útiles Escolares para 50 Niños', categoria: 'Educación', catKey: 'educacion', story: '50 niños de la comunidad Los Girasoles necesitan útiles escolares para iniciar el año escolar. Muchas familias no pueden costearlos.', raised: 3200, meta: 5000, img: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800', status: 'Aprobado', trustLevel: 'Gold', dist: 2.8, daysLeft: 8 },
            { id: 'CS-004', titulo: 'Cirugía de Cadera Doña Mercedes', categoria: 'Emergencia Médica', catKey: 'medico', story: 'Doña Mercedes, de 72 años, necesita una cirugía de reemplazo de cadera. Lleva meses sin poder caminar y necesita ayuda urgente.', raised: 15000, meta: 25000, img: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800', status: 'Aprobado', trustLevel: 'Gold', dist: 3.1, daysLeft: 5 },
            { id: 'CS-005', titulo: 'Taller de Costura Comunitario', categoria: 'Emprendimiento', catKey: 'emprendimiento', story: 'Un grupo de 15 mujeres del barrio Villa Mella buscan crear un taller de costura para generar ingresos y ser independientes económicamente.', raised: 800, meta: 12000, img: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800', status: 'Aprobado', trustLevel: 'Silver', dist: 5.0, daysLeft: 20 },
            { id: 'CS-006', titulo: 'Alimentos para Refugio Animal', categoria: 'Animales', catKey: 'animales', story: 'El refugio "Patitas Felices" necesita alimento para más de 80 perros y gatos rescatados. Los suministros se están agotando.', raised: 2100, meta: 4000, img: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800', status: 'Aprobado', trustLevel: 'Silver', dist: 1.8, daysLeft: 7 },
            { id: 'CS-007', titulo: 'Rehabilitación para Joven Deportista', categoria: 'Emergencia Médica', catKey: 'medico', story: 'Carlos, un joven atleta de 19 años, sufrió una lesión grave en la rodilla durante una competencia. Necesita rehabilitación especializada.', raised: 5500, meta: 8000, img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800', status: 'Aprobado', trustLevel: 'Gold', dist: 6.2, daysLeft: 15 },
            { id: 'CS-008', titulo: 'Biblioteca Infantil Comunitaria', categoria: 'Educación', catKey: 'educacion', story: 'La comunidad de Haina necesita una biblioteca infantil. Los niños no tienen acceso a libros y materiales de lectura.', raised: 1800, meta: 6000, img: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800', status: 'Aprobado', trustLevel: 'Silver', dist: 3.5, daysLeft: 25 },
            { id: 'CS-009', titulo: 'Vivienda para Madre Soltera', categoria: 'Ayuda Familiar', catKey: 'familiar', story: 'María, madre soltera de 3 hijos, vive en condiciones precarias. Necesita materiales para construir una vivienda digna.', raised: 4200, meta: 15000, img: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800', status: 'Aprobado', trustLevel: 'Gold', dist: 7.0, daysLeft: 30 },
            { id: 'CS-010', titulo: 'Equipo Médico para Clínica Rural', categoria: 'Emergencia Médica', catKey: 'medico', story: 'La clínica rural de Los Alcarrizos necesita equipos médicos básicos para atender a más de 2,000 personas de la comunidad.', raised: 8900, meta: 20000, img: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800', status: 'Aprobado', trustLevel: 'Gold', dist: 4.0, daysLeft: 18 }
        ]);
    },

    _seedImpacto: function() {
        if (localStorage.getItem('db_impacto')) return;
        this._set('db_impacto', [
            { id: 'IMP-001', nombre: 'María Rodríguez', ubicacion: 'Santo Domingo Este', historia: 'Gracias a la silla de ruedas que recibí, ahora puedo salir al parque con mis nietos. Esta plataforma cambió mi vida.', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumb: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800', categoriaIcons: ['heart', 'users'], votos: 124, fecha: '2024-03-15' },
            { id: 'IMP-002', nombre: 'Juan Ramos', ubicacion: 'Santiago', historia: 'El préstamo Credifast me permitió comprar las herramientas para mi taller de carpintería.', videoUrl: 'https://www.youtube.com/embed/3JZ_D3ELwOQ', thumb: 'https://images.unsplash.com/photo-1581578731548-c64695ce6958?w=800', categoriaIcons: ['tool', 'briefcase'], votos: 89, fecha: '2024-03-20' },
            { id: 'IMP-003', nombre: 'Luz Peña', ubicacion: 'La Vega', historia: 'Recibí medicamentos para mi tratamiento de cáncer gracias a una donación de la comunidad.', videoUrl: 'https://www.youtube.com/embed/L_jWHffIx5E', thumb: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800', categoriaIcons: ['heart', 'activity'], votos: 156, fecha: '2024-04-10' },
            { id: 'IMP-004', nombre: 'Carlos Medina', ubicacion: 'Puerto Plata', historia: 'Pude iniciar mi negocio de comida gracias al microcrédito. Ahora empleo a 3 personas del barrio.', videoUrl: 'https://www.youtube.com/embed/ZbZSe6N_BXs', thumb: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800', categoriaIcons: ['briefcase', 'trending-up'], votos: 201, fecha: '2024-05-01' },
            { id: 'IMP-005', nombre: 'Ana Lucía Torres', ubicacion: 'San Pedro', historia: 'Los útiles escolares donados permitieron que mis 3 hijos continuaran sus estudios sin interrupciones.', videoUrl: 'https://www.youtube.com/embed/kJQP7kiw5Fk', thumb: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800', categoriaIcons: ['book', 'users'], votos: 178, fecha: '2024-05-15' },
            { id: 'IMP-006', nombre: 'Roberto Féliz', ubicacion: 'Monte Plata', historia: 'Después del huracán perdimos todo. La comunidad nos ayudó a reconstruir nuestra casa en 2 meses.', videoUrl: 'https://www.youtube.com/embed/RgKAFK5djSk', thumb: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800', categoriaIcons: ['home', 'heart'], votos: 245, fecha: '2024-06-01' },
            { id: 'IMP-007', nombre: 'Francisca Reyes', ubicacion: 'Higüey', historia: 'La beca universitaria que recibí me permitió terminar mi carrera de enfermería. Ahora trabajo en el hospital local.', videoUrl: 'https://www.youtube.com/embed/fJ9rUzIMcZQ', thumb: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800', categoriaIcons: ['award', 'book'], votos: 312, fecha: '2024-06-20' },
            { id: 'IMP-008', nombre: 'Miguel Ángel Sosa', ubicacion: 'Baní', historia: 'Gracias al apoyo recibido, mi cooperativa agrícola ahora produce alimentos para toda la comunidad.', videoUrl: 'https://www.youtube.com/embed/JGwWNGJdvx8', thumb: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800', categoriaIcons: ['sun', 'users'], votos: 187, fecha: '2024-07-10' }
        ]);
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
    logout: function() { localStorage.removeItem('db_current_user'); },
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
    getCart: function() { return this._getArr('db_cart'); },
    addToCart: function(productId) {
        var cart = this.getCart();
        var existing = cart.find(function(c) { return c.productId === productId; });
        if (existing) { existing.qty++; } else { cart.push({ productId: productId, qty: 1 }); }
        this._set('db_cart', cart); return cart;
    },
    removeFromCart: function(productId) {
        this._set('db_cart', this.getCart().filter(function(c) { return c.productId !== productId; }));
    },
    updateCartQty: function(productId, qty) {
        var cart = this.getCart();
        var item = cart.find(function(c) { return c.productId === productId; });
        if (item) { if (qty <= 0) { this.removeFromCart(productId); return; } item.qty = qty; this._set('db_cart', cart); }
    },
    clearCart: function() { this._set('db_cart', []); },
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
    savePrestamo: function(p) { var l = this.getPrestamos(); p.id = 'CR-' + Math.floor(Math.random() * 9000 + 1000); p.status = 'Pendiente'; l.push(p); localStorage.setItem('db_prestamos', JSON.stringify(l)); return p; },
    updatePrestamoStatus: function(id, s) { var l = this.getPrestamos(); var i = l.findIndex(function(x) { return x.id === id; }); if (i !== -1) { l[i].status = s; localStorage.setItem('db_prestamos', JSON.stringify(l)); } },
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
