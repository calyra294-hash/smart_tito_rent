const listarAlquileres = require('./listarAlquileres');

console.log('Prueba 1: No existen registros de alquileres');

describe("Listado de alquileres", () => {

    it("Debe indicar cuando no existen registros", () => {

        const alquileres = [];

        const resultado = listarAlquileres(alquileres);

        expect(resultado.valido).toBe(false);
        expect(resultado.mensaje).toContain("No existen registros");
    });

    console.log('Prueba 2: Existen registros de alquileres');

    it("Debe listar correctamente los alquileres registrados", () => {

        const alquileres = [
            {
                ID_Alquiler: 1,
                Fecha_Inicio: "2025-07-12 10:00:00",
                Fecha_Fin: "2025-07-18 10:00:00"
            }
        ];

        const resultado = listarAlquileres(alquileres);

        expect(resultado.valido).toBe(true);
        expect(resultado.datos.length).toBe(1);
    });

    console.log('Prueba 3: Verificar ID del alquiler');

    it("Debe mostrar el alquiler con ID 1", () => {

        const alquileres = [
            {
                ID_Alquiler: 1,
                Fecha_Inicio: "2025-07-12 10:00:00",
                Fecha_Fin: "2025-07-18 10:00:00"
            }
        ];

        const resultado = listarAlquileres(alquileres);

        expect(resultado.datos[0].ID_Alquiler).toBe(1);
    });

    console.log('Prueba 4: Verificar fecha de inicio');

    it("Debe mostrar correctamente la fecha de inicio", () => {

        const alquileres = [
            {
                ID_Alquiler: 1,
                Fecha_Inicio: "2025-07-12 10:00:00",
                Fecha_Fin: "2025-07-18 10:00:00"
            }
        ];

        const resultado = listarAlquileres(alquileres);

        expect(resultado.datos[0].Fecha_Inicio)
            .toBe("2025-07-12 10:00:00");
    });

    console.log('Prueba 5: Verificar fecha de fin');

    it("Debe mostrar correctamente la fecha de fin", () => {

        const alquileres = [
            {
                ID_Alquiler: 1,
                Fecha_Inicio: "2025-07-12 10:00:00",
                Fecha_Fin: "2025-07-18 10:00:00"
            }
        ];

        const resultado = listarAlquileres(alquileres);

        expect(resultado.datos[0].Fecha_Fin)
            .toBe("2025-07-18 10:00:00");
    });

});