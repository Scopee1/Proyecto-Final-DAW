'use strict';
// Indica si el navegador permite usar el almacenamiento local.
function hayAlmacenamientoDisponible() {
    return typeof window.localStorage !== 'undefined' && window.localStorage !== null;
}
// Guarda un texto en el almacenamiento local bajo la clave indicada.
function guardarTexto(clave, texto) {
    if (hayAlmacenamientoDisponible() !== true) {
        return;
    }
    window.localStorage.setItem(clave, texto);
}
// Devuelve el texto guardado en la clave indicada o el valor por defecto.
function leerTexto(clave, valorPorDefecto) {
    var texto = null;
    if (hayAlmacenamientoDisponible() !== true) {
        return valorPorDefecto;
    }
    texto = window.localStorage.getItem(clave);
    if (texto === null) {
        return valorPorDefecto;
    }
    return texto;
}
// Guarda un objeto en el almacenamiento local convirtiendolo a texto JSON.
function guardarObjeto(clave, objeto) {
    guardarTexto(clave, JSON.stringify(objeto));
}
// Devuelve el objeto guardado en la clave indicada o el valor por defecto.
function leerObjeto(clave, valorPorDefecto) {
    var texto = leerTexto(clave, null);
    if (texto === null) {
        return valorPorDefecto;
    }
    try {
        return JSON.parse(texto);
    } catch (error) {
        return valorPorDefecto;
    }
}
