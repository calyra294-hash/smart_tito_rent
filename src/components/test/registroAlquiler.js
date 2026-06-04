function registroAlquiler(alquiler) {
    const {
        id_cliente,
        id_coche,
        fecha_inicio,
        fecha_fin
    } = alquiler;

    // Campos obligatorios
    if (!id_cliente || !id_coche || !fecha_inicio || !fecha_fin) {
        return {
            valido: false,
            mensaje: "Completa todos los campos requeridos."
        };
    }

    // Validar fechas
    const inicio = new Date(fecha_inicio);
    const fin = new Date(fecha_fin);

    if (inicio >= fin) {
        return {
            valido: false,
            mensaje: "La fecha de fin debe ser mayor que la fecha de inicio."
        };
    }

    return {
        valido: true,
        mensaje: "Alquiler registrado correctamente."
    };
}

module.exports = registroAlquiler;