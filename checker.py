import time
import requests

all_games = 'https://api.steampowered.com/ISteamApps/GetAppList/v2'
check_id = 'https://store.steampowered.com/api/appdetails?appids='

games = requests.get(all_games).json()
for game in games['applist']['apps']:
    time.sleep(3)
    print(game)
    appid = game['appid']
    name = game['name']
    info = requests.get(check_id + str(appid)).json()
    if info[str(appid)]['success']:
        if info[str(appid)]['data']['platforms']['linux']:
            linux = info[str(appid)]['data']['platforms']['linux']
            print(f'Available on linux: {linux}')
            f = open('GAMES.csv', 'a')
            if appid or name not in f:
                print('New')
                f.write(f'\n{appid}, {linux}, {name}')
                f.close()
            else:
                print('Already saved')
