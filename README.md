# Express Password Manager

A web-based password manager built with Express, MongoDB and Passport. It was created for COMP-2068G-WAB (Lakehead-Georgian) and deployed on Render.

[Live demo](https://passwordmanager-751n.onrender.com)

## Features

- Register and log in with Passport local authentication
- Add, edit and delete saved credentials (site, username, email, notes)
- Stored passwords are encrypted with AES-256-CBC before they reach the database
- Handlebars views, Mongoose models, MongoDB Atlas storage

## Run it locally

1. `npm install`
2. Copy `.env.example` to `.env` and set:
   - `MONGODB_URI`: your own MongoDB connection string
   - `ENCRYPTION_KEY`: a 32-character secret (the app refuses to start without it)
3. `npm start`

## Limitations

This is coursework, not an audited product. It uses AES-CBC without authentication, and the encryption key lives in an environment variable on the server. Do not use it for real credentials.

## Author

Aleksandr Zheleznov. [GitHub](https://github.com/Aleks4920)
