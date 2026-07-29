'use strict';
// Inicializa los modulos de la pagina una vez construido el DOM.
function iniciarAplicacion() {
    iniciarTema();
    iniciarModales();
    iniciarAutocompletado();
    iniciarTablero();
    iniciarTemporizador();
    iniciarDificultad();
    iniciarPuntuacion();
    iniciarJuego();
}
window.addEventListener('DOMContentLoaded', iniciarAplicacion);
