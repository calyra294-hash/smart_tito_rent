const listarClientes = require('./listarClientes');

console.log('Prueba 1: No existen clientes registrados');

describe("Listado de clientes", () => {

    it("Debe indicar cuando no existen clientes", () => {

        const clientes = [];

        const resultado = listarClientes(clientes);

        expect(resultado.valido).toBe(false);
        expect(resultado.mensaje).toContain("No existen clientes");
    });

    console.log('Prueba 2: Existen clientes registrados');

    it("Debe listar correctamente los clientes registrados", () => {

        const clientes = [
            {
                nombre: 'Juan Pérez',
                cedula: '001-123456-0001A',
                email: 'juan@email.com'
            },
            {
                nombre: 'Yaleska Sevilla',
                cedula: '001-654321-0002B',
                email: 'hanamontana@email.com'
            }
        ];

        const resultado = listarClientes(clientes);

        expect(resultado.valido).toBe(true);
        expect(resultado.datos.length).toBe(2);
    });

    console.log('Prueba 3: Verificar datos de Juan Pérez');

    it("Debe mostrar correctamente los datos de Juan Pérez", () => {

        const clientes = [
            {
                nombre: 'Juan Pérez',
                cedula: '001-123456-0001A',
                email: 'juan@email.com'
            }
        ];

        const resultado = listarClientes(clientes);

        expect(resultado.datos[0].nombre).toBe('Juan Pérez');
        expect(resultado.datos[0].cedula).toBe('001-123456-0001A');
    });

    console.log('Prueba 4: Verificar datos de Yaleska Sevilla');

    it("Debe mostrar correctamente los datos de Yaleska Sevilla", () => {

        const clientes = [
            {
                nombre: 'Yaleska Sevilla',
                cedula: '001-654321-0002B',
                email: 'hanamontana@email.com'
            }
        ];

        const resultado = listarClientes(clientes);

        expect(resultado.datos[0].nombre).toBe('Yaleska Sevilla');
        expect(resultado.datos[0].cedula).toBe('001-654321-0002B');
    });

    console.log('Prueba 5: Verificar correo electrónico');

    it("Debe mostrar correctamente el correo electrónico del cliente", () => {

        const clientes = [
            {
                nombre: 'Juan Pérez',
                cedula: '001-123456-0001A',
                email: 'juan@email.com'
            }
        ];

        const resultado = listarClientes(clientes);

        expect(resultado.datos[0].email).toBe('juan@email.com');
    });

});