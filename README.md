# Biometría Aplicada · Centro de soporte
Prototipo académico para **M4 — Full Contact Forms**, Programación Web I: Cliente (U-tad).
Registra incidencias de acceso, asistencia, terminales y aplicación; consulta el listado remoto y filtra por categoría.
No es el soporte oficial ni está conectado a sistemas biométricos reales. Usa datos ficticios: el recurso de demostración es compartido, sin autenticación ni permisos por empleado. El filtro no es un control de acceso.

## Arranque
Probado con Node.js 24 y npm. Desde esta carpeta:

```bash
npm ci
npm run dev
```

Abre la URL que imprime Vite. Para comprobar:

```bash
npm run lint
npm test
npm run build
```

`npm run preview` sirve el resultado del build. Las pruebas usan el soporte nativo de TypeScript de Node 24 y no envían datos a internet.

## Recorrido de una solicitud
1. React Hook Form registra campos no controlados con `register`; `handleSubmit` ejecuta la validación antes de enviar.
2. `zodResolver` conecta el formulario al esquema Zod. El esquema normaliza espacios, limita tamaños y comprueba correo y categoría.
3. Un refinamiento exige equipo o puerta para acceso y terminal. El error se asocia a `equipo` mediante `path`.
4. `useMutation` llama al POST. Se añade estado Pendiente y fecha ISO. La API asigna el ID.
5. Mientras se envía se deshabilita el formulario. Si falla, se conserva lo escrito; si funciona, se restablecen los campos.
6. `invalidateQueries({ queryKey: ['incidencias'] })` invalida la consulta activa para volver a leer los registros. No se recarga la página ni se duplica la lista en un useState.
7. `useQuery` consulta los datos y expone carga, error y resultado. Un fallo del listado no oculta el formulario.
8. `safeParse` valida toda la respuesta antes de mostrarla. El listado se filtra y ordena sin modificar los datos de la caché.

## Archivos
| Archivo | Responsabilidad |
| --- | --- |
| `src/main.tsx` | Crea un QueryClient y lo comparte mediante QueryClientProvider. |
| `src/App.tsx` | Compone identidad visual, formulario y listado. |
| `src/components/FormularioIncidencia.tsx` | RHF, ayuda por categoría, mutation y mensajes de envío. |
| `src/components/ListadoIncidencias.tsx` | Query, filtro local, orden reciente, vacío y reintento. |
| `src/components/TarjetaIncidencia.tsx` | Presenta una incidencia mediante props, con su ID como key en el listado. |
| `src/schemas/incidencia.ts` | Validación del formulario, respuesta remota y tipos inferidos. |
| `src/services/api.ts` | Funciones GET y POST con comprobación de respuesta HTTP. |
| `src/index.css`, `src/App.css` | Estilos base y diseño adaptable naranja con logo proporcionado por el alumno. |
| `tests/` | Pruebas del esquema y servicio HTTP con fetch simulado. |

## API y sus límites
Recurso: https://6af97cd36d8b86fb22d708a5.mockapi.io/incidencias

- GET consulta todos los registros; POST crea uno con JSON.
- Campos: nombre, correo, empresa, sede, categoria, equipo, asunto, descripcion, estado, fechaCreacion e id.
- `Aplicacion` se conserva sin tilde en los datos para coincidir con el esquema inicial; en la interfaz se muestra Aplicación.
- La lista admite Pendiente, En revisión y Resuelta. Este prototipo crea solicitudes Pendiente; no incluye panel de agentes para cambiar el estado.
- No se crean cuentas de soporte ni se recogen huellas, claves o identificadores personales reales.
- La validación del navegador mejora el formulario, pero no sustituye validación ni autorización en un backend de producción.
- Si el servidor contiene un registro incompatible, se rechaza la respuesta completa y se muestra error en lugar de presentar datos no comprobados.
- La mutation no reintenta el POST automáticamente. Evita duplicados por reintento automático; no proporciona idempotencia ni garantiza ausencia de duplicados ante una respuesta de red ambigua.
- `networkMode: 'always'` permite que el POST falle y muestre feedback incluso si el navegador se declara sin conexión.
- El QueryClient guarda resultados en memoria; la persistencia real depende de MockAPI.

