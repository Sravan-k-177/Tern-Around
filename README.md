# Tern-Around

Tern-Around is a Flask + MySQL travel quest app. The backend serves API routes and also serves the frontend (`index.html`, `script.js`, `style.css`).

## Tech Stack

- Python 3.10+
- Flask
- MySQL 8+

## Project Structure

- `app.py`: Flask app, API routes, DB bootstrap + seed data
- `schema.sql`: SQL schema for manual DB setup
- `requirements.txt`: Python dependencies
- `.env.example`: Environment variable template

## Key Features

- Username/email + password authentication
- Real email verification flow with SMTP and 6-digit code
- Explore view with curated places + live location search
- Profile section with contact details and visited quest badges
- Wishlist section with add/remove saved locations
- Quest completion tracking persisted in MySQL

## 1. Clone The Repository

```bash
git clone https://github.com/<your-username>/Tern-Around.git
cd Tern-Around
```

## 2. Create And Activate Virtual Environment

Linux/macOS:

```bash
python3 -m venv .venv
source .venv/bin/activate
```

Windows PowerShell:

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
```

## 3. Install Dependencies

```bash
pip install -r requirements.txt
```

## 4. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Required variables:

- `FLASK_SECRET_KEY`: Any long random string (for sessions)
- `MYSQL_HOST`: MySQL host (for local setup usually `127.0.0.1`)
- `MYSQL_PORT`: MySQL port (default `3306`)
- `MYSQL_USER`: MySQL username
- `MYSQL_PASSWORD`: MySQL password
- `MYSQL_DATABASE`: Database name (default `tern_around`)

For real email verification, also set:

- `SMTP_HOST`: SMTP server host (example `smtp.gmail.com`)
- `SMTP_PORT`: SMTP port (usually `587`)
- `SMTP_USER`: SMTP account username
- `SMTP_PASSWORD`: SMTP app password / SMTP password
- `SMTP_FROM`: Sender email address
- `SMTP_USE_TLS`: `true` or `false`

Example `.env`:

```env
FLASK_SECRET_KEY=replace-with-a-long-random-secret
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=tern_around
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_FROM=your_email@gmail.com
SMTP_USE_TLS=true
```

Important:

- Never commit your `.env` file.
- `.gitignore` is configured to exclude `.env` and `.venv/`.

## 5. Start MySQL

Make sure MySQL server is running and the configured user has permission to create databases/tables.

The app automatically creates the database/tables and seeds initial place data at startup.

Optional manual setup:

```bash
mysql -u <user> -p < schema.sql
```

## 6. Run The App

```bash
python app.py
```

Then open:

- `http://127.0.0.1:5000/`

Important:

- Do not open `index.html` directly from your file manager (`file://...`).
- The frontend must be loaded through Flask at `http://127.0.0.1:5000/` so `/api/*` requests work.

## 7. Push New Changes To GitHub

Since your repository is already initialized and connected to GitHub, use:

```bash
git status
git add .
git commit -m "Add profile, wishlist, and auth UI/backend updates"
git push
```

Optional checks before pushing:

```bash
git diff --staged
git log --oneline -5
```

## 8. Security Checklist Before Publishing

- Confirm `.env` is not tracked: `git status --short`
- Confirm no secrets are staged: `git diff --cached`
- Rotate any key that was ever committed previously

## Notes

- If MySQL is not reachable, API endpoints requiring DB access return `503`.
- Frontend uses third-party public data endpoints (Wikipedia, CountriesNow, Overpass, OurAirports) and does not require API keys.

## Auth + Profile APIs

- `POST /api/signup`
- `POST /api/verify-email`
- `POST /api/resend-verification`
- `POST /api/login`
- `POST /api/logout`
- `GET /api/bootstrap`
- `POST /api/quests/complete`
- `GET /api/wishlist`
- `POST /api/wishlist`
- `DELETE /api/wishlist`
