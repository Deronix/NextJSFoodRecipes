import { executeQuery } from '../db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const COOKIE_NAME = 'food_site_token';

export async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

export async function comparePasswords(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}

export async function createToken(user) {
  // Remove sensitive info
  const tokenData = {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role
  };
  
  return jwt.sign(tokenData, JWT_SECRET, {
    expiresIn: '7d'
  });
}

export function setAuthCookie(token) {
  cookies().set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production'
  });
}

export function removeAuthCookie() {
  cookies().delete(COOKIE_NAME);
}

export function getAuthToken() {
  return cookies().get(COOKIE_NAME)?.value;
}

export function decodeToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export async function getCurrentUser() {
  const token = getAuthToken();
  if (!token) return null;
  
  const decoded = decodeToken(token);
  if (!decoded) return null;
  
  const query = `
    SELECT id, username, email, role
    FROM users
    WHERE id = ?
    LIMIT 1
  `;
  
  try {
    const results = await executeQuery(query, [decoded.id]);
    return results[0] || null;
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
}

export async function register(username, email, password) {
  const hashedPassword = await hashPassword(password);
  
  const query = `
    INSERT INTO users (username, email, password_hash, role)
    VALUES (?, ?, ?, 'user')
  `;
  
  try {
    const result = await executeQuery(query, [username, email, hashedPassword]);
    return { success: true, userId: result.insertId };
  } catch (error) {
    console.error('Error registering user:', error);
    return { success: false, error: 'Registration failed' };
  }
}

export async function login(email, password) {
  const query = `
    SELECT id, username, email, password_hash, role
    FROM users
    WHERE email = ?
    LIMIT 1
  `;
  
  try {
    const results = await executeQuery(query, [email]);
    const user = results[0];
    
    if (!user) {
      return { success: false, error: 'User not found' };
    }
    
    const passwordMatch = await comparePasswords(password, user.password_hash);
    if (!passwordMatch) {
      return { success: false, error: 'Invalid password' };
    }
    
    const token = await createToken(user);
    setAuthCookie(token);
    
    return {
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Login failed' };
  }
}

export function logout() {
  removeAuthCookie();
  return { success: true };
}

export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}

export async function isAdmin() {
  const user = await getCurrentUser();
  return user?.role === 'admin';
}