# NEXO

> Plataforma de conexión, salas y comunicación construida alrededor de NEXO + Supabase + NEXO Salas.

**Estado actual:** desarrollo activo / entorno de pruebas.

**Preview de trabajo:** https://deploy-preview-5--nexosystem.netlify.app/

**Repositorio:** https://github.com/rodrigomidon04-ui/nexo

**Videollamadas intocables por ahora:** https://rodrigomidon04-ui.github.io/nexo-salas/

---

## 1. Qué es NEXO

NEXO es la capa de identidad, descubrimiento, organización y comunicación que se coloca delante de la aplicación de videollamadas NEXO Salas.

La idea central es separar responsabilidades:

- **NEXO:** usuarios, perfiles, salas, contactos, invitaciones, notificaciones, favoritos, historial, presencia y chat.
- **NEXO Salas:** motor de videollamadas que ya existe y que por decisión del proyecto no se modifica durante esta etapa.
- **Supabase:** autenticación, perfiles, datos persistentes, RLS y Realtime.
- **Netlify:** hosting del frontend de NEXO y Deploy Preview.

---

# 2. Regla de seguridad del proyecto

## NEXO Salas es intocable por ahora

La aplicación de videollamadas existente se considera un componente externo y estable.

**No modificar:**

`https://rodrigomidon04-ui.github.io/nexo-salas/`

La integración de NEXO solamente prepara y abre el destino de videollamadas con los parámetros correspondientes.

Cualquier cambio futuro en NEXO Salas requiere autorización explícita y un respaldo independiente.

---

# 3. Estado general por módulos

## 🟢 COMPLETADO / IMPLEMENTADO

### ✅ Identidad visual NEXO

Incluye:

- Carita/robot NEXO en la portada.
- Iconografía coherente con la identidad visual.
- Favicon de NEXO.
- Apple touch icon.
- Diseño oscuro con estética tecnológica.
- Diseño responsive para escritorio y móvil.

### ✅ Landing principal

La portada presenta:

- Propuesta de valor de NEXO.
- Acceso a salas.
- Sala actual.
- Entrada directa a NEXO Salas.
- Exploración de espacios.
- Ecosistema NEXO.
- Acceso a Mi NEXO.

### ✅ Salas

Implementado:

- Sala de invitado.
- Generación de clave de sala.
- Sala personal persistente para usuarios registrados.
- Copiar clave.
- Compartir clave.
- Introducir una clave manualmente.
- Entrada directa a la videollamada.

### ✅ Integración con NEXO Salas

Implementado:

- Apertura de NEXO Salas desde NEXO.
- Envío de sala.
- Envío de nombre de usuario.
- Parámetro de entrada automática.
- Mantener la aplicación de videollamadas separada del frontend NEXO.

### ✅ Supabase Auth

Implementado:

- Registro real.
- Confirmación por email.
- Inicio de sesión.
- Persistencia de sesión.
- Recuperación de contraseña preparada.
- Cierre de sesión.
- Recuperación del usuario autenticado mediante Supabase Auth.

### ✅ Perfil

Implementado en la base y frontend:

- Nombre visible.
- `@username`.
- Avatar/foto mediante URL.
- Biografía.
- Perfil conectado a Supabase.
- Mostrar identidad del usuario en Mi NEXO.

### ✅ Sala personal

Implementado:

- Asociación de una sala personal al usuario.
- Persistencia de la sala.
- Clave real almacenada en Supabase.
- Reutilización de la sala personal.

### ✅ Contactos

Implementado:

- Buscar usuarios.
- Buscar por usuario/nombre mediante consultas separadas.
- Solicitudes de contacto.
- Aceptar solicitudes.
- Rechazar solicitudes.
- Detección de relaciones existentes.
- Protección contra solicitudes duplicadas.

### ✅ Invitaciones

Implementado:

- Crear invitación.
- Asociar invitación a usuario/sala.
- Aceptar invitación.
- Rechazar invitación.
- Persistencia en Supabase.

### ✅ Notificaciones

Implementado:

- Tabla de notificaciones.
- RLS.
- Notificaciones automáticas para eventos principales.
- Marcar como leída.
- Marcar varias notificaciones.
- Base preparada para contador de no leídas.

### ✅ Favoritos

Implementado:

- Tabla de favoritos.
- RLS.
- Persistencia de favoritos.
- Base preparada para salas favoritas.

### ✅ Historial

Implementado:

- Base de historial de llamadas.
- Registro de actividad preparado.
- Persistencia del historial en Supabase.

### ✅ Presencia online

Implementado en 3.3:

- Supabase Realtime Presence.
- Estado online/offline.
- Identificación de pestaña para una misma sesión.
- Base preparada para última conexión.

