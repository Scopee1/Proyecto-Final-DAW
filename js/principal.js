'use strict';
// Inicializa los modulos de la pagina una vez construido el DOM.
function iniciarAplicacion() {
    iniciarTema();
    iniciarSonidos();
    iniciarModales();
    iniciarAutocompletado();
    iniciarTablero();
    iniciarTemporizador();
    iniciarDificultad();
    iniciarPuntuacion();
    iniciarHistorial();
    iniciarJuego();
}
window.addEventListener('DOMContentLoaded', iniciarAplicacion);
