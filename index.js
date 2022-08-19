const qrcode = require("qrcode-terminal");
const { Client, LocalAuth, GroupChat } = require("whatsapp-web.js");

const GROUP_NAME = "Novios FDS 211"; // Pedir a la pareja nacional que cree el grupo con las parejas equipo
const WAIT_TIME_BEFORE_EACH_INVITE = 5000; //Esperar 5 segundos antes de agregar a cada participante
const SENDER_NAME = "Cesar Bonilla";
const NUMBER_LIST = [""]; //Lista de numeros como strings sin el 504

const client = new Client({
  authStrategy: new LocalAuth(),
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", async () => {
  console.log("Client is ready!");
  const chats = await client.getChats();
  const groupFDSNovios = chats.find((chat) => {
    return chat.name === GROUP_NAME;
  });

  if (!groupFDSNovios || !groupFDSNovios.isGroup) {
    throw new Error(`No se encontro el grupo con el nombre ${GROUP_NAME}`);
  }

  const userIdsToAdd = NUMBER_LIST.map((userNumber) => `504${userNumber}@c.us`);

  const existingUserIds = groupFDSNovios.groupMetadata.participants.map(
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
  for await (const participantId of userIdsThatAreNotInTheGroup) {
    const result = await groupFDSNovios.addParticipants([participantId]);
    switch (result.status) {
      case 207: {
        if (result[participantId] === 403) {
          retriableUserIds.push(participantId);
        }
      }
      case 400: {
        failedUserIds.push(participantId);
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

  const inviteCode = await groupFDSNovios.getInviteCode();
  const inviteLink = `https://chat.whatsapp.com/${inviteCode}`;

  console.log("Invite URL: ", inviteLink);

  for await (const participantId of retriableUserIds) {
    const contact = await client.getContactById(participantId);
    const chat = await contact.getChat();
    console.log("Sending message to", participantId);
    await chat.sendMessage(
      `Hola, buen dia. Le saluda ${SENDER_NAME} del encuentro catolico para novios. Hemos creado un grupo de Whatsapp, por el cual se estara enviando informacion pertinente a las charlas. Puede unirse al grupo usando el enlance: ${inviteLink}`
    );
  }

  console.log("Finalizado!");
  process.exit(0);
});

client.initialize();

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
