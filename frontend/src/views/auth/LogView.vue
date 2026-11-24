<script setup>
    import { reactive, ref } from 'vue';
    import { RouterLink, useRouter } from 'vue-router';
    import { useAuthStore } from '@/stores/auth';
    import ButtonBase from '@/components/ui/ButtonBase.vue';

    const router = useRouter();
    const authStore = useAuthStore();
    const showPassword = ref(false);
    const errorMessage = ref('');
    const form = reactive({
        email: '',
        password: ''
    });

    async function handleLogin() {
        errorMessage.value = '';

        if (!form.email.trim() || !form.password) {
            errorMessage.value = 'Заполните все поля.';
            return;
        }

        const success = await authStore.login(
            form.email,
            form.password
        );

        if (success) {
            router.push('/account');
        } else {
            errorMessage.value = 'Неверная почта или пароль.';
        }
    }

</script>

<template>
    <main class="auth-page login-page">
        <div class="wrap">
            <div class="visual">
                <div class="sad-image">
                    <span>IMAGE PLACEHOLDER</span>
                </div>
                <div class="visual-text">
                    <p>άνεση</p>
                    <h2>Comfort, thoughtfully crafted.</h2>
                </div>
            </div>
            <section class="content">
                <div class="heading">
                    <p class="subtitle">WELCOME BACK</p>
                    <h1 class="title">С возвращением</h1>
                    <p class="description">
                        Войдите в свой аккаунт, чтобы управлять
                        заказами и личными данными.
                    </p>
                </div>
                <form class="form" @submit.prevent="handleLogin">
                    <div class="field">
                        <label for="login-email">Email</label>
                        <input id="login-email" v-model.trim="form.email" type="email" autocomplete="email" placeholder="example@mail.com" required/>
                    </div>
                    <div class="field">
                        <label for="login-password">Пароль</label>
                        <div class="password-box">
                            <input id="login-password" v-model="form.password" :type="showPassword ? 'text' : 'password'" autocomplete="current-password" placeholder="Введите пароль" required/>
                            <ButtonBase variant="text" size="sm" class="eye" @click="showPassword = !showPassword">
                                <i :class="showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
                            </ButtonBase>
                        </div>
                    </div>
                    <p v-if="errorMessage" class="error" role="status">
                        {{ errorMessage }}
                    </p>
                    <ButtonBase type="submit" full-width :loading="authStore.loading">
                        Войти
                        <i class="fa-solid fa-arrow-right"></i>
                    </ButtonBase>
                </form>
                <div class="bottom">
                    <p>
                        Ещё нет аккаунта?
                        <RouterLink to="/regist">
                            Зарегистрироваться
                        </RouterLink>
                    </p>
                </div>
            </section>
        </div>
    </main>
</template>