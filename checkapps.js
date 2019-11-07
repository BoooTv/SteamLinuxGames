const request = require("request");
const fs = require("fs");
const throttledQ = require("throttled-queue");
let throttled = throttledQ(1, 1000);

async function start() {
  let apps = await getAppID();
  await apps.applist.apps.forEach(app => {
    throttled(function() {
      check(app["appid"]);
    });
  });
}

function writeGAMES(id) {
  fs.readFile("GAMES.json", "utf8", function readFileCallback(err, data) {
    if (err) {
      console.log(err);
    } else {
      obj = JSON.parse(data); //now it an object
      obj[id] = true; //add some data
      json = JSON.stringify(obj); //convert it back to json
      fs.writeFile("GAMES.json", json, "utf8", err => {
        if (err) {
          console.log(err);
        }
      }); // write it back
    }
  });
}

function check(id) {
  console.log("Checking id: " + id);
  request(
    "https://store.steampowered.com/api/appdetails?appids=" + id,
    (err, response, body) => {
      if (!err) {
        try {
          let res = JSON.parse(body);
        } catch (error) {
          console.log(error);
          console.log(body);
          process.exit(1);
        }
        if (typeof res === "object") {
          if (res[id].success === true) {
            let linux = res[id].data.platforms.linux;
            if (linux === true) {
              console.log(id + " is supported on linux");
              writeGAMES(id);
            }
          }
        } else {
          console.log("Something went wrong. res not json");
          process.exit(1);
        }
      } else {
        console.log("Something went wrong: " + err);
      }
    }
  );
}

async function getAppID() {
  return new Promise((resolve, reject) => {
    request(
      "https://api.steampowered.com/ISteamApps/GetAppList/v2",
      (error, response, body) => {
        resolve(JSON.parse(body));
      }
    );
  });
}

start();
