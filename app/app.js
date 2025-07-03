const axios = require("axios");
const { successMsg, errorMsg } = require("../utils/respondMsg");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");
const config = require("../clientConfig/config.json");

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

module.exports.sendData = async (message) => {
  const resStampDataTest = await sendDataPackage(message);
  return resStampDataTest;
  // if (resHashTest === "FAILED") return;
  // await delay(3 * 60 * 1000);
  // const resStatusTest = await statusTest(baseUrl, [resStampDataTest]);
  // if (resHashTest === "FAILED") return;
  // await delay(3 * 60 * 1000);
  // await verifyTest(baseUrl, resStatusTest);
};

//////////////////
// SEND PAYLOAD //
//////////////////

const sendDataPackage = async (message) => {
  const baseUrl = config[0].serverUrl;
  const endUrl = "/edge/stamp";

  try {
    const res = await axios.post(
      `${baseUrl}${endUrl}`,
      { message },
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.API_KEY,
          "x-request-id": "APP CLIENT TEST",
        },
      }
    );

    const msg = successMsg(baseUrl, endUrl, res.status, res.data);

    return msg;
    // return res.data.data.uid;
  } catch (err) {
    let msg = "";

    if (err?.response?.data) {
      msg = errorMsg(baseUrl, endUrl, err.response?.status, err.response.data);
    } else {
      msg = errorMsg(baseUrl, endUrl, err.response?.status, err.message);
    }

    console.log(msg);

    return "FAILED";
  }
};

///////////////
// THIS WILL BE DONE IN OTHER APP
///////////////

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

    return statusResponse;
  } catch (err) {
    let msg = "";

    if (err?.response?.data) {
      msg = errorMsg(baseUrl, endUrl, err.response?.status, err.response.data);
    } else {
      msg = errorMsg(baseUrl, endUrl, err.response?.status, err.message);
    }

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

    return res.data.data.hash;
  } catch (err) {
    const msg = err?.response?.data
      ? errorMsg(baseUrl, endUrl, err.response?.status, err.response.data)
      : errorMsg(baseUrl, endUrl, err.response?.status, err.message);

    return "FAILED";
  }
};
