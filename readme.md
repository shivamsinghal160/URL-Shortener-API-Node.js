# URL Shortener Node.js Project

## Description

This project is a URL shortener service built with Node.js. It allows users to shorten long URLs and redirect to the original URLs using the shortened links.

## Features

- Shorten long URLs
- Redirect to original URLs using shortened links
- Track the number of times a shortened URL has been accessed
- Get overall analytics of shortened URLs

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
