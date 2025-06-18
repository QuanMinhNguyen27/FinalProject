"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const auth_1 = require("../controllers/auth");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
// Get all users route
router.get('/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
                // Excluding password for security
            }
        });
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
}));
// Test route
router.get('/test', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json({ message: 'Auth route is working!' });
}));
// Register route
router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, name } = req.body;
        const user = yield prisma.user.create({
            data: {
                email,
                password, // Note: In production, you should hash this password
                name
            }
        });
        res.json({ message: 'User created successfully', user });
    }
    catch (error) {
        res.status(400).json({ error: 'Failed to create user' });
    }
}));
// Login route
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield prisma.user.findUnique({
            where: { email }
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Note: In production, you should compare hashed passwords
        if (user.password !== password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        res.json({ message: 'Login successful', user });
    }
    catch (error) {
        res.status(400).json({ error: 'Login failed' });
    }
}));
router.get('/me', auth_1.getMe);
exports.default = router;
