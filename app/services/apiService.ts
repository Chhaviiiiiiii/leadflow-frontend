export const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://leadflow-backend-gk39.onrender.com/api';

const USE_DEMO_MODE = false;

interface FetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: unknown;
  headers?: Record<string, string>;
}

async function fetchAPI<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {} } = options;

  const token = typeof window !== 'undefined'
    ? localStorage.getItem('token')
    : null;

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  };

  console.log(`Sending ${method} request to: ${BASE_URL}${endpoint}`);

  const response = await fetch(`${BASE_URL}${endpoint}`, config);
  console.log("Backend Message Response Status:", response.status, response.statusText);

  if (!response.ok) {
    let errorMessage = `Request failed: ${response.status} ${response.statusText}`;
    try {
      const textData = await response.text();
      try {
        const jsonData = JSON.parse(textData);
        errorMessage = jsonData.message || errorMessage;
      } catch {
        errorMessage = textData || errorMessage;
      }
    } catch (e) {
      console.error('Failed to parse error body:', e);
    }
    throw new Error(errorMessage);
  }

  if (response.status === 204) return undefined as T;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json() as Promise<T>;
  } else {
    const rawText = await response.text();
    return rawText as unknown as T;
  }
}

export interface LeadDTO {
  id?: string;
  name: string;
  phone: string;
  email: string;
  source: string;
  status: 'NEW' | 'CONTACTED' | 'CONVERTED' | 'LOST';
  notes: string;
  createdAt?: string;
  telegramChatId?: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  role: string;
}
export const LeadAPI = {
  getAll: () =>
    fetchAPI<LeadDTO[]>('/leads'),

  getById: (id: string) =>
    fetchAPI<LeadDTO>(`/leads/${id}`),

  create: (data: Omit<LeadDTO, 'id' | 'createdAt'>) =>
    fetchAPI<LeadDTO>('/leads', { method: 'POST', body: data }),

  update: (id: string, data: Partial<LeadDTO>) =>
    fetchAPI<LeadDTO>(`/leads/${id}`, { method: 'PUT', body: data }),

  delete: (id: string) =>
    fetchAPI<void>(`/leads/${id}`, { method: 'DELETE' }),
};

export const AuthAPI = {
  login: (credentials: AuthCredentials) =>
    fetchAPI<AuthResponse>('/auth/login', {
      method: 'POST',
      body: credentials,
    }),

  register: (data: RegisterData) =>
    fetchAPI<AuthResponse>('/auth/register', {
      method: 'POST',
      body: data,
    }),

  logout: () =>
    fetchAPI<void>('/auth/logout', { method: 'POST' }),
};

export const EmailAPI = {
  send: (data: { email: string; name: string; type: string }) =>
    fetchAPI('/email/send', { 
      method: 'POST', 
      body: data 
    }),
};

export const TelegramAPI = {
  send: (data: { 
    name: string; 
    phone: string; 
    source: string; 
    type: string; 
    message: string; 
    leadChatId: string; 
  }) =>
    fetchAPI('/telegram/send', { 
      method: 'POST', 
      body: data 
    }),
};

export const TokenService = {
  save: (token: string) => localStorage.setItem('token', token),
  get: () => localStorage.getItem('token'),
  remove: () => localStorage.removeItem('token'),
  isLoggedIn: () => !!localStorage.getItem('token'),
};

export { USE_DEMO_MODE };
