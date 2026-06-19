import express from 'express';
import db from '../database/dbManager.js';
import { verifyToken } from './auth.js';

const router = express.Router();

// Get Portal Overview Stats
router.get('/summary', verifyToken, async (req, res) => {
  try {
    const user = await db.findUser({ walletAddress: req.user.walletAddress });
    if (!user) return res.status(404).json({ message: "User not found" });

    const cms = await db.getCMS();
    const stakes = await db.findStakes({ walletAddress: user.walletAddress });
    
    // Calculate total ROI and active stake amounts
    const totalStaked = user.totalStaked || 0;
    const activeStakesCount = stakes.filter(s => s.status === 'active').length;

    // Direct referrals count
    const directCount = user.directs ? user.directs.length : 0;
    const activeDirectsCount = user.directs ? user.directs.filter(d => d).length : 0; // Simulated

    // Simulated dividends accumulators
    const availableDividends = Number((stakes.reduce((sum, s) => {
      if (s.status === 'active') {
        const days = Math.max(1, Math.floor((Date.now() - new Date(s.startDate)) / 86400000));
        return sum + (s.dailyDividend * days);
      }
      return sum;
    }, 0)).toFixed(4));

    res.json({
      summary: {
        usdtBalance: user.usdtBalance,
        dlmcBalance: user.dlmcBalance,
        totalStaked,
        activeStakesCount,
        availableDividends,
        totalClaimed: user.totalClaimed || 0,
        referralEarnings: user.referralEarnings || 0,
        levelEarnings: user.levelEarnings || 0,
        boosterEarnings: user.boosterEarnings || 0,
        salaryEarnings: user.salaryEarnings || 0,
        currentRank: user.currentRank || "D0",
        dailySalary: user.dailySalary || 0,
        lpdaoStatus: user.lpdaoStatus || "none",
        selfStake: user.selfStake || 0,
        mainLegVolume: user.mainLegVolume || 0,
        otherLegVolume: user.otherLegVolume || 0
      },
      cms: {
        tokenPrice: cms.tokenPrice,
        buyFeePercent: cms.buyFeePercent,
        sellFeePercent: cms.sellFeePercent,
        stabilityFeePercent: cms.stabilityFeePercent,
        lpdaoFeePercent: cms.lpdaoFeePercent,
        stakingRoiPercent: cms.stakingRoiPercent
      }
    });

  } catch (err) {
    console.error("Dashboard Summary Error:", err);
    res.status(500).json({ message: "Error loading dashboard metrics" });
  }
});

// Get charts historical trends
router.get('/charts', async (req, res) => {
  try {
    const cms = await db.getCMS();
    const currentPrice = cms.tokenPrice;

    // Generate mock token price variations
    const priceChart = Array.from({ length: 15 }, (_, i) => ({
      date: new Date(Date.now() - (15 - i) * 86400000).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      price: Number((currentPrice * (0.85 + i * 0.012)).toFixed(3))
    }));

    // Daily Earnings Chart
    const dailyEarnings = Array.from({ length: 7 }, (_, i) => ({
      day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
      staking: Number((25 + Math.random() * 10).toFixed(2)),
      referrals: Number((10 + Math.random() * 15).toFixed(2)),
      salary: Number((5 + Math.random() * 5).toFixed(2))
    }));

    // Mint vs Burn Chart
    const mintBurn = Array.from({ length: 6 }, (_, i) => ({
      month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i],
      mint: 100000 + i * 15000 + Math.floor(Math.random() * 5000),
      burn: 25000 + i * 8000 + Math.floor(Math.random() * 3000)
    }));

    // Team Growth Chart
    const teamGrowth = Array.from({ length: 6 }, (_, i) => ({
      month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i],
      members: 12 + i * 8 + Math.floor(Math.random() * 5)
    }));

    res.json({ priceChart, dailyEarnings, mintBurn, teamGrowth });
  } catch (e) {
    res.status(500).json({ message: "Error gathering analytics records" });
  }
});

// Post deposit USDT mock action
router.post('/deposit', verifyToken, async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || Number(amount) <= 0) return res.status(400).json({ message: "Invalid deposit amount" });

    const user = await db.findUser({ walletAddress: req.user.walletAddress });
    if (!user) return res.status(404).json({ message: "User not found" });

    const newUsdt = user.usdtBalance + Number(amount);
    await db.updateUser(user.walletAddress, { usdtBalance: newUsdt });

    await db.createTransaction({
      walletAddress: user.walletAddress,
      type: "deposit",
      amount: Number(amount),
      netAmount: Number(amount),
      status: "success"
    });

    res.json({ message: "Deposit completed successfully", usdtBalance: newUsdt });
  } catch (err) {
    res.status(500).json({ message: "Deposit processing failed" });
  }
});

// Post withdrawal USDT mock action
router.post('/withdraw', verifyToken, async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || Number(amount) <= 0) return res.status(400).json({ message: "Invalid withdrawal amount" });

    const user = await db.findUser({ walletAddress: req.user.walletAddress });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.usdtBalance < Number(amount)) {
      return res.status(400).json({ message: "Insufficient USDT balance." });
    }

    const cms = await db.getCMS();
    const fee = Number((Number(amount) * cms.withdrawalFeePercent / 100).toFixed(4));
    const net = Number((Number(amount) - fee).toFixed(4));

    const newUsdt = user.usdtBalance - Number(amount);
    await db.updateUser(user.walletAddress, { usdtBalance: newUsdt });

    await db.createTransaction({
      walletAddress: user.walletAddress,
      type: "withdrawal",
      amount: Number(amount),
      fee,
      netAmount: net,
      status: "success"
    });

    res.json({ message: "Withdrawal processing", usdtBalance: newUsdt });
  } catch (err) {
    res.status(500).json({ message: "Withdrawal failed" });
  }
});

// Get transactions history for current user
router.get('/transactions', verifyToken, async (req, res) => {
  try {
    const list = await db.findTransactions({ walletAddress: req.user.walletAddress });
    res.json({ transactions: list });
  } catch (err) {
    res.status(500).json({ message: "Error loading user transactions" });
  }
});

export default router;
