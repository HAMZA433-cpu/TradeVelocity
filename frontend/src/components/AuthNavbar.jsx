import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BarChart3, TrendingUp, Users, Trophy, User, LogOut, Menu, X } from 'lucide-react';

const AuthNavbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    const navItems = [
        { path: '/dashboard', label: 'DASHBOARD', icon: BarChart3 },
        { path: '/macro', label: 'MACRO', icon: TrendingUp },
        { path: '/community', label: 'COMMUNAUTÉ', icon: Users },
        { path: '/leaderboard', label: 'LEADERBOARD', icon: Trophy },
        { path: '/profile', label: 'PROFILE', icon: User }
    ];

    return (
        <nav className="border-b border-white/10 backdrop-blur-sm bg-black/30 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link
                        to="/dashboard"
                        className="text-xl sm:text-2xl font-black font-jetbrains hover:scale-105 transition-transform"
                    >
                        <span className="text-white">TRADE</span>
                        <span className="text-neon-green">VELOCITY</span>
                    </Link>

                    {/* Desktop Navigation Items */}
                    <div className="hidden md:flex items-center space-x-2">
                        {navItems.map((item) => {
                            const IconComponent = item.icon;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`px-4 py-2 flex items-center gap-2 transition-all font-jetbrains text-xs tracking-wider ${location.pathname === item.path
                                        ? 'bg-neon-green/20 text-neon-green border-b-2 border-neon-green'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <IconComponent className="w-4 h-4" />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Desktop Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="hidden md:flex px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-500 hover:text-red-400 transition-all font-jetbrains text-xs items-center gap-2"
                    >
                        <LogOut className="w-4 h-4" />
                        DÉCONNEXION
                    </button>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 text-white hover:text-neon-green transition-colors"
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden pb-4 space-y-2">
                        {navItems.map((item) => {
                            const IconComponent = item.icon;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 transition-all font-jetbrains text-sm tracking-wider ${location.pathname === item.path
                                        ? 'bg-neon-green/20 text-neon-green'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <IconComponent className="w-4 h-4" />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-500 hover:text-red-400 transition-all font-jetbrains text-sm"
                        >
                            <LogOut className="w-4 h-4" />
                            DÉCONNEXION
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default AuthNavbar;
