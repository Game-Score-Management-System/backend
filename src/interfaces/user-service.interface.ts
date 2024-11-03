import { Observable } from 'rxjs';
import { Metadata } from './metadata.interface';

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

interface Score {
  id: string;
  userId: string;
  game: string;
  score: number;
  createdAt: string;
  updatedAt: string;
}

export interface UsersService {
  getAllUsers({}): Observable<Result>;
  getUserProfileById({}): Observable<{ user: User }>;
  updateProfile({}): Observable<{ user: User }>;
  updateUserStatus({}): Observable<{ user: User }>;
  getUserScores({}): Observable<Score[]>;
  removeUser({}): Observable<void>;
  registerPlayer({}): Observable<{ user: User }>;
  login({}): Observable<{ user: User }>;
}
