# =============================================================================
# Bio Clothes — simple Flask app for beginners (Hackathon starter)
# Run: python app.py
# =============================================================================

import os
from datetime import date

from dotenv import load_dotenv
from functools import wraps
from flask_sqlalchemy import SQLAlchemy

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

load_dotenv()

app = Flask(__name__)
database_url = os.environ.get("DATABASE_URL")
if not database_url:
    raise RuntimeError(
        "DATABASE_URL is not set. Export it or add it to a .env file in the project root "
        "(e.g. DATABASE_URL=postgresql://user:password@localhost:5432/yourdb)."
    )
app.config["SQLALCHEMY_DATABASE_URI"] = database_url
# Needed so Flask can sign session cookies (change this in a real deployment!)
app.secret_key = "change-this-secret-key-for-production"
# Reload HTML templates when you edit them (Flask otherwise caches them if DEBUG is off)
app.config["TEMPLATES_AUTO_RELOAD"] = True

db = SQLAlchemy(app)

# Where uploaded images are stored (inside static so the browser can load them)
UPLOAD_FOLDER = os.path.join(app.root_path, "static", "uploads")
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif", "webp"}


# =============================================================================
# Database models
# =============================================================================

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    clothes = db.relationship("Clothes", backref="user", lazy=True, cascade="all, delete-orphan")


class Clothes(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    image_path = db.Column(db.String(255), nullable=False)
    type = db.Column(db.String(100), nullable=False)
    color = db.Column(db.String(100), nullable=False)
    last_worn_date = db.Column(db.String(10))  # ISO date format (YYYY-MM-DD)


def allowed_file(filename):
    """Return True if the file has an allowed image extension."""
    if "." not in filename:
        return False
    ext = filename.rsplit(".", 1)[1].lower()
    return ext in ALLOWED_EXTENSIONS


# =============================================================================
# Database initialization
# =============================================================================

def init_db():
    """Create tables if they do not exist yet."""
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    with app.app_context():
        db.create_all()


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

        try:
            user = User(username=username, password=password_hash)
            db.session.add(user)
            db.session.commit()
            flash("Account created. You can log in now.", "success")
            return redirect(url_for("login"))
        except Exception:
            db.session.rollback()
            flash("That username is already taken.", "danger")

    return render_template("register.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    """Show login form or start a session if credentials match."""
    if request.method == "POST":
        username = (request.form.get("username") or "").strip()
        password = request.form.get("password") or ""

        user = User.query.filter_by(username=username).first()

        if user and check_password_hash(user.password, password):
            session["user_id"] = user.id
            session["username"] = user.username
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

    try:
        clothing = Clothes(
            user_id=session["user_id"],
            image_path=db_path,
            type=clothing_type,
            color=color,
        )
        db.session.add(clothing)
        db.session.commit()
        flash("Item saved to your wardrobe!", "success")
        return redirect(url_for("wardrobe"))
    except Exception:
        db.session.rollback()
        flash("Error saving item to database.", "danger")
        return redirect(url_for("home"))


@app.route("/wardrobe")
@login_required
def wardrobe():
    """
    List all clothes for this user, grouped by type.
    Sort: never worn first, then oldest last_worn_date first.
    """
    clothes_list = Clothes.query.filter_by(user_id=session["user_id"]).order_by(
        Clothes.last_worn_date.asc()
    ).all()

    # Convert ORM objects to dictionaries for template
    all_items = []
    for item in clothes_list:
        all_items.append({
            'id': item.id,
            'type': item.type,
            'color': item.color,
            'image_path': item.image_path,
            'last_worn_date': item.last_worn_date,
        })

    # Group items by type (e.g. all "t-shirt" together)
    grouped = {}
    for item in clothes_list:
        t = item.type
        if t not in grouped:
            grouped[t] = []
        grouped[t].append(item)

    return render_template(
    "wardrobe.html",
    username=session.get("username"),
    grouped=grouped,
    all_items=all_items,
)

@app.route("/mark_worn/<int:item_id>", methods=["POST"])
@login_required
def mark_worn(item_id):
    """Set last_worn_date to today for one clothing row (only if it belongs to this user)."""
    today = date.today().isoformat()  # e.g. "2025-03-25"

    item = Clothes.query.filter_by(id=item_id, user_id=session["user_id"]).first()
    if item:
        item.last_worn_date = today
        db.session.commit()
        flash("Marked as worn today!", "success")
    else:
        flash("Item not found.", "danger")

    return redirect(url_for("wardrobe"))


@app.route("/delete_item/<int:item_id>", methods=["POST"])
@login_required
def delete_item(item_id):
    """Remove one clothing row (and its image file) if it belongs to this user."""
    item = Clothes.query.filter_by(id=item_id, user_id=session["user_id"]).first()
    
    if item:
        # Delete the image file from disk
        full_path = os.path.join(app.root_path, item.image_path)
        if os.path.isfile(full_path):
            try:
                os.remove(full_path)
            except OSError:
                pass
        
        db.session.delete(item)
        db.session.commit()
        flash("Item removed from your wardrobe.", "success")
    
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
