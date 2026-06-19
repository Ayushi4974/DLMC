import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useWallet } from '../context/WalletContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ArrowRight, Shield, Zap, TrendingUp, Coins, Users, 
  Layers, Award, HelpCircle, Activity, Vote, Wallet, 
  BookOpen, AlertTriangle, ChevronRight, Play, ExternalLink,
  MessageSquare, Sparkles, CheckCircle2, ChevronDown, ChevronUp, Copy,
  LogIn, UserPlus, Menu, X
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import logoImg from '../assets/logo.png';

const LUXURY_EASE = [0.16, 1, 0.3, 1];

const fadeInUp = {
  hidden: { opacity: 0, y: 35 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.65, ease: LUXURY_EASE } 
  },
  hover: {
    y: -8,
    borderColor: 'rgba(224, 160, 30, 0.45)',
    boxShadow: '0 15px 35px rgba(224, 160, 30, 0.15), 0 8px 32px 0 rgba(0, 0, 0, 0.5)',
    transition: { duration: 0.3, ease: 'easeOut' }
  }
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -35 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { duration: 0.65, ease: LUXURY_EASE } 
  },
  hover: {
    y: -8,
    borderColor: 'rgba(224, 160, 30, 0.45)',
    boxShadow: '0 15px 35px rgba(224, 160, 30, 0.15), 0 8px 32px 0 rgba(0, 0, 0, 0.5)',
    transition: { duration: 0.3, ease: 'easeOut' }
  }
};

const fadeInRight = {
  hidden: { opacity: 0, x: 35 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { duration: 0.65, ease: LUXURY_EASE } 
  },
  hover: {
    y: -8,
    borderColor: 'rgba(224, 160, 30, 0.45)',
    boxShadow: '0 15px 35px rgba(224, 160, 30, 0.15), 0 8px 32px 0 rgba(0, 0, 0, 0.5)',
    transition: { duration: 0.3, ease: 'easeOut' }
  }
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08
    }
  }
};

// Intersection Observer statistics counter
const AnimatedCounter = ({ value, prefix = '', suffix = '', duration = 1.2 }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = React.useRef(null);
  const prevValueRef = React.useRef(0);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAnimated) {
        setHasAnimated(true);
      }
    }, { threshold: 0.1 });

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  useEffect(() => {
    if (!hasAnimated) return;

    const start = prevValueRef.current;
    const end = parseFloat(value);
    if (isNaN(end)) return;
    
    const startTime = performance.now();

    const updateCount = (now) => {
      const elapsed = (now - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeProgress = progress * (2 - progress);
      const current = start + easeProgress * (end - start);
      
      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        prevValueRef.current = end;
      }
    };

    requestAnimationFrame(updateCount);
  }, [hasAnimated, value, duration]);

  const formatNumber = (num) => {
    if (value.toString().includes('.')) {
      return num.toFixed(4);
    }
    return Math.floor(num).toLocaleString();
  };

  return <span ref={elementRef}>{prefix}{formatNumber(count)}{suffix}</span>;
};

// 3D-effect floating coin — pure CSS animations for buttery smooth 60fps
const FloatingCoin = () => {
  return (
    <div className="floating-coin-container" style={{ transformStyle: 'preserve-3d', perspective: 1000 }}>
      {/* Outer Orbit Ring — CSS rotation, GPU-accelerated */}
      <div className="coin-orbit-outer coin-orbit-outer--spin">
        <div className="coin-dot-outer" />
        <div className="orbit-dot-slow-1" />
      </div>

      {/* Middle Orbit Ring */}
      <div className="coin-orbit-middle">
        <div className="orbit-dot-slow-2" />
      </div>

      {/* Inner Orbit Ring — CSS rotation, opposite direction */}
      <div className="coin-orbit-inner coin-orbit-inner--spin">
        <div className="coin-dot-inner" />
      </div>

      {/* Main Floating Golden Token — single smooth CSS float + 3D springs */}
      <motion.div
        whileHover={{ scale: 1.08, rotateY: 15, rotateX: -10 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="coin-token-main coin-float"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="coin-token-inner">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span className="glow-text coin-token-title">DLMC</span>
            <span className="coin-token-sub">PROTOCOL</span>
          </div>
        </div>
      </motion.div>

      <div className="coin-glow-shadow coin-glow-pulse" />
    </div>
  );
};

// Premium Mouse-tracking border glow card
const PremiumGlowCard = motion(React.forwardRef(({ children, className = '', style = {}, ...props }, ref) => {
  const cardRef = useRef(null);
  const [mouseCoords, setMouseCoords] = useState({ x: 0, y: 0 });
  
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMouseCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const setRefs = useCallback((node) => {
    cardRef.current = node;
    if (ref) {
      if (typeof ref === 'function') ref(node);
      else ref.current = node;
    }
  }, [ref]);

  return (
    <div
      ref={setRefs}
      onMouseMove={handleMouseMove}
      className={`premium-glow-card ${className}`}
      style={{
        ...style,
        '--mouse-x': `${mouseCoords.x}px`,
        '--mouse-y': `${mouseCoords.y}px`
      }}
      {...props}
    >
      {children}
    </div>
  );
}));

// Premium Mouse-tracking border glow card + 3D Tilt Effect
const TiltCard = motion(React.forwardRef(({ children, className = '', style = {}, ...props }, ref) => {
  const cardRef = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [mouseCoords, setMouseCoords] = useState({ x: 0, y: 0 });
  
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate rotation angles (max tilt 8 degrees)
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const tiltX = ((y - centerY) / centerY) * -6; // inverted Y axis for correct visual tilt
    const tiltY = ((x - centerX) / centerX) * 6;
    
    setRotateX(tiltX);
    setRotateY(tiltY);
    setMouseCoords({ x, y });
  };
  
  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const setRefs = useCallback((node) => {
    cardRef.current = node;
    if (ref) {
      if (typeof ref === 'function') ref(node);
      else ref.current = node;
    }
  }, [ref]);

  return (
    <div
      ref={setRefs}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`premium-glow-card tilt-card-wrap ${className}`}
      style={{
        ...style,
        '--mouse-x': `${mouseCoords.x}px`,
        '--mouse-y': `${mouseCoords.y}px`,
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: 'transform 0.1s ease-out'
      }}
      {...props}
    >
      {children}
    </div>
  );
}));

const hoverLift = {
  hover: {
    y: -8,
    boxShadow: '0 15px 35px rgba(224, 160, 30, 0.15), 0 8px 32px 0 rgba(0, 0, 0, 0.5)',
    borderColor: 'rgba(224, 160, 30, 0.45)',
    transition: { duration: 0.3, ease: 'easeOut' }
  }
};

