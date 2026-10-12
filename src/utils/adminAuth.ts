/**
 * Admin Authentication and Session Management
 * Default Credentials:
 *   User ID: admin
 *   Password: admin@khairabad2026
 */

export interface AdminCredentials {
  userId: string;
  passwordHash: string; // Plain/Base64 stored in localStorage for demo-safe client verification
  updatedAt: string;
}

export interface AdminSession {
  userId: string;
  loggedInAt: string;
  token: string;
}

const ADMIN_CREDS_STORAGE_KEY = 'khairabad_admin_creds_v1';
const ADMIN_SESSION_STORAGE_KEY = 'khairabad_admin_session_v1';

export const DEFAULT_ADMIN_USER_ID = 'admin';
export const DEFAULT_ADMIN_PASSWORD = 'admin@khairabad2026';

/**
 * Basic encoding for client-side stored credentials
 */
function encodeSecret(str: string): string {
  try {
    return btoa(unescape(encodeURIComponent(str)));
  } catch {
    return str;
  }
}

function decodeSecret(str: string): string {
  try {
    return decodeURIComponent(escape(atob(str)));
  } catch {
    return str;
  }
}

/**
 * Retrieve current stored admin credentials, or initialize defaults
 */
export function getAdminCredentials(): { userId: string; rawPasswordSecret: string } {
  if (typeof window === 'undefined') {
    return { userId: DEFAULT_ADMIN_USER_ID, rawPasswordSecret: DEFAULT_ADMIN_PASSWORD };
  }

  try {
    const raw = localStorage.getItem(ADMIN_CREDS_STORAGE_KEY);
    if (!raw) {
      // Initialize with default credentials
      const defaults = {
        userId: DEFAULT_ADMIN_USER_ID,
        passwordHash: encodeSecret(DEFAULT_ADMIN_PASSWORD),
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(ADMIN_CREDS_STORAGE_KEY, JSON.stringify(defaults));
      return { userId: DEFAULT_ADMIN_USER_ID, rawPasswordSecret: DEFAULT_ADMIN_PASSWORD };
    }

    const parsed: AdminCredentials = JSON.parse(raw);
    const decodedPassword = decodeSecret(parsed.passwordHash);
    return {
      userId: parsed.userId || DEFAULT_ADMIN_USER_ID,
      rawPasswordSecret: decodedPassword || DEFAULT_ADMIN_PASSWORD,
    };
  } catch (err) {
    console.error('Error reading admin credentials:', err);
    return { userId: DEFAULT_ADMIN_USER_ID, rawPasswordSecret: DEFAULT_ADMIN_PASSWORD };
  }
}

/**
 * Authenticate admin with provided User ID and Password
 */
export function authenticateAdmin(userIdInput: string, passwordInput: string): { success: boolean; error?: string } {
  const cleanId = userIdInput.trim();
  const cleanPass = passwordInput.trim();

  if (!cleanId || !cleanPass) {
    return { success: false, error: 'User ID and Password are required.' };
  }

  const { userId, rawPasswordSecret } = getAdminCredentials();

  if (cleanId === userId && cleanPass === rawPasswordSecret) {
    // Generate session
    const session: AdminSession = {
      userId: cleanId,
      loggedInAt: new Date().toISOString(),
      token: `adm-token-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    };

    try {
      localStorage.setItem(ADMIN_SESSION_STORAGE_KEY, JSON.stringify(session));
      window.dispatchEvent(new CustomEvent('khairabad_admin_auth_changed', { detail: { isAuthenticated: true } }));
    } catch {
      // ignore
    }

    return { success: true };
  }

  return { success: false, error: 'Invalid User ID or Password. Please try again.' };
}

/**
 * Check if admin is currently authenticated with a valid session
 */
export function isAdminAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const raw = localStorage.getItem(ADMIN_SESSION_STORAGE_KEY);
    if (!raw) return false;

    const session: AdminSession = JSON.parse(raw);
    if (session && session.userId && session.token) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

/**
 * Get current admin session details
 */
export function getCurrentAdminSession(): AdminSession | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = localStorage.getItem(ADMIN_SESSION_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Logout admin and destroy session
 */
export function logoutAdmin(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(ADMIN_SESSION_STORAGE_KEY);
    sessionStorage.removeItem(ADMIN_SESSION_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('khairabad_admin_auth_changed', { detail: { isAuthenticated: false } }));
  } catch {
    // ignore
  }
}

/**
 * Update Admin User ID and/or Password
 */
export function updateAdminCredentials(newUserId: string, newPassword: string): { success: boolean; error?: string } {
  const cleanId = newUserId.trim();
  const cleanPass = newPassword.trim();

  if (!cleanId || cleanId.length < 3) {
    return { success: false, error: 'User ID must be at least 3 characters long.' };
  }

  if (!cleanPass || cleanPass.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters long.' };
  }

  try {
    const data: AdminCredentials = {
      userId: cleanId,
      passwordHash: encodeSecret(cleanPass),
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(ADMIN_CREDS_STORAGE_KEY, JSON.stringify(data));

    // Also update existing session if logged in
    const existingSession = getCurrentAdminSession();
    if (existingSession) {
      existingSession.userId = cleanId;
      localStorage.setItem(ADMIN_SESSION_STORAGE_KEY, JSON.stringify(existingSession));
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: 'Failed to save updated credentials.' };
  }
}

/**
 * Restore credentials to initial defaults
 */
export function resetAdminCredentialsToDefault(): void {
  if (typeof window === 'undefined') return;

  try {
    const defaults: AdminCredentials = {
      userId: DEFAULT_ADMIN_USER_ID,
      passwordHash: encodeSecret(DEFAULT_ADMIN_PASSWORD),
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(ADMIN_CREDS_STORAGE_KEY, JSON.stringify(defaults));
  } catch {
    // ignore
  }
}
