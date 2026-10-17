# Vin_Salta

Landing estática, sin dependencias, inspirada en la composición de meganfox.world. Fondo ciruela, detalles rosa, fuente Permanent Marker alojada localmente y una entrada VS de al menos 1,7 segundos antes de la transición a la página.

## Ver y publicar

- `npm run dev`: servidor local en http://localhost:4173.
- `npm run build`: copia el sitio listo para publicar a `dist/`.
- También se puede publicar directamente `index.html`, `styles.css`, `app.js` y `assets/` en cualquier alojamiento estático.

Dominio configurado: https://bio2.vinsalta.com/. Incluye URL canónica, Open Graph y Twitter con URLs absolutas. La vista previa social usa el monograma VS y una descripción neutral, sin fotografías.

## Cloudflare Workers

El archivo `wrangler.jsonc` configura el Worker existente `vinlandingbio2`. El comando de despliegue `npx wrangler deploy` ejecuta automáticamente `npm run build` y publica únicamente `dist/`, con la página, los estilos, el script y las imágenes. Se puede mantener vacío el comando de build del panel de Cloudflare porque Wrangler se encarga de ese paso.

No usar la raíz del repositorio como directorio de assets: incluiría herramientas de desarrollo y archivos que no pertenecen al sitio.

## Imágenes y diseño

- Portada: foto del balcón, original de 598 × 598 px.
- Enlace: foto de la máscara, optimizada a 1024 × 1024 px.
- Ambas mantienen su proporción cuadrada y se adaptan a la altura disponible. En móviles apaisados se distribuyen en una fila, con el título en el centro.
- El único texto de la página aparece entre las fotos: «Vin_Salta» y «Contenido Exclusivo». El monograma VS aparece durante la breve entrada.
- En escritorio, la foto enlace hace un zoom suave y se desplaza con el mouse, acompañada por un resplandor rosa. Se desactiva para pantallas táctiles y al preferir movimiento reducido.
- Se deshabilitan la selección, el arrastre de imágenes y el menú contextual. Se bloquean los gestos y atajos de zoom dentro de la página; algunos navegadores pueden mantener el zoom por sus opciones de accesibilidad. El zoom visual de la foto enlace se conserva.
- La entrada espera a que la pestaña esté visible. Al preferir movimiento reducido, muestra el monograma sin animaciones en vez de omitirlo. Un límite de espera evita que una conexión lenta bloquee la página. El contenido y el enlace funcionan sin JavaScript.
- La fuente se distribuye con su licencia en `assets/FONT-LICENSE.txt`.

El enlace a https://vinsalta.com/ usa `target="_blank"` y `rel="noopener noreferrer"`. El navegador decide dónde abre la nueva pestaña; una web no puede obligar al navegador interno de Instagram a abrir Chrome. Los metadatos describen la página y no garantizan la clasificación de ninguna plataforma.
