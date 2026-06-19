import express from 'express';
import db from '../database/dbManager.js';
import { verifyToken } from './auth.js';

const router = express.Router();

// Get membership summary
router.get('/membership', verifyToken, async (req, res) => {
  try {
    const user = await db.findUser({ walletAddress: req.user.walletAddress });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      status: user.lpdaoStatus || "none",
      joiningDate: user.lpdaoStatus === 'member' ? new Date(user.joinDate).toLocaleDateString() : null,
      totalRewards: user.lpdaoStatus === 'member' ? user.boosterEarnings + user.levelEarnings : 0,
      benefits: [
        "Participate in Governance Proposals",
        "2% LPDAO rewards pool sharing",
        "Priority project launches access",
        "Reduced trading fees (5% instead of 10% on Sell)"
      ]
    });
  } catch (err) {
    res.status(500).json({ message: "Error loading membership info" });
  }
});

// Join membership
router.post('/membership', verifyToken, async (req, res) => {
  try {
    const user = await db.findUser({ walletAddress: req.user.walletAddress });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.lpdaoStatus === 'member') {
      return res.status(400).json({ message: "Already an active LPDAO Member." });
    }

    // Cost to join is 100 USDT (Simulated)
    const cost = 100;
    if (user.usdtBalance < cost) {
      return res.status(400).json({ message: "Insufficient USDT balance. LPDAO Membership requires 100 USDT." });
    }

    // Deduct usdt and toggle status
    const updatedUsdt = user.usdtBalance - cost;
    await db.updateUser(user.walletAddress, {
      usdtBalance: updatedUsdt,
      lpdaoStatus: "member"
    });

    await db.createTransaction({
      walletAddress: user.walletAddress,
      type: "buy", // Register the fee
      amount: cost,
      netAmount: cost,
      status: "success"
    });

    res.json({
      message: "Congratulations! You are now an official LPDAO Governance Member.",
      usdtBalance: updatedUsdt,
      lpdaoStatus: "member"
    });

  } catch (err) {
    res.status(500).json({ message: "Membership joining failed" });
  }
});

// Get proposals listing
router.get('/proposals', verifyToken, async (req, res) => {
  try {
    const list = await db.findProposals();
    res.json({ proposals: list });
  } catch (err) {
    res.status(500).json({ message: "Error listing governance proposals" });
  }
});

// Vote on proposal
router.post('/proposals/:id/vote', verifyToken, async (req, res) => {
  try {
    const { voteType } = req.body; // 'approve' | 'reject'
    const proposalId = req.params.id;

    if (!['approve', 'reject'].includes(voteType)) {
      return res.status(400).json({ message: "Invalid vote type. Use approve or reject." });
    }

    const user = await db.findUser({ walletAddress: req.user.walletAddress });
    if (!user) return res.status(404).json({ message: "User not found." });

    if (user.lpdaoStatus !== 'member') {
      return res.status(400).json({ message: "Only active LPDAO members can vote on proposals." });
    }

    const proposals = await db.findProposals({ id: proposalId });
    if (proposals.length === 0) {
      return res.status(404).json({ message: "Proposal not found." });
    }
    const proposal = proposals[0];

    // Check if already voted
    const votedApprove = proposal.votes.approve.includes(user.walletAddress);
    const votedReject = proposal.votes.reject.includes(user.walletAddress);

    if (votedApprove || votedReject) {
      return res.status(400).json({ message: "You have already cast a vote on this proposal." });
    }

    // Add vote and recalculate totals
    const votes = { ...proposal.votes };
    votes[voteType].push(user.walletAddress);
    const totalVotes = votes.approve.length + votes.reject.length;

    await db.updateProposal(proposalId, {
      votes,
      totalVotes
    });

    res.json({
      message: "Vote cast successfully!",
      votes,
      totalVotes
    });

  } catch (err) {
    console.error("Voting failed:", err);
    res.status(500).json({ message: "Error registering governance vote." });
  }
});

// Get voting history of current user
router.get('/voting-history', verifyToken, async (req, res) => {
  try {
    const proposals = await db.findProposals();
    const history = [];

    proposals.forEach(p => {
      if (p.votes.approve.includes(req.user.walletAddress.toLowerCase())) {
        history.push({
          proposal: p.title,
          vote: "Approve",
          date: p.date
        });
      } else if (p.votes.reject.includes(req.user.walletAddress.toLowerCase())) {
        history.push({
          proposal: p.title,
          vote: "Reject",
          date: p.date
        });
      }
    });

    res.json({ history });
  } catch (err) {
    res.status(500).json({ message: "Error loading voting log." });
  }
});

export default router;
