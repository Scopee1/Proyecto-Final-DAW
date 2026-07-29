'use strict';
var PUNTAJE_BASE_FACIL = 100;
var PUNTAJE_BASE_MEDIO = 150;
var PUNTAJE_BASE_DIFICIL = 200;
var PENALIZACION_POR_INTENTO = 10;
var PUNTAJE_MINIMO_GANADO = 10;
var PUNTAJE_PARTIDA_PERDIDA = 0;
var BONUS_POR_PARTIDA_RAPIDA = 20;
var BONUS_POR_PARTIDA_INTERMEDIA = 10;
var SEGUNDOS_DEL_BONUS_MAYOR = 60;
var SEGUNDOS_DEL_BONUS_MENOR = 120;
var datoPuntaje = null;
// Devuelve los puntos base que corresponden a la dificultad elegida.
function obtenerPuntajeBase() {
    if (dificultadActual === DIFICULTAD_DIFICIL) {
        return PUNTAJE_BASE_DIFICIL;
    }
    if (dificultadActual === DIFICULTAD_MEDIA) {
        return PUNTAJE_BASE_MEDIO;
    }
    return PUNTAJE_BASE_FACIL;
}
// Devuelve el bonus que corresponde segun cuanto duro la partida ganada.
function obtenerBonusPorTiempo(duracionEnSegundos) {
    if (duracionEnSegundos < SEGUNDOS_DEL_BONUS_MAYOR) {
        return BONUS_POR_PARTIDA_RAPIDA;
    }
    if (duracionEnSegundos < SEGUNDOS_DEL_BONUS_MENOR) {
        return BONUS_POR_PARTIDA_INTERMEDIA;
    }
    return 0;
}
// Calcula el puntaje de una partida ganada segun dificultad, intentos y tiempo.
function calcularPuntaje(intentosUsados, duracionEnSegundos) {
    var puntaje = obtenerPuntajeBase() - ((intentosUsados - 1) * PENALIZACION_POR_INTENTO);
    puntaje = puntaje + obtenerBonusPorTiempo(duracionEnSegundos);
    if (puntaje < PUNTAJE_MINIMO_GANADO) {
        return PUNTAJE_MINIMO_GANADO;
    }
    return puntaje;
}
// Muestra el puntaje obtenido en el panel de la partida.
function mostrarPuntaje(puntaje) {
    datoPuntaje.textContent = puntaje;
}
// Guarda la referencia del puntaje que se muestra en el panel de la partida.
function iniciarPuntuacion() {
    datoPuntaje = document.getElementById('dato-puntaje');
    mostrarPuntaje(PUNTAJE_PARTIDA_PERDIDA);
}
