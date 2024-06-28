# Prueba Técnica Frontend - Angular

## Indicaciones generales

- Asegúrate de tener Node.js instalado. Puedes descargarlo desde [Node.js](https://nodejs.org/), que incluye npm (Node Package Manager).
- Instala Angular CLI globalmente para trabajar con proyectos Angular:
```sh
npm install -g @angular/cli
```


### Arranque en un solo paso

- Posicionarte en la raiz del proyecto e instalar las dependencias
```sh
npm install
```
- Correr ambos servicios. Esto ejecutará un npm install antes de correr cada servicio e inicializará el proyecto de Angular abriendo una pestaña en el navegador.
```sh
npm run dev
```


## Configuración Inicial del Proyecto (Arranque manual de back y front)

### Ejecutar Proyecto Node.js (Backend)
- Instalación de Dependencias:

```sh
cd backend/
npm install
```
- Ejecutar el Servidor:
```sh
cd backend/
npm run dev # Se abre por defecto en http://localhost:3002/
```

### Ejecutar Proyecto Angular (Frontend)
- Instalación de Dependencias:
```sh
cd frontend/ 
npm install  
```

- Configuración de Variables de Entorno:
Asegúrate de ajustar environment.ts según sea necesario para configurar las URLs de API u otras variables específicas del entorno. Se ha incluido un archivo environment.ts como muestra.

- Compilar y Ejecutar la Aplicación:
 ```sh
ng serve  # Compila y sirve la aplicación en http://localhost:4200/
```

### Integración y Uso
Una vez que ambos servidores estén en funcionamiento, accede a la aplicación desde tu navegador web. La aplicación Angular se conectará al servidor Node.js para obtener datos y realizar operaciones.

### Pruebas Unitarias
```sh
cd frontend/ 
ng test  
```





