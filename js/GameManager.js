//#region Configuración inical
// Configuración inicial
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Referencia al botón de inicio
const startButton = document.getElementById('startButton');

// Variables del juego
const gravity = 0.02; // Reducir la gravedad para un descenso más lento
const thrust = -0.15; // Aumentar el impulso para un ascenso más rápido
let isGameOver = false;

// Variables para mensajes
let message = '';
let showRestartButton = false;

const lander = {
    x: canvas.width / 2,
    y: 100,
    width: 20,
    height: 30,
    velocityX: 0,
    velocityY: 0,
    fuel: 100,
    rotationAngle: 0, // Mover aquí el ángulo de rotación
};
const landingZone = {
    x: Math.random() * (canvas.width - 100), // Posición aleatoria horizontal
    y: canvas.height - 20,
    width: 100,
    height: 20,
};

// Variables para partículas de explosión
let isThrusting = false;

// Almacenar puntos del suelo
let groundPoints = [];

// Variables para la música
let isMusicPlaying = true;
let musicInterval;

// Notas de la canción (frecuencia en Hz y duración en ms)
/*
Relación de notas con frequencia:
octaba 3 -> DO  C3=130.81,RE D3=146.83,MI E3=164.81,FA F3=174.61,SOL G3=196,LA  A3=220,SI  B3=246.94
octaba 4 -> DO  C4=261.63,RE D4=293.66,MI E4=329.63,FA F4=349.23,SOL G4=392,LA  A4=440,SI  B4=493.88
octaba 5 -> DO  C5=523.25,RE D5=587.33,MI E5=659.25,FA F5=698.46,SOL G5=784,LA  A5=880,SI  B5=987.77
silencio -> 0
*/


const N = {  //Notas por octava y silencios
    c3: { freq: 130.81, duration: 400 }, d3: { freq: 146.83, duration: 400 }, e3: { freq: 164.81, duration: 400 }, f3: { freq: 174.61, duration: 400 }, g3: { freq: 196, duration: 400 }, a3: { freq: 220, duration: 400 }, b3: { freq: 246.94, duration: 400 },
    c4: { freq: 261.63, duration: 400 }, d4: { freq: 293.66, duration: 400 }, e4: { freq: 329.63, duration: 400 }, f4: { freq: 349.23, duration: 400 }, g4: { freq: 392, duration: 400 }, a4: { freq: 440, duration: 400 }, b4: { freq: 493.88, duration: 400 },
    c5: { freq: 523.25, duration: 400 }, d5: { freq: 587.33, duration: 400 }, e5: { freq: 659.25, duration: 400 }, f5: { freq: 698.46, duration: 400 }, g5: { freq: 784, duration: 400 }, a5: { freq: 880, duration: 400 }, b5: { freq: 987.77, duration: 400 },
    c3s: { freq: 138.59, duration: 400 }, d3s: { freq: 155.56, duration: 400 }, f3s: { freq: 185.00, duration: 400 }, g3s: { freq: 207.65, duration: 400 }, a3s: { freq: 233.08, duration: 400 },
    c4s: { freq: 277.18, duration: 400 }, d4s: { freq: 311.13, duration: 400 }, f4s: { freq: 369.99, duration: 400 }, g4s: { freq: 415.30, duration: 400 }, a4s: { freq: 466.16, duration: 400 },
    c5s: { freq: 554.37, duration: 400 }, d5s: { freq: 622.25, duration: 400 }, f5s: { freq: 739.99, duration: 400 }, g5s: { freq: 830.61, duration: 400 }, a5s: { freq: 932.33, duration: 400 },
    s0: { freq: 0, duration: 50 }, s1: { freq: 0, duration: 100 }, s2: { freq: 0, duration: 200 }, s3: { freq: 0, duration: 400 }, s4: { freq: 0, duration: 800 }, s5: { freq: 0, duration: 1600 },

};

//Danubio Azul (octaba 4)
/*
Versión corregida:
do do mi sol sol s2 sol s0 sol s2 mi s0 mi s1
do do mi sol sol s2 sol s0 sol s2 fa s0 fa s1
re re fa la la s2 fa s0 fa s2 re s0 re s1
re re fa la la s1 mi5 mi5 s0 do5 do5 s1
do do mi sol do5 s1 sol4 sol4 s0 mi5 mi5 s1
do do mi sol do5 s1 la4 la4 s0 fa5 fa5 s1
re re fa la la s3 sol sol mi5 s1
do5 mi mi s1 re la s1 sol do5 s0 mi mi mi s3
*/

const songNotes = [
    N.s4,
    N.c4, N.c4, N.e4, N.g4, N.g4, N.s2, N.g4, N.s0, N.g4, N.s2, N.e4, N.s0, N.e4, N.s1,
    N.c4, N.c4, N.e4, N.g4, N.g4, N.s2, N.g4, N.s0, N.g4, N.s2, N.f4, N.s0, N.f4, N.s1,
    N.d4, N.d4, N.f4, N.a4, N.a4, N.s2, N.f4, N.s0, N.f4, N.s2, N.d4, N.s0, N.d4, N.s1,
    N.d4, N.d4, N.f4, N.a4, N.a4, N.s1, N.e5, N.e5, N.s0, N.c5, N.c5, N.s1,
    N.c4, N.c4, N.e4, N.g4, N.c5, N.s1, N.g4, N.g4, N.s0, N.e5, N.e5, N.s1,
    N.c4, N.c4, N.e4, N.g4, N.c5, N.s1, N.a4, N.a4, N.s0, N.f5, N.f5, N.s1,
    N.d4, N.d4, N.f4, N.a4, N.a4, N.s3, N.g4, N.g4, N.e5, N.s1,
    N.c5, N.e4, N.e4, N.s1, N.d4, N.a4, N.s1, N.g4, N.c5, N.s0, N.e4, N.e4, N.e4, N.s3,
];

