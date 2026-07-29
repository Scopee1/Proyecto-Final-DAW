'use strict';
var INTERVALO_DEL_TEMPORIZADOR = 1000;
var SEGUNDOS_POR_MINUTO = 60;
var momentoDeInicio = 0;
var segundosTranscurridos = 0;
var identificadorDelIntervalo = null;
var datoTiempo = null;
// Agrega un cero adelante a los numeros menores a diez.
function completarConCero(numero) {
    if (numero < 10) {
        return '0' + numero;
    }
    return '' + numero;
}
// Devuelve los segundos recibidos con formato de minutos y segundos.
function formatearDuracion(segundos) {
    var minutos = Math.floor(segundos / SEGUNDOS_POR_MINUTO);
    return completarConCero(minutos) + ':' + completarConCero(segundos % SEGUNDOS_POR_MINUTO);
}
// Refresca en pantalla el tiempo transcurrido desde el primer intento.
function actualizarTemporizador() {
    segundosTranscurridos = Math.floor((Date.now() - momentoDeInicio) / INTERVALO_DEL_TEMPORIZADOR);
    datoTiempo.textContent = formatearDuracion(segundosTranscurridos);
}
// Detiene la cuenta del tiempo al terminar la partida.
function detenerTemporizador() {
    if (identificadorDelIntervalo === null) {
        return;
    }
    window.clearInterval(identificadorDelIntervalo);
    identificadorDelIntervalo = null;
    actualizarTemporizador();
}
// Pone el temporizador en cero y corta la cuenta de la partida anterior.
function reiniciarTemporizador() {
    detenerTemporizador();
    momentoDeInicio = 0;
    segundosTranscurridos = 0;
    datoTiempo.textContent = formatearDuracion(0);
}
// Arranca la cuenta del tiempo cuando el usuario registra su primer intento.
function arrancarTemporizador() {
    if (identificadorDelIntervalo !== null) {
        return;
    }
    momentoDeInicio = Date.now();
    identificadorDelIntervalo = window.setInterval(actualizarTemporizador, INTERVALO_DEL_TEMPORIZADOR);
}
// Devuelve la cantidad de segundos que duro la partida.
function obtenerDuracionEnSegundos() {
    return segundosTranscurridos;
}
// Guarda la referencia del temporizador que se muestra en el panel de la partida.
function iniciarTemporizador() {
    datoTiempo = document.getElementById('dato-tiempo');
    reiniciarTemporizador();
}
