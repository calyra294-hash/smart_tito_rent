const actualizarAlquiler = require('./actualizarAlquiler');

console.log('Prueba 1: El alquiler no se actualiza con campos vacíos');

describe("Validación de actualización de alquiler", () => {

    it("No permite actualizar con campos vacíos", () => {

        const alquiler = {
            id_alquiler: '',
            fecha_inicio: '',
            fecha_fin: ''
        };

        const resultado = actualizarAlquiler(alquiler);

        expect(resultado.valido).toBe(false);
        expect(resultado.mensaje).toContain("campos requeridos");
    });

    console.log('Prueba 2: El ID del alquiler debe ser válido');

    it("Debe rechazar un ID inválido", () => {

        const alquiler = {
            id_alquiler: -1,
            fecha_inicio: '2025-07-12 10:00:00',
            fecha_fin: '2025-07-18 18:00:00'
        };

        const resultado = actualizarAlquiler(alquiler);

        expect(resultado.valido).toBe(false);
        expect(resultado.mensaje).toContain("ID");
    });

    console.log('Prueba 3: La fecha fin debe ser mayor que la fecha inicio');

    it("Debe rechazar fechas inválidas", () => {

        const alquiler = {
            id_alquiler: 1,
            fecha_inicio: '2025-07-18 18:00:00',
            fecha_fin: '2025-07-12 10:00:00'
        };

        const resultado = actualizarAlquiler(alquiler);

        expect(resultado.valido).toBe(false);
        expect(resultado.mensaje).toContain("fecha de fin");
    });

    console.log('Prueba 4: Actualización correcta del alquiler');

    it("Actualizar alquiler correctamente", () => {

        const alquiler = {
            id_alquiler: 1,
            fecha_inicio: '2025-07-12 10:00:00',
            fecha_fin: '2025-07-18 18:00:00'
        };

        const resultado = actualizarAlquiler(alquiler);

        expect(resultado.valido).toBe(true);
    });

});