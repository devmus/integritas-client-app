const {
  successMsg,
  sendDiscordAlert,
  errorMsg,
} = require("../utils/respondMsg");

module.exports.blockTests = async (baseUrl) => {
  const parameter = "/block";

  try {
    const res = await fetch(`${baseUrl}${parameter}`);

    const rawData = await res.text();

    let block = "";
    try {
      const parsed = JSON.parse(rawData);
      block = parsed?.response?.block ?? "unknown";
    } catch {
      block = "non-JSON response";
    }

    const msg = successMsg(baseUrl, parameter, res.status, block);

    await sendDiscordAlert("node", msg);
  } catch (err) {
    console.error("🚨 FETCH ERROR:", err);
    const msg = errorMsg(baseUrl, parameter, 500, err.message);

    await sendDiscordAlert("node", msg);
  }
};