### ✅ Chat privado

Implementado en 3.3:

- Tabla `messages`.
- RLS para participantes.
- Conversación entre contactos.
- Historial persistente.
- Mensajes en tiempo real.
- Estado de lectura.
- Indicador de escritura.
- Longitud máxima de mensaje.

### ✅ Arquitectura modular del frontend

Implementado:

- Núcleo principal NEXO.
- Capas auxiliares para 3.2, 3.3 y siguientes.
- `build.js` para integrar módulos adicionales sin reescribir manualmente todo el HTML.
- Evita duplicar la lógica principal.

### ✅ Optimización inicial

Implementado parcialmente:

- Evitar doble inicialización de módulos.
- Reutilización de sesión.
- Cargas diferidas en módulos sociales.
- Reducción de consultas redundantes.
- Separación de la lógica de videollamadas.

### ✅ Reorganización del menú

Implementada en la rama de trabajo:

- **Inicio**.
- **Salas**.
- **Espacios** (antes Explorar).
- **Mi NEXO** como centro personal.

Dentro de Mi NEXO:

#### Sesiones

- **Conecta:** salas y videollamadas.
- **Conversa:** conversaciones/chat.
- **Controla:** sesiones, actividad e historial.

#### Tu red

- **Chats**.
- **Contactos**.
- **Invitaciones**.

#### Tu ecosistema

- **Ecosistema**.
- **Perfil**.

#### Acceso rápido

- **Resumen**.

---

# 4. 🟡 IMPLEMENTADO PERO PENDIENTE DE VALIDACIÓN FINAL

Estas funciones existen en código/base de datos, pero todavía deben pasar una prueba completa en el preview antes de considerarlas cerradas.

### 🟡 Chat

Pendiente validar completamente:

- Enviar mensajes después de múltiples cambios de sesión.
- Varias pestañas con el mismo usuario.
- Mensajes leídos/no leídos.
- Reconexión de Realtime.
- Indicador escribiendo.
- Mensajes después de renovar sesión.

### 🟡 Presencia

Pendiente validar:

- Varias pestañas.
- Cerrar una pestaña sin marcar al usuario offline demasiado pronto.
- Cambio entre dispositivos.
- Reconexión de red.

### 🟡 Nueva navegación Mi NEXO

La estructura ya está implementada, pero falta validarla visualmente en el Preview #5 cuando Netlify procese el último commit.

### 🟡 Salas privadas

La estructura de datos y permisos está preparada, pero falta una prueba completa del flujo de propietario/moderador/miembro.

### 🟡 Historial

Falta validar el registro completo desde entrada/salida real de videollamada.

---

# 5. 🔴 PENDIENTE DE DESARROLLO

## ❌ Mi NEXO como dashboard completo

Convertir Mi NEXO en un verdadero centro de control con:

- Resumen de actividad.
- Sala actual.
- Estado online.
- Últimos chats.
- Invitaciones pendientes.
- Notificaciones.
- Accesos rápidos.
- Estadísticas personales.

## ❌ Chat grupal

Actualmente existe la base del chat privado.

Falta:

- Chat de sala.
- Conversaciones de grupo.
- Lista de participantes.
- Menciones.
- Respuestas.
- Reacciones.

## ❌ Contador completo de no leídos

Falta consolidar:

- No leídos por chat.
- No leídos globales.
- Badge en navegación.
- Marcado automático cuando se abre una conversación.

## ❌ Última conexión visible

Falta mostrar correctamente:

- En línea.
- Hace 5 min.
- Hace 1 h.
- Última vez activo.

## ❌ Salas privadas completas

Falta terminar:

- Crear sala privada.
- Política de acceso.
- Invitar miembros.
- Propietario.
- Moderador.
- Miembro.
- Expulsar.
- Revocar acceso.
- Bloquear acceso.

## ❌ Invitaciones por enlace

Crear enlaces como:

`https://nexosystem.netlify.app/invitacion/ABC123`

con:

- Vista previa.
- Quién invitó.
- Qué sala.
- Aceptar como invitado.
- Ingresar.
- Crear cuenta.

## ❌ PWA

Falta:

- `manifest.json` definitivo.
- Service Worker.
- Instalación desde navegador.
- Iconos completos.
- Offline básico.
- Caché controlado.

## ❌ Notificaciones del navegador

Falta:

- Permiso del navegador.
- Notificación de mensaje.
- Invitación recibida.
- Solicitud de contacto.
- Contador de notificaciones.

## ❌ Búsqueda avanzada

Falta:

- Buscar por usuario.
- Buscar por nombre.
- Buscar espacios.
- Buscar salas.
- Filtros.
- Resultados paginados.

## ❌ Chat avanzado

Falta:

