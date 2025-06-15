# 🌐 Taller 2: Introducción al Desarrollo Web/Móvil (Frontend)

Este es un cliente web de comercio electrónico desarrollado con **Next.js** y **TypeScript** como parte del Taller 2 de la asignatura *Introducción al Desarrollo Web/Móvil* de la **Universidad Católica del Norte**. El sistema responde a los requerimientos de la empresa ficticia **BLACKCAT**, ofreciendo funcionalidades como catálogo de productos, carrito de compras y gestión de pedidos.

---
## 📌 Integrantes
* Jorge Nuñez Mori (21495752-3) (jorge.nunez@alumnos.ucn.cl)
* Gustavo Miles Osorio (21444967-6) (gustavo.miles@alumnos.ucn.cl)

---
## 📚 Descripción del Proyecto

BLACKCAT solicita a los estudiantes el desarrollo de una plataforma de comercio electrónico con las siguientes características:

- Catálogo de productos con filtros personalizados
- Gestión de un carrito de compras
- Finalización de pedidos
- Soporte para tres roles de usuario:
  - Usuario no autenticado
  - Cliente registrado
  - Administrador

Cada rol tiene funcionalidades específicas adaptadas a sus necesidades dentro del ecosistema comercial.

---

## ⚙️ Tecnologías Utilizadas

### Framework & Lenguaje

- **Next.js** 15.3.2
- **React** 19
- **TypeScript**

### UI & Estilos

- **TailwindCSS**
- **Radix UI** (Dialog, Label, Slot)
- **Lucide React** (íconos SVG)
- `clsx` y `class-variance-authority` (manejo de clases condicionales)

### Gestión de Estado & Formularios

- **Zustand** (estado global)
- **React Hook Form** 7.57.0
- **Zod** 3.25.50 (validación de formularios)

### Otros

- **Sonner** 2.0.5 (notificaciones)
- **Axios** 1.9.0 (HTTP requests)
- **next-themes** (soporte para modo claro/oscuro)

### Herramientas de Desarrollo

- **ESLint** (recomendado)
- **Visual Studio Code** (recomendado)

---

## ✅ Requisitos Previos

Antes de comenzar, asegúrate de tener instalado lo siguiente:

- [Node.js](https://nodejs.org/) v18.x o superior
- [npm](https://www.npmjs.com/) v9.x o superior
- [Git](https://git-scm.com/downloads)
- [Visual Studio Code](https://code.visualstudio.com/) (recomendado)
- Una API Backend funcional (ver sección siguiente)

---

## 🖥️ Backend Requerido

Este proyecto **requiere una API Backend** desarrollada en **C# (.NET)** para funcionar correctamente. Asegúrate de:

1. Tener el backend corriendo localmente o en un servidor accesible.
2. Configurar la URL del backend en las variables de entorno.
3. Verificar que el endpoint `/api/` esté operativo.

Ejemplo de una API funcional:  
`https://localhost:7088/api/`

---

## 🔒 Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto basado en el archivo de ejemplo `.env.example`:

```bash
cp .env.example .env.local
```

Luego edita `.env.local` y asegúrate de que contenga:

```env
NEXT_PUBLIC_API_URL="https://localhost:7088/api/"
DOMAIN=localhost
```

| Variable              | Descripción                                                                 |
|----------------------|-----------------------------------------------------------------------------|
| NEXT_PUBLIC_API_URL  | URL base del backend (ej: `https://localhost:7088/api/`)                    |
| DOMAIN               | Dominio donde se ejecuta el frontend (ej: `localhost` o tu dominio en prod) |

---

## 🚀 Inicio Rápido

Sigue los pasos a continuación para ejecutar el proyecto en tu entorno local:

### 1. Clonar el repositorio

```bash
git clone https://github.com/j0sash1/Taller_2_IDWM.git
cd Taller_2_IDWM
```

### 2. Instalar las dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env.local
```

Edita `.env.local` y agrega los valores correspondientes, especialmente la URL de la API.

### 4. Ejecutar el servidor de desarrollo

```bash
npm run dev
```

Accede a la aplicación en: [http://localhost:3000](http://localhost:3000)

---

## 📦 Preparar para Producción

Para compilar la aplicación para producción:

```bash
npm run build
```

Y para servir la aplicación compilada:

```bash
npm start
```

---

## 🧱 Organización del Código

El proyecto sigue una **arquitectura modular**, organizada por:

- **Vistas**: páginas y rutas principales de la aplicación.
- **Componentes**: elementos reutilizables como botones, formularios, listas, etc.
- **Hooks y stores**: gestión del estado con Zustand y lógica personalizada.
- **Formularios**: construidos y validados con React Hook Form + Zod.
- **Temas**: configuración clara/oscura usando `next-themes`.

---

## 📌 Notas Finales

Este proyecto es parte del curso **Introducción al Desarrollo Web/Móvil** de la **Universidad Católica del Norte**.

- Está pensado como una aplicación de práctica para aplicar principios modernos del desarrollo frontend.
- Se recomienda su uso con una API funcional en .NET que siga buenas prácticas de autenticación y gestión de recursos.

Si tienes problemas para correr la aplicación o integrar el backend, revisa los logs de consola, verifica la URL del backend y asegúrate de que las dependencias estén instaladas correctamente.
