# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).

---

## ✅ `README.md` — FRONTEND (`frontend-instructores`)

```md
# Frontend - Gestión de Instructores SENA

Este proyecto implementa la interfaz web del sistema de gestión de Instructores SENA, usando **Vue 3**, **Vite** y **Vuetify 3**.

## 🚀 Requisitos

- Node.js 18+
- Navegador moderno (Chrome, Edge, etc.)

## 📦 Instalación

```bash
git clone https://github.com/tu-usuario/recuperacion-frontend.git
cd recuperacion-frontend
npm install
🧪 Ejecutar en desarrollo
bash
Copiar
Editar
npm run dev
Accede en: http://localhost:5173

🔗 Configuración de CORS
Asegúrate de que el backend (http://localhost:3333) tenga habilitado CORS para el frontend (http://localhost:5173) en el archivo config/cors.ts.

ts
Copiar
Editar
origin: ['http://localhost:5173']
🔧 Funcionalidades implementadas
Tabla paginada de instructores con Vuetify

Formulario de creación/edición reutilizable

Gestión dinámica de disponibilidad horaria (con validación de traslapes)

Eliminación lógica (soft delete)

Vista de especialistas inactivos y restauración

Validación de traslapes tanto en frontend como backend

🧑‍🎓 Autor
Christopher David Ramírez Pérez
SENA - Evaluación Técnica Fullstack Junior Recuperación
TEMA: Instructores SENA

yaml
Copiar
Editar