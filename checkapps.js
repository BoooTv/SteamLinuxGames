const request = require("request");
let GAMES = {};

async function start() {
  // let apps = await getAppID();
  let apps = [440, 730];
  await apps.forEach(appid => {
    check(appid);
  });
  // await console.log(apps.applist.apps);
  // await apps.applist.apps.forEach(app => {
  // console.log(app);
  // check(app.appid);
  // });
}

async function check(id) {
  await request(
    "https://store.steampowered.com/api/appdetails?appids=" + id,
    (err, response, body) => {
      if (!err) {
        let res = JSON.parse(body);
        if (typeof res === "object") {
          // console.log(body);
          // console.log(res[id]);
          if (res[id].success === true) {
            let id = id;
            let linux = res[id].data.platform.linux;
            if (linux === true) {
              GAMES.push({ id: linux });
              console.log(id + " is supported on linux");
            }
          }
        } else {
          console.log("Something went wrong");
          process.exit(1);
        }
      } else {
        console.log("Something went wrong");
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
