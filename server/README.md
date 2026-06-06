# NeighborTech Backend Server

This is a simple Node.js/Express server to handle form submissions and booking requests for the NeighborTech website.

## Local Development
1. Navigate to the `server` directory: `cd server`
2. Install dependencies: `npm install`
3. Start the server: `node index.js`
4. The server will run on `http://localhost:3000`

## API Endpoints
- `POST /submit-form`: Handles contact form submissions.
- `GET /available-slots`: Returns available booking time slots for a given date.
- `POST /submit-booking`: Handles booking requests.

Alternatively, you can access the submissions endpoint:
- `GET /submissions`: Returns all contact form submissions (for internal use).

## Deployment Note
For a production deployment, you would typically:
1. **Choose a Host:** Use a platform like Render, Railway, or a VPS (DigitalOcean/Linode).
2. **Environment Variables:** Set any necessary environment variables (like `PORT` or API keys).
3. **API URL:** Update the `API_BASE` in `assets/js/main.js` and the fetch URLs in `booking.html` to point to your live server URL (e.g., `https://api.neighbortech.com`).
4. **CORS:** Ensure the `cors` middleware in `index.js` allows requests from your GitHub Pages domain.
5. **Process Manager:** Use a service like PM2 or the hosting platform's built-in tools to ensure the server stays running and restarts on failure.
6. **Data Persistence:** Since this server uses JSON files, ensure your host has a persistent filesystem or switch to a database like MongoDB or PostgreSQL for production.
