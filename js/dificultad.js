'use strict';
var CLAVE_DE_LA_DIFICULTAD = 'futbolle-dificultad';
var DIFICULTAD_FACIL = 'facil';
var DIFICULTAD_MEDIA = 'media';
var DIFICULTAD_DIFICIL = 'dificil';
var DESENFOQUE_MAXIMO = 8;
var PISTAS_DEL_MODO_MEDIO = [
    { intentosNecesarios: 2, etiqueta: 'Altura', propiedad: 'heightCm', sufijo: ' cm' },
    { intentosNecesarios: 4, etiqueta: 'Edad', propiedad: 'age', sufijo: ' años' },
    { intentosNecesarios: 6, etiqueta: 'Overall', propiedad: 'overall', sufijo: '' }
];
var dificultadActual = DIFICULTAD_FACIL;
var selectorDeDificultad = null;
var bloqueDePistaDeFoto = null;
var fotoDelJugadorSecreto = null;
var bloqueDePistasReveladas = null;
var listaDePistasReveladas = null;
var plantillaDePista = null;
// Devuelve el nivel de desenfoque que corresponde a la cantidad de intentos fallidos.
function calcularNivelDeDesenfoque(intentosFallidos) {
    var nivel = DESENFOQUE_MAXIMO - intentosFallidos;
    if (nivel < 0) {
        return 0;
    }
    return nivel;
}
// Muestra la foto del jugador secreto con el desenfoque que le corresponde.
function actualizarPistaDeFoto(secreto, intentosFallidos) {
    fotoDelJugadorSecreto.src = secreto.photo;
    fotoDelJugadorSecreto.className = 'foto-secreta foto-desenfoque-' + calcularNivelDeDesenfoque(intentosFallidos);
    bloqueDePistaDeFoto.classList.remove('oculto');
}
// Arma un elemento de la lista de pistas clonando la plantilla del HTML.
function crearPista(etiqueta, valor) {
    var elemento = plantillaDePista.content.firstElementChild.cloneNode(true);
    elemento.querySelector('.pista-etiqueta').textContent = etiqueta;
    elemento.querySelector('.pista-valor').textContent = valor;
    return elemento;
}
// Revela las cualidades del jugador secreto que ya se ganaron por intentos fallidos.
function actualizarPistasReveladas(secreto, intentosFallidos) {
    var posicion = 0;
    var pista = null;
    listaDePistasReveladas.textContent = '';
    for (posicion = 0; posicion < PISTAS_DEL_MODO_MEDIO.length; posicion = posicion + 1) {
        pista = PISTAS_DEL_MODO_MEDIO[posicion];
        if (intentosFallidos >= pista.intentosNecesarios) {
            listaDePistasReveladas.appendChild(crearPista(pista.etiqueta, secreto[pista.propiedad] + pista.sufijo));
        }
    }
    if (listaDePistasReveladas.children.length === 0) {
        listaDePistasReveladas.appendChild(crearPista('Proxima pista', 'A los dos intentos'));
    }
    bloqueDePistasReveladas.classList.remove('oculto');
}
// Oculta todas las pistas adicionales de la partida anterior.
function reiniciarPistas() {
    listaDePistasReveladas.textContent = '';
    bloqueDePistaDeFoto.classList.add('oculto');
    bloqueDePistasReveladas.classList.add('oculto');
}
// Refresca las pistas adicionales segun la dificultad elegida por el usuario.
function actualizarPistas(secreto, intentosFallidos) {
    reiniciarPistas();
    if (dificultadActual === DIFICULTAD_FACIL) {
        actualizarPistaDeFoto(secreto, intentosFallidos);
        return;
    }
    if (dificultadActual === DIFICULTAD_MEDIA) {
        actualizarPistasReveladas(secreto, intentosFallidos);
    }
}
// Guarda la dificultad elegida y arranca una partida nueva con ese nivel.
function manejarCambioDeDificultad() {
    dificultadActual = selectorDeDificultad.value;
    guardarTexto(CLAVE_DE_LA_DIFICULTAD, dificultadActual);
    iniciarPartida();
}
// Devuelve el nombre de la dificultad actual para mostrarlo en pantalla.
function obtenerNombreDeLaDificultad() {
    if (dificultadActual === DIFICULTAD_FACIL) {
        return 'Facil';
    }
    if (dificultadActual === DIFICULTAD_MEDIA) {
        return 'Media';
    }
    return 'Dificil';
}
// Guarda las referencias de las pistas y aplica la dificultad recordada.
function iniciarDificultad() {
    selectorDeDificultad = document.getElementById('selector-dificultad');
    bloqueDePistaDeFoto = document.getElementById('pista-foto');
    fotoDelJugadorSecreto = document.getElementById('foto-secreta');
    bloqueDePistasReveladas = document.getElementById('pista-cualidades');
    listaDePistasReveladas = document.getElementById('lista-pistas');
    plantillaDePista = document.getElementById('plantilla-pista');
    dificultadActual = leerTexto(CLAVE_DE_LA_DIFICULTAD, DIFICULTAD_FACIL);
    selectorDeDificultad.value = dificultadActual;
    selectorDeDificultad.addEventListener('change', manejarCambioDeDificultad);
}
