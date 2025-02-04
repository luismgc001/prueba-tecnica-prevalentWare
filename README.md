# Prueba Tecnica Prevalentware

## Requisitos Previos

- Node.js 18.x o superior
- npm o yarn
- Git

## Instalación Local

1. Clonar el repositorio
```bash
git clone https://github.com/luismgc001/prueba-tecnica-prevalentWare
cd prueba-tecnica-prevalentWare
```

2. Instalar dependencias
```bash
npm install
# o
yarn install
```

3. Configurar variables de entorno
- Crea un archivo `.env` en la raíz del proyecto
- Copia el contenido del archivo `.env` proporcionado por correo

4. Configurar la base de datos
```bash
# Generar el cliente de Prisma
npx prisma generate

```

5. Iniciar el servidor de desarrollo
```bash
npm run dev
# o
yarn dev
```

La aplicación estará disponible en `http://localhost:3000`

Enlace de aplicación desplegada en Vercel: `https://prueba-tecnica-prevalent-ware-two.vercel.app/`

## Ejecutar Tests

Este proyecto utiliza Jest para testing. Para ejecutar los tests:

```bash
# Ejecutar todos los tests
npm test

```

## Despliegue en Vercel

1. Crea una cuenta en [Vercel](https://vercel.com) si aún no tienes una

2. Instala Vercel CLI (opcional)
```bash
npm i -g vercel
```

3. Conecta tu repositorio con Vercel
   - Ve a [Vercel](https://vercel.com)
   - Click en "New Project"
   - Importa tu repositorio de GitHub
   - Configura el proyecto:
     - Framework Preset: Next.js
     - Build Command: `prisma generate && next build`
     - Output Directory: `.next`

4. Configura las variables de entorno
   - En el dashboard de Vercel, ve a Settings > Environment Variables
   - Agrega todas las variables de entorno del archivo `.env`
   - Asegúrate de actualizar las URLs y endpoints para producción

5. Despliega
```bash
# Si usas Vercel CLI
vercel

# O simplemente haz push a tu rama main/master
git push origin main
```
## Despliegue en Vercel usando la interfaz grafica.

### 1. Preparación
- Asegúrate de que tu proyecto esté en un repositorio de GitHub
- Crea una cuenta en [Vercel](https://vercel.com) si aún no tienes una
- Asegúrate de tener tu archivo `.env` a mano

### 2. Importar Proyecto
1. Ve a [Vercel](https://vercel.com)
2. Haz clic en "Add New..."
3. Selecciona "Project"
4. En la sección "Import Git Repository":
   - Si es la primera vez, haz clic en "Import GitHub Account"
   - Autoriza a Vercel para acceder a tus repositorios
5. Busca y selecciona tu repositorio en la lista

### 3. Configurar Proyecto
En la pantalla de configuración:

1. **Configure Project**
   - Framework Preset: Selecciona `Next.js`
   - Root Directory: `./` (si tu proyecto está en la raíz)
   - Build and Output Settings:
     - Build Command: `prisma generate && next build`
     - Output Directory: `.next`
     - Install Command: `npm install`

2. **Environment Variables**
   - Copia todas las variables de tu archivo `.env` reemplazando [localhost](http://localhost:3000/) por la url proporcionada por vercel.

3. **Deploy**
   - Haz clic en "Deploy"
   - Espera a que el despliegue se complete



## Credenciales de Prueba

Para probar la aplicación, se proporcinaron credenciales de algunos usuarios por correo.