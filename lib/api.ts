import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Todo {
  id?: number;
  title: string;
  description: string;
  completed: boolean;
  created_at?: string;
  updated_at?: string;
}

export const todoApi = {
  // Listar todos
  getAll: () => api.get<Todo[]>('/todos/'),
  
  // Criar todo
  create: (todo: Omit<Todo, 'id' | 'created_at' | 'updated_at'>) => 
    api.post<Todo>('/todos/', todo),
  
  // Atualizar todo
  update: (id: number, todo: Partial<Todo>) => 
  api.patch<Todo>(`/todos/${id}/`, todo),
  
  // Deletar todo
  delete: (id: number) => api.delete(`/todos/${id}/`),
  
  // Health check
  health: () => api.get('/health/'),
};