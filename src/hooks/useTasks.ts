import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as tasksService from '../api/tasksService';
import { toast } from './use-toast';

export function useTasks() {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: tasksService.getTasks,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: tasksService.createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      toast({
        title: 'Tarefa criada com sucesso',
        description: 'A tarefa foi criada com sucesso',
        variant: 'default',
        color: 'green',
      })
    },
    onError: () => {
      toast({
        title: 'Erro ao criar tarefa',
        description: 'Ocorreu um erro ao criar a tarefa',
        variant: 'destructive',
        color: 'red',
      })
    }
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...task }: { id: number; title?: string; description?: string; status?: string }) =>
      tasksService.updateTask(id, task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      toast({
        title: 'Tarefa atualizada com sucesso',
        description: 'A tarefa foi atualizada com sucesso',
        variant: 'default',
        color: 'green',
      })
    },
    onError: () => {
      toast({
        title: 'Erro ao atualizar tarefa',
        description: 'Ocorreu um erro ao atualizar a tarefa',
        variant: 'destructive',
        color: 'red',
      })
    }
  });
}

export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => tasksService.updateTaskStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      toast({
        title: 'Status da tarefa atualizado com sucesso',
        description: 'O status da tarefa foi atualizado com sucesso',
        variant: 'default',
        color: 'green',
      })
    },
    onError: () => {
      toast({
        title: 'Erro ao atualizar status da tarefa',
        description: 'Ocorreu um erro ao atualizar o status da tarefa',
        variant: 'destructive',
        color: 'red',
      })
    }
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: tasksService.deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      toast({
        title: 'Tarefa deletada com sucesso',
        description: 'A tarefa foi deletada com sucesso',
        variant: 'destructive',
        color: 'red',
      })
    },
    onError: () => {
      toast({
        title: 'Erro ao deletar tarefa',
        description: 'Ocorreu um erro ao deletar a tarefa',
        variant: 'destructive',
        color: 'red',
      })
    }
  });
} 