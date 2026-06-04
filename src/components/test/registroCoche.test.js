const registroCoche = require('./registroCoche');

console.log('Prueba 1: El coche no se registra con campos vacíos');

describe("Validación de coche", () => {

    it("No permite guardar con campos vacíos", () => {

        const coche = {
            marca: '',
            modelo: '',
            anio: '',
            placa: '',
            color: '',
            valor_dia: ''
        };

        const resultado = registroCoche(coche);

        expect(resultado.valido).toBe(false);
        expect(resultado.mensaje).toContain("campos requeridos");
    });

    console.log('Prueba 2: El año del coche debe ser válido');

    it("Debe rechazar un año inválido", () => {

        const coche = {
            marca: 'Toyota',
            modelo: 'Corolla',
            anio: 1800,
            placa: 'AAA111',
            color: 'Rojo',
            valor_dia: 30
        };

        const resultado = registroCoche(coche);

        expect(resultado.valido).toBe(false);
        expect(resultado.mensaje).toContain("año");
    });

    console.log('Prueba 3: El valor por día debe ser mayor que cero');

    it("No permite valor diario negativo", () => {

        const coche = {
            marca: 'Toyota',
            modelo: 'Corolla',
            anio: 2023,
            placa: 'AAA111',
            color: 'Rojo',
            valor_dia: -30
        };

        const resultado = registroCoche(coche);

        expect(resultado.valido).toBe(false);
        expect(resultado.mensaje).toContain("valor");
    });

    console.log('Prueba 4: No debe permitir placas con formato incorrecto');

    it("Debe rechazar placas inválidas", () => {

        const coche = {
            marca: 'Toyota',
            modelo: 'Corolla',
            anio: 2023,
            placa: 'AA11',
            color: 'Rojo',
            valor_dia: 30
        };

        const resultado = registroCoche(coche);

        expect(resultado.valido).toBe(false);
        expect(resultado.mensaje).toContain("placa");
    });

    console.log('Prueba 5: Coche registrado correctamente');

    it("Registrar coche correctamente", () => {

        const coche = {
            marca: 'Toyota',
            modelo: 'Corolla',
            anio: 2023,
            placa: 'AAA111',
            color: 'Rojo',
            valor_dia: 30
        };

        const resultado = registroCoche(coche);

        expect(resultado.valido).toBe(true);
    });

});