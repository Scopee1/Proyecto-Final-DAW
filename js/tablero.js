'use strict';
var FLECHA_HACIA_ARRIBA = '↑';
var FLECHA_HACIA_ABAJO = '↓';
var SIN_FLECHA = '';
var filasDelTablero = null;
var plantillaDeFila = null;
// Devuelve la clase de color que corresponde segun si el atributo coincide o no.
function obtenerClaseDeCoincidencia(coincide) {
    if (coincide === true) {
        return 'celda-acierto';
    }
    return 'celda-error';
}
// Devuelve la flecha que indica si el valor del jugador secreto es mayor o menor.
function obtenerFlechaDeComparacion(valorIntentado, valorSecreto) {
    if (valorIntentado === valorSecreto) {
        return SIN_FLECHA;
    }
    if (valorSecreto > valorIntentado) {
        return FLECHA_HACIA_ARRIBA;
    }
    return FLECHA_HACIA_ABAJO;
}
// Carga en una celda su texto, su color y, si corresponde, su imagen y su flecha.
function completarCelda(celda, texto, coincide, direccion, imagen, descripcion) {
    var elementoDeTexto = celda.querySelector('.celda-texto');
    var elementoDeFlecha = celda.querySelector('.celda-flecha');
    var elementoDeImagen = celda.querySelector('.celda-imagen');
    elementoDeTexto.textContent = texto;
    if (coincide !== null) {
        celda.classList.add(obtenerClaseDeCoincidencia(coincide));
    }
    if (elementoDeFlecha !== null) {
        elementoDeFlecha.textContent = direccion;
    }
    if (elementoDeImagen !== null) {
        elementoDeImagen.src = imagen;
        elementoDeImagen.alt = descripcion;
    }
}
// Arma la fila del tablero comparando el jugador intentado contra el jugador secreto.
function crearFilaDeIntento(intentado, secreto) {
    var fila = plantillaDeFila.content.firstElementChild.cloneNode(true);
    var celdas = fila.querySelectorAll('.celda');
    completarCelda(celdas[0], intentado.name, null, SIN_FLECHA, intentado.photo, 'Foto de ' + intentado.name);
    completarCelda(celdas[1], intentado.nationality, intentado.nationality === secreto.nationality, SIN_FLECHA, intentado.flag, 'Bandera de ' + intentado.nationality);
    completarCelda(celdas[2], intentado.club, intentado.club === secreto.club, SIN_FLECHA, '', '');
    completarCelda(celdas[3], intentado.position, intentado.position === secreto.position, SIN_FLECHA, '', '');
    completarCelda(celdas[4], intentado.age, intentado.age === secreto.age, obtenerFlechaDeComparacion(intentado.age, secreto.age), '', '');
    completarCelda(celdas[5], intentado.overall, intentado.overall === secreto.overall, obtenerFlechaDeComparacion(intentado.overall, secreto.overall), '', '');
    completarCelda(celdas[6], intentado.heightCm + ' cm', intentado.heightCm === secreto.heightCm, obtenerFlechaDeComparacion(intentado.heightCm, secreto.heightCm), '', '');
    return fila;
}
// Cuenta cuantos atributos del intento coinciden con los del jugador secreto.
function contarAtributosCoincidentes(intentado, secreto) {
    var coincidencias = 0;
    if (intentado.nationality === secreto.nationality) {
        coincidencias = coincidencias + 1;
    }
    if (intentado.club === secreto.club) {
        coincidencias = coincidencias + 1;
    }
    if (intentado.position === secreto.position) {
        coincidencias = coincidencias + 1;
    }
    if (intentado.age === secreto.age) {
        coincidencias = coincidencias + 1;
    }
    if (intentado.overall === secreto.overall) {
        coincidencias = coincidencias + 1;
    }
    if (intentado.heightCm === secreto.heightCm) {
        coincidencias = coincidencias + 1;
    }
    return coincidencias;
}
// Agrega al tablero la fila con el resultado del intento recibido.
function agregarIntentoAlTablero(intentado, secreto) {
    filasDelTablero.appendChild(crearFilaDeIntento(intentado, secreto));
}
// Borra todas las filas del tablero para comenzar una partida nueva.
function limpiarTablero() {
    filasDelTablero.textContent = '';
}
// Guarda las referencias del tablero de intentos.
function iniciarTablero() {
    filasDelTablero = document.getElementById('filas-tablero');
    plantillaDeFila = document.getElementById('plantilla-fila');
}
