# Frontend - Gestión de Instructores SENA

Este es el frontend del sistema para gestionar instructores SENA. Permite registrar instructores, asignarles áreas, definir horarios semanales, y aplicar soft delete para manejo de inactivos. La interfaz está construida con Vue 3 y Vuetify.

## 🌐 Tecnologías

- [Vue 3](https://vuejs.org/)
- [Vuetify 3](https://vuetifyjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- Fetch API
- Vite

## ⚙️ Requisitos Previos

- Node.js (v18 o superior)
- npm o yarn
- Backend corriendo (ver [backend](../backend/README.md))

## 🚀 Instalación

1. **Clona el repositorio:**

```bash
git clone <url-del-repo>
cd frontend-instructores
Instala las dependencias:

bash
Copiar
Editar
npm install
Configura variables de entorno:

Crea el archivo .env en la raíz con esta variable (si es necesario):

bash
Copiar
Editar
VITE_BACKEND_URL=http://localhost:3333
Asegúrate que esta URL coincida con la de tu backend.

Inicia la app en modo desarrollo:

bash
Copiar
Editar
npm run dev
Abre el navegador en: http://localhost:5173

📁 Estructura del Proyecto
csharp
Copiar
Editar
├── src/
│   ├── components/           # Componentes reutilizables
│   ├── views/                # Vistas principales
│   ├── services/             # Comunicación con API
│   ├── router/               # Rutas del frontend
│   ├── stores/               # Pinia (si se usa)
│   └── App.vue / main.ts     # Entradas principales
├── public/                   # Archivos estáticos
├── vite.config.ts            # Configuración de Vite
└── tsconfig.json             # Configuración TypeScript
🧩 Funcionalidades
📋 Lista paginada de instructores

➕ Crear instructor con nombre, cédula y área

🕒 Asignación de horarios semanales (día, hora inicio/fin)

✏️ Editar instructores existentes

🗑️ Soft delete (inactivación)

🔁 Restaurar instructores inactivos

🧭 Gestión CRUD de áreas

✅ Validaciones en formulario con Vuetify

📦 Confirmación antes de guardar o eliminar

🧑‍🎓 Autor
Christopher David Ramírez Pérez
SENA - Evaluación Técnica Fullstack Junior Recuperación
TEMA: Instructores SENA

yaml
Copiar
Editar