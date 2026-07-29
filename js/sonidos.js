'use strict';
var CLAVE_DEL_SONIDO = 'futbolle-sonido';
var SONIDO_ACTIVADO = 'activado';
var SONIDO_DESACTIVADO = 'desactivado';
var DURACION_DEL_TONO = 0.18;
var VOLUMEN_DEL_TONO = 0.12;
var VOLUMEN_FINAL_DEL_TONO = 0.0001;
var NOTAS_DE_ACIERTO = [659.25];
var NOTAS_DE_FALLO = [220];
var NOTAS_DE_VICTORIA = [523.25, 659.25, 783.99, 1046.5];
var NOTAS_DE_DERROTA = [392, 349.23, 293.66];
var contextoDeAudio = null;
var estadoDelSonido = SONIDO_ACTIVADO;
var botonDeSonido = null;
// Crea el contexto de audio la primera vez que hace falta reproducir un sonido.
function obtenerContextoDeAudio() {
    var ConstructorDeAudio = window.AudioContext || window.webkitAudioContext;
    if (contextoDeAudio === null) {
        contextoDeAudio = new ConstructorDeAudio();
    }
    return contextoDeAudio;
}
// Reproduce un tono con la frecuencia indicada despues del retardo recibido.
function reproducirTono(frecuencia, retardo) {
    var contexto = obtenerContextoDeAudio();
    var oscilador = contexto.createOscillator();
    var controlDeVolumen = contexto.createGain();
    var momento = contexto.currentTime + retardo;
    oscilador.type = 'sine';
    oscilador.frequency.value = frecuencia;
    controlDeVolumen.gain.setValueAtTime(VOLUMEN_DEL_TONO, momento);
    controlDeVolumen.gain.exponentialRampToValueAtTime(VOLUMEN_FINAL_DEL_TONO, momento + DURACION_DEL_TONO);
    oscilador.connect(controlDeVolumen);
    controlDeVolumen.connect(contexto.destination);
    oscilador.start(momento);
    oscilador.stop(momento + DURACION_DEL_TONO);
}
// Reproduce una tras otra las notas de la melodia recibida.
function reproducirMelodia(notas) {
    var posicion = 0;
    if (estadoDelSonido !== SONIDO_ACTIVADO) {
        return;
    }
    for (posicion = 0; posicion < notas.length; posicion = posicion + 1) {
        reproducirTono(notas[posicion], posicion * DURACION_DEL_TONO);
    }
}
// Suena cuando el intento coincide en al menos un atributo con el jugador secreto.
function sonarAcierto() {
    reproducirMelodia(NOTAS_DE_ACIERTO);
}
// Suena cuando el intento no coincide en ningun atributo.
function sonarFallo() {
    reproducirMelodia(NOTAS_DE_FALLO);
}
// Suena cuando el usuario gana la partida.
function sonarVictoria() {
    reproducirMelodia(NOTAS_DE_VICTORIA);
}
// Suena cuando el usuario agota los intentos y pierde la partida.
function sonarDerrota() {
    reproducirMelodia(NOTAS_DE_DERROTA);
}
// Aplica el estado de sonido recibido y actualiza el texto del boton.
function aplicarEstadoDelSonido(estado) {
    estadoDelSonido = estado;
    if (estado === SONIDO_ACTIVADO) {
        botonDeSonido.textContent = 'Sonido activado';
        return;
    }
    botonDeSonido.textContent = 'Sonido apagado';
}
// Activa o apaga el sonido del juego y recuerda la eleccion del usuario.
function manejarCambioDelSonido() {
    var estadoElegido = SONIDO_ACTIVADO;
    if (estadoDelSonido === SONIDO_ACTIVADO) {
        estadoElegido = SONIDO_DESACTIVADO;
    }
    aplicarEstadoDelSonido(estadoElegido);
    guardarTexto(CLAVE_DEL_SONIDO, estadoElegido);
}
// Guarda la referencia del boton de sonido y aplica el estado recordado.
function iniciarSonidos() {
    botonDeSonido = document.getElementById('boton-sonido');
    botonDeSonido.addEventListener('click', manejarCambioDelSonido);
    aplicarEstadoDelSonido(leerTexto(CLAVE_DEL_SONIDO, SONIDO_ACTIVADO));
}
