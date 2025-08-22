'use client';

import { useState, useEffect } from 'react';
import { todoApi, Todo } from '@/lib/api';

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTodo, setNewTodo] = useState({ title: '', description: '' });

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await todoApi.getAll();
      setTodos(response.data);
    } catch (error) {
      console.error('Erro ao buscar todos:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await todoApi.create({ ...newTodo, completed: false });
      setNewTodo({ title: '', description: '' });
      fetchTodos();
    } catch (error) {
      console.error('Erro ao criar todo:', error);
    }
  };

  const toggleComplete = async (id: number, completed: boolean) => {
    try {
      await todoApi.update(id, { completed: !completed });
      fetchTodos();
    } catch (error) {
      console.error('Erro ao atualizar todo:', error);
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      await todoApi.delete(id);
      fetchTodos();
    } catch (error) {
      console.error('Erro ao deletar todo:', error);
    }
  };

  if (loading) return <div className="p-4">Carregando...</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Todo App - Teste</h1>
      
      {/* Formulário */}
      <form onSubmit={createTodo} className="mb-6 p-4 border rounded">
        <h2 className="text-xl mb-4">Novo Todo</h2>
        <input
          type="text"
          placeholder="Título"
          value={newTodo.title}
          onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
          className="w-full p-2 border rounded mb-2"
          required
        />
        <textarea
          placeholder="Descrição"
          value={newTodo.description}
          onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
          className="w-full p-2 border rounded mb-2"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Criar Todo
        </button>
      </form>

      {/* Lista */}
      <div>
        <h2 className="text-xl mb-4">Todos ({todos.length})</h2>
        {todos.map((todo) => (
          <div
            key={todo.id}
            className={`p-4 border rounded mb-2 ${
              todo.completed ? 'bg-gray-100' : 'bg-white'
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className={`font-semibold ${todo.completed ? 'line-through' : ''}`}>
                  {todo.title}
                </h3>
                {todo.description && (
                  <p className={`text-gray-600 ${todo.completed ? 'line-through' : ''}`}>
                    {todo.description}
                  </p>
                )}
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => toggleComplete(todo.id!, todo.completed)}
                  className={`px-3 py-1 rounded text-sm ${
                    todo.completed
                      ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                      : 'bg-green-500 text-white hover:bg-green-600'
                  }`}
                >
                  {todo.completed ? 'Reabrir' : 'Concluir'}
                </button>
                <button
                  onClick={() => deleteTodo(todo.id!)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                >
                  Deletar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}