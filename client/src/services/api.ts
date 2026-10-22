import {
  StudentProfile,
  RecommendationResponse,
  CareerDomainCatalogItem,
  UserAccount,
  AuthResponse
} from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? 'http://localhost:5000/api' : '/api');
const AUTH_TOKEN_KEY = 'careercompass_auth_token';

// ==========================================
// AUTHENTICATION TOKEN MANAGEMENT
// ==========================================

export function getAuthToken(): string | null {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  } catch (e) {
    return null;
  }
}

export function setAuthToken(token: string): void {
  try {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  } catch (e) {}
}

export function clearAuthToken(): void {
  try {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem('careercompass_profile');
  } catch (e) {}
}

function getAuthHeaders(): HeadersInit {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

// ==========================================
// AUTHENTICATION API CALLS
// ==========================================

export async function registerUser(
  name: string,
  email: string,
  password: string,
  confirmPassword: string
): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, confirmPassword })
  });
  const data = await res.json();
  if (res.ok && data.token) {
    setAuthToken(data.token);
  }
  return data;
}

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (res.ok && data.token) {
    setAuthToken(data.token);
  }
  return data;
}

export async function getAuthMe(): Promise<AuthResponse> {
  const token = getAuthToken();
  if (!token) {
    return { success: false, error: 'No active session' };
  }
  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    if (!res.ok) {
      clearAuthToken();
      return { success: false, error: 'Session expired' };
    }
    return await res.json();
  } catch (err) {
    return { success: false, error: 'Network error verifying session' };
  }
}

export async function logoutUser(): Promise<void> {
  try {
    await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
  } catch (e) {}
  clearAuthToken();
}

export async function requestPasswordReset(email: string): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  return await res.json();
}

export async function confirmPasswordReset(
  resetToken: string,
  newPassword: string,
  confirmPassword: string
): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resetToken, newPassword, confirmPassword })
  });
  return await res.json();
}

// ==========================================
// PLATFORM & DOMAIN CATALOG API CALLS
// ==========================================

export async function checkServerHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/health`);
    const data = await res.json();
    return data.status === 'ok';
  } catch (err) {
    return false;
  }
}

export async function fetchDomains(): Promise<CareerDomainCatalogItem[]> {
  try {
    const res = await fetch(`${API_BASE}/domains`);
    const data = await res.json();
    return data.domains || [];
  } catch (err) {
    console.error('Failed to fetch domains:', err);
    return [];
  }
}

// ==========================================
// PROTECTED RECOMMENDATIONS & STUDENT PROFILE
// ==========================================

export async function getRecommendations(profile: StudentProfile): Promise<RecommendationResponse> {
  const res = await fetch(`${API_BASE}/recommend`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(profile)
  });
  if (!res.ok) {
    if (res.status === 401) {
      clearAuthToken();
      throw new Error('Authentication required. Please log in.');
    }
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || 'Failed to generate career recommendations');
  }
  const data = await res.json();
  return data.recommendations;
}

export async function loadSavedStudentProfile(userId?: string): Promise<{
  profile: StudentProfile | null;
  recommendations: RecommendationResponse | null;
}> {
  // Clean up legacy unscoped demo key
  try {
    localStorage.removeItem('careercompass_profile');
  } catch (e) {}

  try {
    const res = await fetch(`${API_BASE}/student/profile`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    if (res.ok) {
      const data = await res.json();
      if (data.profile) {
        return {
          profile: data.profile,
          recommendations: data.profile.recommendations || null
        };
      }
    }
  } catch (err) {
    console.warn('Could not load profile from backend:', err);
  }

  // Fallback to user-scoped local storage if available
  if (userId) {
    try {
      const local = localStorage.getItem(`careercompass_profile_${userId}`);
      if (local) {
        const parsed = JSON.parse(local);
        return {
          profile: parsed,
          recommendations: parsed.recommendations || null
        };
      }
    } catch (e) {}
  }

  return { profile: null, recommendations: null };
}

export async function saveStudentProfile(profile: StudentProfile, userId?: string): Promise<void> {
  // Clean up legacy unscoped key and save under user-scoped key
  try {
    localStorage.removeItem('careercompass_profile');
    if (userId) {
      localStorage.setItem(`careercompass_profile_${userId}`, JSON.stringify(profile));
    }
  } catch (e) {}

  try {
    await fetch(`${API_BASE}/student/profile`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(profile)
    });
  } catch (err) {
    console.warn('Backend save failed:', err);
  }
}

export async function updateRoadmapTaskProgress(
  phaseIndex: number,
  taskIndex: number,
  status: 'not_started' | 'in_progress' | 'completed'
): Promise<void> {
  try {
    await fetch(`${API_BASE}/student/roadmap`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ phaseIndex, taskIndex, status })
    });
  } catch (err) {
    console.warn('Failed to update task progress on backend:', err);
  }
}

export async function saveDomainBookmark(domainName: string, domainData?: any): Promise<void> {
  try {
    await fetch(`${API_BASE}/student/saved-items`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        itemType: 'domain',
        itemId: domainName,
        itemData: domainData
      })
    });
  } catch (err) {
    console.warn('Failed to save bookmark on backend:', err);
  }
}
