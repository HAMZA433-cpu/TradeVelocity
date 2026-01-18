import React from 'react';
import { Chrome } from 'lucide-react';
import API_BASE_URL from '../config/api';

const GoogleLoginButton = ({ text = "Se connecter avec Google", className = "" }) => {
    const handleGoogleLogin = () => {
        // Redirect to backend Google OAuth route
        window.location.href = `${API_BASE_URL}/auth/google`;
    };

    return (
        <button
            onClick={handleGoogleLogin}
            className={`w-full flex items-center justify-center gap-3 px-6 py-3 bg-white hover:bg-gray-100 text-gray-800 font-jetbrains text-sm font-bold border-2 border-gray-300 hover:border-neon-green transition-all group ${className}`}
        >
            <Chrome className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform" />
            <span>{text}</span>
        </button>
    );
};

export default GoogleLoginButton;
