# 🏦Banco Acme - Simulador de Operaciones Bancarias

Este proyecto es una simulación de un sistema bancario en entorno web. Permite a los usuarios registrarse, iniciar sesión, realizar transacciones financieras y consultar extractos mensuales.

## 🚀 Funcionalidades

- Registro e inicio de sesión de usuarios
- Generación automática de número de cuenta
- Transacciones disponibles:
  - Depósitos
  - Retiros
  - Pagos
  - Certificados
- Generación de extracto bancario por mes y año
- Persistencia de datos en `localStorage` y `sessionStorage`
- Interfaz dividida en:
  - Página de ingreso (`index.html`)
  - Panel de usuario (`dashboard.html`)

## 📁 Estructura del Proyecto

```
16julbank/
├── index.html # Página principal (login/registro)
├── dashboard.html # Panel de usuario
├── script.js # Lógica principal
├── ui.js # Manejo de la interfaz de usuario
├── services.js # Funciones de datos y transacciones
├── styles.css # Estilos generales
├── assets/ # Imágenes utilizadas
│ ├── fondo.png
│ ├── logo.png
│ └── 
```


## 🧰 Tecnologías Utilizadas

- HTML5
- CSS3
- JavaScript (ES6)
- Web Storage API (`localStorage`, `sessionStorage`)

## 💻 Cómo Ejecutar

1. Clona o descarga este repositorio.
2. Abre `index.html` en tu navegador web.
3. Regístrate como nuevo usuario y accede al sistema para comenzar a operar.

> No requiere servidor ni base de datos externa. Todo se almacena en el navegador.

## 📌 Notas

- Este proyecto está diseñado para propósitos educativos y de simulación.
- La seguridad y persistencia no están garantizadas para producción.


👤 Autores: Luis Alejandro Guerrero ropero
👤 Autores: Diego diaz suarez
👤 Autores: yessica jaramillo cortina

¡Gracias por visitar Banco Acme! 💰
