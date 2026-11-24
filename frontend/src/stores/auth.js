import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import api from '@/api';

export const useAuthStore = defineStore('auth', () => {

    const savedUser = localStorage.getItem('anesi-user');
    const user = ref(savedUser ? JSON.parse(savedUser) : null);
    const loading = ref(false);
    const isAuthenticated = computed(() => user.value !== null);
    const isAdmin = computed(() => user.value?.role === 'admin');
    
    watch(
        user,
        (value) => {
            if (value) {
                localStorage.setItem('anesi-user', JSON.stringify(value));
            } else {
                localStorage.removeItem('anesi-user');
            }
        },
        { deep: true, flush: 'sync' }
    );

    function setUser(userData) {
        user.value = userData;
    }

    async function login(email, password) {
        loading.value = true;

        try {
            const response = await api.post('/users/login', {
                email,
                password
            });

            setUser(response.data);
            return true;
        } catch (error) {
            console.log(error);
            return false;
        } finally {
            loading.value = false;
        }
    }

    async function register(userData) {
        loading.value = true;

        try {
            const response = await api.post('/users/register', userData);

            setUser(response.data);
            return true;
        } catch (error) {
            console.log(error);
            return false;
        } finally {
            loading.value = false;
        }
    }

    async function updateProfile(userData) {
        if (!user.value?.id) return false;

        loading.value = true;

        try {
            const response = await api.put(
                `/users/${user.value.id}`,
                userData
            );

            setUser(response.data);
            return true;
        } catch (error) {
            console.log(error);
            return false;
        } finally {
            loading.value = false;
        }
    }

    function logout() {
        user.value = null;
    }

    return {
        user,
        loading,
        isAuthenticated,
        isAdmin,
        setUser,
        login,
        register,
        updateProfile,
        logout
    };
});
