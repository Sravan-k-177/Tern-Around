from __future__ import annotations

import hashlib
import hmac
import json
import os
import re
import secrets
import urllib.error
import urllib.request
from datetime import datetime, timedelta
from pathlib import Path
from typing import Any

import mysql.connector
from dotenv import load_dotenv
from flask import Flask, jsonify, request, session, send_from_directory
from werkzeug.security import check_password_hash, generate_password_hash

try:
    from twilio.rest import Client as TwilioClient  # type: ignore[import-not-found]
    TWILIO_AVAILABLE = True
except ImportError:
    TWILIO_AVAILABLE = False

BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")
app = Flask(__name__)
app.secret_key = os.getenv("FLASK_SECRET_KEY") or secrets.token_hex(32)

# Security configuration
is_production = os.getenv("ENVIRONMENT", "development") == "production"
app.config.update(
    SESSION_COOKIE_SECURE=is_production,  # Only send over HTTPS in production
    SESSION_COOKIE_HTTPONLY=True,         # Prevent JS access to session cookie
    SESSION_COOKIE_SAMESITE="Lax",        # CSRF protection
)


# Define security headers handler and register it explicitly.
def set_security_headers(response):
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "SAMEORIGIN"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Content-Security-Policy"] = (
        "default-src 'self'; script-src 'self' 'unsafe-inline'; "
        "style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; "
        "connect-src 'self' https://api.brevo.com https://en.wikipedia.org "
        "https://countriesnow.space https://raw.githubusercontent.com https://overpass-api.de"
    )
    return response

# Register the after-request handler directly on the internal registry.
# This avoids Flask raising an AssertionError if the app has already
# handled its first request (which can happen during certain reloads).
app.after_request_funcs.setdefault(None, []).append(set_security_headers)


MYSQL_CONFIG = {
    "host": os.getenv("MYSQL_HOST", "127.0.0.1"),
    "port": int(os.getenv("MYSQL_PORT", "3306")),
    "user": os.getenv("MYSQL_USER", "root"),
    "password": os.getenv("MYSQL_PASSWORD", ""),
    "database": os.getenv("MYSQL_DATABASE", "tern_around"),
    "charset": "utf8mb4",
    "collation": "utf8mb4_unicode_ci",
    "autocommit": False,
}

DATABASE_READY = False

