import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar, MessageCircle, Send, Trash2, Edit3, User, Clock, Tag } from 'lucide-react';
import { Task, TaskStatus, Comment } from '@/types/kanban';
import { useKanban } from '@/contexts/KanbanContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TaskDialogProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
}

export function TaskDialog({ task, isOpen, onClose }: TaskDialogProps) {
  const { updateTask, addComment, deleteComment } = useKanban();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: task.title,
    description: task.description || '',
    status: task.status,
    priority: task.priority,
    assignee: task.assignee || '',
    dueDate: task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : '',
    tags: task.tags?.join(', ') || '',
  });
  const [newComment, setNewComment] = useState('');

  const handleSave = () => {
    updateTask(task.id, {
      title: editForm.title,
      description: editForm.description,
      status: editForm.status as TaskStatus,
      priority: editForm.priority as 'low' | 'medium' | 'high',
      assignee: editForm.assignee || undefined,
      dueDate: editForm.dueDate ? new Date(editForm.dueDate) : undefined,
      tags: editForm.tags ? editForm.tags.split(',').map(tag => tag.trim()).filter(Boolean) : undefined,
    });
    setIsEditing(false);
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      addComment(task.id, {
        content: newComment.trim(),
        author: 'Usuário Atual', // Em uma aplicação real, seria obtido do contexto de autenticação
      });
      setNewComment('');
    }
  };

  const handleDeleteComment = (commentId: string) => {
    if (window.confirm('Tem certeza que deseja deletar este comentário?')) {
      deleteComment(task.id, commentId);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const priorityColors = {
    low: 'bg-green-100 text-green-800 border-green-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    high: 'bg-red-100 text-red-800 border-red-200',
  };

  const statusLabels = {
    todo: 'A Fazer',
    'in-progress': 'Em Progresso',
    review: 'Em Revisão',
    done: 'Concluído',
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-start justify-between">
            {isEditing ? (
              <Input
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                className="text-lg font-semibold"
                placeholder="Título da tarefa"
              />
            ) : (
              <DialogTitle className="text-lg">{task.title}</DialogTitle>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              className="ml-2"
            >
              <Edit3 className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6">
            {/* Task Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                {isEditing ? (
                  <Select value={editForm.status} onValueChange={(value) => setEditForm({ ...editForm, status: value as TaskStatus })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todo">A Fazer</SelectItem>
                      <SelectItem value="in-progress">Em Progresso</SelectItem>
                      <SelectItem value="review">Em Revisão</SelectItem>
                      <SelectItem value="done">Concluído</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge variant="outline" className="w-fit">
                    {statusLabels[task.status]}
                  </Badge>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Prioridade</label>
                {isEditing ? (
                  <Select value={editForm.priority} onValueChange={(value) => setEditForm({ ...editForm, priority: value as 'low' | 'medium' | 'high' })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Baixa</SelectItem>
                      <SelectItem value="medium">Média</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge className={`w-fit ${priorityColors[task.priority]}`} variant="outline">
                    {task.priority === 'low' && 'Baixa'}
                    {task.priority === 'medium' && 'Média'}
                    {task.priority === 'high' && 'Alta'}
                  </Badge>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Responsável</label>
                {isEditing ? (
                  <Input
                    value={editForm.assignee}
                    onChange={(e) => setEditForm({ ...editForm, assignee: e.target.value })}
                    placeholder="Nome do responsável"
                  />
                ) : task.assignee ? (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src="" />
                      <AvatarFallback className="text-xs bg-primary/10 text-primary">
                        {getInitials(task.assignee)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{task.assignee}</span>
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">Não atribuído</span>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Data de Vencimento</label>
                {isEditing ? (
                  <Input
                    type="date"
                    value={editForm.dueDate}
                    onChange={(e) => setEditForm({ ...editForm, dueDate: e.target.value })}
                  />
                ) : task.dueDate ? (
                  <div className="flex items-center gap-1 text-sm">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(task.dueDate), 'dd/MM/yyyy', { locale: ptBR })}
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">Não definida</span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Descrição</label>
              {isEditing ? (
                <Textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  placeholder="Descrição da tarefa"
                  rows={3}
                />
              ) : (
                <p className="text-sm text-muted-foreground">
                  {task.description || 'Nenhuma descrição fornecida.'}
                </p>
              )}
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Tags</label>
              {isEditing ? (
                <Input
                  value={editForm.tags}
                  onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
                  placeholder="Tags separadas por vírgula"
                />
              ) : task.tags && task.tags.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {task.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">Nenhuma tag</span>
              )}
            </div>

            {isEditing && (
              <div className="flex gap-2">
                <Button onClick={handleSave}>Salvar</Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancelar
                </Button>
              </div>
            )}

            <Separator />

            {/* Comments Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                <h4 className="font-medium">Comentários ({task.comments.length})</h4>
              </div>

              {/* Add Comment */}
              <div className="flex gap-2">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Adicionar um comentário..."
                  rows={2}
                  className="flex-1"
                />
                <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              {/* Comments List */}
              <div className="space-y-3">
                {task.comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3 p-3 bg-muted/50 rounded-lg">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" />
                      <AvatarFallback className="text-xs bg-primary/10 text-primary">
                        {getInitials(comment.author)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{comment.author}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(comment.createdAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                            onClick={() => handleDeleteComment(comment.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm">{comment.content}</p>
                    </div>
                  </div>
                ))}

                {task.comments.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Nenhum comentário ainda. Seja o primeiro a comentar!
                  </p>
                )}
              </div>
            </div>

            {/* Task Metadata */}
            <div className="text-xs text-muted-foreground space-y-1">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Criado em {format(new Date(task.createdAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Atualizado em {format(new Date(task.updatedAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}