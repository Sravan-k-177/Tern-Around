# Tern-Around

Tern-Around is a travel quest app.

## Tech Stack

- Python
- Flask
- MySQL

## Project Structure

- `app.py`: Flask app, API routes, DB bootstrap + seed data
- `schema.sql`: SQL schema for manual DB setup
- `requirements.txt`: Python dependencies
- `.env.example`: Environment variable template

## Key Features

- Username/email + password authentication
- Real email verification flow with SMTP and 6-digit code
- Phone number OTP verification via SMS (Twilio)
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

This includes:
- Flask: Web framework
- mysql-connector-python: MySQL database connector
- twilio: SMS service for phone verification
- python-dotenv: Environment variable management
- werkzeug: Password hashing and security utilities

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

For SMS phone number verification (optional), also set:

- `TWILIO_ACCOUNT_SID`: Twilio account identifier
- `TWILIO_AUTH_TOKEN`: Twilio authentication token
- `TWILIO_PHONE_NUMBER`: Twilio phone number for sending SMS (format: `+1234567890`)
- `PHONE_DEFAULT_COUNTRY_CODE`: Optional default country code for 10-digit local inputs (example: `+91`)

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

# SMS Verification (optional)
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890
PHONE_DEFAULT_COUNTRY_CODE=+91
```


## 5. Start MySQL

Make sure MySQL server is running and the configured user has permission to create databases/tables.

The app automatically creates the database/tables and seeds initial place data at startup.

Optional manual setup:

```bash
mysql -u <user> -p < schema.sql
```

## 5.1 Setup Twilio (Optional - for SMS phone verification)

1. Sign up for a free Twilio account at [twilio.com](https://www.twilio.com)
2. Go to [Twilio Console](https://www.twilio.com/console)
3. Copy your **Account SID** and **Auth Token**
4. Get your Twilio phone number (free trial accounts get one)
5. Add these to your `.env` file:
   ```
   TWILIO_ACCOUNT_SID=your_account_sid
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_PHONE_NUMBER=+1234567890
   ```

The app's phone verification endpoints will be available at:
- `POST /api/phone/send-code` - Send 6-digit OTP code to user's phone
- `POST /api/phone/verify-code` - Verify the OTP code

For Twilio trial accounts:

- You can send SMS only to verified recipient numbers in Twilio Console.

## 6. Run The App

```bash
python app.py
```

Then open:

- `http://127.0.0.1:5000/`

## 7. Push New Changes To GitHub

Since your repository is already initialized and connected to GitHub, use:

```bash
git status
git add .
git commit -m "add a commit message."
git push
```


## 8. Security Checklist Before Publishing

- Confirm `.env` is not tracked: `git status --short`
- Confirm no secrets are staged: `git diff --cached`
- Rotate any key that was ever committed previously


## Auth + Profile APIs

- `GET /api/places`
- `GET /api/catalog`
- `GET /api/me`
- `POST /api/signup`
- `POST /api/verify-email`
- `POST /api/resend-verification`
- `POST /api/login`
- `POST /api/logout`
- `GET /api/bootstrap`
- `POST /api/phone/send-code`
- `POST /api/phone/verify-code`
- `POST /api/quests/complete`
- `GET /api/wishlist`
- `POST /api/wishlist`
- `DELETE /api/wishlist`
