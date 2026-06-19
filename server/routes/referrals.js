import express from 'express';
import db from '../database/dbManager.js';
import { verifyToken } from './auth.js';

const router = express.Router();

// Get Referral Link detail
router.get('/link', verifyToken, async (req, res) => {
  try {
    const user = await db.findUser({ walletAddress: req.user.walletAddress });
    if (!user) return res.status(404).json({ message: "User not found" });

    const refCode = user.username.toUpperCase();
    const origin = req.get('origin') || 'http://localhost:5173';
    const refUrl = `${origin}/login?ref=${refCode}`;

    res.json({
      referralCode: refCode,
      referralUrl: refUrl,
      stats: {
        clicks: Math.floor(Math.random() * 120) + 15,
        registrations: user.directs ? user.directs.length : 0,
        conversions: user.directs ? Math.floor(user.directs.length * 0.8) : 0
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Error loading referral details" });
  }
});

// Binary Tree Downline network visualization
router.get('/network', verifyToken, async (req, res) => {
  try {
    const user = await db.findUser({ walletAddress: req.user.walletAddress });
    if (!user) return res.status(404).json({ message: "User not found" });

    const allUsers = await db.getUsers();

    // Helper to build tree recursively
    const buildTree = (userWallet, depth = 1, maxDepth = 4) => {
      if (!userWallet || depth > maxDepth) return null;

      const found = allUsers.find(u => u.walletAddress.toLowerCase() === userWallet.toLowerCase());
      if (!found) return null;

      return {
        username: found.username,
        walletAddress: found.walletAddress,
        currentRank: found.currentRank || "D0",
        selfStake: found.selfStake || 0,
        mainLegVolume: found.mainLegVolume || 0,
        otherLegVolume: found.otherLegVolume || 0,
        leftChild: buildTree(found.leftChild, depth + 1, maxDepth),
        rightChild: buildTree(found.rightChild, depth + 1, maxDepth)
      };
    };

    const tree = buildTree(user.walletAddress);

    res.json({
      tree,
      networkStats: {
        leftVolume: user.mainLegVolume || 0,
        rightVolume: user.otherLegVolume || 0,
        activeTeam: user.directs ? user.directs.length : 0,
        totalTeam: allUsers.filter(u => u.referrer && (u.referrer.toLowerCase() === user.walletAddress.toLowerCase() || u.referrer.toLowerCase() === user.username.toLowerCase())).length
      }
    });

  } catch (err) {
    console.error("Network tree build failed:", err);
    res.status(500).json({ message: "Error fetching downline network" });
  }
});

// Direct Referrals List
router.get('/directs', verifyToken, async (req, res) => {
  try {
    const user = await db.findUser({ walletAddress: req.user.walletAddress });
    if (!user) return res.status(404).json({ message: "User not found" });

    const directs = [];
    const allUsers = await db.getUsers();

    if (user.directs && user.directs.length > 0) {
      user.directs.forEach(wallet => {
        const found = allUsers.find(u => u.walletAddress.toLowerCase() === wallet.toLowerCase());
        if (found) {
          directs.push({
            walletAddress: found.walletAddress,
            joinDate: found.joinDate,
            depositAmount: found.selfStake || 0,
            status: found.status || "active"
          });
        }
      });
    }

    res.json({
      summary: {
        totalDirects: directs.length,
        activeDirects: directs.filter(d => d.depositAmount > 0).length,
        referralEarnings: user.referralEarnings || 0
      },
      directs
    });

  } catch (err) {
    res.status(500).json({ message: "Error loading directs list" });
  }
});

// 15 Level Incomes matrix
router.get('/level-income', verifyToken, async (req, res) => {
  try {
    const user = await db.findUser({ walletAddress: req.user.walletAddress });
    if (!user) return res.status(404).json({ message: "User not found" });

    const allUsers = await db.getUsers();
    
    // Level percentages mapping for standard multilevel ROI payout
    const levelPayoutPercents = [10, 5, 3, 2, 1, 1, 1, 1, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5]; // 15 levels

    const levelMatrix = Array.from({ length: 15 }, (_, i) => ({
      level: i + 1,
      teamCount: 0,
      businessVolume: 0,
      income: 0
    }));

    // Traverse recursively down levels
    const traverseLevels = (wallet, currentLevel) => {
      if (currentLevel > 15) return;
      
      const children = allUsers.filter(u => u.referrer && (u.referrer.toLowerCase() === wallet.toLowerCase() || u.referrer.toLowerCase() === allUsers.find(au => au.walletAddress === wallet)?.username.toLowerCase()));
      
      children.forEach(child => {
        levelMatrix[currentLevel - 1].teamCount++;
        levelMatrix[currentLevel - 1].businessVolume += (child.selfStake || 0);
        // Income is simulated: 10% of their staking ROI or direct commission based on level
        levelMatrix[currentLevel - 1].income += Number(((child.selfStake || 0) * (levelPayoutPercents[currentLevel - 1] / 100) * 0.1).toFixed(4));
        
        traverseLevels(child.walletAddress, currentLevel + 1);
      });
    };

    traverseLevels(user.walletAddress, 1);

    // Sum level totals
    const totalLevelIncome = levelMatrix.reduce((sum, item) => sum + item.income, 0);

    res.json({
      totalLevelIncome: Number(totalLevelIncome.toFixed(4)),
      todaysIncome: Number((totalLevelIncome * 0.05).toFixed(4)), // mock 5% daily level earnings
      levelMatrix,
      progress: {
        currentEligibility: levelMatrix.filter(l => l.teamCount > 0).length, // levels unlocked
        nextLevelRequirement: levelMatrix.filter(l => l.teamCount > 0).length + 1
      }
    });

  } catch (err) {
    console.error("Level Income Error:", err);
    res.status(500).json({ message: "Error calculating level matrices" });
  }
});

// Booster rewards details
router.get('/booster', verifyToken, async (req, res) => {
  try {
    const user = await db.findUser({ walletAddress: req.user.walletAddress });
    if (!user) return res.status(404).json({ message: "User not found" });

    const directs = user.directs ? user.directs.length : 0;
    
    // Booster eligibility: Requires at least 5 active direct referrals
    const meetsCriteria = directs >= 5;

    res.json({
      eligibility: {
        requiredActiveMembers: 5,
        currentStatus: meetsCriteria ? "Eligible" : "Pending",
        activeCount: directs
      },
      earnings: {
        boosterIncome: user.boosterEarnings || 0,
        uplineDistribution: Number((user.boosterEarnings * 0.25).toFixed(4))
      },
      boosterTable: [
        {
          date: new Date().toISOString(),
          sourceUser: "0xDirectReferralF5",
          rewardAmount: meetsCriteria ? 25.0 : 0.0
        },
        {
          date: new Date(Date.now() - 86400000 * 3).toISOString(),
          sourceUser: "0xDirectReferralA2",
          rewardAmount: meetsCriteria ? 15.0 : 0.0
        }
      ]
    });

  } catch (err) {
    res.status(500).json({ message: "Error loading booster metrics" });
  }
});

export default router;