SEED_PLACES: list[dict[str, Any]] = [
    {
        "id": "gateway-of-india",
        "name": "Gateway of India",
        "country": "India",
        "state": "Maharashtra",
        "city": "Mumbai",
        "type": "Monument",
        "image_query": "Gateway of India Mumbai",
        "summary": "A waterfront monument facing Mumbai Harbour, popular for ferry rides, evening walks, and Colaba food trails.",
        "best_time": "6:30 PM",
        "tags": ["harbor", "history", "photography", "ferry"],
        "transport": [
            "Metro or train to Churchgate, then 12 min cab",
            "BEST bus toward Colaba Depot",
            "Ferry arrival from Elephanta Caves",
        ],
        "ticketing": [
            {
                "service": "MakeMyTrip",
                "label": "Flights and stays",
                "url": "https://www.makemytrip.com/",
            },
            {
                "service": "RedBus",
                "label": "Intercity buses",
                "url": "https://www.redbus.in/",
            },
            {
                "service": "IRCTC",
                "label": "Train tickets",
                "url": "https://www.irctc.co.in/",
            },
        ],
        "challenge": "Find one stone arch detail, take a pause facing the harbor, and mark the quest complete.",
        "underdog": {
            "name": "Sassoon Dock Art Walk",
            "distance": "1.4 km",
            "transport": "8 min auto or 18 min walk through Colaba lanes",
            "description": "A working dock with murals, fishing boats, and a raw local rhythm before the dinner rush.",
        },
    },
    {
        "id": "amber-fort",
        "name": "Amber Fort",
        "country": "India",
        "state": "Rajasthan",
        "city": "Jaipur",
        "type": "Fort",
        "image_query": "Amber Fort Jaipur",
        "summary": "A hilltop fort known for courtyards, mirror work, old royal routes, and wide Aravalli views.",
        "best_time": "8:00 AM",
        "tags": ["fort", "palace", "architecture", "heritage"],
        "transport": [
            "AC bus from Ajmeri Gate toward Amer",
            "Cab via Amer Road",
            "E-rickshaw from Amer town",
        ],
        "ticketing": [
            {
                "service": "Rajasthan Tourism",
                "label": "Official information",
                "url": "https://www.tourism.rajasthan.gov.in/",
            },
            {
                "service": "MakeMyTrip",
                "label": "Hotels and flights",
                "url": "https://www.makemytrip.com/",
            },
            {
                "service": "RedBus",
                "label": "Bus tickets",
                "url": "https://www.redbus.in/",
            },
        ],
        "challenge": "Find the mirror-work courtyard and complete the quest after reaching the viewpoint.",
        "underdog": {
            "name": "Panna Meena ka Kund",
            "distance": "900 m",
            "transport": "12 min downhill walk or 5 min e-rickshaw",
            "description": "A geometric stepwell with quiet corners just below the fort road.",
        },
    },
    {
        "id": "charminar",
        "name": "Charminar",
        "country": "India",
        "state": "Telangana",
        "city": "Hyderabad",
        "type": "Monument",
        "image_query": "Charminar Hyderabad",
        "summary": "A historic Old City landmark surrounded by bazaars, pearls, bangles, snacks, and busy street life.",
        "best_time": "5:30 PM",
        "tags": ["bazaar", "food", "heritage", "shopping"],
        "transport": [
            "Metro to MGBS, then 10 min auto",
            "Cab drop near Gulzar Houz",
            "Walk from Laad Bazaar",
        ],
        "ticketing": [
            {
                "service": "TSRTC",
                "label": "State buses",
                "url": "https://www.tsrtconline.in/",
            },
            {
                "service": "IRCTC",
                "label": "Train tickets",
                "url": "https://www.irctc.co.in/",
            },
            {
                "service": "MakeMyTrip",
                "label": "Flights and stays",
                "url": "https://www.makemytrip.com/",
            },
        ],
        "challenge": "Stand where all four minarets are visible and mark the quest complete.",
        "underdog": {
            "name": "Badshahi Ashurkhana",
            "distance": "650 m",
            "transport": "9 min walk through the bazaar",
            "description": "A calmer Old City stop with tile work, history, and space to slow down.",
        },
    },
    {
        "id": "qutub-minar",
        "name": "Qutub Minar",
        "country": "India",
        "state": "Delhi",
        "city": "New Delhi",
        "type": "Monument",
        "image_query": "Qutub Minar Delhi",
        "summary": "A towering heritage complex with stone carvings, lawns, ruins, and easy metro access.",
        "best_time": "4:30 PM",
        "tags": ["heritage", "architecture", "metro", "unesco"],
        "transport": [
            "Yellow Line metro to Qutub Minar",
            "Auto from Saket or Mehrauli",
            "Cab drop at the main complex gate",
        ],
        "ticketing": [
            {
                "service": "ASI Payumoney",
                "label": "Monument tickets",
                "url": "https://asi.payumoney.com/",
            },
            {
                "service": "Delhi Metro",
                "label": "Metro route planning",
                "url": "https://www.delhimetrorail.com/",
            },
            {
                "service": "MakeMyTrip",
                "label": "Flights and hotels",
                "url": "https://www.makemytrip.com/",
            },
        ],
        "challenge": "Find the Iron Pillar signboard and complete the quest before exiting the complex.",
        "underdog": {
            "name": "Mehrauli Archaeological Park",
            "distance": "1.1 km",
            "transport": "14 min walk or 6 min auto",
            "description": "Ruins, tombs, trails, and quieter heritage corners next to the famous complex.",
        },
    },
    {
        "id": "statue-of-liberty",
        "name": "Statue of Liberty",
        "country": "United States",
        "state": "New York",
        "city": "New York City",
        "type": "Landmark",
        "image_query": "Statue of Liberty New York",
        "summary": "A harbor icon reached by ferry, paired with skyline views and Ellis Island history.",
        "best_time": "9:00 AM",
        "tags": ["ferry", "skyline", "history", "harbor"],
        "transport": [
            "Subway to Bowling Green, then walk to Battery Park",
            "Official ferry from Battery Park",
            "Cab or rideshare to Castle Clinton",
        ],
        "ticketing": [
            {
                "service": "Statue City Cruises",
                "label": "Official ferry tickets",
                "url": "https://www.cityexperiences.com/new-york/city-cruises/statue/",
            },
            {
                "service": "MTA",
                "label": "Subway and bus routes",
                "url": "https://new.mta.info/",
            },
            {
                "service": "Expedia",
                "label": "Flights and stays",
                "url": "https://www.expedia.com/",
            },
        ],
        "challenge": "Reach the harbor-facing side and complete the quest after spotting Manhattan's skyline.",
        "underdog": {
            "name": "Governors Island Hammock Grove",
            "distance": "2.6 mi by ferry route",
            "transport": "Ferry from Lower Manhattan",
            "description": "Open lawns, harbor views, public art, and a slower island feel close to the famous route.",
        },
    },
    {
        "id": "eiffel-tower",
        "name": "Eiffel Tower",
        "country": "France",
        "state": "Ile-de-France",
        "city": "Paris",
        "type": "Landmark",
        "image_query": "Eiffel Tower Paris",
        "summary": "Paris's classic iron landmark with river walks, viewpoints, gardens, and night lighting.",
        "best_time": "8:45 PM",
        "tags": ["viewpoint", "river", "architecture", "romantic"],
        "transport": [
            "Metro to Bir-Hakeim",
            "RER C to Champ de Mars Tour Eiffel",
            "Walk from Trocadero across the Seine",
        ],
        "ticketing": [
            {
                "service": "Eiffel Tower Official",
                "label": "Tower tickets",
                "url": "https://www.toureiffel.paris/en",
            },
            {
                "service": "SNCF Connect",
                "label": "Trains in France",
                "url": "https://www.sncf-connect.com/",
            },
            {
                "service": "Booking.com",
                "label": "Paris stays",
                "url": "https://www.booking.com/",
            },
        ],
        "challenge": "Reach the Trocadero view line and complete the quest when the tower is fully visible.",
        "underdog": {
            "name": "Rue Cler Market Street",
            "distance": "1.2 km",
            "transport": "15 min walk through the 7th arrondissement",
            "description": "A neighborhood market street with bakeries, cheese shops, cafes, and everyday Paris energy.",
        },
    },
]

