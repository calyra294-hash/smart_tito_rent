import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";

// Custom Hook de Categorías
import { useCategorias } from "../hooks";

// Componentes Reutilizables de la Capa de Ventanas Modales
import ModalRegistroCoche from "../components/coches/ModalRegistroCoche";
import ModalEdicionCoche from "../components/coches/ModalEdicionCoche";
import ModalEliminacionCoche from "../components/coches/ModalEliminacionCoche";
import ModalRegistroCategoria from "../components/categorias/ModalRegistroCategoria";
import TablaCoche from "../components/coches/TablaCoche";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import NotificacionOperacion from "../components/NotificacionOperacion";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Estructura o plantilla base por defecto para detalles técnicos
const DETALLES_TECNICOS_DEFAULT = {
    pasajeros: 4,
    combustible: "Gasolina",
    transmision: "Manual",
    equipamiento: [],
};

// Helper seguro para parsear detalles_tecnicos (por si Supabase retorna string o jsonb)
const parsearDetallesTecnicos = (detalles) => {
    if (!detalles) return DETALLES_TECNICOS_DEFAULT;
    if (typeof detalles === "object") return detalles;
    try {
        return JSON.parse(detalles);
    } catch (e) {
        console.error("Error al parsear detalles_tecnicos:", e);
        return DETALLES_TECNICOS_DEFAULT;
    }
};

