import requests


all_games = 'https://api.steampowered.com/ISteamApps/GetAppList/v2'
appids = requests.get(all_games).json()
f = open('appids.txt', 'a')
for appid in appids['applist']['apps']:
    f.write(f'\n{appid["appid"]}')
