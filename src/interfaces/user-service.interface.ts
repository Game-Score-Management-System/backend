import { Observable } from 'rxjs';
import { Metadata } from './metadata.interface';
import { Score } from './score-service.interface';

interface Result {
  users: User[];
  metadata?: Metadata;
}

export interface User {
  id: string;
  name: string;
  lastname: string;
  email: string;
  role: string;
  username: string;
  profilePicture: string;
  createdAt: string;
  updatedAt: string;
  status: number;
}

export interface UsersService {
  getAllUsers({}): Observable<Result>;
  getUserProfileById({}): Observable<{ user: User }>;
  updateProfile({}): Observable<{ user: User }>;
  updateUser({}): Observable<{ user: User }>;
  getUserScores({}): Observable<Score[]>;
  removeUser({}): Observable<void>;
  registerPlayer({}): Observable<{ user: User }>;
  login({}): Observable<{ user: User }>;
}