const song = songNotes.map(note => { return { freq: note.freq, duration: note.duration }; }
);


// Dimensiones y posición del botón de música
const musicButton = {
    x: canvas.width - 110,
    y: 10,
    width: 100,
    height: 40,
};

// Almacenar partículas de la explosión
let explosionParticles = [];

// Hacer que el canvas sea enfocable
canvas.setAttribute('tabindex', '0');

//#endregion

//#region Funciones de utilidad 
// Generar suelo con montañas
/**
     * Genera un terreno representado por puntos en un lienzo.
     *
     *    1.- Inicializa un arreglo vacío para almacenar los puntos del terreno.
     *    2.- Comienza desde el borde izquierdo del lienzo y avanza en segmentos horizontales.
     *    3.- Para cada segmento, calcula una altura aleatoria para un pico y su posición en el eje X.
     *    4.- Agrega dos puntos al arreglo: uno para el pico y otro para la base del segmento.
     *    5.- Continúa hasta cubrir todo el ancho del lienzo.
     *
     * @global
     * @throws {ReferenceError} Si `canvas` o `groundPoints` no están definidos en el contexto global.
     * @example
     *   Ejemplo de uso:
     *   generateGround();
     *   // Después de ejecutar, `groundPoints` contendrá un conjunto de puntos que representan el terreno.
     */
function generateGround() {
    groundPoints = [];
    let currentX = 0;
    while (currentX < canvas.width) {
        const peakHeight = Math.random() * 50 + 15; // Altura aleatoria de los picos
        const segmentWidth = Math.random() * 50 + 80; // Ancho aleatorio de los segmentos
        groundPoints.push({
            x: currentX + segmentWidth / 2,
            y: canvas.height - peakHeight,
        });
        groundPoints.push({
            x: currentX + segmentWidth,
            y: canvas.height,
        });
        currentX += segmentWidth;
    }
}
//#endregion

//#region funciones para el Audio
// Función para reproducir una nota
function playBeep(freq, duration) {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);
    oscillator.connect(audioCtx.destination);
    oscillator.start();
    setTimeout(() => {
        oscillator.stop();
        audioCtx.close();
    }, duration);
}

// Función para reproducir la canción
function playSong() {
    let index = 0;

    function playNextNote() {

        if (index >= song.length) {
            index = 0; // Reiniciar la canción
        }

        const note = song[index];
        playBeep(note.freq, note.duration);
        index++;

        // Programar la siguiente nota después de la duración actual
        musicInterval = setTimeout(playNextNote, note.duration);
    }

    if (isMusicPlaying) playNextNote(); // Iniciar la reproducción
}

// Función para detener la canción
function stopSong() {
    clearInterval(musicInterval);
}

// Método para alternar la música
function toggleMusic() {
    if (isMusicPlaying) {
        isMusicPlaying = false;
        stopSong();
    } else {
        isMusicPlaying = true;
        playSong();
    }
    draw(); // Redibujar para actualizar el estado del botón inmediatamente
}

/**
 * Reproduce un sonido de explosión.
 *
 *    1.- Genera múltiples tonos descendentes para simular una explosión.
 *    2.- Utiliza la función `playBeep` para reproducir cada tono.
 *
 * @returns {void} No retorna ningún valor.
 */
function playExplosionSound() {
    const explosionTones = [
        { freq: 400, duration: 100 },
        { freq: 300, duration: 100 },
        { freq: 200, duration: 100 },
        { freq: 100, duration: 100 },
    ];

    let delay = 0;
    explosionTones.forEach(tone => {
        setTimeout(() => playBeep(tone.freq, tone.duration), delay);
        delay += tone.duration;
    });
}

//#endregion

//#region Gestión de eventos de teclado

// Manejo de controles
window.addEventListener('keydown', /**
    * Maneja los eventos de pulsación de teclas para controlar un objeto "lander".
    *
    * Flujos de ejecución:
    *    1.- Registra la tecla presionada en la consola para propósitos de depuración.
    *    2.- Si la tecla presionada es 'ArrowUp' y el "lander" tiene combustible, activa el empuje.
    *    3.- Si la tecla presionada es 'ArrowRight', rota el "lander" en sentido horario.
    *    4.- Si la tecla presionada es 'ArrowLeft', rota el "lander" en sentido antihorario.
    *
    * @param {KeyboardEvent} e Evento de teclado que contiene información sobre la tecla presionada.
    * @returns {void} No retorna ningún valor.
    * @throws {Error} Si el objeto "lander" no está definido o no tiene las propiedades necesarias.
    * @example
    *   Ejemplo de uso:
    * document.addEventListener('keydown', (e) => {
    *     manejarTeclaPresionada(e);
    * });
    */
    (e) => {
        console.log(`Key down: ${e.code}`); // Depuración
        if (e.code === 'ArrowUp' && lander.fuel > 0) { // Cambiar de 'Space' a 'ArrowUp'
            isThrusting = true;
        } else if (e.code === 'ArrowRight') { // Rotar en sentido horario
            lander.rotationAngle += 5; // Actualizar propiedad en lander
        } else if (e.code === 'ArrowLeft') { // Rotar en sentido antihorario
            lander.rotationAngle -= 5; // Actualizar propiedad en lander
        } else if (e.code === 'KeyS') {
            toggleMusic(); // Usar el nuevo método
        }
    });
