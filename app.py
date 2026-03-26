# =============================================================================
# Bio Clothes — simple Flask app for beginners (Hackathon starter)
# Run: python app.py
# =============================================================================

import os
import sqlite3
from datetime import date
from functools import wraps

from flask import (
    Flask,
    flash,
    redirect,
    render_template,
    request,
    session,
    url_for,
)
from werkzeug.security import check_password_hash, generate_password_hash
from werkzeug.utils import secure_filename

# -----------------------------------------------------------------------------
# App setup
# -----------------------------------------------------------------------------

app = Flask(__name__)
# Needed so Flask can sign session cookies (change this in a real deployment!)
app.secret_key = "change-this-secret-key-for-production"
# Reload HTML templates when you edit them (Flask otherwise caches them if DEBUG is off)
app.config["TEMPLATES_AUTO_RELOAD"] = True

# Where uploaded images are stored (inside static so the browser can load them)
UPLOAD_FOLDER = os.path.join(app.root_path, "static", "uploads")
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif", "webp"}
DATABASE = os.path.join(app.root_path, "database.db")


def allowed_file(filename):
    """Return True if the file has an allowed image extension."""
    if "." not in filename:
        return False
    ext = filename.rsplit(".", 1)[1].lower()
    return ext in ALLOWED_EXTENSIONS


# -----------------------------------------------------------------------------
# Database helpers (plain sqlite3 — no ORM)
# -----------------------------------------------------------------------------


def get_db():
    """Open a connection to SQLite. 'row_factory' lets us use dict-like rows."""
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    """
    Create tables if they do not exist yet.
    Runs once when the app starts (safe to call every time).
    """
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    conn = get_db()
    cur = conn.cursor()
    # Users: one row per registered account
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
        )
        """
    )
    # Clothes: one row per clothing item; belongs to a user
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS clothes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            image_path TEXT NOT NULL,
            type TEXT NOT NULL,
            color TEXT NOT NULL,
            last_worn_date TEXT,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
        """
    )
    conn.commit()
    conn.close()


def login_required(view):
    """Decorator: only allow logged-in users to access a route."""

    @wraps(view)
    def wrapped(*args, **kwargs):
        if "user_id" not in session:
            flash("Please log in first.", "warning")
            return redirect(url_for("login"))
        return view(*args, **kwargs)

    return wrapped


# -----------------------------------------------------------------------------
# Authentication routes
# -----------------------------------------------------------------------------


