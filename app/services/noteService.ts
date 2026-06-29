import axios from 'axios';
import { BASE_URL } from './apiService';

export interface Note {
    id?: number;
    content: string;
    createdAt?: string;
}

const API_URL = `${BASE_URL}/notes`;

const getAuthHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };
};

export const noteService = {
    getUserNotes: async (): Promise<Note[]> => {
        const response = await axios.get(API_URL, getAuthHeaders());
        return response.data;
    },
    createNote: async (note: Note): Promise<Note> => {
        const response = await axios.post(API_URL, note, getAuthHeaders());
        return response.data;
    },
    updateNote: async (id: number, note: Note): Promise<Note> => {
        const response = await axios.put(`${API_URL}/${id}`, note, getAuthHeaders());
        return response.data;
    },
    deleteNote: async (id: number): Promise<void> => {
        await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
    }
};