import axios from 'axios';
import { BASE_URL } from './apiService';

export interface UserProfile {
    name: string;
    email: string;
    phone: string;
    token?: string; // Optional, returned if email changes
}

export interface PasswordResetData {
    currentPassword:  string;
    newPassword:      string;
}

const getAuthHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };
};

export const profileService = {
    getProfile: async (): Promise<UserProfile> => {
        const response = await axios.get(`${BASE_URL}/profile`, getAuthHeaders());
        return response.data;
    },

    updateProfile: async (data: UserProfile): Promise<UserProfile> => {
        const response = await axios.put(`${BASE_URL}/profile`, data, getAuthHeaders());
        return response.data;
    },

    resetPassword: async (data: PasswordResetData): Promise<{ message: string }> => {
        const response = await axios.post(`${BASE_URL}/profile/reset-password`, data, getAuthHeaders());
        return response.data;
    }
};