@app.route("/register", methods=["GET", "POST"])
def register():
    """Show registration form or create a new user."""
    if request.method == "POST":
        username = (request.form.get("username") or "").strip()
        password = request.form.get("password") or ""

        if not username or not password:
            flash("Username and password are required.", "danger")
            return redirect(url_for("register"))

        # Hash the password so we never store plain text in the database
        password_hash = generate_password_hash(password)

        conn = get_db()
        cur = conn.cursor()
        try:
            cur.execute(
                "INSERT INTO users (username, password) VALUES (?, ?)",
                (username, password_hash),
            )
            conn.commit()
            flash("Account created. You can log in now.", "success")
            return redirect(url_for("login"))
        except sqlite3.IntegrityError:
            flash("That username is already taken.", "danger")
        finally:
            conn.close()

    return render_template("register.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    """Show login form or start a session if credentials match."""
    if request.method == "POST":
        username = (request.form.get("username") or "").strip()
        password = request.form.get("password") or ""

        conn = get_db()
        cur = conn.cursor()
        cur.execute(
            "SELECT id, username, password FROM users WHERE username = ?",
            (username,),
        )
        row = cur.fetchone()
        conn.close()

        if row and check_password_hash(row["password"], password):
            session["user_id"] = row["id"]
            session["username"] = row["username"]
            flash("Welcome back!", "success")
            return redirect(url_for("home"))

        flash("Wrong username or password.", "danger")

    return render_template("login.html")


@app.route("/logout")
def logout():
    """Clear the session so the user is logged out."""
    session.clear()
    flash("You are logged out.", "info")
    return redirect(url_for("login"))


# -----------------------------------------------------------------------------
# Main app pages (require login)
# -----------------------------------------------------------------------------


@app.route("/")
def index():
    """Root URL: send logged-in users home, others to login."""
    if "user_id" in session:
        return redirect(url_for("home"))
    return redirect(url_for("login"))


@app.route("/home")
@login_required
def home():
    """Page to upload a new clothing item."""
    return render_template("home.html", username=session.get("username"))


@app.route("/upload", methods=["POST"])
@login_required
def upload():
    """
    Receive the image + type + color from the home form.
    Saves the file under static/uploads/ and inserts a row in 'clothes'.
    """
    if "image" not in request.files:
        flash("No file part in the form.", "danger")
        return redirect(url_for("home"))

    file = request.files["image"]
    clothing_type = (request.form.get("type") or "").strip()
    color = (request.form.get("color") or "").strip()

    if file.filename == "":
        flash("Please choose an image file.", "danger")
        return redirect(url_for("home"))

    if not clothing_type or not color:
        flash("Please fill in type and color.", "danger")
        return redirect(url_for("home"))

    if not allowed_file(file.filename):
        flash("Allowed formats: png, jpg, jpeg, gif, webp.", "danger")
        return redirect(url_for("home"))

    # Safe filename (removes weird characters)
    filename = secure_filename(file.filename)
    # Make sure two users cannot overwrite each other: prefix with user id + random bit
    unique_name = f"{session['user_id']}_{filename}"
    save_path = os.path.join(UPLOAD_FOLDER, unique_name)
    file.save(save_path)

    # Path we store in DB — browser loads via /static/uploads/...
    db_path = f"uploads/{unique_name}"

    conn = get_db()
    cur = conn.cursor()
    cur.execute(
        """
        INSERT INTO clothes (user_id, image_path, type, color, last_worn_date)
        VALUES (?, ?, ?, ?, NULL)
        """,
        (session["user_id"], db_path, clothing_type, color),
    )
    conn.commit()
    conn.close()

    flash("Item saved to your wardrobe!", "success")
    return redirect(url_for("wardrobe"))


@app.route("/wardrobe")
@login_required
def wardrobe():
    """
    List all clothes for this user.
    Sort: never worn first, then oldest last_worn_date first (SQLite: NULL sorts first in ASC).
    """
    conn = get_db()
    cur = conn.cursor()
    cur.execute(
        """
        SELECT id, image_path, type, color, last_worn_date
        FROM clothes
        WHERE user_id = ?
        ORDER BY last_worn_date ASC
        """,
        (session["user_id"],),
    )
    rows = cur.fetchall()
    conn.close()

    all_items = list(rows)

    return render_template(
        "wardrobe.html",
        username=session.get("username"),
        all_items=all_items,
    )


@app.route("/mark_worn/<int:item_id>", methods=["POST"])
@login_required
def mark_worn(item_id):
    """Set last_worn_date to today for one clothing row (only if it belongs to this user)."""
    today = date.today().isoformat()  # e.g. "2025-03-25"

    conn = get_db()
    cur = conn.cursor()
    cur.execute(
        """
        UPDATE clothes
        SET last_worn_date = ?
        WHERE id = ? AND user_id = ?
        """,
        (today, item_id, session["user_id"]),
    )
    conn.commit()
    conn.close()

    flash("Marked as worn today!", "success")
    return redirect(url_for("wardrobe"))


@app.route("/delete_item/<int:item_id>", methods=["POST"])
@login_required
def delete_item(item_id):
    """Remove one clothing row (and its image file) if it belongs to this user."""
    conn = get_db()
    cur = conn.cursor()
    cur.execute(
        """
        SELECT image_path FROM clothes
        WHERE id = ? AND user_id = ?
        """,
        (item_id, session["user_id"]),
    )
    row = cur.fetchone()
    if row:
        image_path = row["image_path"]
        cur.execute(
            "DELETE FROM clothes WHERE id = ? AND user_id = ?",
            (item_id, session["user_id"]),
        )
        conn.commit()
        full_path = os.path.join(app.root_path, "static", image_path)
        if os.path.isfile(full_path):
            try:
                os.remove(full_path)
            except OSError:
                pass
        flash("Item removed from your wardrobe.", "success")
    conn.close()
    return redirect(url_for("wardrobe"))


@app.route("/map")
@login_required
def map_page():
    """Map page: MapTiler map + donation markers; static assets loaded via url_for in map.html."""
    return render_template("map.html", username=session.get("username"))


# -----------------------------------------------------------------------------
# Run the development server
# -----------------------------------------------------------------------------

# Create tables on import. Needed when you start the app with `flask run` —
# that command does NOT run the `if __name__ == "__main__"` block, so without
# this line you get "no such table: users" on register/login.
init_db()

if __name__ == "__main__":
    # debug=True is handy while learning; turn off in production
    app.run(debug=True, port=5000)