window.addEventListener('keyup', /**
    * Maneja el evento de liberación de una tecla (keyup).
    *
    *    1.- Registra en la consola el código de la tecla liberada para propósitos de depuración.
    *    2.- Verifica si la tecla liberada es la flecha hacia arriba ('ArrowUp').
    *    3.- Si la tecla es 'ArrowUp', desactiva el estado de propulsión estableciendo `isThrusting` en `false`.
    *
    * @param {KeyboardEvent} e El evento de teclado que contiene información sobre la tecla liberada.
    *    - `e.code`: Representa el código de la tecla liberada.
    * @returns {void} No retorna ningún valor.
    * @throws {Error} Si el objeto del evento `e` no contiene la propiedad `code`.
    * @example
    *   Ejemplo de uso:
    * document.addEventListener('keyup', (e) => {
    *     // Llama a esta función cuando se libera una tecla
    * });
    */
    (e) => {
        console.log(`Key up: ${e.code}`); // Depuración
        if (e.code === 'ArrowUp') { // Cambiar de 'Space' a 'ArrowUp'
            isThrusting = false;
        }
    });

// Manejar clics en el botón de música
canvas.addEventListener('mouseup', (e) => {
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    if (
        clickX > musicButton.x &&
        clickX < musicButton.x + musicButton.width &&
        clickY > musicButton.y &&
        clickY < musicButton.y + musicButton.height
    ) {
        toggleMusic(); // Invocar toggleMusic al hacer clic
    }
});

// Manejar toques en el botón de música
canvas.addEventListener('touchend', (e) => {
    const rect = canvas.getBoundingClientRect();
    const touchX = e.touches[0].clientX - rect.left;
    const touchY = e.touches[0].clientY - rect.top;

    if (
        touchX > musicButton.x &&
        touchX < musicButton.x + musicButton.width &&
        touchY > musicButton.y &&
        touchY < musicButton.y + musicButton.height
    ) {
        toggleMusic(); // Usar el nuevo método
    }
});
//#endregion

//#region Eventos de ratón y táctiles
// Función para manejar clics o toques en el canvas
function handleInputEvent(eventType, x, y) {
    const rect = canvas.getBoundingClientRect();
    const inputX = x - rect.left;
    const inputY = y - rect.top;

    if (
        inputX > musicButton.x &&
        inputX < musicButton.x + musicButton.width &&
        inputY > musicButton.y &&
        inputY < musicButton.y + musicButton.height
    ) {
        toggleMusic(); // Gestionar botón de música
    } else if (eventType === 'start') {
        if (inputY < lander.y && lander.fuel > 0) {
            activateThrust(); // Gestionar impulso
        } else if (inputX > lander.x) {
            rotateLander(5); // Rotar en sentido horario
        } else if (inputX < lander.x) {
            rotateLander(-5); // Rotar en sentido antihorario
        }
    } else if (eventType === 'end') {
        deactivateThrust(); // Detener impulso
    }
}


// Verificar clics en el canvas
canvas.addEventListener('click', /**
    * Maneja el evento de clic para reiniciar el juego si el botón de reinicio está visible.
    *
    * Detalles del flujo de ejecución:
    *  1. Verifica si el botón de reinicio está habilitado (`showRestartButton`).
    *  2. Obtiene las coordenadas del clic del usuario en relación con el lienzo (`canvas`).
    *  3. Calcula si las coordenadas del clic están dentro del área del botón de reinicio.
    *  4. Si el clic está dentro del área del botón, llama a la función `restartGame` para reiniciar el juego.
    *
    * @param {MouseEvent} e El evento de clic del ratón que contiene las coordenadas del clic.
    * @throws {Error} Si el lienzo (`canvas`) no está definido o no tiene un rectángulo delimitador válido.
    * @example
    * // Ejemplo de uso:
    * canvas.addEventListener('click', handleRestartClick);
    * 
    * function handleRestartClick(e) {
    *   // Lógica del evento de clic para reiniciar el juego.
    * }
    */
    (e) => {
        if (showRestartButton) {
            const rect = canvas.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const clickY = e.clientY - rect.top;

            if (
                clickX > canvas.width / 2 - 50 &&
                clickX < canvas.width / 2 + 50 &&
                clickY > canvas.height / 2 + 30 &&
                clickY < canvas.height / 2 + 70
            ) {
                restartGame();
            }
        }
    });

// Asegurar que el canvas capture el foco al hacer clic
canvas.addEventListener('click', /**
    * Establece el foco en un elemento de tipo canvas.
    *
    * @details
    *    1.- Llama al método `focus()` del objeto `canvas` para que el elemento reciba el foco.
    *    2.- Este método es útil para garantizar que el usuario pueda interactuar directamente con el canvas, 
    *        como en aplicaciones gráficas o juegos.
    *
    * @throws {ReferenceError} Si el objeto `canvas` no está definido o no es accesible.
    * @example
    *   Ejemplo de uso:
    *   // Asegúrate de que el elemento canvas esté definido en el DOM:
    *   const canvas = document.getElementById('miCanvas');
    *   canvas.focus(); // El foco se establece en el canvas.
    */
    () => {
        canvas.focus();
    });


