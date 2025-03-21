# Moon Lander Clone

Este proyecto es un clon del clásico juego "Moon Lander", donde los jugadores controlan un módulo lunar y deben aterrizarlo de manera segura en una superficie evitando obstáculos y gestionando el combustible.

## Descripción del Juego

MoonLander es un juego interactivo en el que el jugador controla un módulo lunar con el objetivo de aterrizarlo de manera segura en una zona designada dentro de un lienzo HTML5. 

### Objetivo
El jugador debe aterrizar el módulo lunar en la zona de aterrizaje (marcada en verde) sin exceder una velocidad de caída segura y manteniéndose dentro de los límites de la zona.

### Características principales
1. **Control del módulo lunar:**
   - Usa las teclas de flecha para controlar el módulo:
     - **Flecha arriba (`ArrowUp`)**: Activa el impulso para reducir la velocidad de caída.
     - **Flecha izquierda (`ArrowLeft`)**: Rota el módulo en sentido antihorario.
     - **Flecha derecha (`ArrowRight`)**: Rota el módulo en sentido horario.
   - El módulo tiene un nivel limitado de combustible.

2. **Física del juego:**
   - **Gravedad:** Se aplica constantemente, aumentando la velocidad de caída del módulo.
   - **Impulso:** Contrarresta la gravedad y ajusta la trayectoria del módulo.
   - **Rotación:** Cambia la dirección del impulso, permitiendo maniobras horizontales.

3. **Zona de aterrizaje:**
   - Una zona rectangular verde se genera aleatoriamente en la parte inferior del lienzo.
   - El módulo debe aterrizar dentro de esta zona y con una velocidad vertical menor a un límite seguro.

4. **Colisiones y explosiones:**
   - Si el módulo aterriza fuera de la zona o con una velocidad demasiado alta, se genera una explosión visual y sonora.

5. **Interfaz visual:**
   - Indicadores de combustible y velocidad de caída.
   - Animaciones como la llamarada del módulo al usar el impulso y explosiones al fallar.

6. **Música y sonido:**
   - Música de fondo que puede activarse o desactivarse mediante un botón.
   - Sonidos específicos para eventos como explosiones.

7. **Reinicio del juego:**
   - Si el jugador falla, aparece un botón de reinicio para comenzar una nueva partida.
   - Incluye una cuenta regresiva antes de iniciar cada partida.

---

## Características

- Física realista para simular la gravedad y el control del módulo lunar.
- Interfaz de usuario interactiva con indicadores de combustible y velocidad.
- Múltiples niveles con diferentes grados de dificultad.
- Sistema de puntuación basado en la precisión del aterrizaje.
- Guardado y carga de progreso del jugador.

## Requisitos

- Un navegador web moderno.

## Instalación

1. Clona este repositorio:
   ```bash
   git clone https://github.com/bartbender/MoonLander.git
   ```

## Uso

Para jugar, simplemente abre el archivo `index.html` en tu navegador web preferido.

## Créditos

Este proyecto fue inspirado en el clásico juego "Moon Lander" y desarrollado como una demostración educativa.

Dedicado a mis sobrinos Dani,Lucía,Rubén y Jorge

## Licencia
Este proyecto está licenciado bajo la Licencia Pública General de GNU (GPL). Consulta el archivo `LICENSE` para más detalles.

## Jugar Online
https://bartbender.github.io/MoonLander