const Coches = () => {
    const manejoCambioArchivoActualizar = ( e ) => {
        const file = e.target.files[ 0 ] || null;
        setCocheEditar( ( prev ) => ( {
            ...prev,
            archivo: file,
        } ) );
    };

    const [ toast, setToast ] = useState( {
        mostrar: false,
        mensaje: "",
        tipo: "",
    } );

    const notificarAlUsuario = ( mensaje, tipo = "exito" ) => {
        if ( typeof mensaje === "object" && mensaje !== null )
        {
            const msgTexto = mensaje.mensaje || mensaje.message || JSON.stringify( mensaje );
            const msgTipo = mensaje.tipo || tipo;
            setToast( { mostrar: true, mensaje: msgTexto, tipo: msgTipo } );
            return;
        }

        setToast( { mostrar: true, mensaje, tipo } );
    };

    // Integration Hook Categorías
    const {
        categorias,
        mostrarModal: mostrarModalCategoria,
        setMostrarModal: setMostrarModalCategoria,
        nuevaCategoria,
        manejoCambioInput: manejoCambioInputCategoria,
        agregarCategoria,
    } = useCategorias( notificarAlUsuario );

    const [ mostrarModal, setMostrarModal ] = useState( false );

    // Estado inicial de nuevo coche con detalles_tecnicos
    const [ nuevoCoche, setNuevoCoche ] = useState( {
        marca: "",
        modelo: "",
        anio: "",
        placa: "",
        color: "",
        valor_dia: "",
        estado: "Disponible",
        id_categoria: "",
        archivo: null,
        detalles_tecnicos: DETALLES_TECNICOS_DEFAULT,
    } );

    const [ coches, setCoches ] = useState( [] );
    const [ cochesFiltrados, setCochesFiltrados ] = useState( [] );
    const [ textoBusqueda, setTextoBusqueda ] = useState( "" );
    const [ cargando, setCargando ] = useState( true );

    const [ mostrarModalEliminacion, setMostrarModalEliminacion ] = useState( false );
    const [ cocheAEliminar, setCocheAEliminar ] = useState( null );

    const [ mostrarModalEdicion, setMostrarModalEdicion ] = useState( false );
    const [ cocheEditar, setCocheEditar ] = useState( null );

    // =========================
    // PDF COCHES
    // =========================
    const generarPDF = () => {
        const doc = new jsPDF();

        doc.setFontSize( 18 );
        doc.text( "Reporte de Vehículos", 14, 15 );

        doc.setFontSize( 10 );
        doc.text(
            `Fecha: ${ new Date().toLocaleDateString() }`,
            14,
            22
        );

        doc.text(
            `Total de vehículos: ${ cochesFiltrados.length }`,
            14,
            28
        );

        autoTable( doc, {
            startY: 35,
            head: [ [
                "ID",
                "Marca",
                "Modelo",
                "Categoría",
                "Placa",
                "Estado",
                "Valor Día"
            ] ],

            body: cochesFiltrados.map( c => [
                c.id_coche,
                c.marca,
                c.modelo,
                c.categorias?.nombre_categoria || "Sin categoría",
                c.placa,
                c.estado,
                c.valor_dia
            ] ),

            headStyles: {
                fillColor: [ 185, 28, 28 ], // rojo Tito's Rent
                textColor: [ 255, 255, 255 ]
            }
        } );

        doc.save( "reporte_coches.pdf" );
    };

    // =========================
    // CARGAR
    // =========================
    const cargarCoches = async () => {
        setCargando( true );

        const { data, error } = await supabase
            .from( "coche" )
            .select( "*, categorias(id_categoria, nombre_categoria)" )
            .order( "id_coche", { ascending: true } );

        if ( error )
        {
            console.log( error );

            setToast( {
                mostrar: true,
                mensaje: "Error al cargar vehículos",
                tipo: "error",
            } );

            setCargando( false );
            return;
        }

        setCoches( data || [] );
        setCochesFiltrados( data || [] );
        setCargando( false );
    };

    useEffect( () => {
        cargarCoches();
    }, [] );

    // =========================
    // FILTRO (Incapaz de romper si el campo técnico o equipamiento viene variado)
    // =========================
    useEffect( () => {
        const texto = textoBusqueda.toLowerCase();

        setCochesFiltrados(
            coches.filter( ( c ) => {
                const detalles = parsearDetallesTecnicos( c.detalles_tecnicos );
                const equipamientoTexto = Array.isArray( detalles.equipamiento )
                    ? detalles.equipamiento.join( " " )
                    : "";

                return [
                    c.marca,
                    c.modelo,
                    c.placa,
                    c.estado,
                    c.categorias?.nombre_categoria,
                    detalles.combustible,
                    detalles.transmision,
                    equipamientoTexto,
                ].some( ( campo ) => campo?.toLowerCase().includes( texto ) );
            } )
        );

    }, [ textoBusqueda, coches ] );

    // =========================
    // INPUT REGISTRO
    // =========================
    const manejoCambioInput = ( e ) => {
        const { name, value } = e.target;

        setNuevoCoche( ( prev ) => ( {
            ...prev,
            [ name ]: value,
        } ) );
    };

    // Manejador específico para el objeto anidado detalles_tecnicos
    const manejoCambioDetallesTecnicos = ( campoTecnico, valor ) => {
        setNuevoCoche( ( prev ) => ( {
            ...prev,
            detalles_tecnicos: {
                ...prev.detalles_tecnicos,
                [ campoTecnico ]: valor,
            },
        } ) );
    };

    const manejoCambioArchivo = ( e ) => {
        setNuevoCoche( ( prev ) => ( {
            ...prev,
            archivo: e.target.files[ 0 ] || null,
        } ) );
    };

    // =========================
    // INPUT EDICION
    // =========================
    const manejoCambioInputEdicion = ( e ) => {
        const { name, value } = e.target;

        setCocheEditar( ( prev ) => ( {
            ...prev,
            [ name ]: value,
        } ) );
    };

    // Manejador de detalles técnicos para edición
    const manejoCambioDetallesTecnicosEdicion = ( campoTecnico, valor ) => {
        setCocheEditar( ( prev ) => {
            const detallesActuales = parsearDetallesTecnicos( prev.detalles_tecnicos );
            return {
                ...prev,
                detalles_tecnicos: {
                    ...detallesActuales,
                    [ campoTecnico ]: valor,
                },
            };
        } );
    };

    // Ejecución para registro de categoría express
    const ejecutarCreacionCategoriaExpress = async () => {
        await agregarCategoria();
        if ( categorias.length > 0 )
        {
            const ultimaCategoria = categorias[ categorias.length - 1 ];
            setNuevoCoche( prev => ( {
                ...prev,
                id_categoria: ultimaCategoria.id_categoria
            } ) );
        }
    };

    // =========================
    // REGISTRAR
    // =========================
    const agregarCoche = async () => {
        try
        {
            let urlImagen = "";

            if ( nuevoCoche.archivo )
            {
                const nombreArchivo = `${ Date.now() }_${ nuevoCoche.archivo.name }`;

                const { error: uploadError } = await supabase.storage
                    .from( "imagenes_coche" )
                    .upload( nombreArchivo, nuevoCoche.archivo );

                if ( uploadError ) throw uploadError;

                const { data } = supabase.storage
                    .from( "imagenes_coche" )
                    .getPublicUrl( nombreArchivo );

                urlImagen = data.publicUrl;
            }

            // Normalizamos/Serializamos detalles_tecnicos
            const detallesAInsertar = typeof nuevoCoche.detalles_tecnicos === "object"
                ? JSON.stringify( nuevoCoche.detalles_tecnicos )
                : nuevoCoche.detalles_tecnicos;

            const { error } = await supabase
                .from( "coche" )
                .insert( [
                    {
                        marca: nuevoCoche.marca,
                        modelo: nuevoCoche.modelo,
                        anio: Number( nuevoCoche.anio ),
                        placa: nuevoCoche.placa,
                        color: nuevoCoche.color,
                        valor_dia: Number( nuevoCoche.valor_dia ),
                        estado: nuevoCoche.estado,
                        id_categoria: nuevoCoche.id_categoria ? Number( nuevoCoche.id_categoria ) : null,
                        detalles_tecnicos: detallesAInsertar,
                        fecha_registro: new Date()
                            .toISOString()
                            .split( "T" )[ 0 ],
                        url_imagen: urlImagen,
                    },
                ] );

            if ( error ) throw error;

            setMostrarModal( false );

            setNuevoCoche( {
                marca: "",
                modelo: "",
                anio: "",
                placa: "",
                color: "",
                valor_dia: "",
                estado: "Disponible",
                id_categoria: "",
                archivo: null,
                detalles_tecnicos: DETALLES_TECNICOS_DEFAULT,
            } );

            cargarCoches();

            setToast( {
                mostrar: true,
                mensaje: "Vehículo registrado",
                tipo: "exito",
            } );

        } catch ( err )
        {
            console.log( err );

            setToast( {
                mostrar: true,
                mensaje: "Error al registrar vehículo",
                tipo: "error",
            } );
        }
    };

    // =========================
    // ACTUALIZAR
    // =========================
    const actualizarCoche = async () => {
        try
        {
            let urlImagen = cocheEditar.url_imagen;

            if ( cocheEditar.archivo )
            {
                const nombreArchivo = `${ Date.now() }_${ cocheEditar.archivo.name }`;

                const { error: uploadError } = await supabase.storage
                    .from( "imagenes_coche" )
                    .upload( nombreArchivo, cocheEditar.archivo );

                if ( uploadError ) throw uploadError;

                const { data } = supabase.storage
                    .from( "imagenes_coche" )
                    .getPublicUrl( nombreArchivo );

                urlImagen = data.publicUrl;
            }

            const detallesAActualizar = typeof cocheEditar.detalles_tecnicos === "object"
                ? JSON.stringify( cocheEditar.detalles_tecnicos )
                : cocheEditar.detalles_tecnicos;

            const { error } = await supabase
                .from( "coche" )
                .update( {
                    marca: cocheEditar.marca,
                    modelo: cocheEditar.modelo,
                    anio: Number( cocheEditar.anio ),
                    placa: cocheEditar.placa,
                    color: cocheEditar.color,
                    valor_dia: Number( cocheEditar.valor_dia ),
                    estado: cocheEditar.estado,
                    id_categoria: cocheEditar.id_categoria ? Number( cocheEditar.id_categoria ) : null,
                    detalles_tecnicos: detallesAActualizar,
                    url_imagen: urlImagen,
                } )
                .eq( "id_coche", cocheEditar.id_coche );

            if ( error ) throw error;

            setMostrarModalEdicion( false );
            cargarCoches();

            setToast( {
                mostrar: true,
                mensaje: "Vehículo actualizado correctamente",
                tipo: "exito",
            } );

        } catch ( err )
        {
            console.error( "Error al actualizar coche:", err );
            setToast( {
                mostrar: true,
                mensaje: "Error al actualizar el vehículo",
                tipo: "error",
            } );
        }
    };

    // =========================
    // ELIMINAR
    // =========================
    const eliminarCoche = async () => {
        const { data: alquiler } = await supabase
            .from( "alquiler" )
            .select( "*" )
            .eq( "id_coche", cocheAEliminar.id_coche )
            .maybeSingle();

        if ( alquiler )
        {
            setToast( {
                mostrar: true,
                mensaje: "No se puede eliminar, el vehículo está en alquiler.",
                tipo: "error",
            } );
            return;
        }

        const { error } = await supabase
            .from( "coche" )
            .delete()
            .eq( "id_coche", cocheAEliminar.id_coche );

        if ( error )
        {
            setToast( {
                mostrar: true,
                mensaje: "Error al eliminar",
                tipo: "error",
            } );
            return;
        }

        setMostrarModalEliminacion( false );
        cargarCoches();

        setToast( {
            mostrar: true,
            mensaje: "Eliminado correctamente",
            tipo: "exito",
        } );
    };

    // =========================
    // UI
    // =========================
    return (
        <div className="inicio-contenedor">
            <div className="contenedor-dashboard">
                <Container fluid>
                    <Row className="align-items-center mb-3">
                        <Col>
                            <h3>
                                <i className="bi bi-car-front-fill me-2 text-danger"></i>
                                Vehículos
                            </h3>
                        </Col>

                        <Col className="text-end">
                            <Button
                                variant="danger"
                                className="rounded-pill px-4 shadow-sm me-2"
                                onClick={ generarPDF }
                            >
                                <i className="bi bi-file-earmark-pdf-fill me-2"></i>
                                PDF
                            </Button>

                            <Button
                                variant="danger"
                                className="rounded-pill px-4 shadow-sm"
                                onClick={ () => setMostrarModal( true ) }
                            >
                                <i className="bi bi-plus-circle me-2"></i>
                                Nuevo Vehículo
                            </Button>
                        </Col>
                    </Row>

                    <hr />

                    <Row className="mb-4">
                        <Col md={ 5 }>
                            <CuadroBusquedas
                                textoBusqueda={ textoBusqueda }
                                manejarCambioBusqueda={ ( e ) =>
                                    setTextoBusqueda( e.target.value )
                                }
                                placeholder="Buscar Vehículo por marca, modelo, combustible, equipamiento..."
                            />
                        </Col>
                    </Row>

                    { cargando ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" />
                        </div>
                    ) : (
                        <TablaCoche
                            coches={ cochesFiltrados }
                            abrirModalEdicion={ ( c ) => {
                                setCocheEditar( {
                                    ...c,
                                    detalles_tecnicos: parsearDetallesTecnicos( c.detalles_tecnicos )
                                } );
                                setMostrarModalEdicion( true );
                            } }
                            abrirModalEliminacion={ ( c ) => {
                                setCocheAEliminar( c );
                                setMostrarModalEliminacion( true );
                            } }
                        />
                    ) }

                    <ModalRegistroCoche
                        mostrarModal={ mostrarModal }
                        setMostrarModal={ setMostrarModal }
                        nuevoCoche={ nuevoCoche }
                        manejoCambioInput={ manejoCambioInput }
                        manejoCambioDetallesTecnicos={ manejoCambioDetallesTecnicos }
                        manejoCambioArchivo={ manejoCambioArchivo }
                        agregarCoche={ agregarCoche }
                        categorias={ categorias }
                        setMostrarModalCategoria={ setMostrarModalCategoria }
                    />

                    <ModalRegistroCategoria
                        mostrarModal={ mostrarModalCategoria }
                        setMostrarModal={ setMostrarModalCategoria }
                        nuevaCategoria={ nuevaCategoria }
                        manejoCambioInput={ manejoCambioInputCategoria }
                        manejoCambioArchivoActualizar={ manejoCambioArchivoActualizar }
                        agregarCategoria={ ejecutarCreacionCategoriaExpress }
                    />

                    <ModalEdicionCoche
                        mostrarModalEdicion={ mostrarModalEdicion }
                        setMostrarModalEdicion={ setMostrarModalEdicion }
                        cocheEditar={ cocheEditar }
                        manejoCambioInputEdicion={ manejoCambioInputEdicion }
                        manejoCambioDetallesTecnicosEdicion={ manejoCambioDetallesTecnicosEdicion }
                        actualizarCoche={ actualizarCoche }
                        categorias={ categorias }
                    />

                    <ModalEliminacionCoche
                        mostrarModalEliminacion={ mostrarModalEliminacion }
                        setMostrarModalEliminacion={ setMostrarModalEliminacion }
                        eliminarCoche={ eliminarCoche }
                        cocheAEliminar={ cocheAEliminar }
                    />

                    <NotificacionOperacion
                        mostrar={ toast.mostrar }
                        mensaje={ toast.mensaje }
                        tipo={ toast.tipo }
                        onCerrar={ () =>
                            setToast( {
                                ...toast,
                                mostrar: false,
                            } )
                        }
                    />
                </Container>
            </div>
        </div>
    );
};

export default Coches;