// Asignar evento al botón
startButton.addEventListener('click', startGame);

//#endregion

//#region Funciones de control del player
// Función para activar el impulso
function activateThrust() {
    isThrusting = true;
}

// Función para desactivar el impulso
function deactivateThrust() {
    isThrusting = false;
}

// Función para rotar el módulo
function rotateLander(angle) {
    lander.rotationAngle += angle;
}

// Unificar eventos de mouse
canvas.addEventListener('mousedown', (e) => handleInputEvent('start', e.clientX, e.clientY));
canvas.addEventListener('mouseup', (e) => handleInputEvent('end', e.clientX, e.clientY));

// Unificar eventos táctiles
canvas.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    handleInputEvent('start', touch.clientX, touch.clientY);
});
canvas.addEventListener('touchend', (e) => {
    const touch = e.changedTouches[0];
    handleInputEvent('end', touch.clientX, touch.clientY);
});
//#endregion

//#region Funciones de dibujo

// Dibujar suelo con montañas
/**
     * Dibuja el terreno en un lienzo HTML5.
     *
     * @details
     *    1.- Inicia un nuevo camino de dibujo en el contexto del lienzo.
     *    2.- Comienza desde la esquina inferior izquierda del lienzo.
     *    3.- Traza líneas hacia cada punto definido en el arreglo `groundPoints`.
     *    4.- Cierra el camino asegurándose de conectar con el borde derecho del lienzo.
     *    5.- Rellena el área cerrada con un color marrón para representar el terreno.
     *
     * @param {CanvasRenderingContext2D} ctx Contexto del lienzo donde se dibujará el terreno.
     * @param {HTMLCanvasElement} canvas Elemento del lienzo que define el área de dibujo.
     * @param {Array<{x: number, y: number}>} groundPoints Arreglo de puntos que define la forma del terreno.
     *    - `x`: Coordenada horizontal del punto.
     *    - `y`: Coordenada vertical del punto.
     *
     * @returns {void} No retorna ningún valor.
     *
     * @throws {Error} Si alguno de los parámetros no está definido o no es válido.
     *
     * @example
     * // Ejemplo de uso:
     * const canvas = document.getElementById('miCanvas');
     * const ctx = canvas.getContext('2d');
     * const groundPoints = [{ x: 50, y: 300 }, { x: 150, y: 250 }, { x: 250, y: 300 }];
     * drawGround(ctx, canvas, groundPoints);
     */
function drawGround() {
    ctx.beginPath();
    ctx.moveTo(0, canvas.height); // Iniciar desde la esquina inferior izquierda
    for (const point of groundPoints) {
        ctx.lineTo(point.x, point.y);
    }
    ctx.lineTo(canvas.width, canvas.height); // Asegurar que se cierre al borde derecho
    ctx.closePath();
    ctx.fillStyle = 'brown';
    ctx.fill();
}

/**
     * Dibuja la base de la zona de aterrizaje en el lienzo.
     *
     *    1.- Configura el color de relleno del contexto del lienzo a verde.
     *    2.- Dibuja un rectángulo que representa la zona de aterrizaje utilizando las coordenadas y dimensiones especificadas.
     *
     * @param {CanvasRenderingContext2D} ctx Contexto del lienzo donde se dibujará la zona de aterrizaje.
     * @param {Object} landingZone Objeto que define las propiedades de la zona de aterrizaje.
     * @param {number} landingZone.x Coordenada X de la esquina superior izquierda de la zona de aterrizaje.
     * @param {number} landingZone.y Coordenada Y de la esquina superior izquierda de la zona de aterrizaje.
     * @param {number} landingZone.width Ancho del rectángulo que representa la zona de aterrizaje.
     * @param {number} landingZone.height Altura del rectángulo que representa la zona de aterrizaje.
     * @returns {void} No retorna ningún valor.
     * @throws {TypeError} Si alguno de los parámetros no es válido o está ausente.
     * @example
     *   Ejemplo de uso:
     *   const ctx = canvas.getContext('2d');
     *   const landingZone = { x: 50, y: 300, width: 200, height: 50 };
     *   drawBase(ctx, landingZone);
     */
function drawBase() {
    // Dibujar zona de aterrizaje
    ctx.fillStyle = 'green';
    ctx.fillRect(landingZone.x, landingZone.y, landingZone.width, landingZone.height);
}

