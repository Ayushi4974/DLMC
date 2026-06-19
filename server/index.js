import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './database/dbManager.js';

// Route Handlers
import authRouter from './routes/auth.js';
import dashboardRouter from './routes/dashboard.js';
import stakingRouter from './routes/staking.js';
import referralsRouter from './routes/referrals.js';
import lpdaoRouter from './routes/lpdao.js';
import supportRouter from './routes/support.js';
import adminRouter from './routes/admin.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || '';

// Middlewares
app.use(cors());
app.use(express.json());

// Routes Mounts
app.use('/api/auth', authRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/staking', stakingRouter);
app.use('/api/referrals', referralsRouter);
app.use('/api/lpdao', lpdaoRouter);
app.use('/api/support', supportRouter);
app.use('/api/admin', adminRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    databaseMode: db.useMongo ? 'MongoDB' : 'Local JSON file persistence'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandle Error Context:", err.stack);
  res.status(500).json({ message: "Something went wrong on the server." });
});

// Database Connect and Express Boot
const bootServer = async () => {
  try {
    await db.connect(MONGODB_URI);
    app.listen(PORT, () => {
      console.log(`=============================================`);
      console.log(`🚀 DLMC Backend running on port ${PORT}`);
      console.log(`🌐 Health check: http://localhost:${PORT}/health`);
      console.log(`=============================================`);
    });
  } catch (error) {
    console.error("Express boot startup crash:", error);
    process.exit(1);
  }
};

bootServer();
