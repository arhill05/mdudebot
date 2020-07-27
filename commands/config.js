const path = require('path');
const fs = require('fs');
const client = global.discordClient;
const soundsPath = (path.resolve(__dirname, '../sounds'));
const soundsUtils = require('../utils/soundsUtils');
const CONFIG_PATH = (path.resolve(__dirname, '../config.json'));

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
    return volumeAsNumber >= 0 && volumeAsNumber <= 200;
  }
}

function handleSet(message, args) {
  const configValueToSet = args.shift();
  const newValue = args.shift();
  const config = getConfigFromJson();

  if (isValueValid(config, configValueToSet, newValue)) {
    config[configValueToSet] = newValue;
    writeConfigToJson(config);
  } else {
    message.channel.send(`Invalid value for ${configValueToSet}!`);
  }
}

function handleGet(message, args) {
  const configValueToGet = args.shift();
  const config = getConfigFromJson();
  if (!Object.keys(config).includes(configValueToGet)) {
    message.channel.send(`${configValueToGet} does not exist in the config`);
    return;
  }
  message.channel.send(`${configValueToGet}: ${config[configValueToGet]}`);
}

function getConfigFromJson() {
  const rawData = fs.readFileSync(CONFIG_PATH);
  const configObject = JSON.parse(rawData);
  return configObject;
}

function writeConfigToJson(config) {
  const configString = JSON.stringify(config);
  fs.writeFileSync(CONFIG_PATH, configString);
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