TABLES_SQL = [
    """
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(120) NOT NULL UNIQUE,
        email VARCHAR(190) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        email_verified TINYINT(1) NOT NULL DEFAULT 0,
        verification_code_hash VARCHAR(64) NULL,
        verification_expires_at DATETIME NULL,
        is_select_customer TINYINT(1) NOT NULL DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    """,
    """
    CREATE TABLE IF NOT EXISTS places (
        id VARCHAR(80) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        country VARCHAR(120) NOT NULL,
        state VARCHAR(120) NOT NULL,
        city VARCHAR(120) NOT NULL,
        type VARCHAR(120) NOT NULL,
        image_query VARCHAR(255) NOT NULL,
        summary TEXT NOT NULL,
        best_time VARCHAR(80) NOT NULL,
        tags JSON NOT NULL,
        transport JSON NOT NULL,
        ticketing JSON NOT NULL,
        challenge TEXT NOT NULL,
        underdog JSON NOT NULL,
        lat DECIMAL(10, 7) NULL,
        lon DECIMAL(10, 7) NULL,
        source VARCHAR(120) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    """,
    """
    CREATE TABLE IF NOT EXISTS quest_completions (
        user_id INT NOT NULL,
        place_id VARCHAR(80) NOT NULL,
        completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, place_id),
        CONSTRAINT fk_quest_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        CONSTRAINT fk_quest_place FOREIGN KEY (place_id) REFERENCES places(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    """,
    """
    CREATE TABLE IF NOT EXISTS wishlist_entries (
        user_id INT NOT NULL,
        place_id VARCHAR(120) NOT NULL,
        name VARCHAR(255) NOT NULL,
        country VARCHAR(120) NOT NULL,
        state VARCHAR(120) NOT NULL,
        city VARCHAR(120) NOT NULL,
        type VARCHAR(120) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, place_id),
        CONSTRAINT fk_wishlist_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    """,
]


def connect_without_database() -> mysql.connector.MySQLConnection:
    config = dict(MYSQL_CONFIG)
    config.pop("database", None)
    return mysql.connector.connect(**config)


def connect_database() -> mysql.connector.MySQLConnection:
    return mysql.connector.connect(**MYSQL_CONFIG)


def has_column(cursor: mysql.connector.cursor.MySQLCursor, table_name: str, column_name: str) -> bool:
    cursor.execute(
        """
        SELECT COUNT(*)
        FROM information_schema.COLUMNS
        WHERE TABLE_SCHEMA = %s AND TABLE_NAME = %s AND COLUMN_NAME = %s
        """,
        (MYSQL_CONFIG["database"], table_name, column_name),
    )
    (count,) = cursor.fetchone() or (0,)
    return int(count) > 0


def hash_verification_code(code: str) -> str:
    secret = app.secret_key or "tern-around"
    digest = hmac.new(secret.encode("utf-8"), code.encode("utf-8"), hashlib.sha256)
    return digest.hexdigest()


def generate_verification_code() -> str:
    return f"{secrets.randbelow(1_000_000):06d}"


def normalize_phone_number(raw_phone: str) -> str:
    """Normalize user input into E.164 format required by Twilio."""
    phone = str(raw_phone or "").strip()
    if not phone:
        raise ValueError("Phone number is required.")

    # Support international numbers entered as 00<country><number>.
    if phone.startswith("00"):
        phone = f"+{phone[2:]}"

    if phone.startswith("+"):
        digits_only = "".join(filter(str.isdigit, phone))
        normalized = f"+{digits_only}"
    else:
        digits_only = "".join(filter(str.isdigit, phone))
        if len(digits_only) == 10:
            default_country_code = os.getenv("PHONE_DEFAULT_COUNTRY_CODE", "+91").strip()
            if not re.fullmatch(r"\+[1-9]\d{0,3}", default_country_code):
                raise ValueError("Server is misconfigured: PHONE_DEFAULT_COUNTRY_CODE must look like +91.")
            normalized = f"{default_country_code}{digits_only}"
        elif 11 <= len(digits_only) <= 15:
            normalized = f"+{digits_only}"
        else:
            raise ValueError("Phone number must be 10-15 digits.")

    if not re.fullmatch(r"\+[1-9]\d{9,14}", normalized):
        raise ValueError("Invalid phone format. Use E.164 format like +919876543210.")

    return normalized


