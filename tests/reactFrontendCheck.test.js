const axios = require("axios");
const {
  errorMsg,
  successMsg,
  sendDiscordAlert,
} = require("../utils/respondMsg");

module.exports = async function reactFrontendCheck(baseUrl) {
  try {
    const res = await axios.get(baseUrl, { timeout: 5000 });

    if (
      res.status === 200 &&
      res.headers["content-type"].includes("text/html")
    ) {
      const responseMsg = `[OK] Frontend at ${baseUrl} responded with 200 and HTML content.`;

      const msg = successMsg(baseUrl, "/", res.status, responseMsg);

      await sendDiscordAlert("healthcheck", msg);
    } else {
      const errorResponseMsg = `[WARN] Unexpected response from ${baseUrl}:`;

      const msg = errorMsg(baseUrl, 404, errorResponseMsg);

      await sendDiscordAlert("healthcheck", msg);
    }
  } catch (err) {
    const errorResponseMsg = `[ERROR] Frontend at ${baseUrl} is unreachable:`;

    const msg = errorMsg(baseUrl, "/", err.status, errorResponseMsg);

    await sendDiscordAlert("healthcheck", msg);
  }
};