- Adjuntos.
- Imágenes.
- Emojis avanzados.
- Reacciones.
- Responder mensajes.
- Editar mensajes.
- Eliminar mensajes.
- Moderación.

## ❌ Moderación y seguridad de usuario

Falta:

- Bloquear usuario.
- Reportar usuario.
- Silenciar usuario.
- Moderación de salas.
- Registro de acciones administrativas.

## ❌ Seguridad final de Supabase

Pendiente antes de producción:

- Activar protección de contraseñas filtradas.
- Revisar funciones `SECURITY DEFINER` restantes.
- Auditar todas las políticas RLS.
- Revisar permisos de `anon`.
- Revisar permisos de `authenticated`.
- Auditar Realtime.
- Revisar exposición de datos personales.

## ❌ QA completo

Falta probar sistemáticamente:

- Chrome.
- Edge.
- Firefox.
- Móvil Android.
- iPhone/iPad.
- Varias pestañas.
- Cambio de cuenta.
- Sesión expirada.
- Mala conexión.
- Recarga durante chat.
- Recarga durante navegación.
- Invitación desde otro usuario.

## ❌ Producción definitiva

Todavía no se debe publicar definitivamente.

Antes de producción debe completarse:

1. QA.
2. Seguridad Supabase.
3. Rendimiento.
4. Móvil.
5. PWA.
6. Revisión de dominio.
7. Revisión de variables/configuración.
8. Backup.
9. Merge final.

---

# 6. Arquitectura prevista

```text
                    NEXO
                      │
        ┌─────────────┼─────────────┐
        │             │             │
     Identidad     Mi NEXO       Espacios
        │             │             │
     Perfil       Sesiones      Descubrimiento
     Usuario       Chats          Salas
     Avatar      Contactos
     Estado      Invitaciones
                    │
                  Supabase
                    │
       ┌────────────┼────────────┐
       │            │            │
      Auth       Database      Realtime
       │            │            │
    Usuarios     Salas        Presencia
                 Contactos     Chat
                 Mensajes      Eventos
                    │
                    ▼
              NEXO SALAS
                    │
              Videollamadas
```

---

# 7. Roadmap

## ✅ NEXO 1.x

Landing inicial, salas, identidad visual y concepto.

## ✅ NEXO 2.x

Integración inicial con NEXO Salas y sala personal local.

## ✅ NEXO 3.0

Usuarios reales, Supabase, autenticación y sala permanente.

## ✅ NEXO 3.1

Contactos, invitaciones, historial y navegación personal.

## ✅ NEXO 3.1.1

Notificaciones, favoritos y estabilización.

## 🟡 NEXO 3.2

Perfil completo y presencia inicial.

## 🟡 NEXO 3.3

Presencia online y chat privado.

## 🟡 NEXO 3.3.1

Chat grupal, no leídos, última conexión y mejoras de conversación.

## 🟡 NEXO 3.4

Salas privadas, miembros y permisos.

## ❌ NEXO 3.5

PWA, notificaciones del navegador y optimización móvil final.

## ❌ NEXO 4.0

Ecosistema NEXO avanzado:

- Nexo Work.
- Nexo Edu.
- Nexo Care.
- Comunidades.
- Espacios públicos.
- Herramientas de colaboración.

---

# 8. Definición de terminado

Una versión no se considera terminada solamente porque el código exista.

Debe cumplir:

- ✅ Código implementado.
- ✅ Deploy realizado.
- ✅ Preview funcionando.
- ✅ Login probado.
- ✅ Supabase probado.
- ✅ RLS revisado.
- ✅ Función principal probada con dos usuarios.
- ✅ Prueba móvil.
- ✅ Sin regresiones conocidas.
- ✅ NEXO Salas sin modificaciones no autorizadas.

---

# 9. Regla de trabajo del proyecto

> Primero estabilidad, después funciones nuevas.

Cada nueva versión debe conservar lo que ya funciona y añadirse como capa independiente cuando sea posible.

No se debe modificar NEXO Salas sin autorización explícita.

---

# 10. Próxima prioridad

### Siguiente etapa recomendada: NEXO 3.3.1

Orden de trabajo:

1. Finalizar navegación Mi NEXO.
2. Contador de mensajes no leídos.
3. Última conexión.
4. Chat grupal por sala.
5. Mejorar chat privado.
6. Revisar presencia multi-pestaña.
7. Revisar invitaciones desde chat.
8. QA de regresión.
9. Pasar a salas privadas 3.4.
10. Auditoría de seguridad antes de producción.

---

## Estado de la documentación

**Documento:** README maestro de NEXO

**Última actualización:** 2026-08-19

**Entorno de trabajo:** Preview #5

**Producción:** no modificar hasta completar QA y revisión final.
