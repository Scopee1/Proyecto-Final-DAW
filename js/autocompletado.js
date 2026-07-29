'use strict';
var RETARDO_DE_BUSQUEDA = 250;
var jugadorElegido = null;
var sugerenciasVisibles = [];
var temporizadorDeBusqueda = null;
var entradaDeJugador = null;
var listaDeSugerencias = null;
var plantillaDeSugerencia = null;
// Vacia la lista de sugerencias y la oculta de la pantalla.
function limpiarSugerencias() {
    listaDeSugerencias.textContent = '';
    listaDeSugerencias.classList.add('oculto');
    sugerenciasVisibles = [];
}
// Escribe en el campo el nombre del jugador elegido y cierra la lista de sugerencias.
function elegirJugador(jugador) {
    jugadorElegido = jugador;
    entradaDeJugador.value = jugador.name;
    limpiarSugerencias();
}
// Marca como elegido el jugador asociado a la sugerencia sobre la que se hizo clic.
function manejarClicEnSugerencia(evento) {
    var posicion = Number(evento.currentTarget.getAttribute('data-posicion'));
    elegirJugador(sugerenciasVisibles[posicion]);
}
// Arma un elemento de la lista de sugerencias clonando la plantilla del HTML.
function crearSugerencia(jugador, posicion) {
    var elemento = plantillaDeSugerencia.content.firstElementChild.cloneNode(true);
    var foto = elemento.querySelector('.sugerencia-foto');
    var nombre = elemento.querySelector('.sugerencia-nombre');
    var club = elemento.querySelector('.sugerencia-club');
    foto.src = jugador.photo;
    foto.alt = 'Foto de ' + jugador.name;
    nombre.textContent = jugador.name;
    club.textContent = jugador.club;
    elemento.setAttribute('data-posicion', posicion);
    elemento.addEventListener('click', manejarClicEnSugerencia);
    return elemento;
}
// Dibuja en pantalla las sugerencias devueltas por el endpoint.
function mostrarSugerencias(jugadores) {
    var posicion = 0;
    limpiarSugerencias();
    if (jugadores.length === 0) {
        return;
    }
    sugerenciasVisibles = jugadores;
    for (posicion = 0; posicion < jugadores.length; posicion = posicion + 1) {
        listaDeSugerencias.appendChild(crearSugerencia(jugadores[posicion], posicion));
    }
    listaDeSugerencias.classList.remove('oculto');
}
// Avisa por modal que fallo la consulta de nombres al endpoint.
function informarFalloAlBuscarNombres(error) {
    limpiarSugerencias();
    mostrarModalDeError('No se pudieron obtener los nombres de jugadores. Detalle: ' + error.message);
}
// Consulta al endpoint los jugadores cuyo nombre coincide con el texto escrito.
function consultarSugerencias() {
    buscarJugadoresPorNombre(entradaDeJugador.value.trim(), mostrarSugerencias, informarFalloAlBuscarNombres);
}
// Reinicia el retardo de busqueda para no consultar el endpoint en cada tecla.
function manejarEscrituraDeNombre() {
    jugadorElegido = null;
    window.clearTimeout(temporizadorDeBusqueda);
    temporizadorDeBusqueda = window.setTimeout(consultarSugerencias, RETARDO_DE_BUSQUEDA);
}
// Cierra la lista de sugerencias cuando se hace clic fuera del buscador.
function manejarClicFueraDelBuscador(evento) {
    if (evento.target !== entradaDeJugador && listaDeSugerencias.contains(evento.target) !== true) {
        limpiarSugerencias();
    }
}
// Devuelve el texto escrito en el campo de busqueda sin espacios sobrantes.
function obtenerTextoDelBuscador() {
    return entradaDeJugador.value.trim();
}
// Habilita o deshabilita el campo de busqueda segun el estado de la partida.
function habilitarBuscador(habilitado) {
    entradaDeJugador.disabled = habilitado !== true;
}
// Vacia el campo de busqueda y descarta el jugador elegido en la partida anterior.
function reiniciarAutocompletado() {
    jugadorElegido = null;
    entradaDeJugador.value = '';
    limpiarSugerencias();
}
// Guarda las referencias del buscador y activa los eventos del autocompletado.
function iniciarAutocompletado() {
    entradaDeJugador = document.getElementById('entrada-jugador');
    listaDeSugerencias = document.getElementById('lista-sugerencias');
    plantillaDeSugerencia = document.getElementById('plantilla-sugerencia');
    entradaDeJugador.addEventListener('input', manejarEscrituraDeNombre);
    document.addEventListener('click', manejarClicFueraDelBuscador);
}
