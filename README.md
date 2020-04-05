# jetuplno

This app tries to answer two pain points:
- Where can I go so you won't create crowds? Since that are dangerous nowdays. Just look at the map.
- WHY THE ^$@(%$% everyone comes here? Report that this place is full.

## Map

On map you can see places that are nice to see ❤️  and if there are 
purple clouds its full at that place. If you see white clouds ☁️  place is empty.

## Reporting location

If you see location that full or empty give us report! Just press respective button 🤗.

It sends your location **only when** you press button. We respect your 
privacy and battery time, so there is nothing going on in background.


# Development

## Backend

In `server` folder

Server is backed by Flask and Postgres and PostGIS.
PostGIS is used only for types, 
but we expected operations on geometry in future.

Setup `.env` from `.env.example`

```
python main.py
```

## Frontend

In `frontend` folder

It's simple React app with ugly hack around Google Maps Javascript API.

Setup `.env` from `.env.example`

```
npm start
```


---


Code looks like shit, but it was created in less than 30 hours of elapsed 
real time and I still got to sleep 🙃 .

We ended up in top 7 from 31 projects in Hack the Crisis Slovakia 🙌 .
