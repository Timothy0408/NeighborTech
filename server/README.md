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
1. Replace `http://localhost:3000/submit-form` in `assets/js/main.js` with your production URL or use a relative path if the server hosts the static files.
2. Configure an email service (like SendGrid or Mailgun) in `server/index.js` to notify the business owner of new leads.
3. Use a service like PM2 to ensure the server stays running.
