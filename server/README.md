# NeighborTech Form Submission Server

This is a lightweight Express server that handles form submissions from the NeighborTech website.

## How it works
1. The frontend (HTML/JS) sends a POST request to `/submit-form`.
2. The server receives the data, adds a timestamp, and saves it to `submissions.json`.
3. The server is currently running in the background on port 3000.

## How to view submissions
You can view the raw submissions by reading the `submissions.json` file in this directory:
`cat /home/team/shared/website/server/submissions.json`

Alternatively, you can access the submissions endpoint:
`GET http://localhost:3000/submissions`

## Deployment Note
For a production deployment, you would typically:
1. **Choose a Host:** Use a platform like Render, Railway, or a VPS (DigitalOcean/Linode).
2. **Environment Variables:** Set any necessary environment variables (like `PORT` or API keys).
3. **API URL:** Update the `API_BASE` in `assets/js/main.js` and the fetch URLs in `booking.html` to point to your live server URL (e.g., `https://api.neighbortech.com`).
4. **CORS:** Ensure the `cors` middleware in `index.js` allows requests from your GitHub Pages domain.
5. **Process Manager:** Use a service like PM2 or the hosting platform's built-in tools to ensure the server stays running and restarts on failure.
6. **Data Persistence:** Since this server uses JSON files, ensure your host has a persistent filesystem or switch to a database like MongoDB or PostgreSQL for production.
