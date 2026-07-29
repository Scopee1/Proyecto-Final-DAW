'use strict';
var CLAVE_DEL_HISTORIAL = 'futbolle-historial';
var ORDEN_POR_FECHA = 'fecha';
var ORDEN_POR_INTENTOS = 'intentos';
var RESULTADO_GANADO = 'Gano';
var RESULTADO_PERDIDO = 'Perdio';
var partidasGuardadas = [];
var ordenDelHistorial = ORDEN_POR_FECHA;
var capaModalDeHistorial = null;
var filasDelHistorial = null;
var avisoDeHistorialVacio = null;
var selectorDeOrden = null;
var botonAbrirHistorial = null;
var botonCerrarHistorial = null;
var botonBorrarHistorial = null;
var plantillaDePartida = null;
// Devuelve la marca de tiempo recibida con formato de dia, mes, año y hora.
function formatearFechaYHora(marcaDeTiempo) {
    var fecha = new Date(marcaDeTiempo);
    var dia = completarConCero(fecha.getDate()) + '/' + completarConCero(fecha.getMonth() + 1) + '/' + fecha.getFullYear();
    return dia + ' ' + completarConCero(fecha.getHours()) + ':' + completarConCero(fecha.getMinutes());
}
// Compara dos partidas para ordenarlas de la mas reciente a la mas antigua.
function compararPorFecha(primera, segunda) {
    return segunda.marcaDeTiempo - primera.marcaDeTiempo;
}
// Compara dos partidas para ordenarlas por cantidad de intentos de menor a mayor.
function compararPorIntentos(primera, segunda) {
    return primera.intentos - segunda.intentos;
}
// Devuelve una copia de las partidas guardadas con el orden elegido por el usuario.
function ordenarPartidas() {
    var copiaDeLasPartidas = partidasGuardadas.slice();
    if (ordenDelHistorial === ORDEN_POR_INTENTOS) {
        return copiaDeLasPartidas.sort(compararPorIntentos);
    }
    return copiaDeLasPartidas.sort(compararPorFecha);
}
// Arma una fila del historial clonando la plantilla escrita en el HTML.
function crearFilaDeHistorial(partida) {
    var fila = plantillaDePartida.content.firstElementChild.cloneNode(true);
    var celdas = fila.querySelectorAll('.celda-historial');
    celdas[0].textContent = partida.jugador;
    celdas[1].textContent = partida.resultado;
    celdas[2].textContent = partida.intentos;
    celdas[3].textContent = formatearDuracion(partida.duracion);
    celdas[4].textContent = partida.puntaje;
    celdas[5].textContent = formatearFechaYHora(partida.marcaDeTiempo);
    if (partida.resultado === RESULTADO_GANADO) {
        celdas[1].classList.add('celda-ganada');
        return fila;
    }
    celdas[1].classList.add('celda-perdida');
    return fila;
}
// Dibuja en el modal las partidas guardadas segun el orden elegido.
function dibujarHistorial() {
    var partidasOrdenadas = ordenarPartidas();
    var posicion = 0;
    filasDelHistorial.textContent = '';
    if (partidasOrdenadas.length === 0) {
        avisoDeHistorialVacio.classList.remove('oculto');
        return;
    }
    avisoDeHistorialVacio.classList.add('oculto');
    for (posicion = 0; posicion < partidasOrdenadas.length; posicion = posicion + 1) {
        filasDelHistorial.appendChild(crearFilaDeHistorial(partidasOrdenadas[posicion]));
    }
}
// Guarda en el almacenamiento local el resultado de la partida que acaba de terminar.
function guardarPartida(jugador, gano, intentos, duracion, puntaje) {
    var resultado = RESULTADO_PERDIDO;
    if (gano === true) {
        resultado = RESULTADO_GANADO;
    }
    partidasGuardadas.push({
        jugador: jugador,
        resultado: resultado,
        intentos: intentos,
        duracion: duracion,
        puntaje: puntaje,
        marcaDeTiempo: Date.now()
    });
    guardarObjeto(CLAVE_DEL_HISTORIAL, partidasGuardadas);
}
// Cambia el criterio de orden del historial y vuelve a dibujar la lista.
function manejarCambioDeOrden() {
    ordenDelHistorial = selectorDeOrden.value;
    dibujarHistorial();
}
// Abre el modal del historial con las partidas ya dibujadas.
function manejarAperturaDelHistorial() {
    dibujarHistorial();
    abrirModal(capaModalDeHistorial);
}
// Cierra el modal del historial.
function manejarCierreDelHistorial() {
    cerrarModal(capaModalDeHistorial);
}
// Borra todas las partidas guardadas y actualiza la lista en pantalla.
function manejarBorradoDelHistorial() {
    partidasGuardadas = [];
    guardarObjeto(CLAVE_DEL_HISTORIAL, partidasGuardadas);
    dibujarHistorial();
}
// Guarda las referencias del historial, recupera las partidas y activa sus eventos.
function iniciarHistorial() {
    capaModalDeHistorial = document.getElementById('modal-historial');
    filasDelHistorial = document.getElementById('filas-historial');
    avisoDeHistorialVacio = document.getElementById('historial-vacio');
    selectorDeOrden = document.getElementById('selector-orden');
    botonAbrirHistorial = document.getElementById('boton-historial');
    botonCerrarHistorial = document.getElementById('boton-cerrar-historial');
    botonBorrarHistorial = document.getElementById('boton-borrar-historial');
    plantillaDePartida = document.getElementById('plantilla-partida');
    partidasGuardadas = leerObjeto(CLAVE_DEL_HISTORIAL, []);
    selectorDeOrden.addEventListener('change', manejarCambioDeOrden);
    botonAbrirHistorial.addEventListener('click', manejarAperturaDelHistorial);
    botonCerrarHistorial.addEventListener('click', manejarCierreDelHistorial);
    botonBorrarHistorial.addEventListener('click', manejarBorradoDelHistorial);
}
