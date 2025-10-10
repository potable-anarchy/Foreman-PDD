import axios from 'axios';

export type TaskState = 'planning' | 'building' | 'testing' | 'done' | 'error';

interface KanbanTask {
  id: string;
  state: TaskState;
  description: string;
  timestamp: number;
}

const TIMEOUT_MS = 5000;

/**
 * Updates a Kanban board task with the current state and description.
 * Falls back to local stub if Vibe Kanban is not configured.
 * Never throws errors - always succeeds gracefully.
 */
export async function updateKanban(
  taskId: string,
  state: TaskState,
  description: string
): Promise<void> {
  const baseUrl = process.env.VIBE_KANBAN_BASE_URL;
  const token = process.env.VIBE_KANBAN_TOKEN;

  // Always log the state change
  const stateEmoji = getStateEmoji(state);
  console.log(`📋 ${stateEmoji} ${taskId}: ${state.toUpperCase()} - ${description}`);

  // Use local stub if not configured
  if (!baseUrl || !token) {
    console.log(`📋 Using local stub (Vibe Kanban not configured)`);
    return;
  }

  try {
    const task: KanbanTask = {
      id: taskId,
      state,
      description,
      timestamp: Date.now()
    };

    await axios.post(`${baseUrl}/tasks`, task, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      timeout: TIMEOUT_MS
    });

    console.log(`📋 ✅ Successfully updated Kanban board`);
  } catch (error) {
    // Log warning but don't throw - graceful degradation
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        console.log(`📋 ⚠️  Kanban update timed out (${TIMEOUT_MS}ms) - continuing`);
      } else if (error.response?.status === 401 || error.response?.status === 403) {
        console.log(`📋 ⚠️  Kanban authentication failed - continuing`);
      } else if (error.response) {
        console.log(`📋 ⚠️  Kanban API error (${error.response.status}) - continuing`);
      } else {
        console.log(`📋 ⚠️  Kanban network error - continuing`);
      }
    } else {
      console.log(`📋 ⚠️  Kanban update failed - continuing`);
    }
  }
}

/**
 * Get emoji representation for task state
 */
function getStateEmoji(state: TaskState): string {
  switch (state) {
    case 'planning':
      return '📝';
    case 'building':
      return '🔨';
    case 'testing':
      return '🧪';
    case 'done':
      return '✅';
    case 'error':
      return '❌';
    default:
      return '📋';
  }
}

/**
 * Convenience functions for common state updates
 */
export const kanban = {
  planning: (taskId: string, description: string) => 
    updateKanban(taskId, 'planning', description),
  
  building: (taskId: string, description: string) => 
    updateKanban(taskId, 'building', description),
  
  testing: (taskId: string, description: string) => 
    updateKanban(taskId, 'testing', description),
  
  done: (taskId: string, description: string) => 
    updateKanban(taskId, 'done', description),
  
  error: (taskId: string, description: string) => 
    updateKanban(taskId, 'error', description)
};