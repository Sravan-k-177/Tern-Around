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

Example `.env`:

```env
FLASK_SECRET_KEY=replace-with-a-long-random-secret
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=tern_around
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

## 7. Push To GitHub

If this folder is not a git repository yet:

```bash
git init
git add .
git commit -m "Initial commit"
```

Create a new empty GitHub repo named `Tern-Around`, then connect and push:

```bash
git branch -M main
git remote add origin https://github.com/<your-username>/Tern-Around.git
git push -u origin main
```

If the remote already exists, update it:

```bash
git remote set-url origin https://github.com/<your-username>/Tern-Around.git
git push -u origin main
```

## 8. Security Checklist Before Publishing

- Confirm `.env` is not tracked: `git status --short`
- Confirm no secrets are staged: `git diff --cached`
- Rotate any key that was ever committed previously

## Notes

- If MySQL is not reachable, API endpoints requiring DB access return `503`.
- Frontend uses third-party public data endpoints (Wikipedia, CountriesNow, Overpass, OurAirports) and does not require API keys.
