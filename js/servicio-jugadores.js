'use strict';
var URL_BASE_API = 'https://futbolle-daw-uai-2026.onrender.com/api/players';
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
