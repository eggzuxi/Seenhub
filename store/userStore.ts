import { create } from 'zustand';
import { User } from '../types/user';

interface UserState {
    user: User | null;
    setUser: (user: User) => void;
    clearUser: () => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
}

const useUserStore = create<UserState>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    clearUser: () => set({ user: null }),
    loading: false,
    setLoading: (loading) => set({ loading }),
}));

export default useUserStore;