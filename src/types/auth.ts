export interface UserMetadata {
  role: 'owner' | 'admin';
  full_name?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role: 'owner' | 'admin';
  full_name?: string;
}
