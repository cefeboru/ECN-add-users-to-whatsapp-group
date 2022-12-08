const yargs = require('yargs/yargs')(process.argv.slice(2));
const qrcode = require("qrcode-terminal");
const { Client } = require("whatsapp-web.js");
const path = require('path');

const WAIT_TIME_BEFORE_EACH_INVITE = 5000; //Esperar 5 segundos antes de agregar a cada participante
const SENDER_NAME = "Cesar Bonilla";
const NUMBER_LIST = require('./phoneNumbers'); //Lista de numeros como strings sin el 504

const argv = yargs.demandOption(['nombre-grupo']).argv;

const client = new Client({
  puppeteer: {
    userDataDir: path.resolve(__dirname, './userData'),
  }
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on('authenticated', () => {
  console.log('Auth fue correcta');
})

client.on('auth_failure', (message) => {
  console.error(message);
})

client.on("ready", async () => {
  console.log("Client is ready!");
  console.log(`Se tratara de agregar ${NUMBER_LIST.length} numeros`);
  const chats = await client.getChats();
  const groupFDSNovios = chats.find((chat) => {
    return chat.name === argv.nombreGrupo;
  });

  if (!groupFDSNovios || !groupFDSNovios.isGroup) {
    throw new Error(`No se encontro el grupo con el nombre ${argv.nombreGrupo}`);
  }

  const userIdsToAdd = NUMBER_LIST.map((userNumber) => `504${userNumber}@c.us`);

  console.log(groupFDSNovios.participants);

  const existingUserIds = groupFDSNovios.participants.map(
    (participant) => participant.id._serialized
  );

  const existingUsersIdsSet = new Set(existingUserIds);

  const userIdsThatAreNotInTheGroup = userIdsToAdd.filter(
    (newId) => !existingUsersIdsSet.has(newId)
  );

  if (userIdsThatAreNotInTheGroup.length === 0) {
    console.log("Todos los participantes ya estan en el grupo");
    process.exit(0);
  }

  const retriableUserIds = [];
  const failedUserIds = [];

  console.log(`Agregando ${userIdsThatAreNotInTheGroup.length} participantes...`);

  for await (const participantId of userIdsThatAreNotInTheGroup) {
    const result = await groupFDSNovios.addParticipants([participantId]);
    console.log(JSON.stringify(result, null, '\t'));
    switch (result.status) {
      case 207: {
        if (result.participants[0]?.code == 403) {
          retriableUserIds.push(participantId);
        }
        break;
      }
      case 400: {
        failedUserIds.push(participantId);
        break;
      }
    }
    await sleep(WAIT_TIME_BEFORE_EACH_INVITE);
  }

  if (retriableUserIds.length === 0) {
    console.log("Finalizado!");
    process.exit(0);
  }

  console.log(
    "Algunos participantes no se agregaron correctamente, se les enviaran un mensaje con el enlace para unirse al grupo..."
  );
  console.log(retriableUserIds);

  const inviteCode = await groupFDSNovios.getInviteCode();
  const inviteLink = `https://chat.whatsapp.com/${inviteCode}`;

  console.log("Invite URL: ", inviteLink);

  for await (const participantId of retriableUserIds) {
    const contact = await client.getContactById(participantId);
    const chat = await contact.getChat();
    console.log("Enviando mensaje a", participantId);
    console.log(chat)
    await chat.sendMessage(
      `Hola, buen dia. Le saluda ${SENDER_NAME} del encuentro catolico para novios. Hemos creado un grupo de Whatsapp, por el cual se estara enviando informacion pertinente a las charlas. Puede unirse al grupo usando el enlance: ${inviteLink}`
    );
  }

  console.log("Finalizado!");
  if (failedUserIds.length > 0) {
    logFailedUserIds(failedUserIds);
  }
  process.exit(0);

  function logFailedUserIds(numbers) {
    console.log('No se pudo agregar estos numeros:', numbers);
  }
});

client.initialize();

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
