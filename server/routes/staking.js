import express from 'express';
import db from '../database/dbManager.js';
import { verifyToken } from './auth.js';

const router = express.Router();

// Buy DLMC Token
router.post('/buy-token', verifyToken, async (req, res) => {
  try {
    const { usdtAmount } = req.body;
    if (!usdtAmount || Number(usdtAmount) <= 0) {
      return res.status(400).json({ message: "Invalid purchase amount." });
    }

    const user = await db.findUser({ walletAddress: req.user.walletAddress });
    if (!user) return res.status(404).json({ message: "User not found." });

    if (user.usdtBalance < Number(usdtAmount)) {
      return res.status(400).json({ message: "Insufficient USDT balance." });
    }

    const cms = await db.getCMS();
    const tokenPrice = cms.tokenPrice;
    
    // 5% Development Fee
    const devFee = Number((Number(usdtAmount) * cms.buyFeePercent / 100).toFixed(4));
    const netUsdt = Number((Number(usdtAmount) - devFee).toFixed(4));
    
    // DLMC Output calculation
    const dlmcReceived = Number((netUsdt / tokenPrice).toFixed(4));

    // Update User balances
    const updatedUsdt = Number((user.usdtBalance - Number(usdtAmount)).toFixed(4));
    const updatedDlmc = Number((user.dlmcBalance + dlmcReceived).toFixed(4));

    await db.updateUser(user.walletAddress, {
      usdtBalance: updatedUsdt,
      dlmcBalance: updatedDlmc
    });

    // Save transaction
    await db.createTransaction({
      walletAddress: user.walletAddress,
      type: "buy",
      amount: dlmcReceived,
      fee: devFee,
      netAmount: dlmcReceived,
      tokenPrice,
      status: "success"
    });

    // 15% Price appreciation simulated after buy
    const newPrice = Number((tokenPrice * 1.15).toFixed(4));
    await db.updateCMS({
      tokenPrice: newPrice,
      totalMintSupply: cms.totalMintSupply + dlmcReceived,
      totalUsdtInSystem: cms.totalUsdtInSystem + Number(usdtAmount)
    });

    res.json({
      message: "Tokens purchased successfully!",
      usdtBalance: updatedUsdt,
      dlmcBalance: updatedDlmc,
      dlmcReceived,
      newPrice
    });

  } catch (err) {
    console.error("Buy Token Error:", err);
    res.status(500).json({ message: "Token purchase failed." });
  }
});

// Sell DLMC Token
router.post('/sell-token', verifyToken, async (req, res) => {
  try {
    const { dlmcAmount } = req.body;
    if (!dlmcAmount || Number(dlmcAmount) <= 0) {
      return res.status(400).json({ message: "Invalid sale amount." });
    }

    const user = await db.findUser({ walletAddress: req.user.walletAddress });
    if (!user) return res.status(404).json({ message: "User not found." });

    if (user.dlmcBalance < Number(dlmcAmount)) {
      return res.status(400).json({ message: "Insufficient DLMC balance." });
    }

    const cms = await db.getCMS();
    const tokenPrice = cms.tokenPrice;

    // 10% Burn Fee + Sell Fee
    const sellFeePercent = cms.sellFeePercent;
    const grossUsdt = Number((Number(dlmcAmount) * tokenPrice).toFixed(4));
    const fee = Number((grossUsdt * sellFeePercent / 100).toFixed(4));
    const netUsdt = Number((grossUsdt - fee).toFixed(4));

    // Update balances
    const updatedUsdt = Number((user.usdtBalance + netUsdt).toFixed(4));
    const updatedDlmc = Number((user.dlmcBalance - Number(dlmcAmount)).toFixed(4));

    await db.updateUser(user.walletAddress, {
      usdtBalance: updatedUsdt,
      dlmcBalance: updatedDlmc
    });

    // Save transaction
    await db.createTransaction({
      walletAddress: user.walletAddress,
      type: "sell",
      amount: Number(dlmcAmount),
      fee,
      netAmount: netUsdt,
      tokenPrice,
      status: "success"
    });

    // Depreciate Price and update burn metrics
    const newPrice = Number((tokenPrice * 0.90).toFixed(4)); // 10% depreciation
    await db.updateCMS({
      tokenPrice: newPrice > 0.1 ? newPrice : 0.1,
      totalBurnSupply: cms.totalBurnSupply + Number(dlmcAmount),
      totalMintSupply: Math.max(0, cms.totalMintSupply - Number(dlmcAmount))
    });

    res.json({
      message: "Tokens sold successfully!",
      usdtBalance: updatedUsdt,
      dlmcBalance: updatedDlmc,
      netUsdt,
      newPrice
    });

  } catch (err) {
    console.error("Sell Token Error:", err);
    res.status(500).json({ message: "Token sale failed." });
  }
});

