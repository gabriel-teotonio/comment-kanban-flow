import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as commentsService from '../api/commentsService';
import { Alert } from '@/components/ui/alert';
import { toast } from './use-toast';

export function useCommentsByTask(taskId: number) {
  return useQuery({
    queryKey: ['comments', taskId],
    queryFn: () => commentsService.getCommentsByTask(taskId),
    enabled: !!taskId,
  });
}

export function useCreateComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: commentsService.createComment,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.taskId] });
      toast({
        title: 'Comentário criado com sucesso',
        description: 'O comentário foi criado com sucesso',
        variant: 'default',
        color: 'green',
      })
    },
  });
}

export function useDeleteComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: commentsService.deleteComment,
    onSuccess: (_data, variables) => {
      // Recomenda-se passar {id, taskId} para invalidar corretamente
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      toast({
        title: 'Comentário deletado com sucesso',
        description: 'O comentário foi deletado com sucesso',
        variant: 'destructive',
        color: 'red',
      })
    },
  });
} 