const LandingPage = () => {
  const { isConnected } = useWallet();
  const [searchParams] = useSearchParams();
  const refCode = searchParams.get('ref') || '';
  const navigate = useNavigate();
  const [tokenPrice, setTokenPrice] = useState(1.25);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const heroRef = useRef(null);
  const [heroMouse, setHeroMouse] = useState({ x: 50, y: 50 });
  const handleHeroMouseMove = (e) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setHeroMouse({ x, y });
  };

  // Scroll tracking for How It Works progressive line
  const howItWorksRef = useRef(null);
  const { scrollYProgress: howItWorksScroll } = useScroll({
    target: howItWorksRef,
    offset: ["start end", "end start"]
  });
  const progressScale = useTransform(howItWorksScroll, [0.2, 0.55], [0, 1]);


  
  // Interactive calculators state
  const [calculatorMode, setCalculatorMode] = useState('buy'); // 'buy' | 'sell'
  const [usdtInput, setUsdtInput] = useState(100);
  const [dlmcSellInput, setDlmcSellInput] = useState(100);
  
  const [stakeInput, setStakeInput] = useState(500);
  const [roiSlider, setRoiSlider] = useState(0.5); // 0.5% to 1% daily

  // Multi-level Team Income interactive state
  const [activeLevelTab, setActiveLevelTab] = useState(1);

  // Ranks & Salaries interactive state
  const [activeRankTab, setActiveRankTab] = useState('D1');

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  // Address Copy Notification
  const [copiedText, setCopiedText] = useState(false);

  // Simulate price ticks
  useEffect(() => {
    const interval = setInterval(() => {
      setTokenPrice(prev => Number((prev + (Math.random() - 0.49) * 0.0035).toFixed(4)));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goToLogin    = () => navigate('/login');
  const goToRegister = () => navigate(`/login?ref=${refCode}&mode=register`);

  const copyAddress = () => {
    navigator.clipboard.writeText("0xDLMCPRotocolSmartContractAddressBEP20");
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  // 15 Level data mapping
  const levelPayoutPercents = [10, 5, 3, 2, 1, 1, 1, 1, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5];
  const getLevelReqs = (levelNum) => {
    const selfStake = Math.min(3000, levelNum * 100);
    return {
      selfStake,
      directs: levelNum,
      percent: levelPayoutPercents[levelNum - 1] || 0.5
    };
  };

  // Rank data mapping
  const rankLevels = [
    { rank: 'D1',  self: 100,   leg: 500,       salary: 5 },
    { rank: 'D2',  self: 250,   leg: 1500,      salary: 10 },
    { rank: 'D3',  self: 500,   leg: 4000,      salary: 15 },
    { rank: 'D4',  self: 1000,  leg: 10000,     salary: 25 },
    { rank: 'D5',  self: 2000,  leg: 25000,     salary: 40 },
    { rank: 'D6',  self: 3500,  leg: 60000,     salary: 60 },
    { rank: 'D7',  self: 5000,  leg: 120000,    salary: 85 },
    { rank: 'D8',  self: 7500,  leg: 250000,    salary: 120 },
    { rank: 'D9',  self: 10000, leg: 500000,    salary: 160 },
    { rank: 'D10', self: 15000, leg: 1000000,   salary: 210 },
    { rank: 'D11', self: 20000, leg: 2000000,   salary: 270 },
    { rank: 'D12', self: 25000, leg: 4000000,   salary: 350 },
    { rank: 'D13', self: 35000, leg: 8000000,   salary: 450 },
    { rank: 'D14', self: 45000, leg: 15000000,  salary: 600 },
    { rank: 'D15', self: 50000, leg: 30000000,  salary: 800 },
  ];

  const currentRankInfo = rankLevels.find(r => r.rank === activeRankTab) || rankLevels[0];

  // FAQ data mapping
  const faqs = [
    {
      question: "How do I get started with DLMC?",
      answer: "Starting is easy! Connect your Web3 decentralized browser wallet (such as MetaMask or Trust Wallet) configured on the Binance Smart Chain. Click 'Launch Portal', choose your stake amount (starting from $1 USDT), and approve the transaction. Staking dividends begin within 24 hours."
    },
    {
      question: "What is the minimum deposit and withdrawal limit?",
      answer: "The minimum staking deposit is set at just $1 USDT, making the protocol widely accessible. The minimum withdrawal threshold is also $1 USDT, processed immediately on-chain."
    },
    {
      question: "How does the Mint-on-Buy and Burn-on-Sell mechanism work?",
      answer: "Unlike traditional pre-mined tokens, DLMC has no fixed supply. Buying DLMC tokens mints new supply directly, with 15% contributing directly to the mathematical appreciation index and 85% minting the tokens. Selling tokens back to the contract burns the tokens (deleting them from supply) and incurs a 10% burn, preserving scarcity."
    },
    {
      question: "What are the rules for unlocking affiliate and referral income?",
      answer: "Deposits under $100 USDT qualify ONLY for daily staking ROI dividends (up to 1% growth). Deposits of $100 USDT or above unlock the 15-Layer MLM Referral network, Booster Pools, and Rank Salaries. Level 1 requires 1 direct referral, Level 2 requires 2 directs, up to Level 15 requiring 15 directs."
    },
    {
      question: "How are the D1-D15 Rank Salaries calculated?",
      answer: "Rank promotions assess your personal stake size and business volume across your network branches (main leg and weaker leg). Once you hit rank criteria (D1 to D15), the system awards you daily salaries ranging from $5 USDT to $800 USDT."
    },
    {
      question: "Is there a maximum limit on how much I can sell?",
      answer: "Yes. To protect systemic liquidity and token price, the maximum token sale limit is strictly proportional to the user's active staked amount. This prevents major dumps and supports stability."
    }
  ];

  return (
    <div className="landing-container" style={{ minHeight: '100vh', background: 'var(--background)', color: '#FFFFFF', paddingBottom: '0px', fontFamily: "var(--font-sans)", overflowX: 'hidden' }}>
      
      {/* 1. Navbar */}
      <motion.nav 
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: LUXURY_EASE }}
        className="flex-between lp-navbar" 
        style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(15px)', position: 'sticky', top: 0, zIndex: 100, background: 'rgba(5, 7, 10, 0.8)' }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src={logoImg} alt="Vertex Capital Logo" style={{ height: '75px', width: 'auto' }} />
        </div>

        {/* Desktop Navigation Link Container */}
        <div className="desktop-nav" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <a href="#about" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>About</a>
          <a href="#features" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Features</a>
          <a href="#how-it-works" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Workflow</a>
          <a href="#tokenomics" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Tokenomics</a>
          <a href="#staking" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Staking</a>
          <a href="#referrals" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Affiliate</a>
          <a href="#ranks" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Ranks</a>
          <a href="#faq" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>FAQ</a>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '14px' }}>
            Price: <strong className="text-gold glow-text">${tokenPrice.toFixed(4)}</strong>
          </span>
          {isConnected ? (
            <motion.button 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }} 
              className="btn btn-primary" 
              style={{ padding: '9px 20px' }} 
              onClick={() => navigate('/dashboard/overview')}
            >
              Dashboard <ArrowRight size={15} />
            </motion.button>
          ) : (
            <div style={{ display: 'flex', gap: '8px' }}>
              <motion.button 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }} 
                className="btn btn-secondary" 
                style={{ padding: '9px 18px', fontSize: '0.88rem' }} 
                onClick={goToLogin}
              >
                <LogIn size={15} /> Login
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }} 
                className="btn btn-primary" 
                style={{ padding: '9px 18px', fontSize: '0.88rem' }} 
                onClick={goToRegister}
              >
                <UserPlus size={15} /> Register
              </motion.button>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <button 
          className="mobile-menu-btn" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: 'none',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '8px',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 110
          }}
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

        {/* Mobile Dropdown Menu Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: LUXURY_EASE }}
              className="mobile-nav-overlay"
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: 'rgba(7, 9, 13, 0.96)',
                backdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(248, 217, 84, 0.15)',
                padding: '30px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                zIndex: 99
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <a href="#about" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-secondary)' }}>About</a>
                <a href="#features" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Features</a>
                <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Workflow</a>
                <a href="#tokenomics" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Tokenomics</a>
                <a href="#staking" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Staking</a>
                <a href="#referrals" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Affiliate Program</a>
                <a href="#ranks" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Rank Milestones</a>
                <a href="#faq" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-secondary)' }}>FAQ</a>
              </div>

              <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', margin: '4px 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>DLMC Price:</span>
                <strong className="text-gold glow-text" style={{ fontSize: '1.1rem' }}>${tokenPrice.toFixed(4)} USDT</strong>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
                {isConnected ? (
                  <button 
                    className="btn btn-primary" 
                    style={{ width: '100%', padding: '12px' }} 
                    onClick={() => { setMobileMenuOpen(false); navigate('/dashboard/overview'); }}
                  >
                    Go to Dashboard <ArrowRight size={16} />
                  </button>
                ) : (
                  <>
                    <button 
                      className="btn btn-secondary" 
                      style={{ width: '100%', padding: '12px' }} 
                      onClick={() => { setMobileMenuOpen(false); goToLogin(); }}
                    >
                      <LogIn size={16} /> Login
                    </button>
                    <button 
                      className="btn btn-primary" 
                      style={{ width: '100%', padding: '12px' }} 
                      onClick={() => { setMobileMenuOpen(false); goToRegister(); }}
                    >
                      <UserPlus size={16} /> Register
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* 2. Hero Section (First Screen) */}
      <header 
        ref={heroRef}
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={() => setHeroMouse({ x: 50, y: 50 })}
        className="hero-section lp-section-premium dark-layout-grid" 
        style={{ 
          padding: '160px 20px 120px', 
          background: `radial-gradient(circle at ${heroMouse.x}% ${heroMouse.y}%, rgba(224, 160, 30, 0.12) 0%, rgba(7, 9, 13, 1) 60%)`, 
          position: 'relative', 
          overflow: 'hidden' 
        }}
      >
        
        {/* Glow orbs in background */}
        <motion.div 
          animate={{ 
            x: [-20, 20, -20],
            y: [-15, 25, -15],
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 15, 
            ease: "easeInOut" 
          }}
          className="bg-glow-orb" 
          style={{ top: '8%', right: '5%', background: 'rgba(224, 160, 30, 0.08)' }} 
        />
        <motion.div 
          animate={{ 
            x: [25, -25, 25],
            y: [20, -20, 20],
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 20, 
            ease: "easeInOut" 
          }}
          className="bg-glow-orb" 
          style={{ top: '35%', left: '3%', background: 'rgba(59, 130, 246, 0.07)' }} 
        />
        <motion.div 
          animate={{ 
            x: [-15, 15, -15],
            y: [15, -15, 15],
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 18, 
            ease: "easeInOut" 
          }}
          className="bg-glow-orb" 
          style={{ bottom: '15%', right: '8%', background: 'rgba(34, 197, 94, 0.07)' }} 
        />
 
        <div className="hero-grid" style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', alignItems: 'center', position: 'relative', zIndex: 2 }}>
          
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }} className="hero-text-align">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: LUXURY_EASE }}
              className="badge badge-warning" 
              style={{ marginBottom: '24px', fontSize: '0.8rem', padding: '8px 22px', borderRadius: '50px' }}
            >
              <Sparkles size={14} style={{ marginRight: '6px', color: 'var(--gold-light)' }} />
              Decentralised Legacy Management Corporation
            </motion.div>
 
            <motion.h1 
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="lp-hero-title"
              style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}
            >
              <div style={{ overflow: 'hidden', paddingBottom: '4px' }}>
                <motion.span
                  variants={{
                    hidden: { opacity: 0, y: "100%" },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: LUXURY_EASE } }
                  }}
                  style={{ display: 'inline-block' }}
                >
                  Decentralized Staking &
                </motion.span>
              </div>
              <div style={{ overflow: 'hidden', paddingBottom: '4px' }}>
                <motion.span
                  variants={{
                    hidden: { opacity: 0, y: "100%" },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.65, delay: 0.12, ease: LUXURY_EASE } }
                  }}
                  style={{ display: 'inline-block' }}
                >
                  Utility Minting Protocol
                </motion.span>
              </div>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7, ease: LUXURY_EASE }}
              style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '45px', lineHeight: '1.8', maxWidth: '780px' }}
            >
              Earn up to 1.0% daily growth, mint appreciating DLMC assets on Binance Smart Chain (BEP-20), unlock deep 15-level network incentives, and qualify for daily rank salaries.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7, ease: LUXURY_EASE }}
              style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}
              className="hero-buttons"
            >
              <motion.button 
                whileHover={{ scale: 1.06, y: -2 }} 
                whileTap={{ scale: 0.98 }} 
                className="btn btn-primary" 
                style={{ padding: '16px 36px', fontSize: '1.1rem' }} 
                onClick={goToRegister}
              >
                <UserPlus size={18} /> Create Account
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.06, y: -2 }} 
                whileTap={{ scale: 0.98 }} 
                className="btn btn-secondary" 
                style={{ padding: '16px 36px', fontSize: '1.1rem' }} 
                onClick={goToLogin}
              >
                <LogIn size={18} /> Sign In
              </motion.button>
              <motion.a 
                whileHover={{ scale: 1.06, y: -2 }} 
                whileTap={{ scale: 0.98 }} 
                href="#tokenomics" 
                className="btn btn-secondary" 
                style={{ padding: '16px 36px', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: 6 }}
              >
                📊 Token Info
              </motion.a>
            </motion.div>
          </div>

          {/* Right Column */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25, duration: 0.8, ease: LUXURY_EASE }}
            className="hero-coin-container"
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          >
            <FloatingCoin />
          </motion.div>

        </div>
      </header>

      {/* 3. Key Statistics Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={staggerContainer}
        style={{ maxWidth: '1200px', margin: '0 auto 100px', padding: '0 20px', position: 'relative', zIndex: 5 }}
      >
        <div className="grid-cols-4" style={{ gap: '20px' }}>
          <PremiumGlowCard 
            variants={fadeInUp} 
            className="glass-card" 
            style={{ textAlign: 'center', borderTop: '2px solid var(--gold-primary)' }}
          >
            <Coins size={28} className="text-gold" style={{ marginBottom: '12px', marginInline: 'auto' }} />
            <h3 style={{ fontSize: '2rem', fontWeight: '800' }}>
              <AnimatedCounter value={tokenPrice} prefix="$" suffix=" USDT" />
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginTop: '6px', letterSpacing: '0.5px' }}>Current Price</p>
          </PremiumGlowCard>
          <PremiumGlowCard 
            variants={fadeInUp} 
            className="glass-card" 
            style={{ textAlign: 'center' }}
          >
            <Users size={28} className="text-gold" style={{ marginBottom: '12px', marginInline: 'auto' }} />
            <h3 style={{ fontSize: '2rem', fontWeight: '800' }}>
              <AnimatedCounter value="8240" />
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginTop: '6px', letterSpacing: '0.5px' }}>Total Active Users</p>
          </PremiumGlowCard>
          <PremiumGlowCard 
            variants={fadeInUp} 
            className="glass-card" 
            style={{ textAlign: 'center' }}
          >
            <Activity size={28} className="text-gold" style={{ marginBottom: '12px', marginInline: 'auto' }} />
            <h3 style={{ fontSize: '2rem', fontWeight: '800' }}>
              <AnimatedCounter value="250000" suffix=" DLMC" />
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginTop: '6px', letterSpacing: '0.5px' }}>Tokens Burned</p>
          </PremiumGlowCard>
          <PremiumGlowCard 
            variants={fadeInUp} 
            className="glass-card" 
            style={{ textAlign: 'center' }}
          >
            <Shield size={28} className="text-gold" style={{ marginBottom: '12px', marginInline: 'auto' }} />
            <h3 style={{ fontSize: '2rem', fontWeight: '800' }}>
              <AnimatedCounter value="1250000" prefix="$" suffix=" USDT" />
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginTop: '6px', letterSpacing: '0.5px' }}>Liquidity Locked</p>
          </PremiumGlowCard>
        </div>
      </motion.section>

      {/* 4. About the Project Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        id="about" 
        style={{ maxWidth: '1200px', margin: '0 auto 100px', padding: '0 20px' }}
      >
        <div className="grid-cols-2" style={{ gap: '40px', alignItems: 'center' }}>
          <motion.div variants={fadeInLeft}>
            <div className="badge badge-warning" style={{ marginBottom: '16px' }}>Project Background</div>
            <h2 className="lp-section-title">About Decentralised Legacy Management Corporation</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '20px' }}>
               DLMC was created to establish a sustainable, community-governed financial staking platform on the blockchain, eliminating middleman control and maximizing yield security.
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '28px' }}>
               Through automated smart contract parameters and mathematically calculated token minting, DLMC offers a stable model where token values appreciation is directly bound to lock-up growth metrics.
            </p>
            
            <div className="grid-cols-2" style={{ gap: '20px' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '16px', borderRadius: '10px', borderLeft: '3px solid var(--gold-primary)' }}>
                <h5 style={{ fontWeight: '700', marginBottom: '4px' }}>Our Vision</h5>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Building a transparent blockchain ecosystem empowering users globally.</p>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '16px', borderRadius: '10px', borderLeft: '3px solid var(--gold-primary)' }}>
                <h5 style={{ fontWeight: '700', marginBottom: '4px' }}>Our Mission</h5>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Providing stable tokenomics and sustainable long-term yield algorithms.</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            variants={fadeInRight}
            whileHover="hover"
            className="glass-card" 
            style={{ padding: '40px', background: 'radial-gradient(circle at top right, rgba(224, 160, 30, 0.05) 0%, rgba(22, 27, 34, 0.9) 100%)', border: '1px solid rgba(224,160,30,0.15)' }}
          >
            <h3 style={{ fontSize: '1.5rem', marginBottom: '20px', color: 'var(--gold-light)', borderBottom: '1px solid var(--card-border)', paddingBottom: '10px' }}>Ecosystem Core Values</h3>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '16px', listStyle: 'none' }}>
              <li style={{ display: 'flex', gap: '12px' }}>
                <CheckCircle2 size={18} className="text-gold" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ display: 'block', color: '#fff' }}>No Centralized Risk</strong>
                  <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>All functions are written in renounced, immutable smart contracts.</span>
                </div>
              </li>
              <li style={{ display: 'flex', gap: '12px' }}>
                <CheckCircle2 size={18} className="text-gold" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ display: 'block', color: '#fff' }}>Algorithmic Pricing</strong>
                  <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>No traditional LP token depletion; mathematical formula scales pricing on transaction volumes.</span>
                </div>
              </li>
              <li style={{ display: 'flex', gap: '12px' }}>
                <CheckCircle2 size={18} className="text-gold" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ display: 'block', color: '#fff' }}>Strict Scarcity Enforcement</strong>
                  <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>P2P transactions and token sales burn circulating tokens automatically.</span>
                </div>
              </li>
            </ul>
          </motion.div>
        </div>
      </motion.section>

      {/* 5. Core Features Section */}
      <section 
        id="features" 
        className="lp-section-premium dark-layout-grid"
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          style={{ maxWidth: '1200px', margin: '0 auto' }}
        >
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <motion.h2 variants={fadeInUp} className="lp-section-title">Core Ecosystem Features</motion.h2>
            <motion.p variants={fadeInUp} style={{ maxWidth: '700px', margin: '0 auto', fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
              DLMC leverages robust blockchain algorithms to provide transparency, security, and consistent incentives.
            </motion.p>
          </div>

          <div className="grid-cols-4" style={{ gap: '24px' }}>
            {[
              { icon: Shield, title: "Decentralized", desc: "Governed strictly by immutable blockchain rules with no individual control hubs." },
              { icon: CheckCircle2, title: "Smart Contracts", desc: "Automated, self-executing agreements handle all yield computations." },
              { icon: Activity, title: "Transparent", desc: "Public verification of all transaction logs, contract addresses, and updates." },
              { icon: Vote, title: "LPDAO Governance", desc: "Community-owned proposals and voting protocols direct fee allocations." },
              { icon: Coins, title: "Mint on Buy", desc: "Dynamic generation of tokens happens strictly upon actual USDT purchases." },
              { icon: TrendingUp, title: "Burn on Sell", desc: "Reduces token supply permanently on sales, generating index price appreciation." },
              { icon: Wallet, title: "Liquidity Locked", desc: "Funds are locked in smart custody pools to secure payouts and reserves." },
              { icon: Zap, title: "Secure & Audited", desc: "Fully verified code logic designed to prevent common DeFi exploit parameters." }
            ].map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <TiltCard 
                  key={idx}
                  variants={fadeInUp}
                  className="glass-card" 
                  style={{ padding: '28px 22px' }}
                >
                  <Icon size={24} className="text-gold" style={{ marginBottom: '14px' }} />
                  <h5 style={{ fontWeight: '700', fontSize: '1.1rem', marginBottom: '8px' }}>{feat.title}</h5>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{feat.desc}</p>
                </TiltCard>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* 6. How It Works Section */}
      <section 
        id="how-it-works" 
        className="lp-section-premium dark-layout-grid"
      >
        <motion.div
          ref={howItWorksRef}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' }}
        >
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <motion.h2 variants={fadeInUp} className="lp-section-title">How It Works</motion.h2>
            <motion.p variants={fadeInUp} style={{ maxWidth: '700px', margin: '0 auto', fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
              Follow these 4 simple steps to start earning dividends in the DLMC ecosystem.
            </motion.p>
          </div>

          <div style={{ position: 'relative' }}>
            {/* Horizontal Line (Desktop) */}
            <div className="progress-line-bg progress-line-horizontal-bg" />
            <motion.div 
              style={{ scaleX: progressScale }} 
              className="progress-line-fill progress-line-horizontal-fill" 
            />

            {/* Vertical Line (Mobile) */}
            <div className="progress-line-bg progress-line-vertical-bg" />
            <motion.div 
              style={{ scaleY: progressScale }} 
              className="progress-line-fill progress-line-vertical-fill" 
            />

            <div className="how-it-works-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px', position: 'relative', zIndex: 10 }}>
              {[
                { step: "01", name: "Connect Wallet", desc: "Link your Web3 wallet (MetaMask, Trust Wallet) to BSC network." },
                { step: "02", name: "Deposit & Stake", desc: "Choose your staking amount ($1 USDT minimum) and confirm on-chain." },
                { step: "03", name: "Receive Dividends", desc: "Daily dividends start accumulating within 24 hours of staking." },
                { step: "04", name: "Claim Rewards", desc: "Claim accumulated dividends directly to your connected wallet." }
              ].map((item, index) => (
                <PremiumGlowCard 
                  key={index} 
                  variants={fadeInUp}
                  className="glass-card" 
                  style={{ padding: '30px 24px', position: 'relative', overflow: 'hidden' }}
                >
                  <div style={{ fontSize: '3rem', fontWeight: '900', color: 'rgba(224, 160, 30, 0.06)', position: 'absolute', top: '10px', right: '15px', zIndex: 0 }}>{item.step}</div>
                  <span className="badge badge-info" style={{ marginBottom: '16px', position: 'relative', zIndex: 1 }}>Step {item.step}</span>
                  <h4 style={{ fontWeight: '700', fontSize: '1.2rem', marginBottom: '10px', color: '#fff', position: 'relative', zIndex: 1 }}>{item.name}</h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.5', position: 'relative', zIndex: 1 }}>{item.desc}</p>
                </PremiumGlowCard>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* 7. Tokenomics Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        id="tokenomics" 
        style={{ maxWidth: '1200px', margin: '0 auto 100px', padding: '0 20px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <motion.h2 variants={fadeInUp} className="lp-section-title">Dynamic Tokenomics</motion.h2>
          <motion.p variants={fadeInUp} style={{ maxWidth: '700px', margin: '0 auto', fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
            The BEP-20 token supply scales dynamically based on transaction activities, designed with automated price appreciation.
          </motion.p>
        </div>

        <div className="grid-cols-3" style={{ gap: '30px', alignItems: 'stretch' }}>
          {/* Token specs */}
          <motion.div 
            variants={fadeInLeft}
            whileHover="hover"
            className="glass-card" 
            style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
          >
            <h3 style={{ fontSize: '1.4rem', color: 'var(--gold-light)', fontWeight: 800 }}>Token Specifications</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { label: "Token Name", val: "Decentralised Legacy Management Corp" },
                { label: "Symbol", val: "DLMC" },
                { label: "Network", val: "BSC (BEP-20)" },
                { label: "Initial Price", val: "$0.10 USDT" },
                { label: "Supply Model", val: "Mint on Buy / Burn on Sell" },
                { label: "Pricing Model", val: "Contract formula calculation" },
                { label: "P2P Burn Rate", val: "10% Burn on transfers" }
              ].map((spec, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px' }}>
                  <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>{spec.label}</span>
                  <span style={{ fontSize: '0.88rem', fontWeight: '700', textAlign: 'right', wordBreak: 'break-word', maxWidth: '60%' }}>{spec.val}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Interactive Allocator Simulator */}
          <PremiumGlowCard 
            variants={fadeInRight}
            className="glass-card tokenomics-calculator-card" 
            style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
          >
            <div>
              <div style={{ display: 'flex', background: 'rgba(0,0,0,0.3)', padding: '4px', borderRadius: '10px', marginBottom: '20px', position: 'relative', zIndex: 1 }}>
                <button 
                  className="btn" 
                  style={{ flex: 1, position: 'relative', background: 'transparent', color: calculatorMode === 'buy' ? '#05070A' : 'var(--text-secondary)', padding: '10px', borderRadius: '8px', zIndex: 2, transition: 'color 0.2s' }}
                  onClick={() => setCalculatorMode('buy')}
                >
                  {calculatorMode === 'buy' && (
                    <motion.div 
                      layoutId="calcTab" 
                      style={{ position: 'absolute', inset: 0, background: 'var(--gold-gradient)', borderRadius: '8px', zIndex: -1 }} 
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  <span style={{ position: 'relative', zIndex: 3 }}>Buy (Mint)</span>
                </button>
                <button 
                  className="btn" 
                  style={{ flex: 1, position: 'relative', background: 'transparent', color: calculatorMode === 'sell' ? '#05070A' : 'var(--text-secondary)', padding: '10px', borderRadius: '8px', zIndex: 2, transition: 'color 0.2s' }}
                  onClick={() => setCalculatorMode('sell')}
                >
                  {calculatorMode === 'sell' && (
                    <motion.div 
                      layoutId="calcTab" 
                      style={{ position: 'absolute', inset: 0, background: 'var(--gold-gradient)', borderRadius: '8px', zIndex: -1 }} 
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  <span style={{ position: 'relative', zIndex: 3 }}>Sell (Burn)</span>
                </button>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={calculatorMode}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.28, ease: LUXURY_EASE }}
                >
                  {calculatorMode === 'buy' ? (
                    <div>
                      <h4 style={{ fontSize: '1.25rem', marginBottom: '10px', fontWeight: 800 }}>USDT Purchase Distribution</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '18px' }}>
                        Purchases allocate 15% to index price appreciation, 85% to actual token minting, and 5% as dev fee.
                      </p>

                      <div className="form-group" style={{ marginBottom: '16px' }}>
                        <label className="form-label">Purchase Amount (USDT)</label>
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                          <span style={{ position: 'absolute', left: '16px', color: 'var(--gold-light)', fontWeight: 600 }}>$</span>
                          <input 
                            type="number" 
                            className="form-control" 
                            style={{ paddingLeft: '32px' }}
                            value={usdtInput}
                            onChange={(e) => setUsdtInput(Math.max(1, Number(e.target.value)))}
                          />
                        </div>
                      </div>

                      <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div className="flex-between" style={{ fontSize: '0.88rem' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>Appreciation Support (15%):</span>
                          <span key={`appr-${usdtInput}`} className="value-bounce">${(usdtInput * 0.15).toFixed(2)} USDT</span>
                        </div>
                        <div className="flex-between" style={{ fontSize: '0.88rem' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>Token Minting (85%):</span>
                          <span key={`mint-${usdtInput}`} className="value-bounce">${(usdtInput * 0.85).toFixed(2)} USDT</span>
                        </div>
                        <div className="flex-between" style={{ fontSize: '0.88rem' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>Development Fee (5%):</span>
                          <span key={`fee-${usdtInput}`} className="value-bounce">${(usdtInput * 0.05).toFixed(2)} USDT</span>
                        </div>
                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px', marginTop: '2px' }} className="flex-between">
                          <span style={{ fontWeight: '700', color: 'var(--gold-light)' }}>DLMC Mint Output:</span>
                          <span key={`mint-out-${usdtInput}-${tokenPrice}`} className="text-gold glow-text value-bounce" style={{ fontSize: '1.25rem', fontWeight: '800' }}>
                            {((usdtInput * 0.85) / tokenPrice).toFixed(3)} DLMC
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h4 style={{ fontSize: '1.25rem', marginBottom: '10px', fontWeight: 800 }}>DLMC Token Sale & Burn</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '18px' }}>
                        Sells incur a contract-enforced 10% token burn, removing tokens from supply to defend remaining value.
                      </p>

                      <div className="form-group" style={{ marginBottom: '16px' }}>
                        <label className="form-label">Sell Amount (DLMC)</label>
                        <input 
                          type="number" 
                          className="form-control" 
                          value={dlmcSellInput}
                          onChange={(e) => setDlmcSellInput(Math.max(1, Number(e.target.value)))}
                        />
                      </div>

                      <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div className="flex-between" style={{ fontSize: '0.88rem' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>Total Value:</span>
                          <span key={`val-${dlmcSellInput}-${tokenPrice}`} className="value-bounce">${(dlmcSellInput * tokenPrice).toFixed(2)} USDT</span>
                        </div>
                        <div className="flex-between" style={{ fontSize: '0.88rem' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>Permanent Burn (10%):</span>
                          <span key={`burn-${dlmcSellInput}`} className="value-bounce" style={{ color: 'var(--error)' }}>-{(dlmcSellInput * 0.1).toFixed(2)} DLMC</span>
                        </div>
                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px', marginTop: '2px' }} className="flex-between">
                          <span style={{ fontWeight: '700', color: 'var(--gold-light)' }}>Net USDT Received:</span>
                          <span key={`net-rec-${dlmcSellInput}-${tokenPrice}`} className="text-gold glow-text value-bounce" style={{ fontSize: '1.25rem', fontWeight: '800' }}>
                            ${(dlmcSellInput * 0.9 * tokenPrice).toFixed(2)} USDT
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
            
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px', marginTop: '20px', display: 'flex', justifyItems: 'center', gap: '10px' }}>
              <span className="badge badge-warning" style={{ fontSize: '0.75rem' }}>Scarcity Model</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Supply burn and contract-enforced appreciation rules protect ecosystem stability.</span>
            </div>
          </PremiumGlowCard>
        </div>
      </motion.section>

      {/* 8. Staking / Dividend Information Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        id="staking" 
        style={{ maxWidth: '1200px', margin: '0 auto 100px', padding: '0 20px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <motion.h2 variants={fadeInUp} className="lp-section-title">Staking & Daily Dividends</motion.h2>
          <motion.p variants={fadeInUp} style={{ maxWidth: '700px', margin: '0 auto', fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
            Stake USDT value to accrue daily returns, with dynamic caps protecting smart contract liquidity pools.
          </motion.p>
        </div>

        <div className="grid-cols-2" style={{ alignItems: 'center', gap: '40px' }}>
          <motion.div variants={fadeInLeft}>
            <h3 style={{ fontSize: '1.8rem', marginBottom: '20px', fontWeight: '800' }}>Yield Rules & Accumulation Cap</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.02rem', lineHeight: '1.7', marginBottom: '20px' }}>
              Staking rewards accumulate on a daily basis (typically between 0.5% and 1.0% growth). Growth compounds until it reaches a maximum cap of <strong>250% of your staked value</strong>.
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.02rem', lineHeight: '1.7', marginBottom: '24px' }}>
              If you participate in direct sponsorship and network building, the cumulative reward cap is pushed up to <strong>500% overall</strong>. Once hit, growth pauses until a restake transaction is executed.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '10px' }}>
                <strong style={{ color: 'var(--gold-light)', display: 'block', fontSize: '1.1rem', marginBottom: '4px' }}>24h Activation</strong>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Dividends start generating within 24 hours of on-chain confirmation.</span>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '10px' }}>
                <strong style={{ color: 'var(--gold-light)', display: 'block', fontSize: '1.1rem', marginBottom: '4px' }}>$100 MLM Gate</strong>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Deposits under $100 bypass network commissions (dividends only).</span>
              </div>
            </div>
          </motion.div>

          {/* Calculator Card */}
          <PremiumGlowCard 
            variants={fadeInRight}
            className="glass-card" 
            style={{ border: '1px solid rgba(224, 160, 30, 0.2)' }}
          >
            <h3 style={{ fontSize: '1.3rem', marginBottom: '18px', borderBottom: '1px solid var(--card-border)', paddingBottom: '8px', color: 'var(--gold-light)', fontWeight: 800 }}>Staking Return Calculator</h3>

            <div className="form-group" style={{ marginBottom: '18px' }}>
              <label className="form-label">Stake Amount (USDT)</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <span style={{ position: 'absolute', left: '16px', color: 'var(--gold-light)', fontWeight: 600 }}>$</span>
                <input 
                  type="number" 
                  className="form-control" 
                  style={{ paddingLeft: '32px' }}
                  value={stakeInput}
                  onChange={(e) => setStakeInput(Math.max(1, Number(e.target.value)))}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '22px' }}>
              <div className="flex-between">
                <label className="form-label">Accrual Rate (%)</label>
                <span key={`roi-val-${roiSlider}`} className="value-bounce text-gold" style={{ color: 'var(--gold-light)', fontWeight: '700' }}>{roiSlider}% / day</span>
              </div>
              <input 
                type="range" 
                min="0.5" 
                max="1.0" 
                step="0.05"
                style={{ width: '100%', accentColor: 'var(--gold-primary)', cursor: 'pointer' }}
                value={roiSlider}
                onChange={(e) => setRoiSlider(Number(e.target.value))}
              />
            </div>

            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '18px', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
              <div className="flex-between" style={{ fontSize: '0.88rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Daily Return:</span>
                <span key={`daily-${stakeInput}-${roiSlider}`} className="value-bounce text-success" style={{ color: 'var(--success)', fontWeight: '700' }}>+${(stakeInput * (roiSlider / 100)).toFixed(2)} USDT</span>
              </div>
              <div className="flex-between" style={{ fontSize: '0.88rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Monthly Return (Est):</span>
                <span key={`monthly-${stakeInput}-${roiSlider}`} className="value-bounce text-success" style={{ color: 'var(--success)', fontWeight: '700' }}>+${(stakeInput * (roiSlider / 100) * 30).toFixed(2)} USDT</span>
              </div>
              <div className="flex-between" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Dividend Cap (250%):</span>
                <span key={`cap250-${stakeInput}`} className="value-bounce text-gold" style={{ color: 'var(--gold-light)', fontWeight: '700' }}>${(stakeInput * 2.5).toFixed(2)} USDT</span>
              </div>
              <div className="flex-between">
                <span style={{ color: 'var(--text-secondary)' }}>Network Cap (500%):</span>
                <span key={`cap500-${stakeInput}`} className="value-bounce text-gold" style={{ color: 'var(--gold-light)', fontWeight: '700' }}>${(stakeInput * 5).toFixed(2)} USDT</span>
              </div>
            </div>

            {stakeInput < 100 ? (
              <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.25)', padding: '12px', borderRadius: '8px', display: 'flex', gap: '8px' }}>
                <AlertTriangle size={16} color="var(--error)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span style={{ fontSize: '0.78rem', color: 'rgba(255, 100, 100, 0.9)', lineHeight: 1.4 }}>
                  Deposits under $100 bypass multilevel commissions. Stake $100+ to activate network rewards.
                </span>
              </div>
            ) : (
              <div style={{ background: 'rgba(34, 197, 94, 0.08)', border: '1px solid rgba(34, 197, 94, 0.25)', padding: '12px', borderRadius: '8px', display: 'flex', gap: '8px' }}>
                <Shield size={16} color="var(--success)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span style={{ fontSize: '0.78rem', color: 'rgba(100, 255, 100, 0.9)', lineHeight: 1.4 }}>
                  You are qualified to earn network MLM downlines commissions and daily salaries!
                </span>
              </div>
            )}
          </PremiumGlowCard>
        </div>
      </motion.section>

      {/* 9. Referral Program Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        id="referrals" 
        style={{ maxWidth: '1200px', margin: '0 auto 100px', padding: '0 20px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <motion.h2 variants={fadeInUp} className="lp-section-title">15-Level Referral Matrix</motion.h2>
          <motion.p variants={fadeInUp} style={{ maxWidth: '700px', margin: '0 auto', fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
            Expand your network and unlock up to 15 degrees of downline ROI commission sharing.
          </motion.p>
        </div>

        <div className="grid-cols-3" style={{ gap: '30px', alignItems: 'stretch' }}>
          {/* Rules Summary */}
          <motion.div 
            variants={fadeInLeft}
            whileHover="hover"
            className="glass-card" 
            style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}
          >
            <h3 style={{ fontSize: '1.35rem', color: 'var(--gold-light)', fontWeight: 800 }}>MLM Payout Qualifications</h3>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              Your active downline layers are bound directly to your sponsored directs and personal USDT stake amount.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <CheckCircle2 size={16} className="text-gold" />
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>5% direct commission on buy volumes.</span>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <CheckCircle2 size={16} className="text-gold" />
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Level index matches direct count (1 to 15).</span>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <CheckCircle2 size={16} className="text-gold" />
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Self-stake increases by $100 per level.</span>
              </div>
            </div>

            <div style={{ background: 'rgba(224, 160, 30, 0.04)', border: '1px solid rgba(224,160,30,0.15)', padding: '16px', borderRadius: '10px', marginTop: 'auto' }}>
              <h5 style={{ fontWeight: '600', color: 'var(--gold-light)', marginBottom: '4px' }}>Booster Reward Active</h5>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                Have 5 of 15 directs active to unlock a 20% Booster Reward (10% to 1st upline, 5% to 2nd, 5% to 3rd uplines).
              </p>
            </div>
          </motion.div>

          {/* Interactive display */}
          <motion.div 
            variants={fadeInRight}
            whileHover={{ borderColor: 'rgba(224, 160, 30, 0.22)', boxShadow: '0 8px 30px rgba(0,0,0,0.5)' }}
            className="glass-card referrals-matrix-card" 
            style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column' }}
          >
            <div className="flex-between" style={{ marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Level Requirement Matrix</h3>
              <span className="badge badge-info">BEP-20 Smart Contract Rules</span>
            </div>

            {/* Horizontal level tabs scrollable */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              {Array.from({ length: 15 }, (_, i) => i + 1).map((lvl) => (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  key={lvl}
                  className="filter-tab"
                  style={{
                    padding: '6px 14px',
                    borderRadius: '8px',
                    background: activeLevelTab === lvl ? 'var(--gold-gradient)' : 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid',
                    borderColor: activeLevelTab === lvl ? 'var(--gold-light)' : 'rgba(255,255,255,0.08)',
                    color: activeLevelTab === lvl ? '#05070A' : 'var(--text-secondary)',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                  onClick={() => setActiveLevelTab(lvl)}
                >
                  L{lvl}
                </motion.button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div 
                key={activeLevelTab}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.25, ease: LUXURY_EASE }}
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', background: 'rgba(0,0,0,0.25)', padding: '24px', borderRadius: '12px' }}
              >
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Yield Commission Rate</span>
                  <h2 style={{ fontSize: '2.8rem', fontWeight: '800', color: 'var(--gold-light)', margin: '6px 0' }}>{getLevelReqs(activeLevelTab).percent}%</h2>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Earn {getLevelReqs(activeLevelTab).percent}% of all daily Staking ROI dividends generated by members on Level {activeLevelTab}.
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'center' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Required Self Stake:</span>
                    <span style={{ fontWeight: '700' }}>${getLevelReqs(activeLevelTab).selfStake} USDT</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Required Directs:</span>
                    <span style={{ fontWeight: '700' }}>{getLevelReqs(activeLevelTab).directs} Directs</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Income source:</span>
                    <span style={{ fontWeight: '700', color: 'var(--success)' }}>On-Chain Staking Yields</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.section>

      {/* 10. Rank & Salary System Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        id="ranks" 
        style={{ maxWidth: '1200px', margin: '0 auto 100px', padding: '0 20px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <motion.h2 variants={fadeInUp} className="lp-section-title">Rank Milestones & Salaries</motion.h2>
          <motion.p variants={fadeInUp} style={{ maxWidth: '700px', margin: '0 auto', fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
            Climb D1 through D15 ranks by building network volume. Qualify for daily salaries paid out directly.
          </motion.p>
        </div>

        <div className="grid-cols-3" style={{ gap: '30px', alignItems: 'stretch' }}>
          {/* Scroll Selector */}
          <motion.div 
            variants={fadeInLeft}
            className="glass-card" 
            style={{ display: 'flex', flexDirection: 'column', maxHeight: '420px', overflowY: 'auto' }}
          >
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px', display: 'block', fontWeight: 'bold' }}>Rank Ladder</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {rankLevels.map((r) => (
                <motion.button
                  whileHover={{ scale: 1.02, x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  key={r.rank}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: activeRankTab === r.rank ? 'rgba(224, 160, 30, 0.1)' : 'transparent',
                    border: '1px solid',
                    borderColor: activeRankTab === r.rank ? 'var(--gold-primary)' : 'transparent',
                    color: activeRankTab === r.rank ? 'var(--gold-light)' : 'var(--text-secondary)',
                    fontWeight: activeRankTab === r.rank ? '700' : '500',
                    cursor: 'pointer',
                    fontSize: '0.88rem',
                    transition: 'all 0.15s ease'
                  }}
                  onClick={() => setActiveRankTab(r.rank)}
                >
                  <span>Rank {r.rank}</span>
                  <span style={{ color: activeRankTab === r.rank ? 'var(--success)' : 'var(--text-muted)' }}>+${r.salary} USDT/day</span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Details Card */}
          <motion.div 
            variants={fadeInRight}
            whileHover={{ borderColor: 'rgba(224, 160, 30, 0.22)', boxShadow: '0 8px 30px rgba(0,0,0,0.5)' }}
            className="glass-card ranks-milestones-card" 
            style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1px solid rgba(224, 160, 30, 0.18)' }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeRankTab}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.22, ease: LUXURY_EASE }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '14px' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Milestone Level</span>
                    <h3 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--gold-light)' }}>Rank Milestone {currentRankInfo.rank}</h3>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Daily Salary Rate</span>
                    <h3 className="text-gold glow-text" style={{ fontSize: '1.8rem', fontWeight: '800' }}>+${currentRankInfo.salary} USDT</h3>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                  <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '10px', borderLeft: '3px solid var(--gold-primary)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Required Personal Stake</span>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginTop: '4px' }}>${currentRankInfo.self.toLocaleString()} USDT</h3>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '10px', borderLeft: '3px solid var(--info)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Required Team Volume (BSC)</span>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginTop: '4px' }}>${currentRankInfo.leg.toLocaleString()} USDT</h3>
                  </div>
                </div>

                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.6', background: 'rgba(255, 255, 255, 0.02)', padding: '15px', borderRadius: '10px' }}>
                  💡 <strong>Weaker Leg Rule:</strong> Promotion evaluations assess business volume generated on both main-leg and other-leg networks. Salary distributions run daily via the admin control panel directly into your account's claimable wallet balance.
                </p>
              </motion.div>
            </AnimatePresence>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Check your current network volume details:</span>
              <div style={{ display: 'flex', gap: '10px' }}>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn btn-secondary" style={{ padding: '10px 20px' }} onClick={goToLogin}><LogIn size={15} /> Login</motion.button>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn btn-primary" style={{ padding: '10px 20px' }} onClick={goToRegister}><UserPlus size={15} /> Register</motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>


      {/* 12. Security & Trust Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        style={{ maxWidth: '1200px', margin: '0 auto 100px', padding: '0 20px' }}
      >
        <div className="glass-card" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px', padding: '40px', background: 'radial-gradient(circle at top left, rgba(224, 160, 30, 0.05) 0%, rgba(11, 15, 20, 0.9) 100%)', border: '1px solid rgba(224, 160, 30, 0.12)' }}>
          <motion.div variants={fadeInLeft}>
            <span className="badge badge-success" style={{ marginBottom: '14px' }}>Security Verified</span>
            <h3 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '16px' }}>On-Chain Contract Verification</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.96rem', lineHeight: '1.6', marginBottom: '24px' }}>
              The DLMC smart contracts are renounced on-chain, meaning developers cannot alter the rules, fee levels, or yield percentages. All funds are backed contractually.
            </p>

            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label">Verified Smart Contract Address (BSC BEP-20)</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input 
                  type="text" 
                  className="form-control" 
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', background: 'rgba(0,0,0,0.3)' }}
                  value="0xDLMCPRotocolSmartContractAddressBEP20" 
                  readOnly
                />
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-secondary" 
                  style={{ padding: '0 16px', display: 'flex', alignItems: 'center', gap: '6px' }}
                  onClick={copyAddress}
                >
                  <Copy size={16} /> {copiedText ? "Copied" : "Copy"}
                </motion.button>
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeInRight} style={{ display: 'flex', flexDirection: 'column', gap: '16px', justifyContent: 'center' }}>
            <div style={{ display: 'flex', gap: '14px', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.04)' }}>
              <Shield size={20} className="text-gold" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <h5 style={{ fontWeight: '700', fontSize: '0.98rem', marginBottom: '4px' }}>Ownership Renounced</h5>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Immutable parameters; code ownership is burned on deployment.</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '14px', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.04)' }}>
              <Activity size={20} className="text-gold" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <h5 style={{ fontWeight: '700', fontSize: '0.98rem', marginBottom: '4px' }}>Public Reserves Ledger</h5>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>LPDAO liquidity backup pool audit can be verified on BSCScan anytime.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* 13. FAQ Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        id="faq" 
        style={{ maxWidth: '850px', margin: '0 auto 100px', padding: '0 20px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <motion.h2 variants={fadeInUp} className="lp-section-title">Frequently Asked Questions</motion.h2>
          <motion.p variants={fadeInUp} style={{ fontSize: '1.02rem', color: 'var(--text-secondary)' }}>
            Have questions? Find quick answers regarding registration, staking thresholds, and payouts.
          </motion.p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <motion.div 
                variants={fadeInUp}
                key={index} 
                className="glass-card" 
                style={{ 
                  padding: '20px 24px', 
                  cursor: 'pointer',
                  borderColor: isOpen ? 'rgba(224, 160, 30, 0.35)' : 'var(--card-border)',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => setOpenFaqIndex(isOpen ? null : index)}
              >
                <div className="flex-between" style={{ userSelect: 'none' }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: isOpen ? 'var(--gold-light)' : '#fff' }}>{faq.question}</h4>
                  {isOpen ? <ChevronUp size={18} className="text-gold" /> : <ChevronDown size={18} />}
                </div>
                
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25, ease: LUXURY_EASE }}
                      style={{ overflow: 'hidden', marginTop: '14px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px' }}
                    >
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* 14. Community & Partners Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        style={{ maxWidth: '1200px', margin: '0 auto 100px', padding: '0 20px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <motion.h2 variants={fadeInUp} style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '14px' }}>Ecosystem Community & Partners</motion.h2>
          <motion.p variants={fadeInUp} style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1rem', color: 'var(--text-secondary)' }}>
            Join the conversation, read our updates, and view our partner networks.
          </motion.p>
        </div>

        {/* Social channels grid */}
        <div className="grid-cols-4" style={{ gap: '16px', marginBottom: '40px' }}>
          {[
            { label: "Telegram Channel", sub: "Community Chat", url: "https://t.me" },
            { label: "X / Twitter", sub: "Latest Announcements", url: "https://x.com" },
            { label: "Discord Server", sub: "Dev & Support", url: "https://discord.com" },
            { label: "GitHub Code", sub: "Verified Repository", url: "https://github.com" }
          ].map((soc, idx) => (
            <motion.a 
              key={idx}
              href={soc.url} 
              target="_blank" 
              rel="noreferrer" 
              variants={fadeInUp}
              whileHover="hover"
              className="glass-card" 
              style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', textDecoration: 'none' }}
            >
              <MessageSquare className="text-gold" size={20} />
              <div>
                <strong style={{ display: 'block', color: '#fff', fontSize: '0.9rem' }}>{soc.label}</strong>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{soc.sub}</span>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Partners */}
        <motion.div 
          variants={fadeInUp}
          style={{ display: 'flex', justifyContent: 'center', gap: '40px', alignItems: 'center', flexWrap: 'wrap', opacity: 0.65 }}
        >
          <span style={{ fontWeight: '800', fontSize: '1.2rem', letterSpacing: '1px', color: 'var(--text-muted)' }}>🔗 BSCScan</span>
          <span style={{ fontWeight: '800', fontSize: '1.2rem', letterSpacing: '1px', color: 'var(--text-muted)' }}>💎 MetaMask</span>
          <span style={{ fontWeight: '800', fontSize: '1.2rem', letterSpacing: '1px', color: 'var(--text-muted)' }}>🛡️ Trust Wallet</span>
          <span style={{ fontWeight: '800', fontSize: '1.2rem', letterSpacing: '1px', color: 'var(--text-muted)' }}>⚡ PancakeSwap</span>
        </motion.div>
      </motion.section>

      {/* 15. Call-To-Action (CTA) Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        style={{ maxWidth: '1200px', margin: '0 auto 80px', padding: '0 20px' }}
      >
        <motion.div 
          variants={fadeInUp}
          whileHover={{ borderColor: 'rgba(224, 160, 30, 0.45)', boxShadow: '0 0 35px rgba(224, 160, 30, 0.15)' }}
          className="glass-card" 
          style={{ padding: '60px 40px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(5,7,10,0.8) 0%, rgba(224, 160, 30, 0.08) 100%)', border: '1px solid var(--gold-primary)', position: 'relative' }}
        >
          <h2 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '20px', background: 'linear-gradient(to right, #ffffff, #f8d954, #e0a01e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Join the DLMC Ecosystem Today
          </h2>
          <p style={{ maxWidth: '650px', margin: '0 auto 35px', fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            Connect your Web3 browser wallet, stake USDT values securely on-chain, and unlock multilevel growth rewards.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn btn-primary" style={{ padding: '14px 36px', fontSize: '1.05rem' }} onClick={goToRegister}>
              <UserPlus size={18} /> Create Account
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn btn-secondary" style={{ padding: '14px 36px', fontSize: '1.05rem' }} onClick={goToLogin}>
              <LogIn size={18} /> Sign In
            </motion.button>
          </div>
        </motion.div>
      </motion.section>

      {/* 16. Detailed Footer */}
      <footer style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', background: '#07090D', padding: '60px 40px 40px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', marginBottom: '40px' }}>
          <div>
            <img src={logoImg} alt="Vertex Capital Logo" style={{ height: '60px', width: 'auto', marginBottom: '10px' }} />
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '12px', lineHeight: '1.5' }}>
              Vertex Capital is a decentralized blockchain platform built on BEP-20 smart contracts.
            </p>
          </div>
          <div>
            <h5 style={{ fontWeight: '700', marginBottom: '16px', fontSize: '0.95rem' }}>Ecosystem Navigation</h5>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', listStyle: 'none' }}>
              <li><a href="#about" style={{ color: 'var(--text-secondary)' }}>About Us</a></li>
              <li><a href="#features" style={{ color: 'var(--text-secondary)' }}>Core Features</a></li>
              <li><a href="#tokenomics" style={{ color: 'var(--text-secondary)' }}>Token Spec</a></li>
              <li><a href="#staking" style={{ color: 'var(--text-secondary)' }}>Staking Pool</a></li>
            </ul>
          </div>
          <div>
            <h5 style={{ fontWeight: '700', marginBottom: '16px', fontSize: '0.95rem' }}>Referrals & Ranks</h5>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', listStyle: 'none' }}>
              <li><a href="#referrals" style={{ color: 'var(--text-secondary)' }}>15 Levels Matrix</a></li>
              <li><a href="#ranks" style={{ color: 'var(--text-secondary)' }}>Rank Salary ladder</a></li>
              <li><a href="#faq" style={{ color: 'var(--text-secondary)' }}>FAQs</a></li>
            </ul>
          </div>
          <div>
            <h5 style={{ fontWeight: '700', marginBottom: '16px', fontSize: '0.95rem' }}>Legal & Contact</h5>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', listStyle: 'none' }}>
              <li><span style={{ color: 'var(--text-muted)' }}>Terms of Service</span></li>
              <li><span style={{ color: 'var(--text-muted)' }}>Privacy Policy</span></li>
              <li><span style={{ color: 'var(--text-secondary)' }}>support@dlmc.io</span></li>
            </ul>
          </div>
        </div>
        
        <div style={{ maxWidth: '1200px', margin: '0 auto', borderTop: '1px solid rgba(255, 255, 255, 0.04)', paddingTop: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>&copy; {new Date().getFullYear()} DLMC FinTech Protocol. All rights reserved.</p>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-disabled)', maxWidth: '700px', lineHeight: '1.4' }}>
            Disclaimer: Staking cryptocurrency assets holds risk. Yield commissions, price appreciation indices, and MLM downlines are programmatically calculated on-chain, but value depends strictly on liquidity locks. Invest wisely.
          </p>
        </div>
      </footer>

      {/* ── Mobile Responsive overrides for inline-styled sections ── */}
      <style>{`
        @media (max-width: 768px) {
          .hero-section {
            padding: 110px 16px 60px !important;
          }
          .hero-buttons {
            gap: 10px !important;
          }
          .hero-buttons .btn {
            padding: 13px 20px !important;
            font-size: 0.92rem !important;
          }
          footer {
            padding: 40px 16px 30px !important;
          }
        }
        @media (max-width: 480px) {
          .hero-section {
            padding: 90px 12px 48px !important;
          }
          .hero-buttons {
            flex-direction: column !important;
            align-items: stretch !important;
            width: 100%;
          }
          .hero-buttons .btn {
            width: 100% !important;
            justify-content: center !important;
            padding: 14px 16px !important;
          }
          .floating-coin-container {
            width: 220px !important;
            height: 220px !important;
          }
          .coin-orbit-outer {
            width: 210px !important;
            height: 210px !important;
          }
          .coin-orbit-inner {
            width: 158px !important;
            height: 158px !important;
          }
          .coin-token-main {
            width: 108px !important;
            height: 108px !important;
          }
          .coin-token-inner {
            width: 86px !important;
            height: 86px !important;
          }
          .coin-token-title {
            font-size: 1.3rem !important;
          }
        }
      `}</style>

    </div>
  );
};

export default LandingPage;

