# Guía para comprender y preparar la hoja manuscrita
Esta guía describe el código final; no acredita dominio. La autorización de hoja por ambas caras fue comunicada por el alumno. Copia solo lo que puedas explicar, no archivos completos.

## Cara A: recorrido y formulario
- Entrada: index.html contiene root; main.tsx monta App dentro de QueryClientProvider.
- QueryClient: gestor compartido de caché y consultas, creado fuera de los componentes.
- App: compone FormularioIncidencia y ListadoIncidencias.
- register('nombre'): conecta el input con RHF sin mantener un useState para cada campo.
- handleSubmit(enviarDatos): valida mediante zodResolver y llama a enviarDatos solo si pasa.
- Zod: trim, min/max, email, enum; refine mira categoría y equipo juntos; path coloca el error en equipo.
- z.infer: obtiene el tipo TypeScript del esquema. El tipo ayuda al editor; Zod valida valores en ejecución.
- useWatch: observa categoría para cambiar ayuda y etiqueta; no es quien valida.
- aria-invalid/aria-describedby: comunican errores asociados; role=alert anuncia fallos.
- Flujo: escribir → validar → mutate(datos) → POST → éxito o error.

## Cara B: API, estado y decisiones
- GET devuelve lista validada. fetch hace HTTP, !ok lanza error, json lee el cuerpo, safeParse verifica los campos.
- POST manda JSON.stringify({...datos, estado:'Pendiente', fechaCreacion:new Date().toISOString()}); API asigna ID.
- useQuery: queryKey ['incidencias']; queryFn hace GET; isPending/isError/isSuccess; retry 1.
- signal permite cancelar GET si la consulta deja de necesitarlo.
- useMutation: mutationFn crearIncidencia; mutate inicia POST; isPending bloquea formulario; error conserva datos.
- onSuccess: reset() e invalidateQueries con la misma clave; la consulta activa vuelve a leer la lista.
- La mutation no se reintenta automáticamente. Fallo de refresco no significa que el POST no guardó.
- Listado: solo filtro en useState; datos remotos en Query; filter + toSorted derivan resultados. key = ID estable.
- Bonus: listaIncidenciasSchema.safeParse rechaza un ID numérico o fecha inválida; npm test lo demuestra sin modificar la API.
- Decisiones: invalidar vs insertar copia local; validar datos remotos vs confiar en un tipo.
- Límites: demo compartida, sin login; no estado editable ni soporte real. Declarar IA con honestidad.

## Ensayo sin mirar
1. Explica qué sucede al enviar datos inválidos y válidos.
2. ¿Qué diferencia hay entre fetch, useQuery y useMutation?
3. ¿Por qué la clave de invalidación coincide con la de consulta?
4. ¿Qué guarda useState y qué no hace falta guardar?
5. ¿Puede guardarse una incidencia y fallar luego el listado? Explica el caso.
6. Explica el refinamiento, una decisión de Autopsia y la ayuda original por categoría.

