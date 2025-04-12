import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AuthState, AuthContextType, LoginCredentials, User } from '../types/auth';

// Mock users for authentication
const mockUsers = [
  {
    id: 'user1',
    username: 'admin',
    password: 'admin123',
    email: 'admin@beautychain.com',
    role: 'admin',
    name: 'Admin User',
    avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=8e44ad&color=fff'
  },
  {
    id: 'user2',
    username: 'manager',
    password: 'manager123',
    email: 'manager@beautychain.com',
    role: 'manager',
    name: 'Manager User',
    avatar: 'https://ui-avatars.com/api/?name=Manager+User&background=2ecc71&color=fff'
  },
  {
    id: 'user3',
    username: 'staff',
    password: 'staff123',
    email: 'staff@beautychain.com',
    role: 'staff',
    name: 'Staff User',
    avatar: 'https://ui-avatars.com/api/?name=Staff+User&background=3498db&color=fff'
  }
];

// Initial state
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: true,
  error: null
};

// Action types
type AuthAction =
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'AUTH_LOADED' };

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        loading: false,
        error: null
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        loading: false,
        error: action.payload
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null
      };
    case 'AUTH_LOADED':
      return {
        ...state,
        loading: false
      };
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser) as User;
          dispatch({ type: 'LOGIN_SUCCESS', payload: user });
        } catch (error) {
          localStorage.removeItem('user');
          dispatch({ type: 'AUTH_LOADED' });
        }
      } else {
        dispatch({ type: 'AUTH_LOADED' });
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Find user with matching credentials
      const user = mockUsers.find(
        u => u.username === credentials.username && u.password === credentials.password
      );

      if (user) {
        // Remove password before storing user
        const { password, ...userWithoutPassword } = user;
        
        // Store user in localStorage
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        
        // Update state
        dispatch({ 
          type: 'LOGIN_SUCCESS', 
          payload: userWithoutPassword as User 
        });
        
        return true;
      } else {
        dispatch({ 
          type: 'LOGIN_FAILURE', 
          payload: 'Invalid username or password' 
        });
        
        return false;
      }
    } catch (error) {
      dispatch({ 
        type: 'LOGIN_FAILURE', 
        payload: 'An error occurred during login' 
      });
      
      return false;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ authState: state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
