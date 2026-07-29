'use strict';
var CANTIDAD_MAXIMA_DE_INTENTOS = 8;
var MINIMO_DE_LETRAS_DEL_NOMBRE = 3;
var jugadorSecreto = null;
var nombreDelUsuario = '';
var intentosRealizados = [];
var partidaEnCurso = false;
var puntajeDeLaPartida = 0;
var textoDelIntentoPendiente = '';
var capaModalDeInicio = null;
var capaModalDeResultado = null;
var tituloDelResultado = null;
var textoDelResultado = null;
var fotoRevelada = null;
var nombreRevelado = null;
var clubRevelado = null;
var botonJugarDeNuevo = null;
var entradaDelUsuario = null;
var errorDelUsuario = null;
var botonComenzar = null;
var botonReiniciar = null;
var botonIntentar = null;
var errorDelIntento = null;
var datoUsuario = null;
var datoIntentos = null;
var avisoDeCarga = null;
// Cuenta las letras del texto recibido ignorando numeros, espacios y simbolos.
function contarLetras(texto) {
    return texto.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ]/g, '').length;
}
// Muestra el mensaje de validacion indicado en el parrafo recibido.
function mostrarMensajeDeValidacion(parrafo, mensaje) {
    parrafo.textContent = mensaje;
    parrafo.classList.remove('oculto');
}
// Oculta el mensaje de validacion del parrafo recibido.
function ocultarMensajeDeValidacion(parrafo) {
    parrafo.textContent = '';
    parrafo.classList.add('oculto');
}
// Actualiza en pantalla la cantidad de intentos que le quedan al usuario.
function actualizarIntentosRestantes() {
    datoIntentos.textContent = CANTIDAD_MAXIMA_DE_INTENTOS - intentosRealizados.length;
}
// Guarda el jugador secreto recibido del endpoint y habilita la partida.
function recibirJugadorSecreto(jugador) {
    jugadorSecreto = jugador;
    partidaEnCurso = true;
    avisoDeCarga.classList.add('oculto');
    habilitarBuscador(true);
    botonIntentar.disabled = false;
    actualizarPistas(jugadorSecreto, 0);
}
// Avisa por modal que no se pudo obtener el jugador secreto sin cortar la ejecucion.
function informarFalloAlBuscarJugadorSecreto(error) {
    partidaEnCurso = false;
    avisoDeCarga.classList.add('oculto');
    mostrarModalDeError('No se pudo obtener el jugador secreto. Revisa tu conexion y presiona "Nueva partida" para reintentar. Detalle: ' + error.message);
}
// Indica si el jugador recibido ya fue usado como intento en la partida actual.
function yaFueIntentado(jugador) {
    var posicion = 0;
    for (posicion = 0; posicion < intentosRealizados.length; posicion = posicion + 1) {
        if (intentosRealizados[posicion].id === jugador.id) {
            return true;
        }
    }
    return false;
}
// Busca entre los resultados del endpoint un nombre exactamente igual al escrito.
function buscarCoincidenciaExacta(jugadores, texto) {
    var posicion = 0;
    var nombreBuscado = texto.toLowerCase();
    for (posicion = 0; posicion < jugadores.length; posicion = posicion + 1) {
        if (jugadores[posicion].name.toLowerCase() === nombreBuscado) {
            return jugadores[posicion];
        }
    }
    return null;
}
// Reinicia el estado de la partida y solicita un nuevo jugador secreto al endpoint.
function iniciarPartida() {
    jugadorSecreto = null;
    intentosRealizados = [];
    partidaEnCurso = false;
    puntajeDeLaPartida = 0;
    mostrarPuntaje(puntajeDeLaPartida);
    actualizarIntentosRestantes();
    reiniciarTemporizador();
    reiniciarPistas();
    limpiarTablero();
    reiniciarAutocompletado();
    ocultarMensajeDeValidacion(errorDelIntento);
    habilitarBuscador(false);
    botonIntentar.disabled = true;
    avisoDeCarga.classList.remove('oculto');
    pedirJugadorSecreto(recibirJugadorSecreto, informarFalloAlBuscarJugadorSecreto);
}
// Valida el nombre ingresado y, si es correcto, comienza la primera partida.
function manejarComienzoDePartida() {
    var nombreIngresado = entradaDelUsuario.value.trim();
    if (contarLetras(nombreIngresado) < MINIMO_DE_LETRAS_DEL_NOMBRE) {
        mostrarMensajeDeValidacion(errorDelUsuario, 'El nombre debe tener al menos tres letras.');
        return;
    }
    ocultarMensajeDeValidacion(errorDelUsuario);
    nombreDelUsuario = nombreIngresado;
    datoUsuario.textContent = nombreDelUsuario;
    cerrarModal(capaModalDeInicio);
    iniciarPartida();
}
// Devuelve la cantidad de intentos escrita en palabras para armar los mensajes.
function describirCantidadDeIntentos(cantidad) {
    if (cantidad === 1) {
        return 'un intento';
    }
    return cantidad + ' intentos';
}
// Muestra el modal de resultado revelando quien era el jugador secreto.
function mostrarResultadoDePartida(titulo, mensaje) {
    tituloDelResultado.textContent = titulo;
    textoDelResultado.textContent = mensaje;
    fotoRevelada.src = jugadorSecreto.photo;
    fotoRevelada.alt = 'Foto de ' + jugadorSecreto.name;
    nombreRevelado.textContent = jugadorSecreto.name;
    clubRevelado.textContent = jugadorSecreto.club + ' - ' + jugadorSecreto.nationality;
    abrirModal(capaModalDeResultado);
}
// Cierra la partida bloqueando el buscador y mostrando el resultado obtenido.
function terminarPartida(titulo, mensaje, gano) {
    partidaEnCurso = false;
    detenerTemporizador();
    habilitarBuscador(false);
    botonIntentar.disabled = true;
    guardarPartida(nombreDelUsuario, gano, intentosRealizados.length, obtenerDuracionEnSegundos(), puntajeDeLaPartida);
    mostrarResultadoDePartida(titulo, mensaje);
}
// Reproduce el sonido que corresponde segun cuantos atributos acerto el intento.
function reproducirSonidoDelIntento(jugador) {
    if (contarAtributosCoincidentes(jugador, jugadorSecreto) > 0) {
        sonarAcierto();
        return;
    }
    sonarFallo();
}
// Evalua si el ultimo intento gano la partida o si se agotaron los intentos.
function evaluarFinDePartida(jugador) {
    if (jugador.id === jugadorSecreto.id) {
        detenerTemporizador();
        sonarVictoria();
        puntajeDeLaPartida = calcularPuntaje(intentosRealizados.length, obtenerDuracionEnSegundos());
        mostrarPuntaje(puntajeDeLaPartida);
        terminarPartida('Ganaste la partida', 'Adivinaste al jugador secreto en ' + describirCantidadDeIntentos(intentosRealizados.length) + ' y sumaste ' + puntajeDeLaPartida + ' puntos.', true);
        return;
    }
    if (intentosRealizados.length >= CANTIDAD_MAXIMA_DE_INTENTOS) {
        sonarDerrota();
        puntajeDeLaPartida = PUNTAJE_PARTIDA_PERDIDA;
        mostrarPuntaje(puntajeDeLaPartida);
        terminarPartida('Se acabaron los intentos', 'No pudiste adivinar al jugador secreto en ocho intentos, asi que el puntaje de esta partida es cero.', false);
        return;
    }
    reproducirSonidoDelIntento(jugador);
}
// Suma el intento al tablero, lo guarda en la partida y actualiza el contador.
function registrarIntento(jugador) {
    if (yaFueIntentado(jugador) === true) {
        mostrarMensajeDeValidacion(errorDelIntento, 'Ya probaste con ese jugador en esta partida.');
        return;
    }
    ocultarMensajeDeValidacion(errorDelIntento);
    arrancarTemporizador();
    intentosRealizados.push(jugador);
    agregarIntentoAlTablero(jugador, jugadorSecreto);
    actualizarIntentosRestantes();
    actualizarPistas(jugadorSecreto, intentosRealizados.length);
    reiniciarAutocompletado();
    evaluarFinDePartida(jugador);
}
// Registra el intento solo si el nombre escrito existe en el listado del endpoint.
function resolverIntentoPorNombre(jugadores) {
    var jugadorEncontrado = buscarCoincidenciaExacta(jugadores, textoDelIntentoPendiente);
    if (jugadorEncontrado === null) {
        mostrarMensajeDeValidacion(errorDelIntento, 'Ese jugador no existe en el listado. Elegi un nombre de las sugerencias.');
        return;
    }
    registrarIntento(jugadorEncontrado);
}
// Avisa por modal que no se pudo verificar el nombre ingresado contra el endpoint.
function informarFalloAlVerificarIntento(error) {
    mostrarModalDeError('No se pudo verificar el jugador ingresado. Detalle: ' + error.message);
}
// Valida el intento escrito por el usuario antes de registrarlo en el tablero.
function manejarIntento() {
    var textoIngresado = obtenerTextoDelBuscador();
    if (partidaEnCurso !== true) {
        mostrarMensajeDeValidacion(errorDelIntento, 'Todavia no hay una partida en curso.');
        return;
    }
    if (textoIngresado === '') {
        mostrarMensajeDeValidacion(errorDelIntento, 'Escribi el nombre de un jugador para poder intentar.');
        return;
    }
    ocultarMensajeDeValidacion(errorDelIntento);
    if (jugadorElegido !== null) {
        registrarIntento(jugadorElegido);
        return;
    }
    textoDelIntentoPendiente = textoIngresado;
    buscarJugadoresPorNombre(textoIngresado, resolverIntentoPorNombre, informarFalloAlVerificarIntento);
}
// Permite registrar el intento presionando la tecla Enter en el buscador.
function manejarTeclaEnElBuscador(evento) {
    if (evento.key === 'Enter') {
        manejarIntento();
    }
}
// Comienza una partida nueva con otro jugador secreto sin recargar la pagina.
function manejarReinicioDePartida() {
    cerrarModal(capaModalDeResultado);
    iniciarPartida();
}
// Permite confirmar el nombre del usuario presionando la tecla Enter.
function manejarTeclaEnElNombreDelUsuario(evento) {
    if (evento.key === 'Enter') {
        manejarComienzoDePartida();
    }
}
// Guarda las referencias del DOM del juego y activa los eventos de la partida.
function iniciarJuego() {
    capaModalDeInicio = document.getElementById('modal-inicio');
    capaModalDeResultado = document.getElementById('modal-resultado');
    tituloDelResultado = document.getElementById('titulo-resultado');
    textoDelResultado = document.getElementById('texto-resultado');
    fotoRevelada = document.getElementById('foto-revelada');
    nombreRevelado = document.getElementById('nombre-revelado');
    clubRevelado = document.getElementById('club-revelado');
    botonJugarDeNuevo = document.getElementById('boton-jugar-de-nuevo');
    entradaDelUsuario = document.getElementById('entrada-usuario');
    errorDelUsuario = document.getElementById('error-usuario');
    botonComenzar = document.getElementById('boton-comenzar');
    botonReiniciar = document.getElementById('boton-reiniciar');
    botonIntentar = document.getElementById('boton-intentar');
    errorDelIntento = document.getElementById('error-intento');
    datoUsuario = document.getElementById('dato-usuario');
    datoIntentos = document.getElementById('dato-intentos');
    avisoDeCarga = document.getElementById('aviso-carga');
    botonComenzar.addEventListener('click', manejarComienzoDePartida);
    botonReiniciar.addEventListener('click', manejarReinicioDePartida);
    botonJugarDeNuevo.addEventListener('click', manejarReinicioDePartida);
    botonIntentar.addEventListener('click', manejarIntento);
    entradaDelUsuario.addEventListener('keydown', manejarTeclaEnElNombreDelUsuario);
    entradaDeJugador.addEventListener('keydown', manejarTeclaEnElBuscador);
    entradaDelUsuario.focus();
    actualizarIntentosRestantes();
}
