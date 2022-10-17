const redis = require("redis");
const fs = require('fs');
const path = require("path");

const db_url = "redis://127.0.0.1:6379";
const client = redis.createClient({
  url: db_url,
});

async function getData() {
  const data = fs.readFileSync("./dump.json", { encoding: "utf8" });
  const serialized_data = JSON.parse(data);

  return Promise.resolve(serialized_data);
}

async function main() {
  try {
    client.connect();
    console.log("connected to redis");


    const data = await getData();

    data.forEach((item) => {
      Object.entries(item.value).forEach(([field, value]) => {
        client.hSet(item.key, field, value);
      })
    });

    console.log("successfully migrated.");
  } catch (error) {
    console.error(error);
  }
}

main();
