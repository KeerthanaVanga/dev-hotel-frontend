export interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  refreshAuth: () => Promise<void>;
  logoutUser: () => Promise<void>;
  setLoading: (loading: boolean) => void;
}