def send_verification_email(recipient: str, username: str, code: str) -> None:
    brevo_api_key = os.getenv("BREVO_API_KEY", "").strip()
    brevo_sender_email = os.getenv("BREVO_SENDER_EMAIL", "").strip()
    brevo_sender_name = os.getenv("BREVO_SENDER_NAME", "Tern-Around").strip() or "Tern-Around"

    if not brevo_api_key or not brevo_sender_email:
        raise RuntimeError("Brevo is not configured. Set BREVO_API_KEY and BREVO_SENDER_EMAIL.")

    subject = "Verify your Tern-Around account"
    text_content = (
        f"Hi {username},\n\n"
        "Welcome to Tern-Around.\n"
        f"Your verification code is: {code}\n\n"
        "This code expires in 15 minutes.\n"
        "If you did not request this, you can ignore this email.\n"
    )
    html_content = f"""
        <div style="font-family: Arial, Helvetica, sans-serif; color: #17211d; line-height: 1.6;">
          <h2 style="margin: 0 0 12px; color: #087f5b;">Verify your Tern-Around account</h2>
          <p style="margin: 0 0 12px;">Hi {username},</p>
          <p style="margin: 0 0 12px;">Welcome to Tern-Around.</p>
          <p style="margin: 0 0 12px; font-size: 20px; font-weight: 700; letter-spacing: 2px;">
            {code}
          </p>
          <p style="margin: 0 0 12px;">This code expires in 15 minutes.</p>
          <p style="margin: 0; color: #5d6c65;">If you did not request this, you can ignore this email.</p>
        </div>
    """.strip()

    payload = {
        "sender": {
            "name": brevo_sender_name,
            "email": brevo_sender_email,
        },
        "to": [
            {
                "email": recipient,
                "name": username or recipient,
            }
        ],
        "subject": subject,
        "textContent": text_content,
        "htmlContent": html_content,
    }

    request = urllib.request.Request(
        "https://api.brevo.com/v3/smtp/email",
        data=json.dumps(payload).encode("utf-8"),
        method="POST",
        headers={
            "api-key": brevo_api_key,
            "accept": "application/json",
            "content-type": "application/json",
        },
    )

    try:
        with urllib.request.urlopen(request, timeout=20) as response:
            if response.status < 200 or response.status >= 300:
                raise RuntimeError(f"Brevo returned HTTP {response.status}")
    except urllib.error.HTTPError as exc:
        error_body = exc.read().decode("utf-8", errors="ignore")
        raise RuntimeError(f"Failed to send email via Brevo: {error_body or exc.reason}") from exc
    except urllib.error.URLError as exc:
        raise RuntimeError(f"Failed to reach Brevo: {exc.reason}") from exc


def send_verification_sms(phone: str, code: str) -> None:
    if not TWILIO_AVAILABLE:
        raise RuntimeError("Twilio is not installed. Install it with: pip install twilio")
    
    account_sid = os.getenv("TWILIO_ACCOUNT_SID", "").strip()
    auth_token = os.getenv("TWILIO_AUTH_TOKEN", "").strip()
    from_number = os.getenv("TWILIO_PHONE_NUMBER", "").strip()

    if not account_sid or not auth_token or not from_number:
        raise RuntimeError("Twilio is not configured. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER.")

    if not re.fullmatch(r"\+[1-9]\d{9,14}", from_number):
        raise RuntimeError("TWILIO_PHONE_NUMBER must be in E.164 format, for example +15017122661.")

    try:
        client = TwilioClient(account_sid, auth_token)
        message = client.messages.create(
            body=f"Your Tern-Around phone verification code is: {code}\n\nThis code expires in 15 minutes.",
            from_=from_number,
            to=phone
        )
        return message.sid
    except Exception as exc:
        raise RuntimeError(f"Failed to send SMS: {str(exc)}")


def ensure_database_exists() -> None:
    connection = connect_without_database()
    cursor = connection.cursor()
    cursor.execute(
        f"CREATE DATABASE IF NOT EXISTS `{MYSQL_CONFIG['database']}` "
        "CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
    )
    connection.commit()
    cursor.close()
    connection.close()


