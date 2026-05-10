import express from 'express';

const router = express.Router();

router.get('/', (req, res) => res.redirect('/signIn'));
router.get('/signIn', (req, res) => res.render('auth/signin'));
router.get('/signUp', (req, res) => res.render('auth/signup'));

router.get('/dashboard/user', (req, res) => {
    res.render('dashboard/user');
});

router.get('/dashboard/admin', (req, res) => {
    res.render('dashboard/admin');
});

router.get('/profile', (req, res) => {
    res.render('profile');
});

router.get('/403', (req, res) => res.render('403'));

export default router;