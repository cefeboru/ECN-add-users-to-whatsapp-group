# Descripcion

Utilidad escrita en Nodejs para agregar a las parejas inscritas a un FDS al grupo de Whatsapp creado. La persona que corrar el script debera de agregar el dispositivo en Whatsapp, el codigo QR se imprimira en la consola.

Se agregaran a las personas al grupo, pero hay ciertas personas que pueden configurar WhatsApp para no permitir que personas que no estan en sus contactos los agreguen a grupos. En esa situacion, se creara un enlace para unirse al grupo y se les enviara un mensaje directo a las personas con este enlace.

# Instalacion

Se requiere node 16.x, el cual se puede descargar desde: https://nodejs.org/es/download/

Tambien necesitamos instalar las dependencias, corremos el siguiente comando desce la consola.

Usando npm:
```
npm install
```

Usando yarn:
```
yarn install
```

# Como correr el script

La primera vez que ejecutemos el script, este mostrara el codigo QR en la terminal. Deberemos de escanear el codigo QR con nuestro Whatsapp (Como cuando accedemos a Whatsapp web).

Tambien, es necesario asegurarnos que la data es correcta, al inicio de `index.js` esta definidas las variables que necesitamos para correr el script:

```javascript
const WAIT_TIME_BEFORE_EACH_INVITE = 5000; // Esperar 5 segundos antes de agregar a cada participante
const SENDER_NAME = "Cesar Bonilla";
```

## Numeros telefonicos
Agregar los numeros telefonicos en el archivo `phoneNumbers.js`. Ejemplo:

```js
module.exports = [
    "32807873",
    "99980705"
];
```

## Iniciar el script
```
npm run start --nombre-grupo="Novios FDS XXX"
```
Pedir a la pareja nacional que cree el grupo con las parejas equipo (o crearlo ustedes y agregar a las parejas equipo), donde XXX es el numero de FDS. 

Nota: El grupo debe de existir antes de correr el script.