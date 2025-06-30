const axios = require("axios");

module.exports.successMsg = (baseUrl, endUrl, resStatus, resMsg) => {
  const service = checkService(baseUrl);
  const msg =
    "```" +
    `\n🧪 ${service}\n` +
    `\n✅ [${baseUrl}${endUrl}]\n` +
    `Status Code: ${resStatus}\n` +
    `Response: ${JSON.stringify(resMsg, null, 2)}\n` +
    `Time: ${new Date().toISOString()}\n` +
    "```";

  return msg;
};

module.exports.errorMsg = (baseUrl, endUrl, resStatus = 400, resMsg) => {
  const service = checkService(baseUrl);
  const msg =
    "```" +
    `\n🧪 ${service}\n` +
    `\n🚨 [${baseUrl}${endUrl}] failed\n` +
    `Status Code: ${resStatus}\n` +
    `Response: ${JSON.stringify(resMsg, null, 2)}\n` +
    `Time: ${new Date().toISOString()}\n` +
    "```";

  return msg;
};

module.exports.sendDiscordAlert = async (channel, message) => {
  const broadCastChannel = checkChannel(channel);

  try {
    await axios.post(broadCastChannel, {
      content: message,
    });
  } catch (err) {
    console.error("Failed to send Discord alert:", err.message);
  }
};

const checkService = (baseUrl) => {
  switch (baseUrl) {
    case "https://integritas.minima.global/api":
      return "Landing site (public)";
    case "https://integritas.minima.global/core/v1/web":
      return "Core API (public)";
    case "https://docs.integritas.minima.global/api":
      return "Docs (public)";
    case "https://integritas.minima.global/app":
      return "Integritas+ (public)";
    case "http://localhost:5000/v1":
      return "Core API (localhost)";
    case "http://localhost:9005":
      return "Minima Mega Node (localhost)";
    case "http://localhost:9905":
      return "Minima Node (localhost)";
    default:
      return "https://integritas.minima.global";
    // Code to execute if no case matches
  }
};

const checkChannel = (channel) => {
  switch (channel) {
    case "healthcheck":
      return process.env.DISCORD_HEALTHCHECK_WEBHOOK_URL;
    case "core":
      return process.env.DISCORD_CORE_WEBHOOK_URL;
    case "node":
      return process.env.DISCORD_NODE_WEBHOOK_URL;
    default:
      return process.env.DISCORD_WEBHOOK_URL;
  }
};
