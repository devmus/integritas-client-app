const cron = require("node-cron");
require("dotenv").config();

const healthCheck = require("./tests/healthCheck.test");
const reactFrontendCheck = require("./tests/reactFrontendCheck.test");
const { stampTests } = require("./tests/stamp.test");
const { cronSchedule } = require("./utils/cronSchedules");
const { blockTests } = require("./tests/node.test");
// Add other test imports here...

// General API check
const runApiTests = async () => {
  await healthCheck(process.env.PUBLIC_WEBSITE_BASE);
  await healthCheck(process.env.PUBLIC_CORE_BASE);
  await healthCheck(process.env.PUBLIC_DOCS_BASE);
};

// React frontend check
const runReactFrontendTest = async () => {
  await reactFrontendCheck(process.env.PUBLIC_PLUS_BASE);
};

const runTimestampTest = async () => {
  await stampTests(process.env.LOCAL_CORE_BASE);
};

const runNodeTest = async () => {
  await blockTests(process.env.LOCAL_MEGA_NODE_BASE);
  await blockTests(process.env.LOCAL_SEARCH_NODE_BASE);
};

// 🔁 Schedule 1: API tests every 8 hours
cron.schedule(cronSchedule.eightHour, () => {
  console.log(`[${new Date().toISOString()}] Running API tests...`);
  runApiTests();
});

// 🔁 Schedule 2: React frontend twice per day.
cron.schedule(cronSchedule.zeroAndTwelveHour, () => {
  console.log(`[${new Date().toISOString()}] Running React frontend test...`);
  runReactFrontendTest();
});

// 🔁 Schedule 3: Timestamping once a day
cron.schedule(cronSchedule.everyDay, () => {
  console.log(`[${new Date().toISOString()}] Running stamp test...`);
  runTimestampTest();
});

// 🔁 Schedule 4: Timestamping once a day
cron.schedule(cronSchedule.everyHour, () => {
  console.log(`[${new Date().toISOString()}] Running block test...`);
  runNodeTest();
});

console.log("API Tester cron job started.");
