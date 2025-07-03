const cron = require("node-cron");
require("dotenv").config();

const { sendData } = require("./app/app");
const { cronSchedule } = require("./utils/cronSchedules");
const { blockTests } = require("./app/node.test");
const { keyPair } = require("./app/keys");
const { prepareData } = require("./app/hash");
// Add other test imports here...

const runApp = async () => {
  console.log("Checking keys");

  await keyPair();
  console.log("Preparing data");
  const message = await prepareData();
  console.log("Sending data");
  const response = await sendData(message);
};

const runNodeTest = async () => {
  await blockTests(process.env.LOCAL_MEGA_NODE_BASE);
  // await blockTests(process.env.LOCAL_SEARCH_NODE_BASE);
};

// cron.schedule(cronSchedule.testing, () => {
//   console.log(
//     `[${new Date().toISOString()}] Running hash data, sign hash, send package...`
//   );

runApp();

// });

console.log("Integritas Client App started.");
