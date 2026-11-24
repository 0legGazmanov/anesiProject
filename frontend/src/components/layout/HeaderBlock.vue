<script setup>
    import { RouterLink, useRouter } from 'vue-router';
    import { useAuthStore } from '@/stores/auth';
    import ButtonBase from '@/components/ui/ButtonBase.vue';

    const authStore = useAuthStore();
    const router = useRouter();

    function logout() {
        authStore.logout();
        router.push('/');
    }
</script>

<template>
    <header class="header">
        <div class="wrap">
            <RouterLink to="/" class="logo">
                άνεση
            </RouterLink>
            <nav class="menu">
                <RouterLink to="/catalog">Catalog</RouterLink>
                <RouterLink to="/gallery">Gallery</RouterLink>
                <RouterLink to="/decor">Decor</RouterLink>
                <RouterLink to="/atelier">Atelier</RouterLink>
            </nav>
            <div class="actions">
                <RouterLink to="/basket" class="basket-link">
                    Basket
                </RouterLink>
                <RouterLink v-if="!authStore.isAuthenticated" to="/login" class="login-link">
                    Log in
                </RouterLink>
                <template v-else>
                    <RouterLink to="/account" class="account-link">
                        Account
                    </RouterLink>
                    <RouterLink v-if="authStore.isAdmin" to="/admin" class="admin-link">
                        Admin
                    </RouterLink>
                    <ButtonBase variant="text" size="sm" @click="logout">
                        Log out
                    </ButtonBase>
                </template>
            </div>
        </div>
    </header>
</template>
