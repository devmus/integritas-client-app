const axios = require("axios");
const {
  successMsg,
  errorMsg,
  sendDiscordAlert,
} = require("../utils/respondMsg");

module.exports = async function runTests(baseUrl) {
  const endUrl = "/check/health/";
  try {
    const res = await axios.get(`${baseUrl}${endUrl}`);

    const msg = successMsg(baseUrl, endUrl, res.status, res.data);

    await sendDiscordAlert("healthcheck", msg);
  } catch (err) {
    const msg = errorMsg(baseUrl, endUrl, err.status, err.message);

    await sendDiscordAlert("healthcheck", msg);
  }
};
