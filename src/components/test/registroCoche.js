function registroCoche(coche) {

    const {
        marca,
        modelo,
        anio,
        placa,
        color,
        valor_dia
    } = coche;

    // Campos obligatorios
    if (!marca || !modelo || !anio || !placa || !color || valor_dia === '') {
        return {
            valido: false,
            mensaje: "Completa todos los campos requeridos."
        };
    }

    // Año válido
    if (isNaN(anio) || Number(anio) < 1900) {
        return {
            valido: false,
            mensaje: "El año ingresado no es válido."
        };
    }

    // Valor por día positivo
    if (isNaN(valor_dia) || Number(valor_dia) <= 0) {
        return {
            valido: false,
            mensaje: "El valor por día debe ser mayor que cero."
        };
    }

    // Validar formato de placa
    const regexPlaca = /^[A-Z]{3}[0-9]{3}$/;

    if (!regexPlaca.test(placa)) {
        return {
            valido: false,
            mensaje: "La placa no tiene un formato válido."
        };
    }

    return { valido: true };
}

module.exports = registroCoche;