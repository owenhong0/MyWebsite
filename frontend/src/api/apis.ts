import type { User, CreateUserInput } from './types';

const API_URL = 'http://localhost:8000';

export async function createUser(data: CreateUserInput): Promise<User> {
  const res = await fetch(`${API_URL}/users/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || 'Failed to create user');
  }
  return res.json();
}

export async function fetchUsers(): Promise<User[]> {
  const res = await fetch(`${API_URL}/users/`);
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}
