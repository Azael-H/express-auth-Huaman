// src/public/js/main.js
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar componentes de Materialize
    M.AutoInit();
    
    // Configurar el logo según autenticación
    setupLogo();
    
    // Actualizar menú según autenticación
    updateNavMenu();
});

function setupLogo() {
    const logoLink = document.getElementById('logo-link');
    const token = sessionStorage.getItem('token');
    
    if (logoLink) {
        if (token) {
            // Si está autenticado, redirigir al dashboard según rol
            fetch('/api/users/me', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            .then(res => res.json())
            .then(user => {
                if (user.roles && user.roles.includes('admin')) {
                    logoLink.href = '/dashboard/admin';
                } else {
                    logoLink.href = '/dashboard/user';
                }
            })
            .catch(() => {
                logoLink.href = '/signin';
            });
        } else {
            logoLink.href = '/signin';
        }
    }
}

function updateNavMenu() {
    const token = sessionStorage.getItem('token');
    const navMenu = document.getElementById('nav-mobile');
    
    if (navMenu) {
        if (token) {
            // Usuario logueado - obtener rol para mostrar menú correcto
            fetch('/api/users/me', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            .then(res => res.json())
            .then(user => {
                const isAdmin = user.roles && user.roles.includes('admin');
                
                let menuHtml = '';
                if (isAdmin) {
                    menuHtml = `
                        <li><a href="/dashboard/admin"><i class="material-icons left">dashboard</i>Admin</a></li>
                    `;
                } else {
                    menuHtml = `
                        <li><a href="/dashboard/user"><i class="material-icons left">dashboard</i>Dashboard</a></li>
                    `;
                }
                
                menuHtml += `
                    <li><a href="/profile"><i class="material-icons left">person</i>Perfil</a></li>
                    <li><a href="#" onclick="logout()" class="red-text"><i class="material-icons left">exit_to_app</i>Cerrar Sesión</a></li>
                `;
                
                navMenu.innerHTML = menuHtml;
            })
            .catch(() => {
                // Si hay error, mostrar solo cerrar sesión
                navMenu.innerHTML = `
                    <li><a href="#" onclick="logout()" class="red-text"><i class="material-icons left">exit_to_app</i>Cerrar Sesión</a></li>
                `;
            });
        } else {
            // Usuario no logueado
            navMenu.innerHTML = `
                <li><a href="/signin"><i class="material-icons left">login</i>Iniciar Sesión</a></li>
                <li><a href="/signup"><i class="material-icons left">person_add</i>Registrarse</a></li>
            `;
        }
    }
}

// Función global para cerrar sesión
window.logout = function() {
    // Eliminar token
    sessionStorage.removeItem('token');
    // Mostrar mensaje de éxito (opcional)
    M.toast({ html: 'Sesión cerrada correctamente', classes: 'green' });
    // Redirigir al login
    setTimeout(() => {
        window.location.href = '/signin';
    }, 500);
};

function getToken() {
    return sessionStorage.getItem('token');
}

function isAuthenticated() {
    return !!getToken();
}

// Verificar autenticación en páginas protegidas
function checkAuth() {
    const protectedPages = ['/dashboard/user', '/dashboard/admin', '/profile'];
    const currentPath = window.location.pathname;
    
    if (protectedPages.includes(currentPath) && !isAuthenticated()) {
        window.location.href = '/signin';
        return false;
    }
    return true;
}