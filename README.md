# RocketOdds

Simple MERN-stack demo: a minimal roulette-like spin app.

Server (Express + Mongoose)

- location: `server`
- features: `/api/spin` POST to create a spin, `/api/spin/recent` GET recent spins

Quick start (Windows PowerShell):

1. Start MongoDB (using local mongod)

```powershell
# For remote database connection scroll to the bottom until **Database Configuration**

# if installed locally:  in one terminal start MongoDB
mongod --dbpath C:\data\db
```

2. Run the server

```powershell
cd server
npm install
# copy .env.example to .env and edit if needed
copy .env.example .env
npm run dev
```

Client (Vite + React)

- location: `client`

Run the client

```powershell
cd client
npm install
npm run dev
```

Notes

- The client proxies `/api` to `http://localhost:4000` by default (see `client/vite.config.js`).
- This scaffold is minimal — next steps: add authentication, bet placement, payouts, and nicer UI.

**Database Configuration**

- **Set a connection string:** create a `.env` file in the `server` folder with `MONGODB_URI` set to your MongoDB connection string and (optionally) `JWT_SECRET`:

```powershell
cd "server"
Set-Content -Path .env -Value "MONGODB_URI=your_connection_string_here`nJWT_SECRET=replace_with_secret" -Encoding UTF8
```

- **Temporary (session) option:** to avoid writing a file, set the variable for the current PowerShell session:

```powershell
$env:MONGODB_URI = "your_connection_string_here"
npm run dev
```

- **Security note:** Do not commit `.env` or secrets to version control. The `server/.gitignore` file ignores `.env` by default, but double-check before pushing to a remote.

- **Atlas users:** ensure your MongoDB Atlas Network Access allows connections from your IP (or add `0.0.0.0/0` for testing).
