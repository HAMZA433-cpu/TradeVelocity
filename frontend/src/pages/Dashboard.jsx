import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    Activity,
    BarChart3,
    Bell,
    User,
    LogOut,
    Settings,
    Target,
    Zap,
    Clock,
    Award,
    AlertCircle,
    CheckCircle,
    XCircle
} from 'lucide-react';
import axios from 'axios';
import AIChat from '../components/AIChat';
import LivePrice from '../components/LivePrice';
import BVCStocksWidget from '../components/BVCStocksWidget';
import API_BASE_URL from '../config/api';

const Dashboard = () => {
    const chartContainerRef = useRef();
    const [currentPrice, setCurrentPrice] = useState(null);
    const [symbol, setSymbol] = useState('BTC-USD');
    const [quantity, setQuantity] = useState(1);
    const [challengeId, setChallengeId] = useState(1);
    const [openTrades, setOpenTrades] = useState([]);
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    // Portfolio Stats
    const [portfolioStats, setPortfolioStats] = useState({
        balance: 10000,
        equity: 10245.50,
        pnlToday: 245.50,
        pnlTotal: 1245.50,
        winRate: 68.5,
        totalTrades: 47,
        openPositions: 3
    });

    // Watch List with real-time updates
    const [watchList, setWatchList] = useState([
        { symbol: 'BTC-USD', name: 'Bitcoin', price: 43250, change: 2.3, volume: '2.4B', isUp: true },
        { symbol: 'ETH-USD', name: 'Ethereum', price: 2456, change: 1.8, volume: '1.2B', isUp: true },
        { symbol: 'SOL-USD', name: 'Solana', price: 98.45, change: -1.2, volume: '456M', isUp: false },
        { symbol: 'AAPL', name: 'Apple', price: 185.50, change: -0.5, volume: '89M', isUp: false },
        { symbol: 'TSLA', name: 'Tesla', price: 245.30, change: 3.2, volume: '123M', isUp: true }
    ]);

    // Recent Trades
    const [recentTrades, setRecentTrades] = useState([
        { id: 1, symbol: 'BTC-USD', type: 'BUY', quantity: 0.5, price: 42500, pnl: 375, time: '10:45', status: 'closed' },
        { id: 2, symbol: 'ETH-USD', type: 'SELL', quantity: 5, price: 2420, pnl: -120, time: '09:30', status: 'closed' },
        { id: 3, symbol: 'AAPL', type: 'BUY', quantity: 10, price: 182, pnl: 350, time: '08:15', status: 'closed' }
    ]);

    // Market News
    const [marketNews, setMarketNews] = useState([
        { title: 'Bitcoin rallies to new monthly high', time: '5m ago', sentiment: 'positive' },
        { title: 'Fed signals potential rate cuts in 2024', time: '1h ago', sentiment: 'positive' },
        { title: 'Tech stocks show mixed performance', time: '2h ago', sentiment: 'neutral' }
    ]);

    // TradingView Chart Integration
    useEffect(() => {
        if (!chartContainerRef.current) return;

        chartContainerRef.current.innerHTML = '';

        const script = document.createElement('script');
        script.src = 'https://s3.tradingview.com/tv.js';
        script.async = true;
        script.onload = () => {
            if (window.TradingView) {
                let tvSymbol;
                const moroccanStocks = ['IAM', 'ATW', 'BCP', 'CIH', 'GAZ', 'LHM', 'MNG', 'ONA', 'SAM', 'SNI', 'TQM', 'WAA'];

                if (moroccanStocks.includes(symbol)) {
                    tvSymbol = `CASABLANCA:${symbol}`;
                } else if (symbol === 'BTC-USD') {
                    tvSymbol = 'BINANCE:BTCUSDT';
                } else if (symbol === 'ETH-USD') {
                    tvSymbol = 'BINANCE:ETHUSDT';
                } else if (symbol === 'SOL-USD') {
                    tvSymbol = 'BINANCE:SOLUSDT';
                } else {
                    tvSymbol = `NASDAQ:${symbol}`;
                }

                new window.TradingView.widget({
                    autosize: true,
                    symbol: tvSymbol,
                    interval: '15',
                    timezone: 'Africa/Casablanca',
                    theme: 'dark',
                    style: '1',
                    locale: 'fr',
                    toolbar_bg: '#0a0a0f',
                    enable_publishing: false,
                    withdateranges: true,
                    hide_side_toolbar: false,
                    allow_symbol_change: false,
                    container_id: 'tradingview_chart',
                    backgroundColor: '#0a0a0f',
                    gridColor: '#1a1a1f',
                    studies: ['MASimple@tv-basicstudies', 'RSI@tv-basicstudies', 'MACD@tv-basicstudies'],
                    loading_screen: {
                        backgroundColor: '#0a0a0f',
                        foregroundColor: '#00ff9d'
                    },
                    overrides: {
                        'paneProperties.background': '#0a0a0f',
                        'paneProperties.backgroundType': 'solid',
                        'paneProperties.gridProperties.color': '#1a1a1f',
                        'scalesProperties.textColor': '#00ff9d',
                        'mainSeriesProperties.candleStyle.upColor': '#00ff9d',
                        'mainSeriesProperties.candleStyle.downColor': '#ff0055',
                        'mainSeriesProperties.candleStyle.borderUpColor': '#00ff9d',
                        'mainSeriesProperties.candleStyle.borderDownColor': '#ff0055',
                        'mainSeriesProperties.candleStyle.wickUpColor': '#00ff9d',
                        'mainSeriesProperties.candleStyle.wickDownColor': '#ff0055',
                    }
                });
            }
        };

        document.head.appendChild(script);

        // Price updates
        const priceInterval = setInterval(async () => {
            try {
                if (symbol.includes('BTC') || symbol.includes('ETH') || symbol.includes('SOL')) {
                    const tickerMap = { 'BTC-USD': 'BTCUSDT', 'ETH-USD': 'ETHUSDT', 'SOL-USD': 'SOLUSDT' };
                    const tickerSymbol = tickerMap[symbol];
                    const response = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${tickerSymbol}`);
                    const data = await response.json();
                    setCurrentPrice('$' + parseFloat(data.price).toFixed(2));
                }
            } catch (error) {
                console.error('Price fetch error:', error);
            }
        }, 5000);

        // Update watchlist
        const watchlistInterval = setInterval(() => {
            setWatchList(prev => prev.map(item => ({
                ...item,
                price: item.price + (Math.random() - 0.5) * 5,
                change: (Math.random() - 0.4) * 5,
                isUp: Math.random() > 0.4
            })));
        }, 3000);

        return () => {
            clearInterval(priceInterval);
            clearInterval(watchlistInterval);
        };
    }, [symbol]);

    const handleTrade = async (type) => {
        const trade = {
            symbol,
            position: type,
            quantity: parseFloat(quantity),
            entry_price: currentPrice,
            challenge_id: challengeId
        };

        try {
            const response = await axios.post('${API_BASE_URL}/api/trade', trade);
            if (response.data.success) {
                alert(`✅ ${type.toUpperCase()} order executed!`);
                setOpenTrades([...openTrades, {
                    id: Date.now(),
                    ...trade,
                    pnl: 0,
                    status: 'open'
                }]);
            }
        } catch (error) {
            console.error('Trade error:', error);
            alert('❌ Trade failed');
        }
    };

    const handleCloseTrade = async (tradeId) => {
        setOpenTrades(openTrades.filter(t => t.id !== tradeId));
        alert('✅ Position closed');
    };

    return (
        <div className="min-h-screen bg-cyberpunk text-white">
            {/* Top Navigation */}
            <nav className="border-b border-white/10 backdrop-blur-sm bg-black/30 sticky top-0 z-50">
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link to="/" className="text-2xl font-black font-jetbrains">
                            <span className="text-white">TRADE</span>
                            <span className="text-neon-green">VELOCITY</span>
                        </Link>

                        {/* Quick Stats */}
                        <div className="hidden md:flex items-center gap-4 lg:gap-8">
                            <div className="flex items-center gap-2">
                                <DollarSign className="w-5 h-5 text-neon-green" />
                                <div>
                                    <div className="text-[10px] text-gray-500 font-jetbrains">BALANCE</div>
                                    <div className="text-lg font-bold font-jetbrains">${portfolioStats.equity.toLocaleString()}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Activity className="w-5 h-5 text-neon-green" />
                                <div>
                                    <div className="text-[10px] text-gray-500 font-jetbrains">P/L TODAY</div>
                                    <div className={`text-lg font-bold font-jetbrains ${portfolioStats.pnlToday >= 0 ? 'text-neon-green' : 'text-red-500'}`}>
                                        {portfolioStats.pnlToday >= 0 ? '+' : ''}{portfolioStats.pnlToday.toFixed(2)}$
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Target className="w-5 h-5 text-neon-green" />
                                <div>
                                    <div className="text-[10px] text-gray-500 font-jetbrains">WIN RATE</div>
                                    <div className="text-lg font-bold font-jetbrains text-neon-green">{portfolioStats.winRate}%</div>
                                </div>
                            </div>
                        </div>

                        {/* User Menu */}
                        <div className="flex items-center gap-4">
                            <Bell className="w-5 h-5 text-gray-400 hover:text-neon-green cursor-pointer transition-colors" />
                            <div className="relative">
                                <button
                                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                                    className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 hover:border-neon-green/50 transition-all font-jetbrains text-xs"
                                >
                                    <User className="w-4 h-4" />
                                    <span>PROFILE</span>
                                </button>
                                {showProfileMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="absolute right-0 mt-2 w-48 glassmorphism-dark border border-white/10 py-2"
                                    >
                                        <Link to="/profile" className="block px-4 py-2 hover:bg-white/5 font-jetbrains text-xs flex items-center gap-2">
                                            <Settings className="w-4 h-4" /> Settings
                                        </Link>
                                        <Link to="/" className="block px-4 py-2 hover:bg-white/5 font-jetbrains text-xs flex items-center gap-2 text-red-500">
                                            <LogOut className="w-4 h-4" /> Logout
                                        </Link>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Dashboard Grid */}
            <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
                {/* Left Column - Portfolio & Market Data */}
                <div className="lg:col-span-3 space-y-4 sm:space-y-6">
                    {/* Portfolio Overview */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glassmorphism-dark p-6 border border-white/10"
                    >
                        <h3 className="font-jetbrains text-xs text-gray-400 mb-4 uppercase tracking-wider">Portfolio Overview</h3>
                        <div className="space-y-4">
                            <div>
                                <div className="text-[10px] text-gray-500 mb-1 font-jetbrains">TOTAL BALANCE</div>
                                <div className="text-3xl font-black font-jetbrains text-white">${portfolioStats.balance.toLocaleString()}</div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <div className="text-[10px] text-gray-500 mb-1 font-jetbrains">P/L TOTAL</div>
                                    <div className="text-lg font-bold font-jetbrains text-neon-green">+${portfolioStats.pnlTotal}</div>
                                </div>
                                <div>
                                    <div className="text-[10px] text-gray-500 mb-1 font-jetbrains">OPEN POS.</div>
                                    <div className="text-lg font-bold font-jetbrains">{portfolioStats.openPositions}</div>
                                </div>
                            </div>
                            <div className="pt-3 border-t border-white/10">
                                <div className="flex justify-between items-center text-xs font-jetbrains">
                                    <span className="text-gray-400">Total Trades</span>
                                    <span className="text-white font-bold">{portfolioStats.totalTrades}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Live Markets Watch List */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-4"
                    >
                        <h3 className="font-jetbrains text-xs text-gray-400 uppercase tracking-wider flex items-center gap-2">
                            <Activity className="w-4 h-4" /> Live Markets
                        </h3>
                        <LivePrice symbol="BTC-USD" />
                        <LivePrice symbol="ETH-USD" />
                        <LivePrice symbol="AAPL" />
                        <LivePrice symbol="TSLA" />
                    </motion.div>

                    {/* Market News */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glassmorphism-dark p-6 border border-white/10"
                    >
                        <h3 className="font-jetbrains text-xs text-gray-400 mb-4 uppercase tracking-wider flex items-center gap-2">
                            <Bell className="w-4 h-4" /> Market News
                        </h3>
                        <div className="space-y-3">
                            {marketNews.map((news, idx) => (
                                <div key={idx} className="border-l-2 border-neon-green/30 pl-3 py-2">
                                    <div className="font-jetbrains text-xs text-white mb-1">{news.title}</div>
                                    <div className="text-[10px] text-gray-500 font-jetbrains">{news.time}</div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Center Column - Chart & Trading */}
                <div className="lg:col-span-6 space-y-4 sm:space-y-6">
                    {/* Chart Container */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glassmorphism-dark border border-white/10 overflow-hidden"
                    >
                        {/* Chart Header */}
                        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <select
                                    value={symbol}
                                    onChange={(e) => setSymbol(e.target.value)}
                                    className="bg-black/50 border border-white/10 text-white px-4 py-2 font-jetbrains text-sm focus:outline-none focus:border-neon-green"
                                >
                                    <option value="BTC-USD">BTC-USD</option>
                                    <option value="ETH-USD">ETH-USD</option>
                                    <option value="SOL-USD">SOL-USD</option>
                                    <option value="AAPL">AAPL</option>
                                    <option value="TSLA">TSLA</option>
                                    <option value="GOOGL">GOOGL</option>
                                </select>
                                {currentPrice && (
                                    <div className="text-2xl font-bold font-jetbrains text-neon-green">{currentPrice}</div>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                {['1D', '1W', '1M', '3M', '1Y'].map((tf) => (
                                    <button
                                        key={tf}
                                        className="px-3 py-1 bg-white/5 hover:bg-neon-green/20 hover:text-neon-green transition-all font-jetbrains text-xs"
                                    >
                                        {tf}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* TradingView Chart */}
                        <div className="h-[500px] relative">
                            <div id="tradingview_chart" className="absolute inset-0" ref={chartContainerRef}></div>
                        </div>
                    </motion.div>

                    {/* Trading Panel */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="glassmorphism-dark p-6 border border-white/10"
                    >
                        <h3 className="font-jetbrains text-xs text-gray-400 mb-4 uppercase tracking-wider">Quick Trade</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                            <div>
                                <label className="text-[10px] text-gray-500 mb-2 block font-jetbrains uppercase">Quantity</label>
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    className="w-full bg-black/50 border border-white/10 text-white px-3 py-2 font-jetbrains text-sm focus:outline-none focus:border-neon-green"
                                    step="0.01"
                                    min="0.01"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] text-gray-500 mb-2 block font-jetbrains uppercase">Order Type</label>
                                <select className="w-full bg-black/50 border border-white/10 text-white px-3 py-2 font-jetbrains text-sm focus:outline-none focus:border-neon-green">
                                    <option>MARKET</option>
                                    <option>LIMIT</option>
                                    <option>STOP</option>
                                </select>
                            </div>
                            <button
                                onClick={() => handleTrade('buy')}
                                className="bg-neon-green text-black hover:bg-neon-green/90 px-6 py-2 font-jetbrains text-sm font-bold transition-all flex items-center justify-center gap-2"
                            >
                                <TrendingUp className="w-4 h-4" /> BUY
                            </button>
                            <button
                                onClick={() => handleTrade('sell')}
                                className="bg-red-500 text-white hover:bg-red-600 px-6 py-2 font-jetbrains text-sm font-bold transition-all flex items-center justify-center gap-2"
                            >
                                <TrendingDown className="w-4 h-4" /> SELL
                            </button>
                        </div>
                    </motion.div>

                    {/* BVC Stocks Widget - Bourse de Casablanca */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <BVCStocksWidget onStockClick={setSymbol} />
                    </motion.div>
                </div>

                {/* Right Column - Positions & Activity */}
                <div className="lg:col-span-3 space-y-4 sm:space-y-6">
                    {/* Open Positions */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glassmorphism-dark p-6 border border-white/10"
                    >
                        <h3 className="font-jetbrains text-xs text-gray-400 mb-4 uppercase tracking-wider">
                            Open Positions ({openTrades.length})
                        </h3>
                        <div className="space-y-3">
                            {openTrades.length === 0 ? (
                                <div className="text-center py-8 text-gray-600 font-jetbrains text-xs">
                                    No open positions
                                </div>
                            ) : (
                                openTrades.map(trade => (
                                    <div key={trade.id} className="bg-white/5 p-4 border-l-2 border-neon-green">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-jetbrains text-sm font-bold">{trade.symbol}</span>
                                            <span className={`px-2 py-1 text-[10px] font-jetbrains ${trade.position === 'buy' ? 'bg-neon-green/20 text-neon-green' : 'bg-red-500/20 text-red-500'
                                                }`}>
                                                {trade.position.toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="font-jetbrains text-xs text-gray-400 mb-2">
                                            Qty: {trade.quantity} @ {trade.entry_price}
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-jetbrains text-neon-green">P/L: +$0.00</span>
                                            <button
                                                onClick={() => handleCloseTrade(trade.id)}
                                                className="px-3 py-1 bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white font-jetbrains text-[10px] transition-all"
                                            >
                                                CLOSE
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>

                    {/* AI Assistant */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="h-[600px]"
                    >
                        <AIChat symbol={symbol} />
                    </motion.div>

                    {/* Performance Stats */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glassmorphism-dark p-6 border border-white/10"
                    >
                        <h3 className="font-jetbrains text-xs text-gray-400 mb-4 uppercase tracking-wider flex items-center gap-2">
                            <Award className="w-4 h-4" /> Performance
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-jetbrains text-gray-400">Best Trade</span>
                                <span className="text-sm font-jetbrains font-bold text-neon-green">+$875</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-jetbrains text-gray-400">Worst Trade</span>
                                <span className="text-sm font-jetbrains font-bold text-red-500">-$245</span>
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t border-white/10">
                                <span className="text-xs font-jetbrains text-gray-400">Avg Win</span>
                                <span className="text-sm font-jetbrains font-bold text-white">$425</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-jetbrains text-gray-400">Avg Loss</span>
                                <span className="text-sm font-jetbrains font-bold text-white">$187</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
