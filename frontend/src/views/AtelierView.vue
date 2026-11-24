<script setup>
    import { ref } from 'vue';
    import api from '@/api';
    import { useAuthStore } from '@/stores/auth';
    import ButtonBase from '@/components/ui/ButtonBase.vue';
    import ModalBase from '@/components/ui/ModalBase.vue';
    import RequestForm from '@/components/ui/RequestForm.vue';
    import SuccessModal from '@/components/ui/SuccessModal.vue';

    const isModalOpen = ref(false);
    const requestMessage = ref('');
    const showSuccess = ref(false);
    const authStore = useAuthStore();
    const isSubmitting = ref(false);

    const services = [
        {
            id: 1,
            title: 'Индивидуальная мебель',
            description: 'Создание мебели по вашим размерам, предпочтениям и требованиям.'
        },
        {
            id: 2,
            title: 'Подбор материалов',
            description: 'Выбор тканей, древесины, отделки и цветовых решений.'
        },
        {
            id: 3,
            title: 'Интерьерные решения',
            description: 'Разработка гармоничных решений для жилых и коммерческих пространств.'
        }
    ];

    const steps = [
        {
            number: '01',
            title: 'Заявка',
            description: 'Вы рассказываете нам о своей идее и пожеланиях.'
        },
        {
            number: '02',
            title: 'Обсуждение',
            description: 'Мы уточняем детали, размеры, материалы и бюджет.'
        },
        {
            number: '03',
            title: 'Проектирование',
            description: 'Разрабатываем индивидуальное решение.'
        },
        {
            number: '04',
            title: 'Реализация',
            description: 'Изготавливаем и подготавливаем ваш заказ.'
        }
    ];

    function openModal() {
        requestMessage.value = '';
        isModalOpen.value = true;
    }

    function closeModal() {
        isModalOpen.value = false;
    }

    async function handleRequest(formData) {
        if (isSubmitting.value) return;
        isSubmitting.value = true;
        requestMessage.value = '';

        try {
            const requestData = {
                user: authStore.user?.id ?? null,
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                description: `Тип проекта: ${formData.service}\n\n${formData.description}`
            };

            await api.post('/requests', requestData);

            closeModal();
            showSuccess.value = true;
        } catch (error) {
            console.log(error);
            requestMessage.value = 'Не удалось отправить заявку. Попробуйте ещё раз.';
        } finally {
            isSubmitting.value = false;
        }
    }

    function scrollToRequest() {
        document.getElementById('atelier-request')?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
</script>
<template>
    <main class="atelier">
        <section class="hero">
            <div class="wrap">
                <div class="content">
                    <p class="subtitle">
                        ANESI ATELIER
                    </p>
                    <h1 class="title">
                        Искусство индивидуальности
                    </h1>
                    <p class="description">
                        Мы создаём мебель и интерьерные решения,
                        отражающие ваш характер, стиль и представление
                        об идеальном пространстве.
                    </p>
                    <ButtonBase @click="scrollToRequest">
                        Обсудить проект
                        <i class="fa-solid fa-arrow-down"></i>
                    </ButtonBase>
                </div>
                <div class="visual">
                    <div class="sad-image">
                        <span>IMAGE PLACEHOLDER</span>
                    </div>
                </div>
            </div>
        </section>
        <section class="services">
            <div class="wrap">
                <div class="heading">
                    <p class="subtitle">
                        WHAT WE CREATE
                    </p>
                    <h2 class="section-title">
                        Наши возможности
                    </h2>
                </div>
                <div class="services-grid">
                    <article v-for="service in services" :key="service.id" class="service">
                        <h3 class="title">
                            {{ service.title }}
                        </h3>
                        <p class="description">
                            {{ service.description }}
                        </p>
                    </article>
                </div>
            </div>
        </section>
        <section class="process">
            <div class="wrap">
                <div class="heading">
                    <p class="subtitle">
                        OUR PROCESS
                    </p>
                    <h2 class="section-title">
                        Как мы работаем
                    </h2>
                </div>
                <div class="steps-grid">
                    <article v-for="step in steps" :key="step.number" class="step">
                        <span class="number">
                            {{ step.number }}
                        </span>
                        <h3 class="title">
                            {{ step.title }}
                        </h3>
                        <p class="description">
                            {{ step.description }}
                        </p>
                    </article>
                </div>
            </div>
        </section>
        <section id="atelier-request" class="request">
            <div class="wrap">
                <p class="subtitle">
                    YOUR VISION, OUR CRAFT
                </p>
                <h2 class="section-title">
                    Ваша идея — наше вдохновение
                </h2>
                <p class="description">
                    Расскажите нам о своих пожеланиях,
                    и мы поможем воплотить их в жизнь.
                </p>
                <ButtonBase @click="openModal">
                    Оставить заявку
                    <i class="fa-solid fa-arrow-right"></i>
                </ButtonBase>
            </div>
        </section>
        <ModalBase v-if="isModalOpen" @close="closeModal">
            <RequestForm :loading="isSubmitting" :error="requestMessage" @submit="handleRequest"/>
        </ModalBase>
        <SuccessModal v-if="showSuccess" title="Заявка отправлена" message="Спасибо за обращение! Мы свяжемся с вами для обсуждения проекта." @close="showSuccess = false"/>
    </main>
</template>