import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import User from '../models/User.js';

const router = Router();

/* -------------------------------------------------------------
 * Lightweight signed session tokens (HMAC-SHA256, no extra deps)
 * Format: base64url(payloadJSON).base64url(signature)
 * ----------------------------------------------------------- */
const TOKEN_SECRET =
  process.env.AUTH_SECRET || 'chologhuri-dev-secret-change-me-in-production';
const TOKEN_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

const b64url = (input: Buffer | string) =>
  Buffer.from(input).toString('base64url');

const sign = (payload: string) =>
  crypto.createHmac('sha256', TOKEN_SECRET).update(payload).digest('base64url');

export const createToken = (userId: string) => {
  const payload = b64url(JSON.stringify({ sub: userId, exp: Date.now() + TOKEN_TTL_MS }));
  return `${payload}.${sign(payload)}`;
};

export const verifyToken = (token?: string): string | null => {
  if (!token) return null;
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return null;
  const expected = sign(payload);
  if (
    expected.length !== signature.length ||
    !crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
  ) {
    return null;
  }
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (!data.sub || !data.exp || Date.now() > data.exp) return null;
    return String(data.sub);
  } catch {
    return null;
  }
};

export interface AuthedRequest extends Request {
  userId?: string;
}

/* Express middleware: rejects requests without a valid Bearer token */
export const requireAuth = (req: AuthedRequest, res: Response, next: NextFunction) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : undefined;
  const userId = verifyToken(token);
  if (!userId) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }
  req.userId = userId;
  next();
};

const publicUser = (user: any) => ({
  id: String(user._id),
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  avatar: user.avatar || '',
});

/*
 * REGISTER
 * POST /api/auth/register
 */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email and password are required',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      phone: phone || '',
      role: role || 'Solo Travelers',
    });

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token: createToken(String(user._id)),
      user: publicUser(user),
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while creating account',
    });
  }
});

/*
 * LOGIN
 * POST /api/auth/login
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token: createToken(String(user._id)),
      user: publicUser(user),
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Server error while logging in' });
  }
});

/*
 * CURRENT SESSION
 * GET /api/auth/me  (validates a stored token on page reload)
 */
router.get('/me', requireAuth, async (req: AuthedRequest, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Session expired' });
    }
    return res.json({ success: true, user: publicUser(user) });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

/*
 * UPDATE PROFILE
 * PUT /api/auth/profile
 */
router.put('/profile', requireAuth, async (req: AuthedRequest, res) => {
  try {
    const { name, phone, avatar } = req.body;
    const update: Record<string, string> = {};
    if (typeof name === 'string' && name.trim()) update.name = name.trim();
    if (typeof phone === 'string') update.phone = phone;
    if (typeof avatar === 'string') update.avatar = avatar;

    const user = await User.findByIdAndUpdate(req.userId, update, { new: true });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return res.json({ success: true, message: 'Profile updated', user: publicUser(user) });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error while updating profile' });
  }
});

export default router;