def initialize_schema() -> None:
    ensure_database_exists()
    connection = connect_database()
    cursor = connection.cursor()

    try:
        for statement in TABLES_SQL:
            cursor.execute(statement)

        # Backward-compatible migration for existing installations.
        if not has_column(cursor, "users", "password_hash"):
            cursor.execute("ALTER TABLE users ADD COLUMN password_hash VARCHAR(255) NULL")
        if not has_column(cursor, "users", "email_verified"):
            cursor.execute("ALTER TABLE users ADD COLUMN email_verified TINYINT(1) NOT NULL DEFAULT 0")
        if not has_column(cursor, "users", "verification_code_hash"):
            cursor.execute("ALTER TABLE users ADD COLUMN verification_code_hash VARCHAR(64) NULL")
        if not has_column(cursor, "users", "verification_expires_at"):
            cursor.execute("ALTER TABLE users ADD COLUMN verification_expires_at DATETIME NULL")
        if not has_column(cursor, "users", "phone"):
            cursor.execute("ALTER TABLE users ADD COLUMN phone VARCHAR(20) NULL")
        if not has_column(cursor, "users", "phone_verification_code_hash"):
            cursor.execute("ALTER TABLE users ADD COLUMN phone_verification_code_hash VARCHAR(64) NULL")
        if not has_column(cursor, "users", "phone_verification_expires_at"):
            cursor.execute("ALTER TABLE users ADD COLUMN phone_verification_expires_at DATETIME NULL")

        cursor.execute("SELECT COUNT(*) FROM places")
        (place_count,) = cursor.fetchone() or (0,)

        if place_count == 0:
            for place in SEED_PLACES:
                cursor.execute(
                    """
                    INSERT INTO places (
                        id, name, country, state, city, type, image_query,
                        summary, best_time, tags, transport, ticketing,
                        challenge, underdog, lat, lon, source
                    ) VALUES (
                        %(id)s, %(name)s, %(country)s, %(state)s, %(city)s, %(type)s, %(image_query)s,
                        %(summary)s, %(best_time)s, %(tags)s, %(transport)s, %(ticketing)s,
                        %(challenge)s, %(underdog)s, %(lat)s, %(lon)s, %(source)s
                    )
                    """,
                    {
                        **place,
                        "tags": json.dumps(place["tags"]),
                        "transport": json.dumps(place["transport"]),
                        "ticketing": json.dumps(place["ticketing"]),
                        "underdog": json.dumps(place["underdog"]),
                        "lat": place.get("lat"),
                        "lon": place.get("lon"),
                        "source": place.get("source"),
                    },
                )
            connection.commit()
    finally:
        cursor.close()
        connection.close()


try:
    with app.app_context():
        initialize_schema()
    DATABASE_READY = True
except Exception as exc:  # pragma: no cover - startup fallback for missing MySQL
    print(f"Tern-Around database startup skipped: {exc}")


@app.get("/")
def index() -> Any:
    return send_from_directory(BASE_DIR, "index.html")


@app.get("/style.css")
def style_css() -> Any:
    return send_from_directory(BASE_DIR, "style.css")


@app.get("/script.js")
def script_js() -> Any:
    return send_from_directory(BASE_DIR, "script.js")


@app.get("/api/places")
def api_places() -> Any:
    return jsonify({"places": load_places() if DATABASE_READY else load_seed_places()})


@app.get("/api/catalog")
def api_catalog() -> Any:
    places = load_places() if DATABASE_READY else load_seed_places()
    return jsonify({"catalog": build_catalog(places)})


@app.get("/api/me")
def api_me() -> Any:
    return jsonify({"user": get_current_user()})


@app.get("/api/bootstrap")
def api_bootstrap() -> Any:
    user = get_current_user() if DATABASE_READY else None
    places = load_places() if DATABASE_READY else load_seed_places()
    payload = {
        "user": user,
        "places": places,
        "catalog": build_catalog(places),
        "completedQuestIds": sorted(list(get_completed_quests(user["id"])) if user else []),
        "wishlistEntries": get_wishlist_entries(user["id"]) if user else [],
    }
    return jsonify(payload)


@app.post("/api/login")
def api_login() -> Any:
    if not DATABASE_READY:
        return jsonify({"error": "MySQL is not ready."}), 503

    data = request.get_json(silent=True) or {}
    login = str(data.get("login", "")).strip()
    password = str(data.get("password", ""))

    if not login or not password:
        return jsonify({"error": "Username/email and password are required."}), 400

    connection = connect_database()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute(
            """
            SELECT id, name, email, password_hash, email_verified, is_select_customer
            FROM users
            WHERE LOWER(email) = %s OR LOWER(name) = %s
            LIMIT 1
            """,
            (login.lower(), login.lower()),
        )
        user = cursor.fetchone()

        if not user:
            return jsonify({"error": "Account not found. Create a new account first."}), 404

        password_hash = user.get("password_hash") or ""
        if not password_hash:
            return jsonify({"error": "This account has no password set. Please sign up again."}), 400

        if not check_password_hash(password_hash, password):
            return jsonify({"error": "Invalid password."}), 401

        if not bool(user.get("email_verified")):
            return (
                jsonify(
                    {
                        "error": "Email is not verified. Enter the verification code sent to your email.",
                        "requiresVerification": True,
                        "email": user["email"],
                    }
                ),
                403,
            )

        user_id = int(user["id"])
        session["user_id"] = user_id
        user = get_user_by_id(user_id)
        return jsonify({"user": user})
    finally:
        cursor.close()
        connection.close()


