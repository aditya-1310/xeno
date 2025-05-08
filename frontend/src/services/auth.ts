import { auth, googleProvider } from '../firebase';
import { 
  signInWithPopup, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';

export interface User {
  id: string;
  email: string;
  name: string;
}

class AuthService {
  private static instance: AuthService;
  private currentUser: User | null = null;

  private constructor() {
    console.log('Initializing AuthService');
    // Listen for auth state changes
    onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', user ? 'User logged in' : 'User logged out');
      if (user) {
        this.currentUser = {
          id: user.uid,
          email: user.email || '',
          name: user.displayName || ''
        };
        // Get and store the token when user is authenticated
        const token = await user.getIdToken();
        localStorage.setItem('token', token);
        console.log('Current user set:', this.currentUser);
      } else {
        this.currentUser = null;
        localStorage.removeItem('token');
        console.log('Current user cleared');
      }
    });
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login() {
    try {
      console.log('Attempting login...');
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log('Login successful:', user);
      
      // Get the token
      const token = await user.getIdToken();
      localStorage.setItem('token', token);
      
      this.currentUser = {
        id: user.uid,
        email: user.email || '',
        name: user.displayName || ''
      };
      
      return this.currentUser;
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    console.log('Getting current user:', this.currentUser);
    return this.currentUser;
  }

  async logout() {
    try {
      console.log('Attempting logout...');
      await firebaseSignOut(auth);
      this.currentUser = null;
      localStorage.removeItem('token');
      console.log('Logout successful');
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  }

  isAuthenticated(): boolean {
    const isAuth = !!this.currentUser && !!localStorage.getItem('token');
    console.log('Checking authentication:', isAuth);
    return isAuth;
  }

  async getToken(): Promise<string | null> {
    try {
      const token = localStorage.getItem('token');
      if (!token && auth.currentUser) {
        const newToken = await auth.currentUser.getIdToken();
        localStorage.setItem('token', newToken);
        return newToken;
      }
      return token;
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  async handleCallback(token: string) {
    try {
      // Store the token in localStorage
      localStorage.setItem('token', token);
      // You can add additional token validation or user info fetching here
      return true;
    } catch (error) {
      console.error('Error handling callback:', error);
      throw error;
    }
  }
}

export default AuthService.getInstance(); 