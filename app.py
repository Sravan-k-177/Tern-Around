from __future__ import annotations

import json
import os
import secrets
from pathlib import Path
from typing import Any

import mysql.connector
from dotenv import load_dotenv
from flask import Flask, jsonify, request, session, send_from_directory

BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")
app = Flask(__name__)
app.secret_key = os.getenv("FLASK_SECRET_KEY") or secrets.token_hex(32)


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
        name VARCHAR(120) NOT NULL,
        email VARCHAR(190) NOT NULL UNIQUE,
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
]


def connect_without_database() -> mysql.connector.MySQLConnection:
    config = dict(MYSQL_CONFIG)
    config.pop("database", None)
    return mysql.connector.connect(**config)


def connect_database() -> mysql.connector.MySQLConnection:
    return mysql.connector.connect(**MYSQL_CONFIG)


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
    }
    return jsonify(payload)


@app.post("/api/login")
def api_login() -> Any:
    if not DATABASE_READY:
        return jsonify({"error": "MySQL is not ready."}), 503

    data = request.get_json(silent=True) or {}
    name = str(data.get("name", "")).strip()
    email = str(data.get("email", "")).strip().lower()
    is_select_customer = bool(data.get("isSelectCustomer", True))

    if not name or not email:
        return jsonify({"error": "Name and email are required."}), 400

    connection = connect_database()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute(
            "SELECT id, name, email, is_select_customer FROM users WHERE email = %s",
            (email,),
        )
        user = cursor.fetchone()

        if not user:
            return jsonify({"error": "Account not found. Create a new account first."}), 404

        cursor.execute(
            """
            UPDATE users
            SET name = %s, is_select_customer = %s
            WHERE id = %s
            """,
            (name, int(is_select_customer), user["id"]),
        )
        user_id = user["id"]

        connection.commit()
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
    name = str(data.get("name", "")).strip()
    email = str(data.get("email", "")).strip().lower()
    is_select_customer = bool(data.get("isSelectCustomer", True))

    if not name or not email:
        return jsonify({"error": "Name and email are required."}), 400

    connection = connect_database()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
        if cursor.fetchone() is not None:
            return jsonify({"error": "That email already has an account. Log in instead."}), 409

        cursor.execute(
            """
            INSERT INTO users (name, email, is_select_customer)
            VALUES (%s, %s, %s)
            """,
            (name, email, int(is_select_customer)),
        )
        connection.commit()
        session["user_id"] = cursor.lastrowid
        user = get_user_by_id(cursor.lastrowid)
        return jsonify({"user": user}), 201
    finally:
        cursor.close()
        connection.close()


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
            "SELECT id, name, email, is_select_customer FROM users WHERE id = %s",
            (user_id,),
        )
        row = cursor.fetchone()
        if not row:
            return None

        return {
            "id": row["id"],
            "name": row["name"],
            "email": row["email"],
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
    app.run(debug=True)
