# Tasks

## Notes

URL: localhost:3000/notes
Features:
- View Note List
- Add Note Item
- Update Note Item
Branch: feature/notes

## Weather

API: GET https://api.openweathermap.org/data/2.5/weather?id=1566083&units=metric&appid=a185da73f0467dbc267ce609dda11980
Features:
Thoi tiet
- title: jsonData.weather[0].main
- description: jsonData.weather[0].description
- icon: jsonData.weather[0].icon (https://openweathermap.org/img/wn/{iconName}@2x.png)
Nhiet do
- jsonData.main.temp (do C)