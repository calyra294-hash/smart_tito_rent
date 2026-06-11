function listarAlquileres(alquileres) {

    // Verificar que existan registros
    if (!alquileres || alquileres.length === 0) {
        return {
            valido: false,
            mensaje: "No existen registros de alquileres."
        };
    }

    return {
        valido: true,
        datos: alquileres
    };
}

module.exports = listarAlquileres;