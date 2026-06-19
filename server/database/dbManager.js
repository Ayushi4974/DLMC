import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'db.json');

// Initialize local JSON database defaults if file doesn't exist
const initLocalDB = () => {
  if (!fs.existsSync(DB_FILE)) {
    const defaultData = {
      users: [
        {
          id: "admin-1",
          username: "admin",
          email: "admin@dlmc.io",
          password: "$2a$10$DVO7SOrubvH.haO/RE7YD.y9/Ux5iTIgxiT1qjy/xULQQB5alW8Ki", // bcrypt for "password123"
          walletAddress: "0x0000000000000000000000000000000000000000",
          role: "admin",
          status: "active",
          joinDate: new Date().toISOString(),
          kycStatus: "verified",
          lpdaoStatus: "member",
          dlmcBalance: 1000000,
          usdtBalance: 50000,
          totalStaked: 0,
          totalClaimed: 0,
          referralEarnings: 0,
          levelEarnings: 0,
          boosterEarnings: 0,
          salaryEarnings: 0,
          currentRank: "D15",
          dailySalary: 500,
          selfStake: 50000,
          mainLegVolume: 0,
          otherLegVolume: 0
        }
      ],
      stakes: [],
      transactions: [],
      tickets: [],
      proposals: [
        {
          id: "prop-1",
          title: "Enable DLMC Staking Rewards Boost",
          description: "This proposal aims to increase the base daily Staking ROI from 0.5% to 0.65% for user accounts staking more than 10,000 USDT worth of DLMC.",
          creator: "0x0000000000000000000000000000000000000000",
          status: "active",
          votes: { approve: [], reject: [] },
          totalVotes: 0,
          endDate: new Date(Date.now() + 86400000 * 7).toISOString(),
          date: new Date().toISOString()
        },
        {
          id: "prop-2",
          title: "Launch LPDAO Liquidity Allocation",
          description: "Allocate 15% of the accumulated stability fees to the Uniswap liquidity pool to stabilize the DLMC token exchange price.",
          creator: "0x0000000000000000000000000000000000000000",
          status: "passed",
          votes: { approve: ["0x0000000000000000000000000000000000000000"], reject: [] },
          totalVotes: 1,
          endDate: new Date(Date.now() - 86400000).toISOString(),
          date: new Date(Date.now() - 86400000 * 10).toISOString()
        }
      ],
      cmsConfig: {
        tokenPrice: 1.25,
        buyFeePercent: 5,
        sellFeePercent: 10,
        stabilityFeePercent: 3,
        lpdaoFeePercent: 2,
        stakingRoiPercent: 0.5,
        withdrawalFeePercent: 2,
        minStakeAmount: 100,
        totalMintSupply: 10000000,
        totalBurnSupply: 250000,
        totalUsdtInSystem: 1250000
      }
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2));
  }
};

initLocalDB();

// Dynamic Adapter class that acts as the backend DB layer
class DatabaseManager {
  constructor() {
    this.useMongo = false;
    this.mongoConnected = false;
  }

  async connect(uri) {
    if (!uri) {
      console.log("No MONGODB_URI provided. Falling back to local file database: " + DB_FILE);
      this.useMongo = false;
      return;
    }
    try {
      await mongoose.connect(uri);
      this.useMongo = true;
      this.mongoConnected = true;
      console.log("Connected to MongoDB successfully!");
    } catch (err) {
      console.error("MongoDB connection failed! Falling back to local file database: " + DB_FILE, err.message);
      this.useMongo = false;
    }
  }