@app.post("/api/logout")
def api_logout() -> Any:
    if not DATABASE_READY:
        return jsonify({"error": "MySQL is not ready."}), 503

    session.clear()
    return jsonify({"ok": True})


@app.post("/api/signup")
def api_signup() -> Any:
    if not DATABASE_READY:
        return jsonify({"error": "MySQL is not ready."}), 503

    data = request.get_json(silent=True) or {}
    name = str(data.get("username", "")).strip()
    email = str(data.get("email", "")).strip().lower()
    password = str(data.get("password", ""))

    if not name or not email or not password:
        return jsonify({"error": "Username, email, and password are required."}), 400

    if len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters."}), 400

    connection = connect_database()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute(
            "SELECT id FROM users WHERE LOWER(email) = %s OR LOWER(name) = %s",
            (email.lower(), name.lower()),
        )
        if cursor.fetchone() is not None:
            return jsonify({"error": "Username or email already exists. Log in instead."}), 409

        cursor.execute(
            """
            INSERT INTO users (
                name,
                email,
                password_hash,
                email_verified,
                verification_code_hash,
                verification_expires_at,
                is_select_customer
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            """,
            (
                name,
                email,
                generate_password_hash(password),
                0,
                None,
                None,
                1,
            ),
        )
        user_id = cursor.lastrowid

        code = generate_verification_code()
        cursor.execute(
            """
            UPDATE users
            SET verification_code_hash = %s,
                verification_expires_at = %s
            WHERE id = %s
            """,
            (hash_verification_code(code), datetime.utcnow() + timedelta(minutes=15), user_id),
        )
        connection.commit()
        session.pop("user_id", None)

        try:
            send_verification_email(email, name, code)
        except Exception as exc:
            return (
                jsonify(
                    {
                        "error": "Account created, but verification email could not be sent. Configure SMTP and resend.",
                        "email": email,
                        "details": str(exc),
                    }
                ),
                502,
            )

        return (
            jsonify(
                {
                    "ok": True,
                    "requiresVerification": True,
                    "email": email,
                    "message": "Verification code sent. Check your inbox.",
                }
            ),
            201,
        )
    finally:
        cursor.close()
        connection.close()


@app.post("/api/verify-email")
def api_verify_email() -> Any:
    if not DATABASE_READY:
        return jsonify({"error": "MySQL is not ready."}), 503

    data = request.get_json(silent=True) or {}
    email = str(data.get("email", "")).strip().lower()
    code = str(data.get("code", "")).strip()

    if not email or not code:
        return jsonify({"error": "Email and verification code are required."}), 400

    connection = connect_database()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute(
            """
            SELECT id, name, email, email_verified, verification_code_hash, verification_expires_at
            FROM users
            WHERE LOWER(email) = %s
            LIMIT 1
            """,
            (email,),
        )
        user = cursor.fetchone()

        if not user:
            return jsonify({"error": "Account not found."}), 404

        if bool(user.get("email_verified")):
            session["user_id"] = int(user["id"])
            return jsonify({"user": get_user_by_id(int(user["id"]))})

        stored_hash = user.get("verification_code_hash") or ""
        expires_at = user.get("verification_expires_at")

        if not stored_hash or not expires_at:
            return jsonify({"error": "No active verification code. Request a new code."}), 400

        if isinstance(expires_at, datetime) and expires_at < datetime.utcnow():
            return jsonify({"error": "Verification code expired. Request a new code."}), 400

        candidate_hash = hash_verification_code(code)
        if not hmac.compare_digest(stored_hash, candidate_hash):
            return jsonify({"error": "Invalid verification code."}), 400

        cursor.execute(
            """
            UPDATE users
            SET email_verified = 1,
                verification_code_hash = NULL,
                verification_expires_at = NULL
            WHERE id = %s
            """,
            (user["id"],),
        )
        connection.commit()
        session["user_id"] = int(user["id"])
        return jsonify({"user": get_user_by_id(int(user["id"]))})
    finally:
        cursor.close()
        connection.close()


