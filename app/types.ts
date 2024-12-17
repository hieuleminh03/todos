export interface Task {
  id: string
  name: string
  description: string
  status: 'in progress' | 'pending' | 'cancelled' | 'done'
  createdTime: string
  deadline: string
  note: string
}

