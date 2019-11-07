const request = require("request");
const fs = require("fs");

async function start() {
  let apps = await getAppID();
  console.log(apps);
  // let apps = [440, 730];
  // apps.forEach(appid => {
  //   check(appid);
  // });
  // await console.log(apps.applist.apps);
  await apps.applist.apps.forEach(app => {
    check(app["appid"]);
    console.log(app);
  });
  // console.log(app);
  // check(app.appid);
  // });
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
      // console.log(response);
      if (!err) {
        let res = JSON.parse(body);
        if (typeof res === "object") {
          // console.log(body);
          // console.log(res[id]);
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