@app.post("/api/resend-verification")
def api_resend_verification() -> Any:
    if not DATABASE_READY:
        return jsonify({"error": "MySQL is not ready."}), 503

    data = request.get_json(silent=True) or {}
    email = str(data.get("email", "")).strip().lower()

    if not email:
        return jsonify({"error": "Email is required."}), 400

    connection = connect_database()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute(
            "SELECT id, name, email, email_verified FROM users WHERE LOWER(email) = %s LIMIT 1",
            (email,),
        )
        user = cursor.fetchone()

        if not user:
            return jsonify({"error": "Account not found."}), 404

        if bool(user.get("email_verified")):
            return jsonify({"ok": True, "message": "Email is already verified."})

        code = generate_verification_code()
        cursor.execute(
            """
            UPDATE users
            SET verification_code_hash = %s,
                verification_expires_at = %s
            WHERE id = %s
            """,
            (hash_verification_code(code), datetime.utcnow() + timedelta(minutes=15), user["id"]),
        )
        connection.commit()
        send_verification_email(user["email"], user["name"], code)

        return jsonify({"ok": True, "message": "Verification code sent."})
    finally:
        cursor.close()
        connection.close()


@app.post("/api/phone/send-code")
def api_send_phone_code() -> Any:
    # Phone verification temporarily disabled
    return jsonify({"error": "Phone verification is currently disabled. Coming soon!"}), 503


@app.post("/api/phone/verify-code")
def api_verify_phone_code() -> Any:
    # Phone verification temporarily disabled
    return jsonify({"error": "Phone verification is currently disabled. Coming soon!"}), 503


@app.post("/api/quests/complete")
def api_complete_quest() -> Any:
    if not DATABASE_READY:
        return jsonify({"error": "MySQL is not ready."}), 503

    user = get_current_user()
    if not user:
        return jsonify({"error": "Login required."}), 401

    data = request.get_json(silent=True) or {}
    place_id = str(data.get("placeId", "")).strip()

    if not place_id:
        return jsonify({"error": "placeId is required."}), 400

    connection = connect_database()
    cursor = connection.cursor()

    try:
        cursor.execute("SELECT 1 FROM places WHERE id = %s", (place_id,))
        if cursor.fetchone() is None:
            return jsonify({"error": "Unknown place."}), 404

        cursor.execute(
            """
            INSERT IGNORE INTO quest_completions (user_id, place_id)
            VALUES (%s, %s)
            """,
            (user["id"], place_id),
        )
        connection.commit()
        return jsonify({"ok": True, "completedQuestIds": sorted(list(get_completed_quests(user["id"])))})
    finally:
        cursor.close()
        connection.close()


@app.get("/api/wishlist")
def api_get_wishlist() -> Any:
    if not DATABASE_READY:
        return jsonify({"error": "MySQL is not ready."}), 503

    user = get_current_user()
    if not user:
        return jsonify({"error": "Login required."}), 401

    return jsonify({"wishlistEntries": get_wishlist_entries(int(user["id"]))})


@app.post("/api/wishlist")
def api_add_wishlist() -> Any:
    if not DATABASE_READY:
        return jsonify({"error": "MySQL is not ready."}), 503

    user = get_current_user()
    if not user:
        return jsonify({"error": "Login required."}), 401

    data = request.get_json(silent=True) or {}
    place_id = str(data.get("placeId", "")).strip()
    name = str(data.get("name", "")).strip()
    country = str(data.get("country", "")).strip()
    state = str(data.get("state", "")).strip()
    city = str(data.get("city", "")).strip()
    place_type = str(data.get("type", "")).strip()

    if not all([place_id, name, country, state, city, place_type]):
        return jsonify({"error": "Incomplete place data for wishlist."}), 400

    connection = connect_database()
    cursor = connection.cursor()

    try:
        cursor.execute(
            """
            INSERT INTO wishlist_entries (user_id, place_id, name, country, state, city, type)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE
                name = VALUES(name),
                country = VALUES(country),
                state = VALUES(state),
                city = VALUES(city),
                type = VALUES(type)
            """,
            (int(user["id"]), place_id, name, country, state, city, place_type),
        )
        connection.commit()
        return jsonify({"ok": True, "wishlistEntries": get_wishlist_entries(int(user["id"]))})
    finally:
        cursor.close()
        connection.close()


@app.delete("/api/wishlist")
def api_remove_wishlist() -> Any:
    if not DATABASE_READY:
        return jsonify({"error": "MySQL is not ready."}), 503

    user = get_current_user()
    if not user:
        return jsonify({"error": "Login required."}), 401

    data = request.get_json(silent=True) or {}
    place_id = str(data.get("placeId", "")).strip()

    if not place_id:
        return jsonify({"error": "placeId is required."}), 400

    connection = connect_database()
    cursor = connection.cursor()

    try:
        cursor.execute(
            "DELETE FROM wishlist_entries WHERE user_id = %s AND place_id = %s",
            (int(user["id"]), place_id),
        )
        connection.commit()
        return jsonify({"ok": True, "wishlistEntries": get_wishlist_entries(int(user["id"]))})
    finally:
        cursor.close()
        connection.close()


@app.errorhandler(404)
def not_found(_: Any) -> Any:
    return jsonify({"error": "Not found"}), 404


