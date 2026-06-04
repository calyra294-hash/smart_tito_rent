function registroEmpleado(empleado) {

    const {
        rol,
        cedula,
        nombre1,
        apellido1,
        direccion,
        email,
        contrasena
    } = empleado;

    // Campos obligatorios
    if (!rol || !cedula || !nombre1 || !apellido1 || !direccion || !email || !contrasena) {
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

    // Validar contraseña
    if (contrasena.length < 4) {
        return {
            valido: false,
            mensaje: "La contraseña debe tener al menos 4 caracteres."
        };
    }

    return { valido: true };
}

module.exports = registroEmpleado;