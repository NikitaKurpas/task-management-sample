import { User } from '../user/user.entity';
import { Task } from '../task/task.entity';

export class Comment {
  id: string;
  author: User;
  text: string;
  task: Task;
  createdAt: Date;
  createdBy: User;
  updatedAt: Date;
}
