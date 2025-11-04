# 🌐 MoniSitios

**MoniSitios** es una aplicación web desarrollada para **monitorizar el rendimiento y la disponibilidad de sitios web en tiempo real**. Permite configurar alertas automáticas, visualizar métricas y analizar el estado de diferentes sitios desde una interfaz moderna y fácil de usar.

---

## 📋 Índice

- [Introducción](#introducción)
- [Características principales](#características-principales)
- [Arquitectura del sistema](#arquitectura-del-sistema)
- [Tecnologías utilizadas](#tecnologías-utilizadas)
- [Instalación y despliegue](#instalación-y-despliegue)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Guía de estilos](#guía-de-estilos)
- [Autor](#autor)
- [Licencia](#licencia)

---

## 🧩 Introducción

En el entorno digital actual, la disponibilidad y el rendimiento de los sitios web son críticos.  
**MoniSitios** proporciona una solución integral que permite a los usuarios **supervisar sus páginas web**, detectar fallos y recibir notificaciones automáticas cuando surgen problemas, mejorando así la **experiencia de usuario** y la **fiabilidad del servicio**.

---

## 🚀 Características principales

- Monitorización en tiempo real de sitios web.  
- Configuración de umbrales y criterios de alerta.  
- Notificaciones automáticas por email o SMS.  
- Panel de control interactivo con gráficas (Chart.js).  
- Autenticación con **JWT** y control de roles.  
- Arquitectura **Fullstack** con Laravel + React.  
- Despliegue mediante **Docker Compose**.

---

## 🏗️ Arquitectura del sistema

El sistema se compone de varios contenedores Docker:

| Servicio      | Descripción |
|----------------|-------------|
| **Laravel API** | Backend encargado de la lógica, gestión de datos y autenticación. |
| **React App** | Interfaz de usuario dinámica y responsiva. |
| **MySQL** | Base de datos principal. |
| **phpMyAdmin** | Interfaz web para gestionar la base de datos. |

### Comunicación Front–Back
La interacción se realiza mediante **API RESTful** utilizando **Axios**.  
La autenticación se gestiona con **tokens JWT**, garantizando seguridad y control de acceso.

---

## 💻 Tecnologías utilizadas

### Backend (Laravel)
- `laravel/framework`
- `laravel/sanctum`
- `firebase/php-jwt`
- `guzzlehttp/guzzle`
- `spatie/laravel-permission`
- `PHPUnit`, `Mockery`, `Collision`

### Frontend (React)
- `React`, `React Router DOM`
- `Redux` y `Context API`
- `Axios`
- `Chart.js`, `react-chartjs-2`
- `Bootstrap`, `SASS`, `FontAwesome`
- `Jest`, `Testing Library`, `MSW`

### Infraestructura
- **Docker Compose**
- **MySQL 8.2**
- **phpMyAdmin**
- **Laravel Scheduler (tareas automáticas)**

---

## ⚙️ Instalación y despliegue

### 1️⃣ Clonar el repositorio
```bash
git clone https://github.com/02pac02/Monisitios.git
cd Monisitios
### 2️⃣ Levantar los contenedores
Asegúrate de tener Docker instalado. Luego ejecuta:
docker compose up -d
### 3️⃣ Inicializar datos y tareas
make data        # Crea tablas y roles
make automatic   # Ejecuta el cron para comprobaciones automáticas
make proof       # Prueba de chequeo de URLs
### 4️⃣ Acceder a la aplicación

Abre tu navegador y entra en
👉 http://localhost:3001

## 📁 Estructura del proyecto
/react-app         → Frontend en React
/laravel-api       → Backend en Laravel
/docker-compose.yml

## 🎨 Guía de estilos

Colores: tonos grises y blancos sobre fondo oscuro.

Tipografía: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif

Framework CSS: Bootstrap con SASS

Logo: pantalla con gráficas, representando la monitorización.

Imágenes: provenientes de Pixabay.

## 👤 Autor

Julián Ramos Jiménez
📚 2º DAW – Dpto. Informática
📍 I.E.S. San Sebastián – C.F.G.S. Desarrollo de Aplicaciones Web
✉️ Proyecto académico: Aplicación de monitorización de sitios web en tiempo real.

## 📜 Licencia

Este proyecto se publica bajo licencia MIT.
Eres libre de usar, modificar y distribuir el código con atribución al autor original.

