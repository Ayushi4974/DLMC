import express from 'express';
import db from '../database/dbManager.js';
import { verifyToken } from './auth.js';

const router = express.Router();

// Get tickets list
router.get('/tickets', verifyToken, async (req, res) => {
  try {
    const list = await db.findTickets({ walletAddress: req.user.walletAddress });
    res.json({ tickets: list });
  } catch (err) {
    res.status(500).json({ message: "Error listing tickets." });
  }
});

// Create ticket
router.post('/tickets', verifyToken, async (req, res) => {
  try {
    const { subject, category, priority, message } = req.body;
    if (!subject || !message) {
      return res.status(400).json({ message: "Subject and message content are required." });
    }

    const ticket = await db.createTicket({
      walletAddress: req.user.walletAddress,
      subject,
      category: category || "General",
      priority: priority || "Medium",
      message
    });

    res.status(201).json({ message: "Support ticket registered successfully!", ticket });

  } catch (err) {
    console.error("Ticket Create Error:", err);
    res.status(500).json({ message: "Failed to log support ticket." });
  }
});

// Reply to ticket (user side)
router.post('/tickets/:id/reply', verifyToken, async (req, res) => {
  try {
    const { content } = req.body;
    const ticketId = req.params.id;

    if (!content) return res.status(400).json({ message: "Message content required." });

    const tickets = await db.findTickets({ id: ticketId });
    if (tickets.length === 0) return res.status(404).json({ message: "Ticket not found." });
    const ticket = tickets[0];

    // Verify ownership
    if (ticket.walletAddress !== req.user.walletAddress.toLowerCase()) {
      return res.status(403).json({ message: "Unauthorized ticket access." });
    }

    const messages = [...ticket.messages];
    messages.push({
      sender: "user",
      content,
      date: new Date().toISOString()
    });

    const updated = await db.updateTicket(ticketId, {
      messages,
      status: "open" // reopen if closed/replied
    });

    res.json({ message: "Reply posted successfully", ticket: updated });

  } catch (err) {
    res.status(500).json({ message: "Failed to post ticket reply." });
  }
});

export default router;
