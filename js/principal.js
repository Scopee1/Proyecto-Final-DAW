'use strict';
// Inicializa los modulos de la pagina una vez construido el DOM.
function iniciarAplicacion() {
    iniciarModales();
    iniciarAutocompletado();
    iniciarTablero();
    iniciarTemporizador();
    iniciarJuego();
}
window.addEventListener('DOMContentLoaded', iniciarAplicacion);
