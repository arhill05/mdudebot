const configUtils = require('../utils/configUtils');
const LOWER_VOLUME_LIMIT = 0;
const UPPER_VOLUME_LIMIT = 200;

async function config(message, firstParam, args) {
  if (firstParam && firstParam.toLowerCase() === 'set') {
    handleSet(message, args);
  } else if (firstParam && firstParam.toLowerCase() === 'get'){
    handleGet(message, args);
  } else {
    message.channel.send('Not a valid config command!');
  }
};

function isValueValid(config, configValueToSet, newValue) {
  if (!Object.keys(config).includes(configValueToSet)) {
    return false;
  }

  if (configValueToSet === 'volume') {
    const volumeAsNumber = Number(newValue);
    return volumeAsNumber >= LOWER_VOLUME_LIMIT && volumeAsNumber <= UPPER_VOLUME_LIMIT;
  }
}

function handleSet(message, args) {
  const configValueToSet = args.shift();
  const newValue = args.shift();
  const config = configUtils.getConfigFromJson();

  if (isValueValid(config, configValueToSet, newValue)) {
    config[configValueToSet] = newValue;
    configUtils.writeConfigToJson(config);
    message.channel.send(`${configValueToSet} set to ${newValue}`);
  } else {
    message.channel.send(`Invalid value for ${configValueToSet}!`);
  }
}

function handleGet(message, args) {
  const configValueToGet = args.shift();
  const config = configUtils.getConfigFromJson();
  if (!Object.keys(config).includes(configValueToGet)) {
    message.channel.send(`${configValueToGet} does not exist in the config`);
    return;
  }
  message.channel.send(`${configValueToGet}: ${config[configValueToGet]}`);
}

async function addCommandsToList() {
  let commandDescription =
    `**Config**
    \`%config\` allows you to get/set various settings.
    \`%config set volume 100\` will set the volume of sounds played to 100%. Valid values are 0 - 200.
    \`%config get volume\` will return the current volume level.
    `
  global.commandsList.push(commandDescription);
}

addCommandsToList();

module.exports = config;