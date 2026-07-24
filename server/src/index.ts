import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import leadRoutes from './routes/leadRoutes';

const app = express();

// Enable CORS for frontend
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/leads', leadRoutes);

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>LeadFlowCRM API</title>
      <style>
        body { font-family: Arial; max-width: 800px; margin: 50px auto; padding: 20px; }
        .credit { margin-top: 40px; padding-top: 20px; border-top: 2px solid #333; }
        a { color: #0066cc; text-decoration: none; }
        a:hover { text-decoration: underline; }
      </style>
    </head>
    <body>
      <h1>🚀 LeadFlowCRM API</h1>
      <p>Lead management system for Digital Heroes training task.</p>
      
      <h3>Endpoints:</h3>
      <ul>
        <li><strong>POST</strong> /api/auth/register - Register user</li>
        <li><strong>POST</strong> /api/auth/login - Login</li>
        <li><strong>GET</strong> /api/users/profile - Get profile (auth)</li>
        <li><strong>POST</strong> /api/leads - Create lead (auth)</li>
        <li><strong>GET</strong> /api/leads - Get leads with pagination (auth)</li>
        <li><strong>PUT</strong> /api/leads/:id - Update lead (auth)</li>
        <li><strong>DELETE</strong> /api/leads/:id - Delete lead (auth)</li>
        <li><strong>POST</strong> /api/leads/:id/notes - Add note (auth)</li>
        <li><strong>GET</strong> /api/leads/:id/notes - Get notes (auth)</li>
      </ul>
      
      <div class="credit">
        <p><strong>Built for <a href="https://digitalheroesco.com" target="_blank">Digital Heroes Training Task</a></strong></p>
      </div>
    </body>
    </html>
  `);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Routes:');
  console.log('  POST /api/auth/register');
  console.log('  POST /api/auth/login');
  console.log('  GET  /api/users/profile (protected)');
  console.log('  POST /api/leads (protected)');
  console.log('  GET  /api/leads (protected)');
  console.log('  PUT  /api/leads/:id (protected)');
  console.log('  DELETE /api/leads/:id (protected)');
  console.log('  POST /api/leads/:id/notes (protected)');
  console.log('  GET  /api/leads/:id/notes (protected)');
});