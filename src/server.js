// src/server.js (actualizado)
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/users.routes.js';
import seedRoles from './utils/seedRoles.js';
import seedUsers from './utils/seedUsers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

// Configuración de EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// ============ RUTAS DEL FRONTEND ============

// Página de login
app.get('/signin', (req, res) => {
    res.render('auth/signin');
});

// Página de registro
app.get('/signup', (req, res) => {
    res.render('auth/signup');
});

// Dashboard de usuario
app.get('/dashboard/user', (req, res) => {
    res.render('dashboard/user');
});

// Dashboard de admin
app.get('/dashboard/admin', (req, res) => {
    res.render('dashboard/admin');
});

// Perfil de usuario
app.get('/profile', (req, res) => {
    res.render('profile');
});

// Página 403
app.get('/403', (req, res) => {
    res.render('403');
});

// Redirección raíz
app.get('/', (req, res) => {
    res.redirect('/signin');
});

// Página 404 (debe ir al final)
app.use((req, res) => {
    res.status(404).render('404');
});

// Manejador global de errores
app.use((err, req, res, next) => {
    console.error(err);
    if (req.path.startsWith('/api')) {
        res.status(err.status || 500).json({ message: err.message || 'Error interno del servidor' });
    } else {
        res.status(err.status || 500).render('404');
    }
});

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI, { autoIndex: true })
    .then(async () => {
        console.log('Mongo connected');
        await seedRoles();
        await seedUsers();
        app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
    })
    .catch(err => {
        console.error('Error al conectar con Mongo:', err);
        process.exit(1);
    });