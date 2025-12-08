# html-to-img

Basic Express + Puppeteer example that accepts HTML from the browser, renders it in headless Chromium, and returns a PNG of the element with `id="capture"`.

## Available scripts

- `npm run start:backend` – starts the Express server (also serves the frontend from `public/`).
- `npm run start:frontend` – serves the static client from `public/` (useful if you want to point it at a remote backend).

## Usage

1. Install dependencies: `npm install`.
2. Start the backend: `npm run start:backend` (defaults to port `3000`).
3. Open `http://localhost:3000` and edit the HTML block in the textarea.
4. Click **Capture** to receive a PNG of the `#capture` element from Puppeteer.
