import { create } from 'zustand';

const storedToken = localStorage.getItem('vb_token');
const storedUser = localStorage.getItem('vb_user');

let parsedUser = null;
if (storedUser) {
  try {
    parsedUser = JSON.parse(storedUser);
  } catch (e) {
    console.error('Error parsing stored user', e);
  }
}

export const useAuthStore = create((set) => ({
  user: parsedUser,
  token: storedToken,
  isAuthenticated: !!storedToken,

  login: (user, token) => {
    localStorage.setItem('vb_token', token);
    localStorage.setItem('vb_user', JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('vb_token');
    localStorage.removeItem('vb_user');
    // Clear mock storage logs/records on logout if user wants to reset the demo flow (optional)
    set({ user: null, token: null, isAuthenticated: false });
  },
}));

// Default export as well as named export
export default useAuthStore;
