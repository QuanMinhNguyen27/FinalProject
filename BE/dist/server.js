"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const auth_1 = __importDefault(require("./routes/auth"));
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
const port = 5000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
// Routes
app.use('/api/auth', auth_1.default);
// Serve the login page
app.get('/', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, 'public', 'index.html'));
});
// Serve the registration page
app.get('/register', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, 'public', 'register.html'));
});
// Serve the dashboard page
app.get('/dashboard', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, 'public', 'dashboard.html'));
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});
// Start server
const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`Access the login page at: http://localhost:${port}`);
    console.log(`Access the registration page at: http://localhost:${port}/register`);
    console.log(`Access the dashboard at: http://localhost:${port}/dashboard`);
}).on('error', (err) => {
    console.error('Server error:', err);
    process.exit(1);
});
