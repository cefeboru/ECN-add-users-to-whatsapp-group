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

Para iniciar el scrip basta con:
```
npm run start
```

La primera vez que ejecutemos el script, este mostrara el codigo QR en la terminal. Deberemos agregar de escanear el codigo QR con nuestro Whatsapp (Como cuando accedemos a Whatsapp web).

Tambien, es necesario asegurarnos que la data es correcta, al inicio de `index.js` esta definidas las variables que necesitamos para correr el script:

```javascript
const GROUP_NAME = "Novios FDS 211"; // Pedir a la pareja nacional que cree el grupo con las parejas equipo
const WAIT_TIME_BEFORE_EACH_INVITE = 5000; //Esperar 5 segundos antes de agregar a cada participante
const SENDER_NAME = "Cesar Bonilla";
const NUMBER_LIST = [""]; //Lista de numeros como strings sin el 504
```

# Mejoras a Futuro

- Convertir a CLI y requerir la data como parametros