def get_user_by_id(user_id: int) -> dict[str, Any] | None:
    if not DATABASE_READY:
        return None

    connection = connect_database()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute(
            "SELECT id, name, email, email_verified, is_select_customer FROM users WHERE id = %s",
            (user_id,),
        )
        row = cursor.fetchone()
        if not row:
            return None

        return {
            "id": row["id"],
            "username": row["name"],
            "name": row["name"],
            "email": row["email"],
            "emailVerified": bool(row.get("email_verified")),
            "isSelectCustomer": bool(row["is_select_customer"]),
        }
    finally:
        cursor.close()
        connection.close()


def get_current_user() -> dict[str, Any] | None:
    if not DATABASE_READY:
        return None

    user_id = session.get("user_id")
    if not user_id:
        return None
    return get_user_by_id(int(user_id))


def parse_json_field(value: Any, default: Any) -> Any:
    if value is None:
        return default

    if isinstance(value, (list, dict)):
        return value

    try:
        return json.loads(value)
    except (TypeError, json.JSONDecodeError):
        return default


def load_seed_places() -> list[dict[str, Any]]:
    places: list[dict[str, Any]] = []

    for place in SEED_PLACES:
        places.append(
            {
                "id": place["id"],
                "name": place["name"],
                "country": place["country"],
                "state": place["state"],
                "city": place["city"],
                "type": place["type"],
                "imageQuery": place["image_query"],
                "summary": place["summary"],
                "bestTime": place["best_time"],
                "tags": place["tags"],
                "transport": place["transport"],
                "ticketing": place["ticketing"],
                "challenge": place["challenge"],
                "underdog": place["underdog"],
                "lat": place.get("lat"),
                "lon": place.get("lon"),
                "source": place.get("source"),
            }
        )

    return places


def load_places() -> list[dict[str, Any]]:
    if not DATABASE_READY:
        return load_seed_places()

    connection = connect_database()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute(
            """
            SELECT id, name, country, state, city, type, image_query, summary, best_time,
                   tags, transport, ticketing, challenge, underdog, lat, lon, source
            FROM places
            ORDER BY country, state, city, name
            """
        )
        rows = cursor.fetchall()
        return [normalize_place_row(row) for row in rows]
    finally:
        cursor.close()
        connection.close()


def normalize_place_row(row: dict[str, Any]) -> dict[str, Any]:
    underdog = parse_json_field(row.get("underdog"), {})
    return {
        "id": row["id"],
        "name": row["name"],
        "country": row["country"],
        "state": row["state"],
        "city": row["city"],
        "type": row["type"],
        "imageQuery": row["image_query"],
        "summary": row["summary"],
        "bestTime": row["best_time"],
        "tags": parse_json_field(row.get("tags"), []),
        "transport": parse_json_field(row.get("transport"), []),
        "ticketing": parse_json_field(row.get("ticketing"), []),
        "challenge": row["challenge"],
        "underdog": {
            "name": underdog.get("name", ""),
            "distance": underdog.get("distance", ""),
            "transport": underdog.get("transport", ""),
            "description": underdog.get("description", ""),
        },
        "lat": float(row["lat"]) if row.get("lat") is not None else None,
        "lon": float(row["lon"]) if row.get("lon") is not None else None,
        "source": row.get("source"),
    }


def get_completed_quests(user_id: int) -> set[str]:
    if not DATABASE_READY:
        return set()

    connection = connect_database()
    cursor = connection.cursor()

    try:
        cursor.execute(
            "SELECT place_id FROM quest_completions WHERE user_id = %s",
            (user_id,),
        )
        return {row[0] for row in cursor.fetchall()}
    finally:
        cursor.close()
        connection.close()


def get_wishlist_entries(user_id: int) -> list[dict[str, Any]]:
    if not DATABASE_READY:
        return []

    connection = connect_database()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute(
            """
            SELECT place_id, name, country, state, city, type
            FROM wishlist_entries
            WHERE user_id = %s
            ORDER BY created_at DESC
            """,
            (user_id,),
        )
        rows = cursor.fetchall()
        return [
            {
                "placeId": row["place_id"],
                "name": row["name"],
                "country": row["country"],
                "state": row["state"],
                "city": row["city"],
                "type": row["type"],
            }
            for row in rows
        ]
    finally:
        cursor.close()
        connection.close()


def build_catalog(places: list[dict[str, Any]]) -> list[dict[str, Any]]:
    catalog: dict[str, set[str]] = {}
    for place in places:
        country = place.get("country")
        state = place.get("state")
        if not country or not state:
            continue
        catalog.setdefault(country, set()).add(state)

    return [
        {
            "name": country,
            "states": [{"name": state} for state in sorted(states)],
        }
        for country, states in sorted(catalog.items(), key=lambda item: item[0])
    ]


if __name__ == "__main__":
    debug_mode = os.getenv("ENVIRONMENT") != "production"
    app.run(debug=debug_mode)