/**
     * Dibuja el módulo lunar en el contexto del lienzo.
     *
     *    1.- Guarda el estado actual del contexto del lienzo.
     *    2.- Traslada el contexto al pivote del módulo lunar basado en sus coordenadas (`lander.x`, `lander.y`).
     *    3.- Aplica una rotación al contexto según el ángulo de rotación del módulo (`lander.rotationAngle`).
     *    4.- Dibuja el cuerpo del módulo como un rectángulo blanco centrado en el pivote.
     *    5.- Dibuja un triángulo gris en la parte superior del módulo para simular una antena o detalle decorativo.
     *    6.- Si el módulo está aplicando impulso (`isThrusting`) y tiene combustible disponible (`lander.fuel > 0`), dibuja una llamarada roja debajo del módulo.
     *    7.- Restaura el estado original del contexto del lienzo.
     *
     * @param {Object} lander Objeto que representa el módulo lunar.
     * @param {number} lander.x Coordenada X del módulo lunar en el lienzo.
     * @param {number} lander.y Coordenada Y del módulo lunar en el lienzo.
     * @param {number} lander.rotationAngle Ángulo de rotación del módulo lunar en grados.
     * @param {number} lander.width Ancho del módulo lunar.
     * @param {number} lander.height Altura del módulo lunar.
     * @param {number} lander.fuel Cantidad de combustible restante del módulo lunar.
     * @param {boolean} isThrusting Indica si el módulo está aplicando impulso.
     * @returns {void} No retorna ningún valor.
     * @throws {Error} Si el contexto del lienzo (`ctx`) no está definido o no es válido.
     * @example
     * // Ejemplo de uso:
     * drawLander({
     *   x: 100,
     *   y: 200,
     *   rotationAngle: 45,
     *   width: 50,
     *   height: 30,
     *   fuel: 100
     * }, true);
     */
function drawLander() {
    ctx.save();
    ctx.translate(lander.x, lander.y); // Trasladar al pivote del módulo
    ctx.rotate((lander.rotationAngle * Math.PI) / 180); // Aplicar rotación

    // Dibujar cuerpo del módulo (rectángulo blanco)
    ctx.fillStyle = 'white';
    ctx.fillRect(
        -lander.width / 2, // Ajustar para que el pivote esté en el centro de la base
        -lander.height,    // Ajustar para que la base esté en la posición `lander.y`
        lander.width,
        lander.height
    );

    // Dibujar triángulo en la parte superior del módulo
    ctx.beginPath();
    ctx.moveTo(-lander.width / 2, -lander.height); // Esquina superior izquierda del rectángulo
    ctx.lineTo(lander.width / 2, -lander.height); // Esquina superior derecha del rectángulo
    ctx.lineTo(0, -lander.height - 10); // Punto superior del triángulo
    ctx.closePath();
    ctx.fillStyle = 'gray';
    ctx.fill();

    // Dibujar llamarada si se está aplicando impulso
    if (isThrusting && lander.fuel > 0) {
        ctx.beginPath();
        ctx.moveTo(-lander.width / 4, 0); // Punto izquierdo bajo el módulo
        ctx.lineTo(lander.width / 4, 0); // Punto derecho bajo el módulo
        ctx.lineTo(0, 10); // Punto inferior de la llamarada
        ctx.closePath();
        ctx.fillStyle = 'red';
        ctx.fill();
    }

    ctx.restore();
}

/**
     * Dibuja las etiquetas de información en el lienzo del juego.
     *
     * Detalles del flujo de ejecución:
     *  1.- Dibuja el nivel actual de combustible en la esquina superior izquierda del lienzo.
     *  2.- Dibuja la velocidad de caída actual del objeto en el eje Y, también en la esquina superior izquierda.
     *  3.- Si existe un mensaje definido, lo muestra centrado en el lienzo.
     *  4.- Si el botón de reinicio debe mostrarse, dibuja un botón interactivo con el texto "Reiniciar".
     *
     * @param {CanvasRenderingContext2D} ctx Contexto de renderizado del lienzo donde se dibujarán las etiquetas.
     * @param {Object} lander Objeto que contiene los datos del módulo lunar.
     * @param {number} lander.fuel Cantidad de combustible restante del módulo lunar.
     * @param {number} lander.velocityY Velocidad de caída actual del módulo lunar en el eje Y.
     * @param {string} [message] Mensaje opcional que se mostrará centrado en el lienzo.
     * @param {boolean} [showRestartButton=false] Indica si debe mostrarse el botón de reinicio.
     * @param {HTMLCanvasElement} canvas Elemento del lienzo donde se dibujarán las etiquetas.
     * @returns {void} No retorna ningún valor.
     * @throws {Error} Si alguno de los parámetros obligatorios no está definido o es inválido.
     * @example
     * // Ejemplo de uso:
     * drawLabels(ctx, { fuel: 50, velocityY: -2.5 }, "¡Juego terminado!", true, canvas);
     */
