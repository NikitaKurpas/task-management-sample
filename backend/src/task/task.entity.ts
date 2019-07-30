import { User } from '../user/user.entity';

export type TaskStatus = 'new' | 'in progress' | 'completed' | 'archived';

export class Task {
  id: string;
  status: TaskStatus;
  description: string;
  assignees: User[];
  createdAt: Date;
  createdBy: User;
  updatedAt: Date;
}
