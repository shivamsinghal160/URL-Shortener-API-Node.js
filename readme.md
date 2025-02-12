# URL Shortener Node.js Project

## Description

This project is a URL shortener service built with Node.js. It allows users to shorten long URLs and redirect to the original URLs using the shortened links.

## Features

- Shorten long URLs
- Redirect to original URLs using shortened links
- Track the number of times a shortened URL has been accessed
- Get overall analytics of shortened URLs
- Set topics for shortened URLs
- Customizable shortened URLs by setting a custom alias

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/url-shortener.git
   ```
2. Navigate to the project directory:
   ```bash
   cd url-shortener
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Configuration

1. Create a `.env` file in the root directory of the project.
2. Add the following environment variables to the `.env` file:

   ```env
   PUBLIC_URL=YOUR_PUBLIC_URL
   DB_HOST=YOUR_DB_HOST
   DB_USER=YOUR_DB_USER
   DB_PASS=YOUR_DB_PASS
   DB_NAME=YOUR_DB_NAME
   PORT=3000
   GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
   GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET
   GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
   SESSION_SECRET=YOUR_SESSION_SECRET
   COOKIE_SECURE=false
   ```

   Replace the placeholders with your own values.

3. Create a Google OAuth 2.0 client ID and client secret by following the instructions [here](https://developers.google.com/identity/protocols/oauth2).
4. Add the Google client ID and client secret to the `.env` file.
5. Set the `COOKIE_SECURE` environment variable to `true` if you are using HTTPS.
6. Save the `.env` file.
7. Create a MySQL database and run the SQL script `mysqli_database_structure_model.sql` to create the required tables.
8. Enjoy!

## Usage

1. Start the server:
   ```bash
   npm start
   ```
2. Open your browser and navigate to `http://localhost:3000`.

## API Endpoints for Shorten Url

**-> No Auth Required**

- `GET /api/shorten/:shortUrl`: Redirect to the original URL.
- `POST /api/shorten/:shortUrl`: Fetch data in JSON for a shortened URL.

**-> Auth Required**

- `GET /api/shorten/overall` : Get overall analytics of all the shortened URLs.
- `POST /api/shorten`: Shorten a long URL.

## API Endpoints for Shorten URLs Analytics (Auth Required)

- `GET /api/analytics/:shortUrl`: Get analytics of a shortened URL.
- `GET /api/analytics/overall`: Get overall analytics of all the shortened URLs.
- `GET /api/analytics/topic/:topic`: Get overall analytics of all the shortened URLs for a specific topic.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## Acknowledgements

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)

## Author

Shivam Singhal
