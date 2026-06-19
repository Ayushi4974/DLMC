import express from 'express';
import db from '../database/dbManager.js';
import { verifyToken } from './auth.js';

const router = express.Router();

// Middleware to secure admin endpoints
const verifyAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: "Forbidden. Admin access required." });
  }
};

// Apply security to all routes below
router.use(verifyToken, verifyAdmin);

// Get Global Admin Stats
router.get('/stats', async (req, res) => {
  try {
    const users = await db.getUsers();
    const cms = await db.getCMS();
    const allStakes = await db.findStakes({});
    const allTxs = await db.findTransactions({});
    const tickets = await db.findTickets({});

    const totalStaked = users.reduce((sum, u) => sum + (u.totalStaked || 0), 0);
    const totalCirculatingDlmc = users.reduce((sum, u) => sum + (u.dlmcBalance || 0), 0);
    const totalClaimed = users.reduce((sum, u) => sum + (u.totalClaimed || 0), 0);
    const totalUSDT = users.reduce((sum, u) => sum + (u.usdtBalance || 0), 0);

    res.json({
      metrics: {
        totalUsers: users.length,
        totalStaked,
        totalCirculatingDlmc,
        totalClaimed,
        totalUSDT,
        openTickets: tickets.filter(t => t.status === 'open').length,
        totalProposals: (await db.findProposals()).length
      },
      cms,
      recentTransactions: allTxs.slice(0, 10),
      recentTickets: tickets.slice(0, 5)
    });
  } catch (err) {
    console.error("Admin stats failed:", err);
    res.status(500).json({ message: "Failed to compile admin stats report" });
  }
});

// Get Users List
router.get('/users', async (req, res) => {
  try {
    const list = await db.getUsers();
    res.json({ users: list });
  } catch (err) {
    res.status(500).json({ message: "Error listing users" });
  }
});

// Update User details manually (for admin overrides)
router.put('/users/:walletAddress', async (req, res) => {
  try {
    const addr = req.params.walletAddress;
    const updates = req.body; // e.g. { dlmcBalance, usdtBalance, currentRank, kycStatus }
    
    // Whitelist editable fields
    const allowed = {};
    if ('dlmcBalance' in updates) allowed.dlmcBalance = Number(updates.dlmcBalance);
    if ('usdtBalance' in updates) allowed.usdtBalance = Number(updates.usdtBalance);
    if ('currentRank' in updates) allowed.currentRank = updates.currentRank;
    if ('kycStatus' in updates) allowed.kycStatus = updates.kycStatus;
    if ('role' in updates) allowed.role = updates.role;
    if ('lpdaoStatus' in updates) allowed.lpdaoStatus = updates.lpdaoStatus;

    const user = await db.updateUser(addr, allowed);
    if (!user) return res.status(404).json({ message: "User not found." });

    res.json({ message: "User parameters updated successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Failed to override user parameters." });
  }
});

// Update CMS Parameters
router.put('/cms', async (req, res) => {
  try {
    const updates = req.body;
    const cms = await db.updateCMS(updates);
    res.json({ message: "CMS Configuration updated successfully", cms });
  } catch (err) {
    res.status(500).json({ message: "Failed to update CMS parameters." });
  }
});

// Create proposal (admin)
router.post('/proposals', async (req, res) => {
  try {
    const { title, description, durationDays } = req.body;
    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required." });
    }

    const proposal = await db.createProposal({
      title,
      description,
      creator: req.user.walletAddress,
      durationDays: durationDays || 7
    });

    res.status(201).json({ message: "Governance Proposal launched!", proposal });
  } catch (err) {
    res.status(500).json({ message: "Failed to create proposal" });
  }
});

// Get all support tickets
router.get('/tickets', async (req, res) => {
  try {
    const list = await db.findTickets({});
    res.json({ tickets: list });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch tickets list" });
  }
});

// Reply to support ticket (admin)
router.post('/tickets/:id/reply', async (req, res) => {
  try {
    const { content } = req.body;
    const ticketId = req.params.id;

    if (!content) return res.status(400).json({ message: "Reply text is required." });

    const tickets = await db.findTickets({ id: ticketId });
    if (tickets.length === 0) return res.status(404).json({ message: "Ticket not found." });
    const ticket = tickets[0];

    const messages = [...ticket.messages];
    messages.push({
      sender: "admin",
      content,
      date: new Date().toISOString()
    });

    const updated = await db.updateTicket(ticketId, {
      messages,
      status: "replied"
    });

    res.json({ message: "Reply sent successfully", ticket: updated });

  } catch (err) {
    res.status(500).json({ message: "Failed to log ticket reply" });
  }
});

// Simulate distributing daily salary
router.post('/distribute-salaries', async (req, res) => {
  try {
    const users = await db.getUsers();
    
    // Rank salary rates table
    const rankSalaryMap = {
      "D0": 0, "D1": 5, "D2": 10, "D3": 15, "D4": 25, "D5": 40, "D6": 60, "D7": 85,
      "D8": 120, "D9": 160, "D10": 210, "D11": 270, "D12": 350, "D13": 450, "D14": 600, "D15": 800
    };

    let payoutCount = 0;
    let totalDistributed = 0;

    for (const u of users) {
      const rank = u.currentRank || "D0";
      const salary = rankSalaryMap[rank] || 0;
      
      if (salary > 0) {
        payoutCount++;
        totalDistributed += salary;
        
        const newSalaryEarnings = (u.salaryEarnings || 0) + salary;
        const newUsdt = (u.usdtBalance || 0) + salary;
        
        await db.updateUser(u.walletAddress, {
          salaryEarnings: newSalaryEarnings,
          usdtBalance: newUsdt
        });

        await db.createTransaction({
          walletAddress: u.walletAddress,
          type: "claim", // Pay directly into USDT
          amount: salary,
          netAmount: salary,
          status: "success",
          hash: "salary-" + Math.random().toString(36).substr(2, 9)
        });
      }
    }

    res.json({
      message: `Successfully distributed ${totalDistributed} USDT to ${payoutCount} users!`,
      totalDistributed,
      payoutCount
    });

  } catch (err) {
    console.error("Salary distribution simulation failed:", err);
    res.status(500).json({ message: "Failed to process salary payouts." });
  }
});

// Get all transactions (admin only)
router.get('/transactions', async (req, res) => {
  try {
    const list = await db.findTransactions({});
    res.json({ transactions: list });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch all transactions." });
  }
});

export default router;
