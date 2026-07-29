'use strict';
var CORREO_DE_DESTINO = 'scopettaagostino@gmail.com';
var MINIMO_DE_CARACTERES_DEL_MENSAJE = 5;
var EXPRESION_DE_NOMBRE = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ ]+$/;
var EXPRESION_DE_CORREO = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
var formularioDeContacto = null;
var entradaDeNombre = null;
var entradaDeCorreo = null;
var entradaDeMensaje = null;
var errorDeNombre = null;
var errorDeCorreo = null;
var errorDeMensaje = null;
var capaModalDeEnvio = null;
var botonCerrarModalDeEnvio = null;
// Muestra el mensaje de validacion indicado en el parrafo recibido.
function mostrarErrorDelCampo(parrafo, mensaje) {
    parrafo.textContent = mensaje;
    parrafo.classList.remove('oculto');
}
// Oculta el mensaje de validacion del parrafo recibido.
function ocultarErrorDelCampo(parrafo) {
    parrafo.textContent = '';
    parrafo.classList.add('oculto');
}
// Valida que el nombre no este vacio y que sea alfanumerico.
function validarNombre(nombre) {
    if (nombre === '') {
        mostrarErrorDelCampo(errorDeNombre, 'Ingresa tu nombre.');
        return false;
    }
    if (EXPRESION_DE_NOMBRE.test(nombre) !== true) {
        mostrarErrorDelCampo(errorDeNombre, 'El nombre solo admite letras, numeros y espacios.');
        return false;
    }
    ocultarErrorDelCampo(errorDeNombre);
    return true;
}
// Valida que el correo tenga un formato de direccion valido.
function validarCorreo(correo) {
    if (correo === '') {
        mostrarErrorDelCampo(errorDeCorreo, 'Ingresa tu correo electronico.');
        return false;
    }
    if (EXPRESION_DE_CORREO.test(correo) !== true) {
        mostrarErrorDelCampo(errorDeCorreo, 'El correo no tiene un formato valido.');
        return false;
    }
    ocultarErrorDelCampo(errorDeCorreo);
    return true;
}
// Valida que el mensaje supere la cantidad minima de caracteres exigida.
function validarMensaje(mensaje) {
    if (mensaje.length <= MINIMO_DE_CARACTERES_DEL_MENSAJE) {
        mostrarErrorDelCampo(errorDeMensaje, 'El mensaje debe tener mas de cinco caracteres.');
        return false;
    }
    ocultarErrorDelCampo(errorDeMensaje);
    return true;
}
// Arma la direccion mailto con el asunto y el cuerpo del mensaje del usuario.
function armarDireccionDeCorreo(nombre, correo, mensaje) {
    var asunto = encodeURIComponent('Consulta desde Futbolle de ' + nombre);
    var cuerpo = encodeURIComponent(mensaje + '\n\nNombre: ' + nombre + '\nCorreo: ' + correo);
    return 'mailto:' + CORREO_DE_DESTINO + '?subject=' + asunto + '&body=' + cuerpo;
}
// Cierra el aviso que confirma la apertura de la aplicacion de correo.
function manejarCierreDelModalDeEnvio() {
    cerrarModal(capaModalDeEnvio);
}
// Valida el formulario y, si esta correcto, abre la aplicacion de correo del sistema.
function manejarEnvioDelFormulario(evento) {
    var nombre = entradaDeNombre.value.trim();
    var correo = entradaDeCorreo.value.trim();
    var mensaje = entradaDeMensaje.value.trim();
    var nombreValido = validarNombre(nombre);
    var correoValido = validarCorreo(correo);
    var mensajeValido = validarMensaje(mensaje);
    evento.preventDefault();
    if (nombreValido !== true || correoValido !== true || mensajeValido !== true) {
        return;
    }
    window.location.href = armarDireccionDeCorreo(nombre, correo, mensaje);
    abrirModal(capaModalDeEnvio);
    formularioDeContacto.reset();
}
// Guarda las referencias del formulario de contacto y activa sus eventos.
function iniciarContacto() {
    formularioDeContacto = document.getElementById('formulario-contacto');
    entradaDeNombre = document.getElementById('entrada-nombre');
    entradaDeCorreo = document.getElementById('entrada-correo');
    entradaDeMensaje = document.getElementById('entrada-mensaje');
    errorDeNombre = document.getElementById('error-nombre');
    errorDeCorreo = document.getElementById('error-correo');
    errorDeMensaje = document.getElementById('error-mensaje');
    capaModalDeEnvio = document.getElementById('modal-envio');
    botonCerrarModalDeEnvio = document.getElementById('boton-cerrar-envio');
    formularioDeContacto.addEventListener('submit', manejarEnvioDelFormulario);
    botonCerrarModalDeEnvio.addEventListener('click', manejarCierreDelModalDeEnvio);
}
