<script setup>
    import { reactive, ref } from 'vue';
    import { RouterLink, useRouter  } from 'vue-router';
    import { useAuthStore } from '@/stores/auth';
    import ButtonBase from '@/components/ui/ButtonBase.vue';

    const showPassword = ref(false);
    const showConfirmPassword = ref(false);
    const errorMessage = ref('');
    const router = useRouter();
    const authStore = useAuthStore();
    const form = reactive({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        agree: false
    });

    async function handleRegister() {
        errorMessage.value = '';
        if (
            !form.firstName ||
            !form.lastName ||
            !form.email ||
            !form.password ||
            !form.confirmPassword
        ) {
            errorMessage.value = 'Заполните все обязательные поля.';
            return;
        }

        if (form.password.length < 8) {
            errorMessage.value = 'Пароль должен содержать минимум 8 символов.';
            return;
        }

        if (form.password !== form.confirmPassword) {
            errorMessage.value = 'Пароли не совпадают.';
            return;
        }

        if (!form.agree) {
            errorMessage.value = 'Необходимо согласиться с условиями.';
            return;
        }

        const success = await authStore.register({
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            phone: form.phone,
            password: form.password
        });

        if (success) {
            router.push('/account');
        } else {
            errorMessage.value = 'Не удалось зарегистрироваться. Возможно, эта почта уже используется.';
        }
    }
</script>
<template>
    <main class="auth-page register-page">
        <div class="wrap">
            <div class="visual">
                <div class="sad-image">
                    <span>IMAGE PLACEHOLDER</span>
                </div>
                <div class="visual-text">
                    <p>άνεση</p>
                    <h2>Designed for the way you live.</h2>
                </div>
            </div>
            <section class="content">
                <div class="heading">
                    <p class="subtitle">JOIN ANESI</p>
                    <h1 class="title">Создать аккаунт</h1>
                    <p class="description">
                        Зарегистрируйтесь, чтобы сохранять
                        свои данные и отслеживать заказы.
                    </p>
                </div>
                <form class="form" @submit.prevent="handleRegister">
                    <div class="field">
                        <label for="register-first-name">Имя</label>
                        <input id="register-first-name" v-model.trim="form.firstName" type="text" autocomplete="given-name" placeholder="Имя" required/>
                    </div>
                    <div class="field">
                        <label for="register-last-name">Фамилия</label>
                        <input id="register-last-name" v-model.trim="form.lastName" type="text" autocomplete="family-name" placeholder="Фамилия" required/>
                    </div>
                    <div class="field">
                        <label for="register-email">Email</label>
                        <input id="register-email" v-model.trim="form.email" type="email" autocomplete="email" placeholder="example@mail.com" required/>
                    </div>
                    <div class="field">
                        <label for="register-phone">Телефон</label>
                        <input id="register-phone" v-model.trim="form.phone" type="tel" autocomplete="tel" placeholder="+7..."/>
                    </div>
                    <div class="field">
                        <label for="register-password">Пароль</label>
                        <div class="password-box">
                            <input id="register-password" v-model="form.password" :type="showPassword ? 'text' : 'password'" autocomplete="new-password" placeholder="Минимум 8 символов" minlength="8" required/>
                            <ButtonBase variant="text" size="sm" class="eye" @click="showPassword = !showPassword">
                                <i :class="showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
                            </ButtonBase>
                        </div>
                    </div>
                    <div class="field">
                        <label for="register-confirm-password">
                            Подтверждение пароля
                        </label>
                        <div class="password-box">
                            <input id="register-confirm-password" v-model="form.confirmPassword" :type="showConfirmPassword ? 'text' : 'password'" autocomplete="new-password" placeholder="Повторите пароль" required/>
                            <ButtonBase variant="text" size="sm" class="eye" @click="showConfirmPassword = !showConfirmPassword">
                                <i :class="showConfirmPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
                            </ButtonBase>
                        </div>
                    </div>

                    <label class="checkbox">
                        <input v-model="form.agree" type="checkbox" required/>
                        <span>
                            Я согласен с условиями использования
                            и обработкой персональных данных.
                        </span>
                    </label>
                    <p v-if="errorMessage" class="error" role="status">
                        {{ errorMessage }}
                    </p>
                    <ButtonBase type="submit" full-width :loading="authStore.loading">
                        Зарегистрироваться
                        <i class="fa-solid fa-arrow-right"></i>
                    </ButtonBase>
                </form>
                <div class="bottom">
                    <p>
                        Уже есть аккаунт?
                        <RouterLink to="/login">
                            Войти
                        </RouterLink>
                    </p>
                </div>
            </section>
        </div>
    </main>
</template>