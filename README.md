# Futbolle

Juego de adivinanza de jugadores de futbol al estilo Wordle, desarrollado como Proyecto Final Individual de la materia Desarrollo y Arquitecturas Web 2026 (UAI).

## Demo

El proyecto esta publicado en GitHub Pages: **https://scopee1.github.io/Proyecto-Final-DAW/**

## Como se juega

1. Al abrir la pagina se pide un nombre de usuario de al menos tres letras.
2. El juego solicita un jugador secreto aleatorio al endpoint de la catedra.
3. El usuario escribe nombres en el buscador y elige uno de la lista de autocompletado.
4. Cada intento devuelve pistas visuales comparando seis atributos contra el jugador secreto.
5. Gana quien acierta el nombre dentro de los ocho intentos. Si se agotan, se revela el jugador secreto.

## Pistas de cada intento

| Atributo | Pista |
| --- | --- |
| Nacionalidad | Verde si coincide, rojo si no |
| Club | Verde si coincide, rojo si no |
| Posicion | Verde si coincide, rojo si no |
| Edad | Verde si coincide, flecha hacia arriba o abajo segun el jugador secreto |
| Overall | Verde si coincide, flecha hacia arriba o abajo segun el jugador secreto |
| Altura | Verde si coincide, flecha hacia arriba o abajo segun el jugador secreto |

## Niveles de dificultad

| Nivel | Pistas adicionales |
| --- | --- |
| Facil | Foto del jugador secreto desenfocada, que se aclara con cada intento fallido |
| Media | Sin foto. Se revelan altura, edad y overall a los dos, cuatro y seis intentos |
| Dificil | Sin pistas adicionales, solo el feedback de los intentos cargados |

## Sistema de puntuacion

- Puntaje base segun dificultad: 100 en facil, 150 en media y 200 en dificil.
- Se restan 10 puntos por cada intento usado ademas del primero.
- Bonus por tiempo: 20 puntos si se gana en menos de 60 segundos y 10 puntos si se gana en menos de 120 segundos.
- El puntaje minimo de una partida ganada es 10 y el de una partida perdida es 0.

## Funcionalidades

- Jugador secreto aleatorio pedido al endpoint al iniciar cada partida.
- Buscador con autocompletado dinamico alimentado por el endpoint.
- Tablero de intentos generado con JavaScript, con colores y flechas por atributo.
- Validacion de intentos vacios, repetidos y de nombres que no existen en el listado.
- Contador de intentos restantes y temporizador desde el primer intento.
- Reinicio de partida sin recargar la pagina.
- Modales para errores de red, resultado de la partida e historial. El juego no usa alert.
- Modo claro y modo oscuro, recordados entre visitas.
- Sonidos generados con la Web Audio API al acertar atributos, ganar o perder.
- Historial de partidas en LocalStorage, ordenable por fecha o por cantidad de intentos.
- Pagina de contacto con validaciones en JavaScript que abre el cliente de correo del sistema.

## Tecnologias

- HTML5
- CSS3, maquetado unicamente con Flexbox
- JavaScript ES5 en modo estricto, sin librerias ni frameworks

## Endpoints de la catedra

Toda la comunicacion se hace con `fetch`. El dataset nunca se guarda dentro del proyecto.

- `GET https://futbolle-daw-uai-2026.onrender.com/api/players/random` devuelve el jugador secreto de cada partida.
- `GET https://futbolle-daw-uai-2026.onrender.com/api/players/search?q=&limit=8` alimenta el autocompletado.

## Estructura del proyecto

```
.
├── index.html                 Pantalla del juego
├── contacto.html              Formulario de contacto
├── css
│   ├── reset.css              Normalizacion de estilos entre navegadores
│   ├── base.css               Variables, paleta, cabecera, contenido y pie
│   ├── formularios.css        Campos, etiquetas y mensajes de validacion
│   ├── modales.css            Ventanas modales
│   ├── juego.css              Panel, buscador, pistas y tablero de intentos
│   ├── historial.css          Tabla del historial de partidas
│   └── contacto.css           Formulario de contacto
└── js
    ├── almacenamiento.js      Lectura y escritura en LocalStorage
    ├── tema.js                Modo claro y modo oscuro
    ├── sonidos.js             Sonidos generados con la Web Audio API
    ├── servicio-jugadores.js  Llamadas con fetch al endpoint
    ├── modales.js             Apertura y cierre de modales
    ├── autocompletado.js      Buscador con sugerencias dinamicas
    ├── tablero.js             Comparacion de atributos y dibujado de filas
    ├── temporizador.js        Cronometro de la partida
    ├── dificultad.js          Niveles de dificultad y pistas adicionales
    ├── puntuacion.js          Calculo del puntaje
    ├── historial.js           Historial de partidas y su ordenamiento
    ├── juego.js               Estado y reglas de la partida
    ├── contacto.js            Validaciones del formulario de contacto
    ├── principal.js           Inicializador de la pantalla del juego
    └── principal-contacto.js  Inicializador de la pagina de contacto
```

## Convenciones de codigo

- Todo el proyecto esta escrito en espanol, tanto los identificadores como los textos.
- Archivos, carpetas, clases e identificadores de CSS y HTML en kebab case.
- Variables y funciones de JavaScript en camel case, constantes de modulo en mayusculas.
- Comillas simples en JavaScript y punto y coma al final de cada sentencia.
- Solo funciones nominadas, comparaciones con `===` y `!==`, sin sintaxis de ES6.
- Colores en hexadecimal, maquetado con Flexbox y media queries al final de cada hoja.
- Sin estilos ni JavaScript en linea, sin lineas en blanco y sin comentarios innecesarios.

## Como ejecutarlo localmente

El proyecto no necesita compilarse ni instalar dependencias, pero conviene servirlo por HTTP para que las llamadas al endpoint funcionen sin restricciones del navegador.

```
npx serve .
```

Tambien se puede abrir `index.html` directamente con la extension Live Server de Visual Studio Code.

## Autor

Agostino Scopetta &mdash; Desarrollo y Arquitecturas Web 2026, Universidad Abierta Interamericana.
