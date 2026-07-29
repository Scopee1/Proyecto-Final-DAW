'use strict';
var CLAVE_DEL_TEMA = 'futbolle-tema';
var TEMA_CLARO = 'claro';
var TEMA_OSCURO = 'oscuro';
var temaActual = TEMA_CLARO;
var botonDeTema = null;
// Aplica el tema recibido al documento y actualiza el texto del boton.
function aplicarTema(tema) {
    temaActual = tema;
    if (tema === TEMA_OSCURO) {
        document.body.classList.add('tema-oscuro');
        botonDeTema.textContent = 'Modo claro';
        return;
    }
    document.body.classList.remove('tema-oscuro');
    botonDeTema.textContent = 'Modo oscuro';
}
// Alterna entre el modo claro y el modo oscuro y recuerda la eleccion del usuario.
function manejarCambioDeTema() {
    var temaElegido = TEMA_OSCURO;
    if (temaActual === TEMA_OSCURO) {
        temaElegido = TEMA_CLARO;
    }
    aplicarTema(temaElegido);
    guardarTexto(CLAVE_DEL_TEMA, temaElegido);
}
// Guarda la referencia del boton de tema y aplica el tema recordado.
function iniciarTema() {
    botonDeTema = document.getElementById('boton-tema');
    botonDeTema.addEventListener('click', manejarCambioDeTema);
    aplicarTema(leerTexto(CLAVE_DEL_TEMA, TEMA_CLARO));
}
