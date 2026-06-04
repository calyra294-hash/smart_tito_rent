const registroCliente = require('./registroCliente');

console.log('Prueba 1: El cliente no se registra con campos vacíos');

describe("Validación de cliente", () => {

    it("No permite guardar con campos vacíos", () => {

        const cliente = {
            cedula: '',
            nombre: '',
            apellido: '',
            telefono: '',
            direccion: '',
            email: '',
            licencia: ''
        };

        const resultado = registroCliente(cliente);

        expect(resultado.valido).toBe(false);
        expect(resultado.mensaje).toContain("campos requeridos");
    });

    console.log('Prueba 2: La cédula debe tener formato válido');

    it("Debe rechazar una cédula inválida", () => {

        const cliente = {
            cedula: '12345',
            nombre: 'Juan',
            apellido: 'Perez',
            telefono: '88888888',
            direccion: 'Managua',
            email: 'juan@gmail.com',
            licencia: 'LIC-002'
        };

        const resultado = registroCliente(cliente);

        expect(resultado.valido).toBe(false);
        expect(resultado.mensaje).toContain("cédula");
    });

    console.log('Prueba 3: El correo debe ser válido');

    it("Debe rechazar correo inválido", () => {

        const cliente = {
            cedula: '001-020202-0000B',
            nombre: 'Juan',
            apellido: 'Perez',
            telefono: '88888888',
            direccion: 'Managua',
            email: 'juan@gmail',
            licencia: 'LIC-002'
        };

        const resultado = registroCliente(cliente);

        expect(resultado.valido).toBe(false);
        expect(resultado.mensaje).toContain("correo");
    });

    console.log('Prueba 4: La licencia debe ser válida');

    it("Debe rechazar licencia inválida", () => {

        const cliente = {
            cedula: '001-020202-0000B',
            nombre: 'Juan',
            apellido: 'Perez',
            telefono: '88888888',
            direccion: 'Managua',
            email: 'juan@gmail.com',
            licencia: '1'
        };

        const resultado = registroCliente(cliente);

        expect(resultado.valido).toBe(false);
        expect(resultado.mensaje).toContain("licencia");
    });

    console.log('Prueba 5: Cliente registrado correctamente');

    it("Registrar cliente correctamente", () => {

        const cliente = {
            cedula: '001-020202-0000B',
            nombre: 'Juan',
            apellido: 'Perez',
            telefono: '88888888',
            direccion: 'Managua',
            email: 'juan@gmail.com',
            licencia: 'LIC-002'
        };

        const resultado = registroCliente(cliente);

        expect(resultado.valido).toBe(true);
    });

});