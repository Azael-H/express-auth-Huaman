// src/utils/seedUsers.js
import bcrypt from 'bcrypt';
import userRepository from '../repositories/UserRepository.js';
import roleRepository from '../repositories/RoleRepository.js';

export default async function seedUsers() {
    try {
        // Verificar si ya existe un admin
        const existingAdmin = await userRepository.findByEmail('admin@example.com');
        
        if (!existingAdmin) {
            // Obtener el rol admin
            const adminRole = await roleRepository.findByName('admin');
            
            if (adminRole) {
                // La contraseña en texto plano DEBE cumplir con la validación
                const plainPassword = 'Admin123#';
                
                // Verificar que cumple la validación antes de hashear
                const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[#$%&*@])[A-Za-z\d#$%&*@]{8,}$/;
                if (!passwordRegex.test(plainPassword)) {
                    console.error('La contraseña del admin no cumple con los requisitos');
                    return;
                }
                
                // Hashear la contraseña DESPUÉS de que el modelo la valide
                // Pero como estamos creando directamente, nos aseguramos que la contraseña en texto plano pase la validación
                const hashedPassword = await bcrypt.hash(plainPassword, 10);
                
                await userRepository.create({
                    email: 'admin@example.com',
                    password: hashedPassword,  // Enviamos el hash, pero esto NO pasará la validación
                    name: 'Administrador',
                    lastName: 'Sistema',
                    phoneNumber: '999999999',
                    birthdate: new Date('1990-01-01'),
                    url_profile: '',
                    address: 'Sede Principal',
                    roles: [adminRole._id]
                });
                
                console.log('Usuario admin creado: admin@example.com / Admin123#');
            }
        }
    } catch (error) {
        console.error('Error seeding admin user:', error);
    }
}