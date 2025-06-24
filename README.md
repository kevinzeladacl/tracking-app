# Tracking App

Aplicación móvil desarrollada con Ionic y Angular para la gestión de usuarios, metas personales y notificaciones. El proyecto cuenta con autenticación, registro, seguimiento de objetivos, y módulos de servicios que permiten la integración con bases de datos y lógica de negocio personalizada.

---

## Resumen del Proyecto
Tracking App es una aplicación móvil orientada al seguimiento y gestión de metas personales. Permite a los usuarios registrarse, iniciar sesión, crear y actualizar metas, recibir notificaciones y gestionar su perfil. Utiliza tecnologías modernas como Ionic, Angular y Supabase para ofrecer una experiencia multiplataforma.

## Funcionalidades Principales

- **Autenticación y Registro**: Módulos dedicados para el login y registro de usuarios, integrando servicios de autenticación y validación de datos.
- **Gestión de Metas (Goals)**:
  - Crear, actualizar y marcar metas como completadas.
  - Visualización de metas en calendario y modal.
- **Notificaciones**: Sistema para mostrar notificaciones relevantes al usuario.
- **Gestión de Perfil**: Actualización de datos del usuario y personalización de la experiencia.
- **Servicios**:
  - `auth.service`: Lógica de autenticación.
  - `directory.service`: Manejo de directorios y datos asociados.
  - `price-rules.service`: Gestión de reglas de precios (útil para apps con lógica de negocio avanzada).
  - `utils.service`: Utilidades generales para la app.
- **Navegación por Tabs**: Interfaz de usuario basada en pestañas para acceder rápidamente a las secciones principales.
- **Carga y Splash**: Módulos de loading para mejorar la experiencia de usuario al iniciar la app.

## Estructura de Carpetas Destacadas

- `src/app/goals/`: Modales y lógica para crear, ver, actualizar y marcar metas.
- `src/app/login/`, `src/app/register/`, `src/app/update-user/`: Autenticación y gestión de usuario.
- `src/app/notifications/`: Página y lógica de notificaciones.
- `src/app/services/`: Servicios reutilizables para autenticación, lógica de negocio y utilidades.
- `src/app/tabs/`: Navegación principal de la app.

## Consideraciones para Futuras Mejoras con IA

- **Recomendaciones Inteligentes**: Implementar modelos de IA para sugerir metas personalizadas según el comportamiento y progreso del usuario.
- **Análisis Predictivo**: Analizar patrones de uso para anticipar necesidades y ofrecer recordatorios proactivos.
- **Procesamiento de Lenguaje Natural**: Permitir a los usuarios interactuar con la app mediante comandos de voz o texto, facilitando la creación y actualización de metas.
- **Notificaciones Inteligentes**: Usar IA para optimizar el envío de notificaciones en momentos clave, maximizando la interacción y el cumplimiento de metas.
- **Análisis de Sentimiento**: Incorporar análisis de sentimiento en las interacciones del usuario para adaptar la experiencia y brindar soporte personalizado.

---

## Instalación y Ejecución

1. Instala las dependencias:
   ```bash
   npm install
   ```
2. Copia el archivo de ejemplo de entorno:
   ```bash
   cp src/environments/environment.example.ts src/environments/environment.ts
   # Edita src/environments/environment.ts con tus datos reales
   ```
3. Ejecuta la app en modo desarrollo:
   ```bash
   ionic serve
   ```

## Variables de Entorno

El proyecto utiliza archivos de entorno para separar la configuración sensible del código fuente. Ejemplo de variables requeridas:

```typescript
export const environment = {
  production: false,
  apiUrl: 'https://your-api-url.com',
  supabaseUrl: 'https://your-supabase-url.supabase.co',
  supabaseAnonKey: 'tu-clave-anon-de-supabase'
};
```

- No subas tus archivos `environment.ts` reales a repositorios públicos.
- Usa siempre `environment.example.ts` como plantilla para nuevos entornos.

## Buenas Prácticas
- Variables sensibles y claves públicas solo en archivos de entorno.
- Usa `.gitignore` para excluir carpetas como `android/`, `ios/`, `node_modules/`, archivos de entorno reales y cualquier archivo generado.
- Mantén el código organizado en módulos, servicios y páginas.
- Escribe pruebas y utiliza linters para mantener la calidad del código.
- Documenta nuevas funciones y servicios.

## Tecnologías Utilizadas
- Ionic
- Angular
- Supabase
- Capacitor

## Autor

Proyecto desarrollado por el equipo de Kevin Zelada.

---
