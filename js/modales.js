'use strict';
var capaModalDeError = null;
var textoModalDeError = null;
var botonCerrarModalDeError = null;
// Muestra la capa de modal recibida quitandole la clase que la oculta.
function abrirModal(capa) {
    capa.classList.remove('oculto');
}
// Oculta la capa de modal recibida.
function cerrarModal(capa) {
    capa.classList.add('oculto');
}
// Muestra el modal de error con el mensaje indicado, en reemplazo de alert.
function mostrarModalDeError(mensaje) {
    textoModalDeError.textContent = mensaje;
    abrirModal(capaModalDeError);
}
// Cierra el modal de error cuando el usuario confirma el aviso.
function manejarCierreDelModalDeError() {
    cerrarModal(capaModalDeError);
}
// Guarda las referencias del modal de error y activa su boton de cierre.
function iniciarModales() {
    capaModalDeError = document.getElementById('modal-error');
    textoModalDeError = document.getElementById('texto-error');
    botonCerrarModalDeError = document.getElementById('boton-cerrar-error');
    botonCerrarModalDeError.addEventListener('click', manejarCierreDelModalDeError);
}
