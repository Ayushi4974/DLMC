import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../database/dbManager.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dlmc_secret_key_9918';

// JWT verification middleware
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: "Access denied. No token provided." });
  
  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: "Access denied. Invalid token format." });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid or expired token." });
  }
};

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, walletAddress, referrer } = req.body;

    if (!username || !walletAddress) {
      return res.status(400).json({ message: "Username and Wallet Address are required." });
    }

    const cleanWallet = walletAddress.toLowerCase();

    // Check if wallet or username already exists
    const existingWallet = await db.findUser({ walletAddress: cleanWallet });
    if (existingWallet) {
      return res.status(400).json({ message: "Wallet address is already registered." });
    }

    const existingUser = await db.findUser({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username is already taken." });
    }

    // Encrypt password if present, otherwise set mock password
    const hashedPassword = await bcrypt.hash(password || "password123", 10);

    const user = await db.createUser({
      username,
      email: email || `${username}@dlmc.io`,
      password: hashedPassword,
      walletAddress: cleanWallet,
      referrer: referrer || "",
      role: "user"
    });

    const token = jwt.sign(
      { id: user.id, username: user.username, walletAddress: user.walletAddress, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        username: user.username,
        email: user.email,
        walletAddress: user.walletAddress,
        role: user.role,
        kycStatus: user.kycStatus,
        lpdaoStatus: user.lpdaoStatus,
        usdtBalance: user.usdtBalance,
        dlmcBalance: user.dlmcBalance,
        referrer: user.referrer,
        referralCode: user.referralCode
      }
    });

  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: "Internal server error during registration." });
  }
});

// Login — accepts username, referralCode, or email
router.post('/login', async (req, res) => {
  try {
    const { username, password, referrer } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Login ID and password are required." });
    }

    // Try to find user by username first, then referralCode, then email
    let user = await db.findUser({ username });
    if (!user) user = await db.findUser({ referralCode: username });
    if (!user) user = await db.findUser({ email: username });

    // If user does not exist, automatically register on the fly
    if (!user) {
      let finalUsername = username.trim();
      let finalEmail = `${finalUsername}@dlmc.io`;
      if (finalUsername.includes('@')) {
        finalEmail = finalUsername;
        finalUsername = finalUsername.split('@')[0];
      }

      // Sanitize username to contain only alphanumeric & underscore characters
      finalUsername = finalUsername.replace(/[^a-zA-Z0-9_]/g, '');
      if (!finalUsername) {
        finalUsername = 'user_' + Math.random().toString(36).substr(2, 6);
      }

      // Ensure unique username in case of collisions
      let checkUsername = finalUsername;
      let count = 0;
      while (await db.findUser({ username: checkUsername })) {
        count++;
        checkUsername = `${finalUsername}_${count}`;
      }
      finalUsername = checkUsername;

      // Generate a mock wallet address
      const randomHex = Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join("");
      const walletAddress = `0x${randomHex}`;

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      user = await db.createUser({
        username: finalUsername,
        email: finalEmail,
        password: hashedPassword,
        walletAddress: walletAddress,
        referrer: referrer || "",
        role: "user"
      });
    }

    // Bypass strict password hash validation (any password matches)

    // Handle updating referrer on login if not already set
    if (referrer && !user.referrer) {
      const cleanReferrer = referrer.trim();
      const sponsor = await db.findUser({ walletAddress: cleanReferrer.toLowerCase() })
        || await db.findUser({ username: cleanReferrer })
        || await db.findUser({ referralCode: cleanReferrer });
        
      if (sponsor && sponsor.walletAddress.toLowerCase() !== user.walletAddress.toLowerCase()) {
        await db.updateUser(user.walletAddress, { referrer: sponsor.walletAddress });
        user.referrer = sponsor.walletAddress;

        // Add to sponsor's directs
        const directsList = sponsor.directs || [];
        if (!directsList.includes(user.walletAddress)) {
          directsList.push(user.walletAddress);
          await db.updateUser(sponsor.walletAddress, { directs: directsList });
        }
      }
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, walletAddress: user.walletAddress, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        username: user.username,
        email: user.email,
        walletAddress: user.walletAddress,
        role: user.role,
        kycStatus: user.kycStatus,
        lpdaoStatus: user.lpdaoStatus,
        usdtBalance: user.usdtBalance,
        dlmcBalance: user.dlmcBalance,
        referrer: user.referrer,
        referralCode: user.referralCode
      }
    });

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Internal server error during login." });
  }
});

// Wallet Connect Sign-in or Register on the fly
router.post('/wallet-login', async (req, res) => {
  try {
    const { walletAddress } = req.body;
    if (!walletAddress) {
      return res.status(400).json({ message: "Wallet address is required." });
    }

    const cleanWallet = walletAddress.toLowerCase();
    let user = await db.findUser({ walletAddress: cleanWallet });

    // If user doesn't exist, create a profile automatically (Simulating Web3 registration on first connect)
    if (!user) {
      const uniqueUsername = "user_" + cleanWallet.substring(2, 8);
      const hashedPassword = await bcrypt.hash("password123", 10);
      user = await db.createUser({
        username: uniqueUsername,
        email: `${uniqueUsername}@dlmc.io`,
        password: hashedPassword,
        walletAddress: cleanWallet,
        referrer: "",
        role: "user"
      });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, walletAddress: user.walletAddress, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: "Wallet connection authenticated",
      token,
      user: {
        username: user.username,
        email: user.email,
        walletAddress: user.walletAddress,
        role: user.role,
        kycStatus: user.kycStatus,
        lpdaoStatus: user.lpdaoStatus,
        usdtBalance: user.usdtBalance,
        dlmcBalance: user.dlmcBalance,
        referrer: user.referrer
      }
    });

  } catch (err) {
    console.error("Wallet Login Error:", err);
    res.status(500).json({ message: "Internal server error during wallet auth." });
  }
});

// Get Current Profile details
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await db.findUser({ walletAddress: req.user.walletAddress });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Omit sensitive password
    const { password, ...safeUser } = user;
    res.json({ user: safeUser });
  } catch (err) {
    res.status(500).json({ message: "Error fetching profile" });
  }
});

// Update Profile settings
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const { username, email, kycStatus, lpdaoStatus } = req.body;
    const updates = {};
    
    if (username) {
      const cleanUsername = username.trim();
      if (cleanUsername.length < 3) {
        return res.status(400).json({ message: "Username must be at least 3 characters long." });
      }
      // Check if username is already taken by another user
      const existingUser = await db.findUser({ username: cleanUsername });
      if (existingUser && existingUser.walletAddress.toLowerCase() !== req.user.walletAddress.toLowerCase()) {
        return res.status(400).json({ message: "Username is already taken." });
      }
      updates.username = cleanUsername;
    }

    if (email) updates.email = email;
    if (kycStatus) updates.kycStatus = kycStatus;
    if (lpdaoStatus) updates.lpdaoStatus = lpdaoStatus;

    const user = await db.updateUser(req.user.walletAddress, updates);
    res.json({ message: "Profile updated successfully", user });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ message: "Error updating profile" });
  }
});

export default router;
