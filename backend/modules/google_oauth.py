from flask import Blueprint, redirect, url_for, request, jsonify, session
from authlib.integrations.flask_client import OAuth
from extensions import db
from models import User, Challenge
from datetime import datetime
import os
from dotenv import load_dotenv
import secrets

load_dotenv()

# Initialize OAuth
oauth = OAuth()
google_oauth_bp = Blueprint('google_oauth', __name__)

# Configure Google OAuth
google = oauth.register(
    name='google',
    client_id=os.getenv('GOOGLE_CLIENT_ID'),
    client_secret=os.getenv('GOOGLE_CLIENT_SECRET'),
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={
        'scope': 'openid email profile'
    }
)

@google_oauth_bp.route('/google')
def google_login():
    """Redirect to Google OAuth login page"""
    redirect_uri = url_for('google_oauth.google_callback', _external=True)
    return google.authorize_redirect(redirect_uri)

@google_oauth_bp.route('/google/callback')
def google_callback():
    """Handle Google OAuth callback"""
    try:
        # Get the authorization token
        token = google.authorize_access_token()
        
        # Get user info from Google
        user_info = token.get('userinfo')
        
        if not user_info:
            return redirect(f"{os.getenv('FRONTEND_URL', 'http://localhost:5173')}/login?error=no_user_info")
        
        # Extract user data
        google_id = user_info.get('sub')
        email = user_info.get('email')
        name = user_info.get('name', email.split('@')[0])
        
        # Check if user exists by google_id or email
        user = User.query.filter(
            (User.google_id == google_id) | (User.email == email)
        ).first()
        
        if user:
            # Update google_id if user exists but doesn't have it
            if not user.google_id:
                user.google_id = google_id
            user.last_login = datetime.utcnow()
            db.session.commit()
        else:
            # Create new user
            user = User(
                username=name,
                email=email,
                password=None,  # No password for OAuth users
                google_id=google_id,
                is_verified=True,  # Google users are pre-verified
                last_login=datetime.utcnow()
            )
            db.session.add(user)
            db.session.flush()
            
            # Create initial challenge for new user
            challenge = Challenge(
                user_id=user.id,
                status='active',
                start_balance=5000.0,
                current_equity=5000.0
            )
            db.session.add(challenge)
            db.session.commit()
        
        # Generate a simple token (in production, use JWT)
        token = secrets.token_urlsafe(32)
        
        # Store user session
        session['user_id'] = user.id
        session['google_token'] = token
        
        # Redirect to frontend with success
        frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:5173')
        return redirect(f"{frontend_url}/dashboard?google_auth=success&user_id={user.id}&token={token}")
        
    except Exception as e:
        print(f"Google OAuth Error: {e}")
        frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:5173')
        return redirect(f"{frontend_url}/login?error=oauth_failed")

@google_oauth_bp.route('/google/status')
def google_status():
    """Check if Google OAuth is configured"""
    client_id = os.getenv('GOOGLE_CLIENT_ID')
    client_secret = os.getenv('GOOGLE_CLIENT_SECRET')
    
    return jsonify({
        'configured': bool(client_id and client_secret),
        'client_id_set': bool(client_id),
        'client_secret_set': bool(client_secret)
    })
