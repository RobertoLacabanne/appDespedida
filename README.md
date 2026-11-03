# Lo que nos queda

Una experiencia digital de despedida, amistad y agradecimiento, en cinco capítulos, pensada para abrirse desde el celular con un enlace de WhatsApp.

*Hay lugares de los que uno se va, pero personas que se lleva para siempre.*

| Capítulo | Símbolo | Interacción |
| --- | --- | --- |
| I · El tiempo compartido | Atardecer | Tres frases que aparecen de a una (tocando la pantalla se adelantan) y la portada con la dedicatoria. |
| II · Las raíces | Árbol de la vida | Ocho brotes; cada uno revela una palabra, hace brotar sus hojas y profundiza las raíces. Completo, el árbol florece. |
| III · Gracias | Girasol, rosa, olivo | Siete flores; cada una se abre y muestra un agradecimiento. La última en descubrirse guarda el mensaje final. |
| IV · Aprender a soltar | Diente de león, pluma, mariposa, loto | Se desliza el dedo (o se toca «Soplar») para liberar las semillas; cruza la pluma, llega la mariposa y se abre el loto. |
| V · Lo que nos queda | Círculo abierto | El círculo de luz se dibuja y queda abierto; la carta; tocar el círculo libera chispas y «Gracias por tanto.»; compartir. |

Ningún capítulo exige completar las interacciones: «Seguir» está siempre disponible.

---

## Probarla en tu compu

Necesitás [Node.js](https://nodejs.org) 20.19 o más nuevo.

```bash
npm install
npm run dev
```

Abrí la dirección que aparece (por ejemplo `http://localhost:5173`). Para verla desde tu celular en la misma red wifi, usá la dirección «Network» que muestra la terminal.

Atajo para revisar un capítulo puntual: agregá `#2`, `#3`, `#4` o `#5` al final de la dirección.

---

## Cambiar textos, nombres y contenido

**Todo se edita en un solo archivo: `src/config/experience.ts`.** No hace falta tocar ningún componente.

Ahí están:

- **Remitente** (`sender`): nombre y despedida de la carta.
- **Destinatarios** (`recipients`): aparecen en la portada, en la carta y en la vista previa.
- **Años compartidos** (`yearsShared`): dejalo en `null` para no mostrarlo, o poné un número (por ejemplo `8`) y aparece «8 años compartidos» en la escena final.
- **Textos de cada capítulo** (`chapters`): frases, palabras del árbol, agradecimientos, la carta, la frase final.
- **Recuerdos y fotos** (`memories`): ver abajo.
- **Compartir** (`share`) y **sonido** (`sound`).

Los textos marcados como *microcopy* (indicaciones del tipo «Tocá una flor») los escribí yo para esta versión; cambialos si querés otro tono.

Después de editar, corré `npm run build` para verificar que no se rompió nada.

### Sumar recuerdos o fotos reales

1. Copiá las fotos a `public/recuerdos/` (JPG de hasta ~1600 px de ancho; pesan menos y cargan rápido).
2. En `memories`, agregá una entrada por recuerdo:

```ts
memories: [
  {
    title: 'Título corto',
    when: 'Cuándo fue, como quieras escribirlo',
    text: 'Lo que pasó, en dos o tres líneas.',
    photo: '/recuerdos/nombre-de-la-foto.jpg',
    photoAlt: 'Qué se ve en la foto',
  },
],
```

Con al menos un recuerdo cargado, en el capítulo II aparece el botón «Algunos recuerdos» (después de descubrir tres palabras) y abre una hoja con las fotos y los textos. Con la lista vacía, la sección no existe.

### Sonido

- `mode: 'generative'` (por defecto): un ambiente suave generado en el navegador, sin archivos ni obras de terceros. Arranca **apagado**; solo suena si alguien toca el botón de sonido.
- `mode: 'file'`: poné tu archivo en `public/` y su ruta en `src` (por ejemplo `'/musica.mp3'`). Usá solo música con licencia de uso apropiada.
- `mode: 'off'`: no se muestra el botón.

---

## Publicarla

La experiencia es un sitio estático: no necesita servidor ni base de datos.

### 1. Definí la dirección pública

WhatsApp solo muestra la imagen de vista previa si el enlace a la imagen es absoluto. Antes de compilar, creá un archivo `.env` (podés copiar `.env.example`) con la dirección donde la vas a publicar:

```
VITE_SITE_URL=https://tu-sitio.netlify.app
```

### 2. Compilá

```bash
npm run build
```

Queda todo en la carpeta `dist/`.

### 3. Subila a un hosting estático (cualquiera de estos)

- **Netlify** (ya configurado): el archivo `netlify.toml` define el build, la carpeta `dist` y la dirección pública `https://lo-que-nos-queda.netlify.app`. Si conectás el repositorio en Netlify, cada cambio se publica solo.
- **Netlify Drop** (sin repositorio): entrá a <https://app.netlify.com/drop> y arrastrá la carpeta `dist`. Te da una dirección; si no coincide con la que pusiste en `.env`, actualizala, compilá de nuevo y volvé a subir.
- **Vercel** o **Cloudflare Pages**: conectá el repositorio, comando de build `npm run build`, carpeta de salida `dist`, y la variable de entorno `VITE_SITE_URL`.
- **GitHub Pages**: funciona tal cual, incluso dentro de una subcarpeta (las rutas son relativas).

### 4. Verificá la vista previa antes de mandarla al grupo

Mandate el enlace a vos mismo por WhatsApp. Si la imagen no aparece, revisá `VITE_SITE_URL`. WhatsApp guarda en caché las vistas previas: si corregiste algo, probá agregando `?v=2` al final del enlace.

La página tiene `noindex` para que no aparezca en buscadores.

### Regenerar la imagen de vista previa

`public/og-image.jpg` ya está generada a partir de la propia app. Si cambiás los nombres o el título, regenerala:

```bash
npm i -D playwright && npx playwright install chromium   # una sola vez
npm run dev        # en una terminal
npm run og         # en otra
```

---

## Detalles técnicos

- React 19, TypeScript, Vite, Tailwind CSS 4 y Motion. Sin backend.
- Tipografías incluidas en el sitio (Newsreader y Hanken Grotesk), sin pedidos a servidores externos.
- Ilustraciones en SVG propias; el diente de león y las chispas del final se dibujan en canvas.
- Todos los colores, tipografías, sombras y curvas de animación están definidos como tokens en `src/index.css`.
- Accesibilidad: respeta «reducir movimiento» (sin vuelos ni desplazamientos, con alternativas estáticas), todo se puede usar con teclado (flechas ← → para cambiar de capítulo), textos anunciados a lectores de pantalla, áreas táctiles de 44 px como mínimo y áreas seguras del notch.
- El botón «atrás» del celular vuelve al capítulo anterior.

### Estructura

```
src/
  config/experience.ts   ← textos y contenido (lo único que necesitás editar)
  chapters/              ← los cinco capítulos
  components/            ← interfaz, cielo, canvas del diente de león y chispas
  components/illustrations/  ← árbol, girasol, rosa, olivo, pluma, mariposa, loto, círculo
  lib/                   ← árbol procedural, sonido, compartir, navegación
  index.css              ← tokens de diseño
public/                  ← íconos, imagen de vista previa, recuerdos/
```
