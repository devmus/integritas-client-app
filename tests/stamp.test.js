const axios = require("axios");
const {
  successMsg,
  errorMsg,
  sendDiscordAlert,
} = require("../utils/respondMsg");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

module.exports.stampTests = async (baseUrl) => {
  const resHashTest = await hashTest(baseUrl);
  if (resHashTest === "FAILED") return;
  await delay(3 * 60 * 1000);
  const resStampDataTest = await stampDataTest(baseUrl, resHashTest);
  if (resHashTest === "FAILED") return;
  await delay(3 * 60 * 1000);
  const resStatusTest = await statusTest(baseUrl, [resStampDataTest]);
  if (resHashTest === "FAILED") return;
  await delay(3 * 60 * 1000);
  await verifyTest(baseUrl, resStatusTest);
};

////////////
// TEST 1 //
////////////

const hashTest = async (baseUrl) => {
  const filePath = path.resolve(__dirname, "../files/abc.md");
  const endUrl = "/file/hash/";

  try {
    // Create form-data
    const form = new FormData();
    const buffer = fs.readFileSync(filePath);

    form.append("file", buffer, {
      filename: "abc.md",
      contentType: "text/markdown", // or whatever mimetype is correct
    });

    const res = await axios.post(`${baseUrl}${endUrl}`, form, {
      headers: {
        ...form.getHeaders(),
        "x-api-key": process.env.API_KEY,
        "x-request-id": "RUNTIME CHECK",
      },
    });

    const msg = successMsg(baseUrl, endUrl, res.status, res.data);

    await sendDiscordAlert("core", msg);
    return res.data.data.hash;
  } catch (err) {
    let msg = "";

    if (err?.response?.data) {
      msg = errorMsg(baseUrl, endUrl, err.response?.status, err.response.data);
    } else {
      msg = errorMsg(baseUrl, endUrl, err.response?.status, err.message);
    }

    await sendDiscordAlert("core", msg);
    return "FAILED";
  }
};

////////////
// TEST 2 //
////////////

const stampDataTest = async (baseUrl, hash) => {
  const endUrl = "/timestamp/post/";

  // const payload = JSON.stringify({ hash });

  try {
    const res = await axios.post(
      `${baseUrl}${endUrl}`,
      { hash },
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.API_KEY,
          "x-request-id": "RUNTIME CHECK",
        },
      }
    );

    const msg = successMsg(baseUrl, endUrl, res.status, res.data);

    await sendDiscordAlert("core", msg);
    return res.data.data.uid;
  } catch (err) {
    let msg = "";

    if (err?.response?.data) {
      msg = errorMsg(baseUrl, endUrl, err.response?.status, err.response.data);
    } else {
      msg = errorMsg(baseUrl, endUrl, err.response?.status, err.message);
    }

    await sendDiscordAlert("core", msg);
    return "FAILED";
  }
};

////////////
// TEST 3 //
////////////

const statusTest = async (baseUrl, uids) => {
  const endUrl = "/timestamp/status/";

  try {
    const res = await axios.post(
      `${baseUrl}${endUrl}`,
      { uids },
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.API_KEY,
          "x-request-id": "RUNTIME CHECK",
        },
      }
    );

    const msg = successMsg(baseUrl, endUrl, res.status, res.data);

    const { data, root, proof, address } = res.data.data[0];

    const statusResponse = { data, root, proof, address };

    await sendDiscordAlert("core", msg);
    return statusResponse;
  } catch (err) {
    let msg = "";

    if (err?.response?.data) {
      msg = errorMsg(baseUrl, endUrl, err.response?.status, err.response.data);
    } else {
      msg = errorMsg(baseUrl, endUrl, err.response?.status, err.message);
    }

    await sendDiscordAlert("core", msg);
    return "FAILED";
  }
};

////////////
// TEST 4 //
////////////

const verifyTest = async (baseUrl, jsonProof) => {
  // Convert JSON proof to a Buffer (simulate a .json file)
  const jsonBuffer = Buffer.from(JSON.stringify([jsonProof], null, 2));

  // Create form-data with the JSON "file"
  const form = new FormData();
  form.append("jsonproof", jsonBuffer, {
    filename: "proof.json",
    contentType: "application/json",
  });

  const endUrl = "/verify/post-lite/";

  try {
    const res = await axios.post(`${baseUrl}${endUrl}`, form, {
      headers: {
        ...form.getHeaders(),
        "x-api-key": process.env.API_KEY,
        "x-request-id": "RUNTIME CHECK",
        "x-report-required": "true",
      },
    });

    const msg = successMsg(baseUrl, endUrl, res.status, res.data);

    await sendDiscordAlert("core", msg);
    return res.data.data.hash;
  } catch (err) {
    const msg = err?.response?.data
      ? errorMsg(baseUrl, endUrl, err.response?.status, err.response.data)
      : errorMsg(baseUrl, endUrl, err.response?.status, err.message);

    await sendDiscordAlert("core", msg);
    return "FAILED";
  }
};
