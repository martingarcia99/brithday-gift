# 💫 Sorpresa de cumpleaños para Miriam

Una web interactiva de cumpleaños, hecha con **HTML, CSS y JavaScript puro**
(sin frameworks, sin librerías externas, sin servidor). Cuenta una historia
en 8 pantallas hasta revelar el regalo final: un viaje de dos días a
Disneyland Paris.

## 🚀 Cómo verla

Abre `index.html` directamente en el navegador (doble clic, o
"Abrir con" → tu navegador favorito). Funciona sin conexión a internet y
sin necesidad de ningún servidor.

Compatible con Safari (iPhone), Chrome, Edge y Firefox, en móvil y
ordenador.

## 🗂️ Estructura del proyecto

```
brithday-gift/
├── index.html      → estructura de las 8 pantallas
├── style.css        → todo el diseño visual y las animaciones
├── script.js         → toda la lógica e interacciones
├── images/           → fotos de la galería de recuerdos
├── music/            → música de fondo (opcional)
└── README.md
```

## 🎨 Personalización

### 1. La carta (Pantalla 2)

Edita el texto en `script.js`, dentro de `CONFIG.letterText` (al principio
del archivo). Se escribirá automáticamente letra por letra al abrir el
sobre.

### 2. Fotos y recuerdos (Pantalla 3)

1. Copia tus fotos dentro de la carpeta `/images`.
2. Ábre `script.js` y edita el array `CONFIG.memories`. Cada foto tiene:
   - `file`: el nombre del archivo dentro de `/images` (ej. `"foto-1.jpg"`).
   - `caption`: el pequeño recuerdo que aparece debajo de la foto.

Puedes añadir o quitar tantas fotos como quieras, solo añade o elimina
líneas del array. Si un archivo aún no existe, se muestra un marcador de
posición elegante en su lugar (no se rompe nada).

### 3. Música de fondo (opcional)

Coloca un archivo `cancion.mp3` dentro de la carpeta `/music`. Aparecerá
un botón flotante (abajo a la derecha) para reproducirla o pausarla. Nunca
se reproduce automáticamente.

### 4. El regalo final (Pantalla 7)

El texto del billete ("Nos vamos dos días a Disneyland Paris") está en
`index.html`, dentro de la sección `#screen-7` (clase `.ticket-title`), por
si quieres ajustar la redacción exacta.

### 5. Tipografías más elegantes (opcional)

Por defecto la web usa únicamente fuentes del sistema para garantizar que
funcione sin conexión a internet. Si en el momento de mostrarla hay wifi
disponible, puedes activar tipografías aún más bonitas descomentando el
bloque `<link>` de Google Fonts que aparece comentado en el `<head>` de
`index.html`.

## 🧭 El recorrido

1. **Portada** — cielo estrellado, luna y un mensaje de apertura.
2. **Carta** — un sobre que se abre y revela un mensaje escrito letra a letra.
3. **Galería** — carrusel de fotos y recuerdos, con gestos táctiles.
4. **Pregunta** — "¿Estás preparada para descubrir tu regalo?"
5. **Castillo mágico** — una ilustración de cuento de hadas hecha en SVG.
6. **Caja de regalo** — se abre con una animación 3D y estalla en confeti.
7. **Revelación** — un billete gira y desvela el viaje a Disneyland Paris.
8. **Celebración final** — fuegos artificiales y confeti continuo.

## 🛠️ Notas técnicas

- Sin dependencias externas: todo el código es HTML, CSS y JavaScript
  puro.
- Las animaciones usan CSS y `requestAnimationFrame` para mantener 60 FPS.
- Diseño responsive con unidades relativas y `clamp()`, y ajustes
  específicos para la barra segura de iPhone (`env(safe-area-inset-*)`).
- El sistema de partículas (confeti, corazones, estrellas) es una función
  compartida (`spawnParticles` en `script.js`) reutilizada en la caja de
  regalo y en la celebración final.
