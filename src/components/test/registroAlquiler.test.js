const registroAlquiler = require('./registroAlquiler');

describe("Validación de alquiler", () => {

    test("No permite registrar alquiler con campos vacíos", () => {
        const alquiler = {
            id_cliente: '',
            id_coche: '',
            fecha_inicio: '',
            fecha_fin: ''
        };

        const resultado = registroAlquiler(alquiler);

        expect(resultado.valido).toBe(false);
        expect(resultado.mensaje).toContain("campos requeridos");
    });

    test("No permite registrar sin cliente", () => {
        const alquiler = {
            id_cliente: '',
            id_coche: 1,
            fecha_inicio: '2025-07-10 12:00:00',
            fecha_fin: '2025-07-15 12:00:00'
        };

        const resultado = registroAlquiler(alquiler);

        expect(resultado.valido).toBe(false);
    });

    test("No permite registrar sin vehículo", () => {
        const alquiler = {
            id_cliente: 1,
            id_coche: '',
            fecha_inicio: '2025-07-10 12:00:00',
            fecha_fin: '2025-07-15 12:00:00'
        };

        const resultado = registroAlquiler(alquiler);

        expect(resultado.valido).toBe(false);
    });

    test("No permite fecha fin menor que fecha inicio", () => {
        const alquiler = {
            id_cliente: 1,
            id_coche: 1,
            fecha_inicio: '2025-07-15 12:00:00',
            fecha_fin: '2025-07-10 12:00:00'
        };

        const resultado = registroAlquiler(alquiler);

        expect(resultado.valido).toBe(false);
        expect(resultado.mensaje).toContain("fecha de fin");
    });

    test("Registrar alquiler correctamente", () => {
        const alquiler = {
            id_cliente: 1,
            id_coche: 1,
            fecha_inicio: '2025-07-10 12:00:00',
            fecha_fin: '2025-07-15 12:00:00'
        };

        const resultado = registroAlquiler(alquiler);

        expect(resultado.valido).toBe(true);
    });

});