'use strict';
var CANTIDAD_MAXIMA_DE_INTENTOS = 8;
var MINIMO_DE_LETRAS_DEL_NOMBRE = 3;
var jugadorSecreto = null;
var nombreDelUsuario = '';
var intentosRealizados = [];
var partidaEnCurso = false;
var capaModalDeInicio = null;
var entradaDelUsuario = null;
var errorDelUsuario = null;
var botonComenzar = null;
var botonReiniciar = null;
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
}
// Avisa por modal que no se pudo obtener el jugador secreto sin cortar la ejecucion.
function informarFalloAlBuscarJugadorSecreto(error) {
    partidaEnCurso = false;
    avisoDeCarga.classList.add('oculto');
    mostrarModalDeError('No se pudo obtener el jugador secreto. Revisa tu conexion y presiona "Nueva partida" para reintentar. Detalle: ' + error.message);
}
// Reinicia el estado de la partida y solicita un nuevo jugador secreto al endpoint.
function iniciarPartida() {
    jugadorSecreto = null;
    intentosRealizados = [];
    partidaEnCurso = false;
    actualizarIntentosRestantes();
    reiniciarAutocompletado();
    habilitarBuscador(false);
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
// Comienza una partida nueva con otro jugador secreto sin recargar la pagina.
function manejarReinicioDePartida() {
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
    entradaDelUsuario = document.getElementById('entrada-usuario');
    errorDelUsuario = document.getElementById('error-usuario');
    botonComenzar = document.getElementById('boton-comenzar');
    botonReiniciar = document.getElementById('boton-reiniciar');
    datoUsuario = document.getElementById('dato-usuario');
    datoIntentos = document.getElementById('dato-intentos');
    avisoDeCarga = document.getElementById('aviso-carga');
    botonComenzar.addEventListener('click', manejarComienzoDePartida);
    botonReiniciar.addEventListener('click', manejarReinicioDePartida);
    entradaDelUsuario.addEventListener('keydown', manejarTeclaEnElNombreDelUsuario);
    entradaDelUsuario.focus();
    actualizarIntentosRestantes();
}
