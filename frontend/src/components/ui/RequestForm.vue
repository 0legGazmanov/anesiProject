<script setup>
    import { reactive } from 'vue';
    import ButtonBase from '@/components/ui/ButtonBase.vue';
    import { useAuthStore } from '@/stores/auth';

    const authStore = useAuthStore();
    defineProps({
        loading: {
            type: Boolean,
            default: false
        },
        error: {
            type: String,
            default: ''
        }
    });

    const emit = defineEmits(['submit']);
    const form = reactive({
        firstName: authStore.user?.firstName ?? '',
        lastName: authStore.user?.lastName ?? '',
        email: authStore.user?.email ?? '',
        phone: authStore.user?.phone ?? '',
        service: '',
        description: ''
    });

    function submitRequest() {
        emit('submit', { ...form });
    }
</script>
<template>
    <form class="request-form" @submit.prevent="submitRequest">
        <div class="heading">
            <p class="subtitle">ANESI ATELIER</p>
            <h2 class="title">Оставить заявку</h2>
            <p class="description">
                Расскажите о своём проекте, и мы свяжемся с вами
                для обсуждения деталей.
            </p>
        </div>
        <div class="fields">
            <div class="row">
                <div class="field">
                    <label for="request-first-name">Имя</label>
                    <input id="request-first-name" v-model.trim="form.firstName" type="text" placeholder="Имя" required/>
                </div>
                <div class="field">
                    <label for="request-last-name">Фамилия</label>
                    <input id="request-last-name" v-model.trim="form.lastName" type="text" placeholder="Фамилия"/>
                </div>
                <div class="field">
                    <label for="request-email">Email</label>
                    <input id="request-email" v-model.trim="form.email" type="email" placeholder="example@mail.com" required/>
                </div>
            </div>
            <div class="row">
                <div class="field">
                    <label for="request-phone">Телефон</label>
                    <input id="request-phone" v-model.trim="form.phone" type="tel" placeholder="+7..." required/>
                </div>
                <div class="field">
                    <label for="request-service">Тип проекта</label>
                    <select id="request-service" v-model="form.service" required>
                        <option value="" disabled>
                            Выберите направление
                        </option>
                        <option value="furniture">
                            Индивидуальная мебель
                        </option>
                        <option value="materials">
                            Подбор материалов
                        </option>
                        <option value="interior">
                            Интерьерное решение
                        </option>
                    </select>
                </div>
            </div>
            <div class="field">
                <label for="request-description">
                    Описание проекта
                </label>
                <textarea id="request-description" v-model.trim="form.description" placeholder="Расскажите о вашей идее..." rows="5" required></textarea>
            </div>
        </div>
        <p v-if="error" class="message error">
            {{ error }}
        </p>
        <ButtonBase type="submit" :loading="loading" :disabled="loading">
            Отправить заявку
            <i class="fa-solid fa-arrow-right"></i>
        </ButtonBase>
    </form>
</template>
