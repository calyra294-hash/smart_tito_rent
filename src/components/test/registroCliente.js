function registroCliente(cliente) {

    const {
        cedula,
        nombre,
        apellido,
        telefono,
        direccion,
        email,
        licencia
    } = cliente;

    // Campos obligatorios
    if (!cedula || !nombre || !apellido || !telefono || !direccion || !email || !licencia) {
        return {
            valido: false,
            mensaje: "Completa todos los campos requeridos."
        };
    }

    // Validar cédula
    const regexCedula = /^\d{3}-\d{6}-\d{4}[A-Za-z]$/;

    if (!regexCedula.test(cedula)) {
        return {
            valido: false,
            mensaje: "La cédula no tiene un formato válido."
        };
    }

    // Validar correo
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regexCorreo.test(email)) {
        return {
            valido: false,
            mensaje: "El correo electrónico no es válido."
        };
    }

    // Validar licencia
    if (licencia.length < 5) {
        return {
            valido: false,
            mensaje: "La licencia no es válida."
        };
    }

    return { valido: true };
}

module.exports = registroCliente;