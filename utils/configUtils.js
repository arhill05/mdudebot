const path = require('path');
const fs = require('fs');
const CONFIG_PATH = (path.resolve(__dirname, '../config.json'));

function getConfigValue(key) {
  const config = getConfigFromJson();
  return config[key];
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

module.exports = {
  getConfigValue,
  getConfigFromJson,
  writeConfigToJson
}