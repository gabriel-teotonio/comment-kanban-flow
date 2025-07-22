import api from './axios';

export const getCommentsByTask = async (taskId: number) => {
  const { data } = await api.get(`/comments/task/${taskId}`);
  return data;
};

export const createComment = async (comment: { content: string; taskId: number }) => {
  const { data } = await api.post('/comments', comment);
  return data;
};

export const deleteComment = async (id: number) => {
  const { data } = await api.delete(`/comments/${id}`);
  return data;
}; 