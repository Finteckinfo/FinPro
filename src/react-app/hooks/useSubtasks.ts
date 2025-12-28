import { useState, useEffect } from 'react';
import type { Subtask } from '@/shared/types';
import { supabase } from '@/react-app/lib/supabase';

export function useSubtasks(projectId: number | null) {
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubtasks = async () => {
    if (!projectId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('subtasks')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubtasks(data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubtasks();

    if (!projectId) return;

    // Set up real-time listener for subtasks of this project
    const channel = supabase
      .channel(`subtasks-${projectId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'subtasks',
          filter: `project_id=eq.${projectId}`
        },
        (payload) => {
          console.log('Real-time subtask change detected:', payload);
          fetchSubtasks();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [projectId]);

  return { subtasks, loading, error, refetch: fetchSubtasks };
}
