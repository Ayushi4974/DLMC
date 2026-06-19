import React, {
  createContext, useContext, useState,
  useEffect, useCallback, useRef,
} from 'react';

const WalletContext = createContext();

const getApiUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  const protocol = typeof window !== 'undefined' ? window.location.protocol : 'http:';
  
  if (hostname && hostname !== 'localhost' && hostname !== '127.0.0.1') {
    return `${protocol}//${hostname}:5000/api`;
  }
  return 'http://localhost:5000/api';
};

const API_URL = getApiUrl();

const getMockDataForUrl = (url, options = {}) => {
  const path = url.split('/api')[1] || '';
  
  if (path.startsWith('/auth/profile')) {
    return {
      user: {
        username: 'demo_user',
        walletAddress: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
        role: 'admin',
        createdAt: new Date().toISOString()
      }
    };
  }
  
  if (path.startsWith('/dashboard/summary')) {
    return {
      summary: {
        usdtBalance: 1250.00,
        dlmcBalance: 5000.00,
        totalStaked: 2500.00,
        activeStakesCount: 2,
        availableDividends: 45.50,
        totalClaimed: 120.00,
        referralEarnings: 350.00,
        salaryEarnings: 200.00,
        currentRank: 'VIP 1',
        lpdaoStatus: 'member',
      },
      cms: {
        tokenPrice: 1.25,
      }
    };
  }

  if (path.startsWith('/dashboard/charts')) {
    return {
      dailyEarnings: [
        { day: 'Mon', staking: 12.5, referrals: 8.0, salary: 5.0 },
        { day: 'Tue', staking: 15.0, referrals: 10.5, salary: 5.0 },
        { day: 'Wed', staking: 18.2, referrals: 12.0, salary: 5.5 },
        { day: 'Thu', staking: 14.1, referrals: 9.0, salary: 5.0 },
        { day: 'Fri', staking: 22.4, referrals: 15.0, salary: 6.0 },
        { day: 'Sat', staking: 25.8, referrals: 18.5, salary: 6.0 },
        { day: 'Sun', staking: 30.0, referrals: 22.0, salary: 7.0 },
      ],
      priceChart: [
        { date: 'Jun 12', time: '10:00', price: 1.20 },
        { date: 'Jun 13', time: '12:00', price: 1.21 },
        { date: 'Jun 14', time: '14:00', price: 1.215 },
        { date: 'Jun 15', time: '16:00', price: 1.22 },
        { date: 'Jun 16', time: '18:00', price: 1.23 },
        { date: 'Jun 17', time: '20:00', price: 1.24 },
        { date: 'Jun 18', time: '22:00', price: 1.25 }
      ],
    };
  }

  if (path.startsWith('/dashboard/transactions')) {
    return {
      transactions: [
        {
          id: '1',
          type: 'deposit',
          amount: 500,
          fee: 0,
          hash: '0x1234567890abcdef1234567890abcdef12345678',
          status: 'completed',
          date: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString()
        },
        {
          id: '2',
          type: 'stake',
          amount: 1000,
          fee: 0,
          hash: '0xabcdef1234567890abcdef1234567890abcdef12',
          status: 'completed',
          date: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString()
        },
        {
          id: '3',
          type: 'claim',
          amount: 45,
          fee: 2.25,
          hash: '0x7890abcdef1234567890abcdef1234567890abcd',
          status: 'completed',
          date: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString()
        }
      ]
    };
  }

  if (path.startsWith('/staking/stakes')) {
    return {
      stakes: [
        { id: '1', amount: 1000, durationMonths: 12, status: 'active', startDate: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString(), nextRewardDate: new Date(Date.now() + 20 * 24 * 3600 * 1000).toISOString() },
        { id: '2', amount: 1500, durationMonths: 24, status: 'active', startDate: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(), nextRewardDate: new Date(Date.now() + 25 * 24 * 3600 * 1000).toISOString() }
      ]
    };
  }

  if (path.startsWith('/staking/dividends')) {
    return {
      dividends: [
        { id: '1', stakeId: 'stk-1', amount: 4.5, dividendEarned: 4.5, type: 'daily', status: 'paid', date: new Date(Date.now() - 24 * 3600 * 1000).toISOString(), createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString() },
        { id: '2', stakeId: 'stk-2', amount: 4.5, dividendEarned: 4.5, type: 'daily', status: 'paid', date: new Date(Date.now() - 48 * 3600 * 1000).toISOString(), createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString() }
      ]
    };
  }

  if (path.startsWith('/referrals/network')) {
    return {
      tree: {
        username: 'demouser',
        walletAddress: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
        selfStake: 2500,
        currentRank: 'VIP 1',
        leftChild: {
          username: 'crypto_king',
          walletAddress: '0x1111111111111111111111111111111111111111',
          selfStake: 1000,
          currentRank: 'VIP 1',
          leftChild: null,
          rightChild: null
        },
        rightChild: {
          username: 'moon_shooter',
          walletAddress: '0x2222222222222222222222222222222222222222',
          selfStake: 1500,
          currentRank: 'VIP 2',
          leftChild: null,
          rightChild: null
        }
      },
      networkStats: {
        leftVolume: 5000.00,
        rightVolume: 4500.00,
        activeTeam: 2,
        totalTeam: 5
      }
    };
  }

  if (path.startsWith('/referrals/link')) {
    const host = typeof window !== 'undefined' ? window.location.host : 'localhost:5173';
    const proto = typeof window !== 'undefined' ? window.location.protocol : 'http:';
    return {
      referralCode: 'DEMOUSER',
      referralUrl: `${proto}//${host}/login?ref=DEMOUSER`,
      stats: {
        clicks: 45,
        registrations: 2,
        conversions: 4.4
      }
    };
  }

  if (path.startsWith('/referrals/level-income')) {
    return {
      totalLevelIncome: 155.00,
      todaysIncome: 12.50,
      levelMatrix: Array.from({ length: 15 }, (_, i) => ({
        level: i + 1,
        teamCount: Math.max(0, 10 - i),
        businessVolume: Math.max(0, 5000 - i * 350),
        income: Math.max(0, 50 - i * 3.5)
      }))
    };
  }

  if (path.startsWith('/referrals/directs')) {
    return {
      summary: {
        totalDirects: 2,
        activeDirects: 2,
        referralEarnings: 125.00
      },
      directs: [
        { walletAddress: '0x1111111111111111111111111111111111111111', joinDate: new Date(Date.now() - 10*24*3600*1000).toISOString(), depositAmount: 1000 },
        { walletAddress: '0x2222222222222222222222222222222222222222', joinDate: new Date(Date.now() - 5*24*3600*1000).toISOString(), depositAmount: 1500 }
      ]
    };
  }

  if (path.startsWith('/referrals/booster')) {
    return {
      eligibility: {
        activeCount: 3,
        requiredActiveMembers: 5,
        currentStatus: 'Pending Eligibility',
      },
      earnings: {
        boosterIncome: 45.00,
        uplineDistribution: 15.00
      },
      boosterTable: [
        { date: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(), sourceUser: '0x1111...1111', rewardAmount: 15.00 },
        { date: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(), sourceUser: '0x2222...2222', rewardAmount: 30.00 }
      ]
    };
  }

  if (path.startsWith('/lpdao/membership')) {
    return {
      status: 'member',
      joiningDate: '2026-06-15',
      totalRewards: 320.50,
      benefits: [
        'Voting rights on ROI parameters and platform mechanics',
        'Dividend yields share (10% of global deposit fees pool)',
        'LPDAO specific direct referrals bonus of +5% extra',
        'VIP queue placement on withdrawals processing'
      ]
    };
  }

  if (path.startsWith('/lpdao/proposals')) {
    return {
      proposals: [
        {
          id: '1',
          title: 'Increase staking ROI by 0.5%',
          description: 'Proposal to adjust reward percentages',
          status: 'active',
          userVoted: false,
          votesFor: 12000,
          votesAgainst: 3000,
          endDays: 5,
          totalVotes: 15,
          votes: {
            approve: Array.from({ length: 12 }, (_, i) => `0xmockapprove${i}`),
            reject: Array.from({ length: 3 }, (_, i) => `0xmockreject${i}`)
          },
          endDate: new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString(),
          date: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString()
        },
        {
          id: '2',
          title: 'Introduce VIP 4 Tier',
          description: 'Introduce new rank for high volume referrers',
          status: 'passed',
          userVoted: true,
          votesFor: 25000,
          votesAgainst: 1200,
          endDays: 0,
          totalVotes: 26,
          votes: {
            approve: Array.from({ length: 25 }, (_, i) => `0xmockapprove${i}`),
            reject: Array.from({ length: 1 }, (_, i) => `0xmockreject${i}`)
          },
          endDate: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
          date: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString()
        }
      ]
    };
  }

  if (path.startsWith('/lpdao/voting-history')) {
    return {
      history: [
        { proposalId: '2', vote: 'for', timestamp: '2026-06-14' }
      ]
    };
  }

  if (path.startsWith('/support/tickets')) {
    return {
      tickets: [
        { id: '1', subject: 'Stake reward delay', message: 'Staking reward not showing up', status: 'open', reply: null, createdAt: '2026-06-17T12:00:00Z' }
      ]
    };
  }

  if (path.startsWith('/admin/users')) {
    return {
      users: [
        { username: 'demouser', walletAddress: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F', balance: 1250, role: 'user' }
      ]
    };
  }

  if (path.startsWith('/admin/tickets')) {
    return {
      tickets: [
        { id: '1', subject: 'Stake reward delay', message: 'Staking reward not showing up', status: 'open', reply: null, createdAt: '2026-06-17T12:00:00Z' }
      ]
    };
  }

  if (path.startsWith('/admin/stats')) {
    return {
      totalUsers: 19,
      totalDeposited: 45000,
      totalStaked: 32000,
      openTickets: 1
    };
  }

  if (path.startsWith('/admin/cms')) {
    return {
      tokenPrice: 1.25,
      roiRate: 0.8
    };
  }

  return { success: true };
};

export const WalletProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [isConnected,   setIsConnected]   = useState(false);
  const [user,          setUser]          = useState(null);
  const [loading,       setLoading]       = useState(true);
  const [token,         setToken]         = useState(() => localStorage.getItem('dlmc_token') || null);
  const [error,         setError]         = useState(null);

  // ── Keep a ref so authFetch always reads the latest token
  //    without needing to be recreated on every token change.
  const tokenRef = useRef(token);
  useEffect(() => { tokenRef.current = token; }, [token]);

  // ── Stable authFetch — never changes identity, always uses latest token
  const authFetch = useCallback(async (url, options = {}) => {
    let targetUrl = url;
    if (targetUrl.startsWith('http://localhost:5000/api')) {
      targetUrl = targetUrl.replace('http://localhost:5000/api', API_URL);
    }
    
    console.log('Client-side mock intercept:', targetUrl);
    const mockData = getMockDataForUrl(targetUrl, options);
    return {
      ok: true,
      status: 200,
      json: async () => mockData,
      text: async () => JSON.stringify(mockData),
    };
  }, []); // intentionally empty — uses ref for token

  // ── Verify saved session once on mount
  useEffect(() => {
    let cancelled = false;

    const verifySession = async () => {
      if (!tokenRef.current) {
        setLoading(false);
        return;
      }
      try {
        const res = await authFetch(`${API_URL}/auth/profile`);
        if (cancelled) return;
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setWalletAddress(data.user.walletAddress);
          setIsConnected(true);
        } else {
          logout();
        }
      } catch (e) {
        if (!cancelled) {
          console.warn('Session verification failed:', e.message);
          logout();
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    verifySession();
    return () => { cancelled = true; };
  }, []); // run once on mount only

  // ── Connect simulated / MetaMask wallet
  const connectWallet = async (preferredAddress = null) => {
    setError(null);
    try {
      const address = preferredAddress
        || '0x' + Array.from({ length: 40 }, () =>
            '0123456789abcdef'[Math.floor(Math.random() * 16)]
          ).join('');

      const data = {
        token: 'mock_wallet_token_' + Date.now(),
        user: { username: 'wallet_user', walletAddress: address, role: 'user' }
      };

      localStorage.setItem('dlmc_token', data.token);
      tokenRef.current = data.token;
      setToken(data.token);
      setWalletAddress(address);
      setIsConnected(true);
      setUser(data.user);
      return data.user;
    } catch (e) {
      setError(e.message);
      setIsConnected(false);
      setUser(null);
      throw e;
    }
  };

  // ── Username / password login (admin panel)
  const login = async (username, password, referrer = '') => {
    setError(null);
    try {
      const mockAddress = '0x' + Array.from({ length: 40 }, () =>
        '0123456789abcdef'[Math.floor(Math.random() * 16)]
      ).join('');
      
      const data = {
        token: 'mock_auth_token_' + Date.now(),
        user: { 
          username: username || 'demo_user', 
          walletAddress: mockAddress, 
          role: username === 'admin' ? 'admin' : 'user' 
        }
      };

      localStorage.setItem('dlmc_token', data.token);
      tokenRef.current = data.token;
      setToken(data.token);
      setUser(data.user);
      setWalletAddress(data.user.walletAddress);
      setIsConnected(true);
      return data.user;
    } catch (e) {
      setError(e.message);
      throw e;
    }
  };

  // ── Registration
  const register = async (username, email, password, walletAddress, referrer) => {
    setError(null);
    try {
      const address = walletAddress || '0x' + Array.from({ length: 40 }, () =>
        '0123456789abcdef'[Math.floor(Math.random() * 16)]
      ).join('');

      const data = {
        token: 'mock_auth_token_' + Date.now(),
        user: { 
          username, 
          email, 
          walletAddress: address, 
          role: username === 'admin' ? 'admin' : 'user' 
        }
      };

      localStorage.setItem('dlmc_token', data.token);
      tokenRef.current = data.token;
      setToken(data.token);
      setUser(data.user);
      setWalletAddress(data.user.walletAddress);
      setIsConnected(true);
      return data.user;
    } catch (e) {
      setError(e.message);
      throw e;
    }
  };

  // ── Logout
  const logout = () => {
    localStorage.removeItem('dlmc_token');
    tokenRef.current = null;
    setToken(null);
    setWalletAddress(null);
    setIsConnected(false);
    setUser(null);
  };

  // ── Manual profile refresh
  const refreshProfile = async () => {
    if (!tokenRef.current) return;
    try {
      const res = await authFetch(`${API_URL}/auth/profile`);
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch (e) {
      console.warn('Profile refresh failed:', e.message);
    }
  };

  return (
    <WalletContext.Provider value={{
      walletAddress,
      isConnected,
      user,
      loading,
      token,
      error,
      connectWallet,
      login,
      register,
      logout,
      authFetch,
      refreshProfile,
      apiUrl: API_URL,
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
export default WalletContext;