  // Local File Helper Functions
  _readLocal() {
    initLocalDB();
    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(content);
    } catch (e) {
      console.error("Failed to read JSON DB", e);
      return { users: [], stakes: [], transactions: [], tickets: [], proposals: [], cmsConfig: {} };
    }
  }

  _writeLocal(data) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    } catch (e) {
      console.error("Failed to write JSON DB", e);
    }
  }

  // Core API Methods

  // CMS Parameters
  async getCMS() {
    if (this.useMongo) {
      // In Mongo mode, query dynamic collection
      const CMS = mongoose.model('CMS', new mongoose.Schema({}, { strict: false }), 'cms');
      let config = await CMS.findOne();
      if (!config) {
        config = await CMS.create(this._readLocal().cmsConfig);
      }
      return config.toObject();
    } else {
      const db = this._readLocal();
      return db.cmsConfig;
    }
  }

  async updateCMS(updates) {
    if (this.useMongo) {
      const CMS = mongoose.model('CMS', new mongoose.Schema({}, { strict: false }), 'cms');
      return await CMS.findOneAndUpdate({}, { $set: updates }, { new: true, upsert: true });
    } else {
      const db = this._readLocal();
      db.cmsConfig = { ...db.cmsConfig, ...updates };
      this._writeLocal(db);
      return db.cmsConfig;
    }
  }

  // Users
  async findUser(query) {
    if (this.useMongo) {
      const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
      const user = await User.findOne(query);
      return user ? user.toObject() : null;
    } else {
      const db = this._readLocal();
      return db.users.find(u => {
        return Object.keys(query).every(key => {
          if (typeof query[key] === 'string' && typeof u[key] === 'string') {
            return u[key].toLowerCase() === query[key].toLowerCase();
          }
          return u[key] === query[key];
        });
      }) || null;
    }
  }

  async getUsers() {
    if (this.useMongo) {
      const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
      const list = await User.find({});
      return list.map(u => u.toObject());
    } else {
      return this._readLocal().users;
    }
  }

  async createUser(userData) {
    const newUser = {
      id: "usr-" + Math.random().toString(36).substr(2, 9),
      username: userData.username,
      email: userData.email || "",
      password: userData.password || "",
      walletAddress: userData.walletAddress.toLowerCase(),
      role: userData.role || "user",
      status: "active",
      referrer: userData.referrer || "",
      directs: [],
      teamSide: userData.teamSide || "",
      leftChild: "",
      rightChild: "",
      joinDate: new Date().toISOString(),
      kycStatus: "unverified",
      lpdaoStatus: "none",
      dlmcBalance: 0,
      usdtBalance: 10000, // Preload with $10,000 for local testing and UX simulation
      totalStaked: 0,
      totalClaimed: 0,
      referralEarnings: 0,
      levelEarnings: 0,
      boosterEarnings: 0,
      salaryEarnings: 0,
      currentRank: "D0",
      dailySalary: 0,
      selfStake: 0,
      mainLegVolume: 0,
      otherLegVolume: 0
    };

    if (this.useMongo) {
      const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
      const userObj = await User.create(newUser);
      return userObj.toObject();
    } else {
      const db = this._readLocal();
      // Handle referral assignments in localized file database
      if (newUser.referrer) {
        const referrerUser = db.users.find(u => 
          u.walletAddress.toLowerCase() === newUser.referrer.toLowerCase() ||
          u.username.toLowerCase() === newUser.referrer.toLowerCase()
        );
        if (referrerUser) {
          referrerUser.directs.push(newUser.walletAddress);
          
          // Place inside team network binary tree if space available
          if (!referrerUser.leftChild) {
            referrerUser.leftChild = newUser.walletAddress;
            newUser.teamSide = "left";
          } else if (!referrerUser.rightChild) {
            referrerUser.rightChild = newUser.walletAddress;
            newUser.teamSide = "right";
          } else {
            // Traverse down tree to place binary node
            let queue = [referrerUser];
            let placed = false;
            while (queue.length > 0 && !placed) {
              let current = queue.shift();
              let leftNode = db.users.find(u => u.walletAddress === current.leftChild);
              let rightNode = db.users.find(u => u.walletAddress === current.rightChild);
              
              if (leftNode) {
                if (!leftNode.leftChild) {
                  leftNode.leftChild = newUser.walletAddress;
                  newUser.teamSide = "left";
                  placed = true;
                } else if (!leftNode.rightChild) {
                  leftNode.rightChild = newUser.walletAddress;
                  newUser.teamSide = "right";
                  placed = true;
                } else {
                  queue.push(leftNode);
                }
              }
              if (!placed && rightNode) {
                if (!rightNode.leftChild) {
                  rightNode.leftChild = newUser.walletAddress;
                  newUser.teamSide = "left";
                  placed = true;
                } else if (!rightNode.rightChild) {
                  rightNode.rightChild = newUser.walletAddress;
                  newUser.teamSide = "right";
                  placed = true;
                } else {
                  queue.push(rightNode);
                }
              }
            }
          }
        }
      }

      db.users.push(newUser);
      this._writeLocal(db);
      return newUser;
    }
  }

  async updateUser(walletAddress, updates) {
    const addr = walletAddress.toLowerCase();
    if (this.useMongo) {
      const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
      const user = await User.findOneAndUpdate({ walletAddress: addr }, { $set: updates }, { new: true });
      return user ? user.toObject() : null;
    } else {
      const db = this._readLocal();
      const userIndex = db.users.findIndex(u => u.walletAddress === addr);
      if (userIndex !== -1) {
        db.users[userIndex] = { ...db.users[userIndex], ...updates };
        this._writeLocal(db);
        return db.users[userIndex];
      }
      return null;
    }
  }

  // Stakes
  async createStake(stakeData) {
    const newStake = {
      id: "stk-" + Math.random().toString(36).substr(2, 9),
      walletAddress: stakeData.walletAddress.toLowerCase(),
      amount: Number(stakeData.amount),
      roiPercent: Number(stakeData.roiPercent || 0.5),
      dailyDividend: Number((stakeData.amount * (stakeData.roiPercent || 0.5) / 100).toFixed(4)),
      status: "active",
      startDate: new Date().toISOString(),
      lastDividendClaimDate: new Date().toISOString()
    };

    if (this.useMongo) {
      const Stake = mongoose.model('Stake', new mongoose.Schema({}, { strict: false }));
      const stkObj = await Stake.create(newStake);
      return stkObj.toObject();
    } else {
      const db = this._readLocal();
      db.stakes.push(newStake);
      
      // Update User volumes & stats
      const user = db.users.find(u => u.walletAddress === newStake.walletAddress);
      if (user) {
        user.totalStaked += newStake.amount;
        user.selfStake += newStake.amount;
        user.usdtBalance -= newStake.amount;
        
        // Propagate business volume to uplines (15 levels max)
        let upline = user.referrer;
        let currentChild = user.walletAddress;
        let level = 1;
        while (upline && level <= 15) {
          const upUser = db.users.find(u => u.walletAddress === upline.toLowerCase() || u.username === upline.toLowerCase());
          if (upUser) {
            if (upUser.leftChild === currentChild) {
              upUser.mainLegVolume += newStake.amount;
            } else {
              upUser.otherLegVolume += newStake.amount;
            }
            // Add level-income calculation triggers here or in claims
            currentChild = upUser.walletAddress;
            upline = upUser.referrer;
            level++;
          } else {
            break;
          }
        }
      }
      this._writeLocal(db);
      return newStake;
    }
  }

  async findStakes(query) {
    if (this.useMongo) {
      const Stake = mongoose.model('Stake', new mongoose.Schema({}, { strict: false }));
      const list = await Stake.find(query);
      return list.map(s => s.toObject());
    } else {
      const db = this._readLocal();
      return db.stakes.filter(s => {
        return Object.keys(query).every(key => s[key] === query[key]);
      });
    }
  }

  // Transactions
  async createTransaction(txData) {
    const newTx = {
      id: "tx-" + Math.random().toString(36).substr(2, 9),
      walletAddress: txData.walletAddress.toLowerCase(),
      type: txData.type, // 'deposit' | 'withdrawal' | 'buy' | 'sell' | 'claim'
      amount: Number(txData.amount),
      fee: Number(txData.fee || 0),
      netAmount: Number(txData.netAmount),
      tokenPrice: Number(txData.tokenPrice || 0),
      hash: txData.hash || "0x" + Math.random().toString(16).substr(2, 32) + Math.random().toString(16).substr(2, 32),
      date: new Date().toISOString(),
      status: txData.status || "success"
    };

    if (this.useMongo) {
      const Transaction = mongoose.model('Transaction', new mongoose.Schema({}, { strict: false }));
      const txObj = await Transaction.create(newTx);
      return txObj.toObject();
    } else {
      const db = this._readLocal();
      db.transactions.push(newTx);
      this._writeLocal(db);
      return newTx;
    }
  }

  async findTransactions(query) {
    if (this.useMongo) {
      const Transaction = mongoose.model('Transaction', new mongoose.Schema({}, { strict: false }));
      const list = await Transaction.find(query).sort({ date: -1 });
      return list.map(t => t.toObject());
    } else {
      const db = this._readLocal();
      let list = db.transactions.filter(t => {
        return Object.keys(query).every(key => {
          if (typeof query[key] === 'string' && typeof t[key] === 'string') {
            return t[key].toLowerCase() === query[key].toLowerCase();
          }
          return t[key] === query[key];
        });
      });
      return list.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
  }

  // Support Tickets
  async createTicket(ticketData) {
    const newTicket = {
      id: "tkt-" + Math.random().toString(36).substr(2, 6).toUpperCase(),
      walletAddress: ticketData.walletAddress.toLowerCase(),
      subject: ticketData.subject,
      category: ticketData.category,
      priority: ticketData.priority,
      status: "open",
      messages: [
        {
          sender: "user",
          content: ticketData.message,
          date: new Date().toISOString()
        }
      ],
      date: new Date().toISOString()
    };

    if (this.useMongo) {
      const Ticket = mongoose.model('Ticket', new mongoose.Schema({}, { strict: false }));
      const ticketObj = await Ticket.create(newTicket);
      return ticketObj.toObject();
    } else {
      const db = this._readLocal();
      db.tickets.push(newTicket);
      this._writeLocal(db);
      return newTicket;
    }
  }

  async findTickets(query) {
    if (this.useMongo) {
      const Ticket = mongoose.model('Ticket', new mongoose.Schema({}, { strict: false }));
      const list = await Ticket.find(query).sort({ date: -1 });
      return list.map(t => t.toObject());
    } else {
      const db = this._readLocal();
      return db.tickets.filter(t => {
        return Object.keys(query).every(key => {
          if (typeof query[key] === 'string' && typeof t[key] === 'string') {
            return t[key].toLowerCase() === query[key].toLowerCase();
          }
          return t[key] === query[key];
        });
      }).sort((a, b) => new Date(b.date) - new Date(a.date));
    }
  }

  async updateTicket(ticketId, updates) {
    if (this.useMongo) {
      const Ticket = mongoose.model('Ticket', new mongoose.Schema({}, { strict: false }));
      const ticketObj = await Ticket.findOneAndUpdate({ id: ticketId }, { $set: updates }, { new: true });
      return ticketObj ? ticketObj.toObject() : null;
    } else {
      const db = this._readLocal();
      const ticketIndex = db.tickets.findIndex(t => t.id === ticketId);
      if (ticketIndex !== -1) {
        db.tickets[ticketIndex] = { ...db.tickets[ticketIndex], ...updates };
        this._writeLocal(db);
        return db.tickets[ticketIndex];
      }
      return null;
    }
  }

  // Governance Proposals
  async createProposal(propData) {
    const newProp = {
      id: "prop-" + Math.random().toString(36).substr(2, 9),
      title: propData.title,
      description: propData.description,
      creator: propData.creator.toLowerCase(),
      status: "active",
      votes: { approve: [], reject: [] },
      totalVotes: 0,
      endDate: new Date(Date.now() + 86400000 * Number(propData.durationDays || 7)).toISOString(),
      date: new Date().toISOString()
    };

    if (this.useMongo) {
      const Proposal = mongoose.model('Proposal', new mongoose.Schema({}, { strict: false }));
      const propObj = await Proposal.create(newProp);
      return propObj.toObject();
    } else {
      const db = this._readLocal();
      db.proposals.push(newProp);
      this._writeLocal(db);
      return newProp;
    }
  }

  async findProposals(query = {}) {
    if (this.useMongo) {
      const Proposal = mongoose.model('Proposal', new mongoose.Schema({}, { strict: false }));
      const list = await Proposal.find(query).sort({ date: -1 });
      return list.map(p => p.toObject());
    } else {
      const db = this._readLocal();
      return db.proposals.filter(p => {
        return Object.keys(query).every(key => p[key] === query[key]);
      }).sort((a, b) => new Date(b.date) - new Date(a.date));
    }
  }

  async updateProposal(proposalId, updates) {
    if (this.useMongo) {
      const Proposal = mongoose.model('Proposal', new mongoose.Schema({}, { strict: false }));
      const propObj = await Proposal.findOneAndUpdate({ id: proposalId }, { $set: updates }, { new: true });
      return propObj ? propObj.toObject() : null;
    } else {
      const db = this._readLocal();
      const index = db.proposals.findIndex(p => p.id === proposalId);
      if (index !== -1) {
        db.proposals[index] = { ...db.proposals[index], ...updates };
        this._writeLocal(db);
        return db.proposals[index];
      }
      return null;
    }
  }
}

const db = new DatabaseManager();
export default db;
