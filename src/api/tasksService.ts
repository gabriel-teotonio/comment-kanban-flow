import api from './axios';

export const getTasks = async () => {
  const { data } = await api.get('/tasks');
  return data;
};

export const createTask = async (task: { title: string; description?: string }) => {
  const { data } = await api.post('/tasks', task);
  return data;
};

export const updateTask = async (id: number, task: { title?: string; description?: string; status?: string }) => {
  const { data } = await api.patch(`/tasks/${id}`, task);
  return data;
};

export const updateTaskStatus = async (id: number, status: string) => {
  const { data } = await api.patch(`/tasks/${id}/status`, { status });
  return data;
};

export const deleteTask = async (id: number) => {
  const { data } = await api.delete(`/tasks/${id}`);
  return data;
}; 