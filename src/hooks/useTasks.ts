
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../integrations/supabase/client'
import type { Tables, TablesInsert, TablesUpdate } from '../integrations/supabase/types'
import { toast } from 'sonner'

export function useTasks(filters?: { date?: string; parentId?: string }) {
  const queryClient = useQueryClient()
  const { date, parentId } = filters || {}

  const queryKey = parentId ? ['subtasks', parentId] : ['tasks', date]

  const tasksQuery = useQuery({
    queryKey,
    queryFn: async () => {
      const query = supabase.from('tasks').select('*')
      if (parentId) query.eq('parent_id', parentId)
      else if (date) query.eq('date', date).is('parent_id', null)
      const { data, error } = await query.order('created_at')
      if (error) throw error
      return data || []
    },
    staleTime: 60000, // 1 minute before considering data stale
  })

  const addTask = useMutation({
    mutationFn: async (newTask: TablesInsert<'tasks'>) => {
      const { data, error } = await supabase.from('tasks').insert(newTask).select().single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })
      toast.success(parentId ? 'Подзадача добавлена' : 'Задача добавлена')
    },
    onError: () => toast.error(parentId ? 'Не удалось добавить подзадачу' : 'Не удалось добавить задачу'),
  })

  const updateTask = useMutation({
    mutationFn: async (task: TablesUpdate<'tasks'> & { id: string }) => {
      const { data, error } = await supabase.from('tasks').update(task).eq('id', task.id).select().single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })
    },
    onError: () => toast.error('Не удалось обновить задачу'),
  })

  return { ...tasksQuery, addTask, updateTask }
}
