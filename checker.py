import time
import requests


check_id = 'https://store.steampowered.com/api/appdetails?appids='
games = open('appids.txt').readlines()

for game in games[::-1]:
    time.sleep(3)
    appid = game.replace('\n', '')
    info = requests.get(check_id + str(appid)).json()
    print(f'Checking Appid: {appid}')
    if info[str(appid)]['success']:
        del games[-1]
        open('appids.txt', 'w').writelines(games)
        if info[str(appid)]['data']['platforms']['linux']:
            linux = info[str(appid)]['data']['platforms']['linux']
            print(f'Available on linux: {linux}')
            f = open('GAMES.csv', 'r+')
            if str(appid) not in f.read():
                print('New saved')
                f.write(f'\n{appid}, {linux}')
                f.close()
            else:
                print('Already saved')