function drawLabels() {
    // Dibujar combustible
    ctx.fillStyle = 'yellow';
    ctx.font = '20px Arial';
    ctx.fillText(`Combustible: ${Math.max(0, Math.floor(lander.fuel))}`, 10, 20, 100);

    // Dibujar velocidad de caída actual en el eje Y
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Velocidad de caída: ${lander.velocityY.toFixed(2)}`, 10, 50, 150);

    // Dibujar título "MoonLander" en colores
    const title = "MoonLander";
    const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];
    const titleX = canvas.width / 2 - 150; // Centrar el texto
    const titleY = 50;
    ctx.font = '50px "Comic Sans MS", cursive, sans-serif';
    for (let i = 0; i < title.length; i++) {
        ctx.fillStyle = colors[i % colors.length];
        ctx.fillText(title[i], titleX + i * 30, titleY); // Espaciado entre letras
    }

    // Mostrar mensaje si existe
    if (message) {
        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.fillText(message, canvas.width / 2 - 100, canvas.height / 2);

        if (showRestartButton) {
            ctx.fillStyle = 'white';
            ctx.strokeStyle = 'blue';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(canvas.width / 2 - 50, canvas.height / 2 + 30, 100, 40, 20); // Bordes redondeados
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = 'blue';
            ctx.font = '20px "Comic Sans MS", cursive, sans-serif';
            ctx.fillText('Reiniciar', canvas.width / 2 - 35, canvas.height / 2 + 55);
        }
    }
}

// Función para dibujar el botón de música
function drawMusicButton() {
    console.log('el estado de isMusicPlaying es: ', isMusicPlaying);
    ctx.fillStyle = isMusicPlaying ? 'green' : 'red';
    ctx.fillRect(musicButton.x, musicButton.y, musicButton.width, musicButton.height);
    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.fillText(isMusicPlaying ? 'Música: ON' : 'Música: OFF', musicButton.x + 10, musicButton.y + 25);
}

// Función para dibujar el borde del canvas
function drawCanvasBorder() {
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
}

/**
 * Dibuja una explosión en el lienzo en la posición del módulo lunar.
 *
 *    1.- Dibuja múltiples círculos concéntricos con colores degradados para simular una explosión.
 *    2.- Utiliza un bucle para generar los círculos con radios crecientes.
 *    3.- La explosión se centra en las coordenadas actuales del módulo lunar.
 *
 * @param {number} x Coordenada X del centro de la explosión.
 * @param {number} y Coordenada Y del centro de la explosión.
 * @returns {void} No retorna ningún valor.
 * @example
 *   drawExplosion(lander.x, lander.y);
 */
function drawExplosion(x, y) {
    const colors = ['red', 'orange', 'yellow', 'white'];
    for (let i = 0; i < colors.length; i++) {
        ctx.beginPath();
        ctx.arc(x, y, (i + 1) * 15, 0, Math.PI * 2);
        ctx.fillStyle = colors[i];
        ctx.fill();
    }
}

/**
 * Dibuja y actualiza las partículas de la explosión.
 *
 *    1.- Recorre las partículas activas y las dibuja en el lienzo.
 *    2.- Actualiza la posición de cada partícula según su velocidad.
 *    3.- Reduce la vida de cada partícula y las elimina si su vida llega a 0.
 *
 * @returns {void} No retorna ningún valor.
 */
function drawExplosionParticles() {
    explosionParticles.forEach((particle, index) => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();

        // Actualizar posición y vida
        particle.x += particle.velocityX;
        particle.y += particle.velocityY;
        particle.life--;

        // Reducir opacidad gradualmente
        const alpha = Math.max(0, particle.life / 60);
        particle.color = particle.color.replace(/rgba\(([^,]+),([^,]+),([^,]+),[^)]+\)/, `rgba($1,$2,$3,${alpha})`);

        // Eliminar partículas sin vida
        if (particle.life <= 0) {
            explosionParticles.splice(index, 1);
        }
    });
}

/**
     * Dibuja el contenido principal de la escena en un lienzo HTML5.
     *
     * @details
     *    1.- Limpia el área completa del lienzo para preparar un nuevo dibujo.
     *    2.- Llama a las funciones auxiliares para dibujar los diferentes elementos de la escena:
     *        - `drawGround`: Dibuja el suelo.
     *        - `drawBase`: Dibuja la base.
     *        - `drawLander`: Dibuja el módulo de aterrizaje.
     *        - `drawLabels`: Dibuja las etiquetas o información adicional.
     *
     * @throws {Error} Si alguna de las funciones auxiliares (`drawGround`, `drawBase`, `drawLander`, `drawLabels`) falla o no está definida.
     * @example
     *   Ejemplo de uso:
     *   // Asumiendo que el contexto del lienzo (ctx) y el elemento canvas están definidos:
     *   draw();
     */
function draw() {
    if (!isGameOver) ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGround();
    drawBase();
    drawLander();
    drawExplosionParticles(); // Dibujar partículas de la explosión
    drawLabels();
    drawMusicButton(); // Dibujar el botón de música
    drawCanvasBorder(); // Dibujar el borde del canvas
}

//#endregion

//#region Gestión de colisiones y lógica del juego

/**
     * Muestra una cuenta regresiva en un lienzo y ejecuta una función al finalizar.
     *
     * Detalles del flujo de ejecución:
     *    1.- Inicializa un contador con el valor 3.
     *    2.- Configura un intervalo que se ejecuta cada segundo.
     *    3.- En cada iteración del intervalo:
     *        - Limpia el lienzo.
     *        - Dibuja el texto de la cuenta regresiva en el centro del lienzo.
     *        - Decrementa el contador.
     *    4.- Cuando el contador llega a un valor menor que 0:
     *        - Detiene el intervalo.
     *        - Ejecuta la función proporcionada como callback.
     *
     * @param {Function} callback Función que se ejecutará al finalizar la cuenta regresiva.
     *                            Debe ser una función válida que no reciba parámetros.
     * @returns {void} No retorna ningún valor.
     * @throws {TypeError} Si el parámetro `callback` no es una función.
     * @example
     *   Ejemplo de uso:
     * showCountdown(() => {
     *     console.log('¡Cuenta regresiva finalizada!');
     * });
     */
function showCountdown(callback) {
    let countdown = 3;
    let countdownInterval = setInterval(() => { // Cambiar const por let
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        draw(); // Asegurar que se dibujen los elementos del juego
        ctx.fillStyle = 'white';
        ctx.font = '40px Arial';
        ctx.fillText(`Comenzando en: ${countdown}`, canvas.width / 2 - 120, canvas.height / 2);
        countdown--;

        if (countdown < 0) {
            clearInterval(countdownInterval);
            isGameOver = false; // Restablecer el estado del juego
            callback(); // Ejecutar la función pasada como callback
        }
    }, 1000);
}

// Función para actualizar la posición del módulo lunar
/**
 * Genera partículas para la explosión.
 *
 *    1.- Crea múltiples partículas con posiciones iniciales en el centro de la explosión.
 *    2.- Asigna a cada partícula una dirección, velocidad y duración aleatorias.
 *    3.- Almacena las partículas en el arreglo `explosionParticles`.
 *
 * @param {number} x Coordenada X del centro de la explosión.
 * @param {number} y Coordenada Y del centro de la explosión.
 * @returns {void} No retorna ningún valor.
 */
function createExplosion(x, y) {
    explosionParticles = [];
    for (let i = 0; i < 50; i++) {
        explosionParticles.push({
            x: x,
            y: y,
            radius: Math.random() * 5 + 2, // Tamaño aleatorio
            color: `rgba(${Math.random() * 255}, ${Math.random() * 150}, 0, 1)`, // Colores cálidos
            velocityX: (Math.random() - 0.5) * 4, // Velocidad horizontal
            velocityY: (Math.random() - 0.5) * 4, // Velocidad vertical
            life: Math.random() * 60 + 30, // Duración en frames
        });
    }
}

// Función para iniciar el juego
/**
     * Verifica si el módulo aterriza correctamente en la zona de aterrizaje.
     *
     * Este método evalúa si el módulo espacial cumple con las condiciones necesarias para un aterrizaje exitoso:
     *    1.- Comprueba si el módulo está dentro de los límites de la zona de aterrizaje (coordenadas x e y).
     *    2.- Verifica si la velocidad vertical del módulo es segura para aterrizar.
     *    3.- Si ambas condiciones se cumplen, ajusta la posición del módulo y muestra un mensaje de éxito.
     *    4.- Si alguna condición falla, muestra un mensaje de colisión.
     *    5.- Marca el juego como terminado y habilita el botón de reinicio.
     *
     * @throws {Error} Si las propiedades `lander` o `landingZone` no están definidas.
     * @example
     *   Ejemplo de uso:
     *   // Supongamos que `lander` y `landingZone` están definidos en el contexto global:
     *   checkLanding();
     *   // Resultado esperado:
     *   // Si el módulo aterriza correctamente: message = '¡Aterrizaje exitoso!'
     *   // Si falla el aterrizaje: message = '¡Te has estrellado!'
     */
function checkLanding() {
    const withinLandingZone =
        lander.x > landingZone.x && // El lado izquierdo del módulo está dentro de la zona
        lander.x < landingZone.x + landingZone.width && // El lado derecho del módulo está dentro de la zona
        lander.y >= landingZone.y; // La parte inferior del módulo toca la zona de aterrizaje

    const safeSpeed = lander.velocityY < 1;

    if (withinLandingZone && safeSpeed) {
        lander.y = landingZone.y; // Ajustar la posición para que esté justo en la zona de aterrizaje
        message = '¡Aterrizaje exitoso!';
    } else {
        createExplosion(lander.x, lander.y); // Crear partículas de explosión
        playExplosionSound(); // Reproducir sonido de explosión
        message = '¡Te has estrellado!';
    }
    isGameOver = true;
    showRestartButton = true;
}

// Función para reproducir el sonido de explosión
/**
     * Restablece las propiedades del módulo lunar a sus valores iniciales.
     *
     * Detalles del flujo de ejecución:
     *    1.- Establece la posición horizontal del módulo lunar en el centro del lienzo.
     *    2.- Establece la posición vertical del módulo lunar a una altura inicial de 100 píxeles.
     *    3.- Reinicia las velocidades horizontal y vertical del módulo lunar a 0.
     *    4.- Restaura el nivel de combustible del módulo lunar al 100%.
     *
     * @example
     *   Ejemplo de uso:
     *   resetLander();
     *   // El módulo lunar se reinicia a su posición inicial con velocidad y combustible restaurados.
     */
function resetLander() {
    lander.x = canvas.width / 2;
    lander.y = 100;
    lander.velocityX = 0;
    lander.velocityY = 0;
    lander.fuel = 100;
    lander.rotationAngle = 0; // Restaurar el ángulo de rotación
}

//Restaura los parámetros de inicio de la partida
/**
     * Restablece el estado del juego a su configuración inicial.
     *
     * Detalles del flujo de ejecución:
     *    1.- Limpia el mensaje mostrado en pantalla.
     *    2.- Oculta el botón de reinicio del juego.
     *    3.- Establece el estado del juego como no finalizado.
     *    4.- Llama a la función `resetLander` para reiniciar el estado del módulo lunar.
     *    5.- Genera un nuevo terreno llamando a la función `generateGround`.
     *    6.- Calcula una nueva posición aleatoria para la zona de aterrizaje dentro de los límites del lienzo.
     *    7.- Restaura el ángulo de rotación del módulo lunar a 0.
     *
     * @throws {Error} Si alguna de las funciones auxiliares (`resetLander` o `generateGround`) falla durante su ejecución.
     * @example
     *   Ejemplo de uso:
     *   resetGameState();
     *   // Reinicia el juego y prepara un nuevo escenario para jugar.
     */
function resetGameState() {
    message = '';
    showRestartButton = false;
    //isGameOver = false;
    gameTitle.style.display = 'none'; //Ocultar la capa del título html
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    resetLander();
    generateGround();
    landingZone.x = Math.random() * (canvas.width - landingZone.width);

}

//Reinicia el juego
/**
     * Reinicia el estado del juego y prepara el entorno para un nuevo inicio.
     *
     * Detalles del flujo de ejecución:
     *    1.- Llama a la función `resetGameState` para restablecer el estado del juego a su configuración inicial.
     *    2.- Muestra una cuenta regresiva mediante la función `showCountdown`, que recibe como parámetro la función `startGame` para iniciar el juego al finalizar la cuenta regresiva.
     *    3.- Establece el foco en el elemento del lienzo (`canvas`) para garantizar que los controles del juego estén activos.
     *
     * @throws {Error} Si alguna de las funciones internas (`resetGameState`, `showCountdown`, o `canvas.focus`) falla durante su ejecución.
     * @example
     *   Ejemplo de uso:
     *   restartGame();
     *   // Resultado: El estado del juego se reinicia, se muestra una cuenta regresiva, y el foco se establece en el lienzo.
     */
function restartGame() {
    resetGameState();
    showCountdown(gameLoop); // Cambiar startGame por gameLoop
    canvas.focus();
}

// Iniciar el juego
/**
     * Inicia el juego configurando el estado inicial y mostrando una cuenta regresiva.
     *
     * Detalles del flujo de ejecución:
     *    1.- Oculta el botón de inicio para evitar que se vuelva a presionar.
     *    2.- Restablece el estado del juego a su configuración inicial.
     *    3.- Muestra una cuenta regresiva antes de iniciar el bucle principal del juego.
     *    4.- Asegura que el foco esté en la ventana del navegador para capturar eventos correctamente.
     *
     * @throws {Error} Si ocurre algún problema al restablecer el estado del juego o al iniciar la cuenta regresiva.
     * @example
     *   Ejemplo de uso:
     *   startGame();
     */
function startGame() {
    startButton.style.display = 'none'; // Ocultar el botón  

    playSong();
    resetGameState();
    showCountdown(gameLoop);
    window.focus(); // Asegurar que el foco esté en el window
}

// Lógica del juego
/**
     * Actualiza el estado del módulo lunar en cada fotograma del juego.
     *
     *    1.- Verifica si el juego ha terminado; si es así, detiene la ejecución.
     *    2.- Aplica la gravedad al módulo lunar, incrementando su velocidad vertical.
     *    3.- Si el empuje está activo y hay combustible disponible:
     *        - Calcula el empuje vectorial basado en el ángulo de rotación.
     *        - Ajusta las velocidades horizontal y vertical del módulo.
     *        - Reduce la cantidad de combustible disponible.
     *    4.- Actualiza la posición del módulo lunar en el eje X e Y según sus velocidades.
     *    5.- Limita la posición del módulo dentro del área de juego:
     *        - Si el módulo excede los límites horizontales, lo reposiciona y detiene su velocidad horizontal.
     *        - Si el módulo excede los límites verticales superiores, lo reposiciona y detiene su velocidad vertical.
     *        - Si el módulo excede los límites verticales inferiores, lo reposiciona, marca el juego como terminado y verifica el aterrizaje.
     *
     * @throws {Error} Si ocurre un error inesperado durante la actualización del estado del módulo.
     * @example
     *   Ejemplo de uso:
     *   // Llamar a esta función en cada iteración del bucle principal del juego.
     *   update();
     */
function update() {
    if (isGameOver) return;

    // Aplicar gravedad
    lander.velocityY += gravity;

    // Aplicar empuje vectorial
    if (isThrusting && lander.fuel > 0) {
        const angleInRadians = (lander.rotationAngle * Math.PI) / 180;
        lander.velocityX += Math.sin(angleInRadians) * -thrust;
        lander.velocityY += Math.cos(angleInRadians) * thrust;
        lander.fuel -= 0.1; // Reducir el combustible
    }

    // Actualizar posición
    lander.x += lander.velocityX;
    lander.y += lander.velocityY;

    // Limitar posición dentro del área de juego
    if (lander.x < 0) {
        lander.x = 0;
        lander.velocityX = 0;
    }
    if (lander.x > canvas.width) {
        lander.x = canvas.width;
        lander.velocityX = 0;
    }
    if (lander.y < 100) {
        lander.y = 100;
        lander.velocityY = 0;
    }
    if (lander.y > canvas.height) { // Cambiar la verificación para el nuevo pivote
        lander.y = canvas.height;
        isGameOver = true;
        checkLanding();
    }
}

// Bucle principal
/**
     * Bucle principal del juego.
     *
     *    1.- Llama a la función `update` para actualizar el estado del juego.
     *    2.- Llama a la función `draw` para renderizar los elementos del juego en pantalla.
     *    3.- Utiliza `requestAnimationFrame` para programar la siguiente iteración del bucle.
     *
     * @function gameLoop
     * @throws {Error} Si alguna de las funciones `update` o `draw` lanza un error.
     * @example
     *   Ejemplo de uso:
     *   gameLoop(); // Inicia el bucle principal del juego.
     */
function gameLoop() {
    if (!isGameOver) update();
    draw();
    requestAnimationFrame(gameLoop);
}


//#endregion        


