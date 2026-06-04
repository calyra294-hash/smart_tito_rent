const registroEmpleado = require('./registroEmpleado');

console.log('Prueba 1: El empleado no se registra con campos vacíos');

describe("Validación de empleado", () => {

    it("No permite guardar con campos vacíos", () => {

        const empleado = {
            rol: '',
            cedula: '',
            nombre1: '',
            apellido1: '',
            direccion: '',
            email: '',
            contrasena: ''
        };

        const resultado = registroEmpleado(empleado);

        expect(resultado.valido).toBe(false);
        expect(resultado.mensaje).toContain("campos requeridos");
    });

    console.log('Prueba 2: La cédula debe tener formato válido');

    it("Debe rechazar una cédula inválida", () => {

        const empleado = {
            rol: 'Administrador',
            cedula: '12345',
            nombre1: 'Ana',
            apellido1: 'Lopez',
            direccion: 'Managua',
            email: 'ana@gmail.com',
            contrasena: '12345'
        };

        const resultado = registroEmpleado(empleado);

        expect(resultado.valido).toBe(false);
        expect(resultado.mensaje).toContain("cédula");
    });

    console.log('Prueba 3: El correo debe ser válido');

    it("Debe rechazar correo inválido", () => {

        const empleado = {
            rol: 'Administrador',
            cedula: '002-030303-0000C',
            nombre1: 'Ana',
            apellido1: 'Lopez',
            direccion: 'Managua',
            email: 'ana@gmail',
            contrasena: '12345'
        };

        const resultado = registroEmpleado(empleado);

        expect(resultado.valido).toBe(false);
        expect(resultado.mensaje).toContain("correo");
    });

    console.log('Prueba 4: La contraseña debe tener longitud mínima');

    it("Debe rechazar contraseña muy corta", () => {

        const empleado = {
            rol: 'Administrador',
            cedula: '002-030303-0000C',
            nombre1: 'Ana',
            apellido1: 'Lopez',
            direccion: 'Managua',
            email: 'ana@gmail.com',
            contrasena: '12'
        };

        const resultado = registroEmpleado(empleado);

        expect(resultado.valido).toBe(false);
        expect(resultado.mensaje).toContain("contraseña");
    });

    console.log('Prueba 5: Empleado registrado correctamente');

    it("Registrar empleado correctamente", () => {

        const empleado = {
            rol: 'Administrador',
            cedula: '002-030303-0000C',
            nombre1: 'Ana',
            apellido1: 'Lopez',
            direccion: 'Managua',
            email: 'ana@gmail.com',
            contrasena: '12345'
        };

        const resultado = registroEmpleado(empleado);

        expect(resultado.valido).toBe(true);
    });

});