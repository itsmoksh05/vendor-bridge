import { useAuthStore } from '../store/authStore';

export function useAuth() {
  const { user, token, isAuthenticated, login, logout } = useAuthStore();
  
  const hasRole = (roles) => {
    if (!user) return false;
    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    return user.role === roles;
  };

  return {
    user,
    token,
    isAuthenticated,
    login,
    logout,
    hasRole,
    isAdmin: user?.role === 'ADMIN',
    isProcurementOfficer: user?.role === 'PROCUREMENT_OFFICER',
    isVendor: user?.role === 'VENDOR',
    isManager: user?.role === 'MANAGER',
  };
}

export default useAuth;
