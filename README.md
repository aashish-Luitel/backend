# Vivobook Backend - Node.js + MongoDB

## Setup (2 mins)

1. Install Node.js from https://nodejs.org

2. Get free MongoDB:
   - Go to https://www.mongodb.com/atlas -> Create free cluster -> Create DB user -> Whitelist 0.0.0.0/0 -> Copy connection string
   - Or install locally: `mongodb://localhost:27017/vivobook`

3. In `backend` folder:
```
cp .env.example .env
# edit .env and paste your MONGODB_URI
npm install
npm start
```

Server runs on http://localhost:5000
- GET http://localhost:5000/api/reviews
- POST http://localhost:5000/api/reviews  {name, stars, text}

## Connect Frontend
In `../script.js` change:
```js
const API = 'http://localhost:5000/api/reviews';
```
After deploy, change to your Render/Railway URL:
```js
const API = 'https://your-app.onrender.com/api/reviews';
```

## Deploy Backend Free
- Render.com -> New Web Service -> Connect GitHub -> Root: backend -> Build: npm install -> Start: npm start -> Add env MONGODB_URI
- Or Railway.app

Frontend on Netlify will call this backend and reviews will be shared for everyone in the world.