// Stake Tokens
router.post('/stake', verifyToken, async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ message: "Invalid stake amount." });
    }

    const user = await db.findUser({ walletAddress: req.user.walletAddress });
    if (!user) return res.status(404).json({ message: "User not found." });

    if (user.usdtBalance < Number(amount)) {
      return res.status(400).json({ message: "Staking requires USDT. Insufficient USDT balance." });
    }

    const cms = await db.getCMS();
    if (Number(amount) < cms.minStakeAmount) {
      return res.status(400).json({ message: `Minimum staking requirement is ${cms.minStakeAmount} USDT.` });
    }

    const newStake = await db.createStake({
      walletAddress: user.walletAddress,
      amount: Number(amount),
      roiPercent: cms.stakingRoiPercent
    });

    await db.createTransaction({
      walletAddress: user.walletAddress,
      type: "buy", // Register the stake movement
      amount: Number(amount),
      netAmount: Number(amount),
      status: "success"
    });

    res.json({
      message: "Staking completed successfully!",
      stake: newStake,
      usdtBalance: user.usdtBalance - Number(amount)
    });

  } catch (err) {
    console.error("Stake Error:", err);
    res.status(500).json({ message: "Staking transaction failed." });
  }
});

// Get stakes list
router.get('/stakes', verifyToken, async (req, res) => {
  try {
    const stakes = await db.findStakes({ walletAddress: req.user.walletAddress });
    res.json({ stakes });
  } catch (err) {
    res.status(500).json({ message: "Error fetching active stakes." });
  }
});

// Dividend Earned history list
router.get('/dividends', verifyToken, async (req, res) => {
  try {
    const stakes = await db.findStakes({ walletAddress: req.user.walletAddress });
    
    // Generate logical mock list based on stake creation dates
    const dividendHistory = [];
    stakes.forEach(s => {
      const days = Math.max(1, Math.floor((Date.now() - new Date(s.startDate)) / 86400000));
      for (let day = 0; day < days; day++) {
        const divDate = new Date(new Date(s.startDate).getTime() + (day * 86400000)).toISOString();
        dividendHistory.push({
          date: divDate,
          stakeId: s.id,
          dividendEarned: s.dailyDividend,
          status: "success"
        });
      }
    });

    // Sort newest first
    dividendHistory.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({ dividends: dividendHistory });
  } catch (err) {
    res.status(500).json({ message: "Error getting dividend record." });
  }
});

// Claim Rewards
router.post('/claim', verifyToken, async (req, res) => {
  try {
    const user = await db.findUser({ walletAddress: req.user.walletAddress });
    if (!user) return res.status(404).json({ message: "User not found." });

    const stakes = await db.findStakes({ walletAddress: user.walletAddress });
    
    // Calculate total accumulative dividends
    let totalDividends = 0;
    const now = new Date();
    
    stakes.forEach(async (s) => {
      if (s.status === 'active') {
        const days = Math.max(1, Math.floor((now - new Date(s.startDate)) / 86400000));
        totalDividends += (s.dailyDividend * days);
        // Reset stake start date to simulate claiming dividends
        s.startDate = now.toISOString();
        await db.updateProposal(s.id, { startDate: now.toISOString() }); // Overwrite stake date locally/externally
      }
    });

    if (totalDividends <= 0) {
      return res.status(400).json({ message: "No dividends available to claim at this time." });
    }

    const cms = await db.getCMS();
    // 3% stability fee, 2% LPDAO fee
    const stabilityFee = Number((totalDividends * cms.stabilityFeePercent / 100).toFixed(4));
    const lpdaoFee = Number((totalDividends * cms.lpdaoFeePercent / 100).toFixed(4));
    const netClaim = Number((totalDividends - stabilityFee - lpdaoFee).toFixed(4));

    // Update user balance
    const newUsdtBalance = Number((user.usdtBalance + netClaim).toFixed(4));
    const newTotalClaimed = Number((user.totalClaimed + netClaim).toFixed(4));

    await db.updateUser(user.walletAddress, {
      usdtBalance: newUsdtBalance,
      totalClaimed: newTotalClaimed
    });

    // Log transaction
    const tx = await db.createTransaction({
      walletAddress: user.walletAddress,
      type: "claim",
      amount: totalDividends,
      fee: stabilityFee + lpdaoFee,
      netAmount: netClaim,
      status: "success"
    });

    res.json({
      message: "Rewards claimed successfully!",
      claimedAmount: totalDividends,
      stabilityFee,
      lpdaoFee,
      netClaim,
      usdtBalance: newUsdtBalance,
      transactionHash: tx.hash
    });

  } catch (err) {
    console.error("Claim Error:", err);
    res.status(500).json({ message: "Claim rewards execution failed." });
  }
});

export default router;
