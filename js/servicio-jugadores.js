'use strict';
var URL_BASE_API = 'https://futbolle-daw-uai-2026.onrender.com/api/players';
var LIMITE_DE_SUGERENCIAS = 8;
var MINIMO_DE_LETRAS_PARA_BUSCAR = 2;
// Verifica el estado de la respuesta del endpoint y la convierte a JSON.
function convertirRespuestaAJson(respuesta) {
    if (respuesta.ok !== true) {
        throw new Error('El servidor respondio con el estado ' + respuesta.status + '.');
    }
    return respuesta.json();
}
// Pide al endpoint un jugador aleatorio para usarlo como jugador secreto de la partida.
function pedirJugadorSecreto(alObtener, alFallar) {
    fetch(URL_BASE_API + '/random')
        .then(convertirRespuestaAJson)
        .then(alObtener)
        .catch(alFallar);
}
// Pide al endpoint los jugadores cuyo nombre coincide parcialmente con el texto buscado.
function buscarJugadoresPorNombre(texto, alObtener, alFallar) {
    var direccion = '';
    if (texto.length < MINIMO_DE_LETRAS_PARA_BUSCAR) {
        alObtener([]);
        return;
    }
    direccion = URL_BASE_API + '/search?q=' + encodeURIComponent(texto) + '&limit=' + LIMITE_DE_SUGERENCIAS;
    fetch(direccion)
        .then(convertirRespuestaAJson)
        .then(alObtener)
        .catch(alFallar);
}
