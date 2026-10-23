# Vin_Salta

Landing estática, sin dependencias, inspirada en la composición de meganfox.world. Fondo ciruela, detalles rosa, fuente Permanent Marker alojada localmente y una entrada VS de al menos 1,7 segundos antes de la transición a la página.

## Ver y publicar

- `npm run dev`: servidor local en http://localhost:4173.
- `npm run build`: copia el sitio listo para publicar a `dist/`.
- También se puede publicar directamente `index.html`, `styles.css`, `app.js`, `browser-help.js`, `analytics.js` y `assets/` en cualquier alojamiento estático.

Dominio configurado: https://bio2.vinsalta.com/. Incluye URL canónica, Open Graph y Twitter con URLs absolutas. La vista previa social usa el monograma VS y una descripción neutral, sin fotografías.

## Cloudflare Workers

El archivo `wrangler.jsonc` configura el Worker existente `vinlandingbio2`. El comando de despliegue `npx wrangler deploy` ejecuta automáticamente `npm run build` y publica únicamente `dist/`, con la página, los estilos, el script y las imágenes. Se puede mantener vacío el comando de build del panel de Cloudflare porque Wrangler se encarga de ese paso.

No usar la raíz del repositorio como directorio de assets: incluiría herramientas de desarrollo y archivos que no pertenecen al sitio.

## PostHog

La landing envía una visita (`$pageview`) por carga al mismo proyecto de PostHog Cloud US que vinsalta.com (629107). `analytics.js` contiene su token público de ingesta; no requiere claves privadas ni variables en Cloudflare. El SDK slim sin dependencias externas de PostHog 1.434.14 se aloja en `assets/`, junto con su licencia.

Para ver únicamente esta landing en PostHog, filtrar Web Analytics por hostname `bio2.vinsalta.com`, o los informes de eventos por `site = bio2`. El sitio principal conserva `site = com`. Sin filtro, las vistas generales del proyecto pueden sumar ambos sitios. Se comparte el proyecto, no la identidad anónima entre dominios.

Solo se mide HTTPS en `bio2.vinsalta.com/` (o `/index.html`). Localhost, previews de Cloudflare y otras rutas no envían eventos. Respeta Do Not Track y Global Privacy Control; no activa autocaptura, grabaciones, perfiles, flags ni encuestas. Las propiedades se reconstruyen desde una lista permitida, sin query strings, fragmentos, referrers, formularios ni datos de usuario. Mantener activo **Settings → Project → Privacy → Discard client IP data**, como en el proyecto principal. Si un bloqueador impide el envío, la página y su enlace siguen funcionando.

La integración registra visitas; no registra clics ni crea informes o dashboards automáticamente. Para comprobar la publicación, abrir la landing sin bloqueadores ni opt-out y buscar `$pageview` con `site = bio2` en los eventos en vivo de PostHog.

## Imágenes y diseño

- Portada: foto del balcón, original de 598 × 598 px.
- Enlace: foto con máscara negra, original de 1646 × 1646 px.
- Ambas mantienen su proporción cuadrada y se adaptan al ancho y la altura disponibles. En pantallas apaisadas de al menos 480 px de ancho, tanto desktop como teléfonos girados, se distribuyen en una fila: portada, título y foto enlace. En vertical conservan la composición apilada. El cambio se aplica al redimensionar o girar la pantalla.
- Las fotos llegan hasta 600 px por lado en horizontal y 480 px en vertical cuando hay espacio, sin añadir scroll. El título, los márgenes y las fotos se ajustan juntos al espacio disponible, incluyendo las zonas seguras del teléfono. Sus bordes cercanos al texto se desvanecen hacia el fondo real de la página; el degradado acompaña la disposición vertical u horizontal.
- El único texto de la página aparece entre las fotos: «Vin_Salta» y «Contenido Exclusivo». El monograma VS aparece durante la breve entrada.
- En Instagram, tocar la foto enlace abre un modal sin párrafos ni encabezados, con las opciones «Abrir en Chrome» y «Usar otro navegador», además del icono para cerrarlo. Sus botones tienen iconos, degradados rosa y sombras suaves. La primera opción intenta abrir vinsalta.com en Chrome en iOS/Android. La flecha hacia el menú de Instagram y su rótulo «Abrir en navegador externo» aparecen únicamente al elegir «Usar otro navegador» y se ocultan al cerrar la ayuda; desde ese menú se puede elegir el navegador externo disponible. En pantallas apaisadas de poca altura, el modal deja lugar a la indicación. Al volver a abrir el modal, la indicación vuelve a estar oculta. La apertura de Chrome y su permiso dependen del teléfono y de Instagram. En navegadores normales se conserva el enlace directo a una nueva pestaña.
- En escritorio, la foto enlace hace un zoom suave y se desplaza con el mouse, acompañada por un resplandor rosa. Se desactiva para pantallas táctiles y al preferir movimiento reducido.
- Se deshabilitan la selección, el arrastre de imágenes y el menú contextual. Se bloquean los gestos y atajos de zoom dentro de la página; algunos navegadores pueden mantener el zoom por sus opciones de accesibilidad. El zoom visual de la foto enlace se conserva.
- La entrada espera a que la pestaña esté visible. Al preferir movimiento reducido, muestra el monograma sin animaciones en vez de omitirlo. Un límite de espera evita que una conexión lenta bloquee la página. El contenido y el enlace funcionan sin JavaScript.
- La fuente se distribuye con su licencia en `assets/FONT-LICENSE.txt`.

El enlace a https://vinsalta.com/ usa `target="_blank"` y `rel="noopener noreferrer"`. El navegador decide dónde abre la nueva pestaña; una web no puede obligar al navegador interno de Instagram a abrir Chrome. Los metadatos describen la página y no garantizan la clasificación de ninguna plataforma.

Para revisar la ayuda desde el servidor local: `/?preview=instagram-ios` o `/?preview=instagram-android`. Estas simulaciones no se incluyen en el despliegue.