## Originalidad
El formulario está adaptado al soporte de control de accesos: equipo obligatorio según categoría y consejos específicos sobre puerta, marcación, terminal o pantalla afectada. El listado permite seguimiento por categoría y fecha. Identidad naranja y logo aportado por el alumno.
Contexto del dominio consultado en https://baplicada.cl/ ; flujo y textos del prototipo son propios de esta práctica.

## Bonus: respuesta corrupta
`npm test` incluye una prueba denominada **BONUS: atrapa dato corrupto de API**.
Parte de un registro válido, cambia su ID a un número y su fecha a `ayer`. `safeParse` devuelve `success: false` y la prueba imprime las rutas rechazadas (`0.id`, `0.fechaCreacion`).
No modifica ni ensucia el recurso remoto.

## Comprobaciones y pruebas manuales
Build y lint comprueban compilación y reglas; las pruebas automatizadas comprueban espacios, validación condicional, datos corruptos, HTTP y cuerpo del POST con respuestas simuladas.
La prueba visual automatizada no pudo completarse: el navegador integrado agotó la conexión al servidor local y Computer Use bloqueó el acceso a Chrome al no poder verificar su URL. La consulta directa desde el entorno de Codex falló por resolución DNS del host MockAPI. Esto no prueba un fallo en el navegador del alumno: este ya había mostrado la lista vacía antes de estos cambios.
El POST real, la persistencia y el diseño en navegador quedan por comprobar manualmente tras esta versión.

Antes de entregar:
- [ ] Abrir en escritorio y móvil (por ejemplo 390 px), comprobar lectura y ausencia de desbordamiento.
- [ ] Recorrer los campos con Tab y enviar vacío: errores vinculados y foco en el primer campo inválido.
- [ ] Probar acceso/terminal sin equipo: debe rechazar; asistencia/aplicación sin equipo: debe aceptar si el resto es válido.
- [ ] Enviar una incidencia ficticia: mensaje de espera, éxito, campos restablecidos y tarjeta nueva.
- [ ] Recargar y confirmar que el registro sigue presente.
- [ ] Probar categoría sin coincidencias y volver a Todas.
- [ ] Simular fallo de red: conservar campos si falla el POST; reintentar la consulta al recuperar conexión.
- [ ] Ejecutar lint, test y build; entregar la misma URL de repositorio en Arena y Blackboard.

## Uso de IA
Se utilizó **Codex (OpenAI)** para orientar y generar código y explicaciones.
Prompts reales relevantes:
> «Ya continuemos, dime paso a paso como conectamos React con la API y explicame que hace cada cosa»

> «Ya continuemos con lo que nos falta del codigo, pero quiero que lo hagas todo edita mi proyecto y luego vemos que cambios pasaron, recuerda hacer los commits restantes»

El alumno eligió la temática Biometría Aplicada, proporcionó el logo, configuró MockAPI, creó la plantilla y escribió manualmente siguiendo indicaciones los primeros bloques de API, QueryClientProvider, consulta, esquema y formulario. Hizo los dos primeros commits y comunicó su subida a GitHub.
## Autopsia
1. **Invalidar la consulta tras crear.** Se eligió volver a pedir la lista al servidor en lugar de insertar una copia local de la solicitud con un ID inventado. Mantiene al servidor como fuente de verdad y evita duplicar estado. Cuesta una petición adicional y el listado puede fallar al actualizar aunque el POST haya guardado correctamente; se comunica el fallo en su propia sección.
2. **Validar toda la respuesta con Zod.** Se prefirió rechazar una lista corrupta frente a convertirla con `as Incidencia[]` o descartar silenciosamente registros inválidos. Una aserción TypeScript no verifica datos en ejecución. La contrapartida es que un solo registro incorrecto impide mostrar esa respuesta; el formulario sigue disponible y existe reintento.

