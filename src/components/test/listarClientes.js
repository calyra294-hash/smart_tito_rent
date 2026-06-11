function listarClientes(clientes) {

    // Verificar que existan clientes registrados
    if (!clientes || clientes.length === 0) {
        return {
            valido: false,
            mensaje: "No existen clientes registrados."
        };
    }

    return {
        valido: true,
        datos: clientes
    };
}

module.exports = listarClientes;