const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = 8000;

// Admin credentials (in production, store these securely)
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'salon123' // Change this to a secure password
};

// Store active admin sessions
const adminSessions = new Map();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.'));

// Initialize SQLite database
const db = new sqlite3.Database('salon.db');

// Create appointments table
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS appointments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT NOT NULL,
            service TEXT NOT NULL,
            date TEXT NOT NULL,
            time TEXT NOT NULL,
            status TEXT DEFAULT 'pending',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
});

// Generate session token
function generateToken() {
    return crypto.randomBytes(32).toString('hex');
}

// Middleware to verify admin authentication
function verifyAdminAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
    }
    
    const token = authHeader.substring(7);
    
    if (!adminSessions.has(token)) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
    
    // Check if token is expired (24 hours)
    const session = adminSessions.get(token);
    if (Date.now() - session.createdAt > 24 * 60 * 60 * 1000) {
        adminSessions.delete(token);
        return res.status(401).json({ error: 'Token expired' });
    }
    
    next();
}

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Admin login endpoint
app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        const token = generateToken();
        adminSessions.set(token, {
            username: username,
            createdAt: Date.now()
        });
        
        res.json({ 
            success: true, 
            token: token,
            message: 'Login successful' 
        });
    } else {
        res.status(401).json({ 
            success: false, 
            message: 'Invalid credentials' 
        });
    }
});

// Admin logout endpoint
app.post('/api/admin/logout', verifyAdminAuth, (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader.substring(7);
    
    adminSessions.delete(token);
    res.json({ success: true, message: 'Logged out successfully' });
});

// Protected admin routes
app.get('/api/appointments', verifyAdminAuth, (req, res) => {
    db.all('SELECT * FROM appointments ORDER BY created_at DESC', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        
        const appointments = rows.map(row => ({
            id: row.id,
            name: row.name,
            email: row.email,
            phone: row.phone,
            service: row.service,
            date: row.date,
            time: row.time,
            status: row.status,
            created_at: row.created_at
        }));
        
        res.json(appointments);
    });
});

app.post('/api/confirm', verifyAdminAuth, (req, res) => {
    const { id } = req.body;
    
    db.run('UPDATE appointments SET status = ? WHERE id = ?', ['confirmed', id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ success: true });
    });
});

app.post('/api/reject', verifyAdminAuth, (req, res) => {
    const { id } = req.body;
    
    db.run('UPDATE appointments SET status = ? WHERE id = ?', ['rejected', id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ success: true });
    });
});

// Public booking endpoint (no authentication required)
app.post('/api/book', (req, res) => {
    const { name, email, phone, service, date, time } = req.body;
    
    db.run(
        'INSERT INTO appointments (name, email, phone, service, date, time) VALUES (?, ?, ?, ?, ?, ?)',
        [name, email, phone, service, date, time],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ success: true, message: 'Appointment booked successfully!' });
        }
    );
});

// Clean up expired sessions every hour
setInterval(() => {
    const now = Date.now();
    for (const [token, session] of adminSessions.entries()) {
        if (now - session.createdAt > 24 * 60 * 60 * 1000) {
            adminSessions.delete(token);
        }
    }
}, 60 * 60 * 1000);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Admin credentials:');
    console.log('Username: admin');
    console.log('Password: salon123');
});