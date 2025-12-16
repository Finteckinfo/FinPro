<template>
  <div class="kanban-view">
    <v-container fluid>
      <div class="view-header">
        <h1 class="page-title">Project Kanban Board</h1>
        <div class="view-actions">
          <v-btn variant="outlined" @click="saveBoard">
            <v-icon start>mdi-content-save</v-icon>
            Save Board
          </v-btn>
        </div>
      </div>

      <KanbanBoard
        :board="board"
        @update-board="updateBoard"
      />
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import KanbanBoard from '@/components/kanban/KanbanBoard.vue'

interface Card {
  id: string
  title: string
  description?: string
  assignee?: string
  dueDate?: string
  labels?: string[]
  listId: string
}

interface List {
  id: string
  title: string
  cards: Card[]
}

interface Board {
  id: string
  title: string
  lists: List[]
}

// Mock board data for client onboarding
const board = ref<Board>({
  id: 'onboarding-board',
  title: 'Client Onboarding',
  lists: [
    {
      id: 'list-1',
      title: 'Initial Contact',
      cards: [
        {
          id: 'card-1',
          title: 'Send welcome email',
          description: 'Introduce FinPro services and schedule discovery call',
          assignee: 'Sales Team',
          dueDate: '2024-12-20',
          labels: ['Communication'],
          listId: 'list-1'
        },
        {
          id: 'card-2',
          title: 'Schedule discovery meeting',
          description: 'Book initial consultation to understand client needs',
          assignee: 'Account Manager',
          dueDate: '2024-12-18',
          labels: ['Meeting'],
          listId: 'list-1'
        }
      ]
    },
    {
      id: 'list-2',
      title: 'Requirements',
      cards: [
        {
          id: 'card-3',
          title: 'Gather project requirements',
          description: 'Document scope, timeline, and technical specifications',
          assignee: 'Project Manager',
          dueDate: '2024-12-25',
          labels: ['Planning', 'Documentation'],
          listId: 'list-2'
        },
        {
          id: 'card-4',
          title: 'Create project proposal',
          description: 'Prepare detailed proposal with pricing and timeline',
          assignee: 'Sales Team',
          dueDate: '2024-12-22',
          labels: ['Proposal'],
          listId: 'list-2'
        }
      ]
    },
    {
      id: 'list-3',
      title: 'Setup',
      cards: [
        {
          id: 'card-5',
          title: 'Set up project workspace',
          description: 'Create project in FinPro and configure departments/roles',
          assignee: 'Project Manager',
          dueDate: '2024-12-28',
          labels: ['Setup', 'Configuration'],
          listId: 'list-3'
        },
        {
          id: 'card-6',
          title: 'Configure team access',
          description: 'Add team members and set up permissions',
          assignee: 'Admin',
          dueDate: '2024-12-27',
          labels: ['Access', 'Security'],
          listId: 'list-3'
        }
      ]
    },
    {
      id: 'list-4',
      title: 'Launch',
      cards: [
        {
          id: 'card-7',
          title: 'Fund project escrow',
          description: 'Transfer FIN tokens to project escrow for task payments',
          assignee: 'Client',
          dueDate: '2025-01-02',
          labels: ['Finance', 'Blockchain'],
          listId: 'list-4'
        },
        {
          id: 'card-8',
          title: 'Kickoff meeting',
          description: 'Conduct project kickoff with full team',
          assignee: 'Project Manager',
          dueDate: '2025-01-05',
          labels: ['Meeting', 'Kickoff'],
          listId: 'list-4'
        },
        {
          id: 'card-9',
          title: 'Begin task allocation',
          description: 'Start assigning and funding initial tasks',
          assignee: 'Project Manager',
          dueDate: '2025-01-07',
          labels: ['Tasks', 'Execution'],
          listId: 'list-4'
        }
      ]
    }
  ]
})

// Methods
const updateBoard = (updatedBoard: Board) => {
  board.value = updatedBoard
  console.log('Board updated:', board.value)
}

const saveBoard = () => {
  // TODO: Save to backend
  console.log('Saving board...', board.value)
  // Show success message
}
</script>

<style scoped>
.kanban-view {
  min-height: 100vh;
  background: var(--erp-page-bg);
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 24px 0;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--erp-text);
  margin: 0;
}

.view-actions {
  display: flex;
  gap: 12px;
}
</style>
