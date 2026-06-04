function actualizarAlquiler(alquiler) {

    const {
        id_alquiler,
        fecha_inicio,
        fecha_fin
    } = alquiler;

    // Campos obligatorios
    if (!id_alquiler || !fecha_inicio || !fecha_fin) {
        return {
            valido: false,
            mensaje: "Completa todos los campos requeridos."
        };
    }

    // Validar ID
    if (isNaN(id_alquiler) || Number(id_alquiler) <= 0) {
        return {
            valido: false,
            mensaje: "El ID del alquiler no es válido."
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

    return { valido: true };
}

module.exports = actualizarAlquiler;