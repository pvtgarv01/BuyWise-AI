import { User } from 'firebase/auth';

export type AuthMode = 'login' | 'signup';

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signupWithEmail: (email: string, password: string, displayName?: string) => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  isAuthModalOpen: boolean;
  authModalMode: AuthMode;
  openAuthModal: (mode?: AuthMode) => void;
  closeAuthModal: () => void;
  setAuthModalMode: (mode: AuthMode) => void;
}
