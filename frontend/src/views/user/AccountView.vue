<script setup>
    import api from '@/api';
    import { ref, reactive, computed, watch } from 'vue';
    import { RouterLink, useRouter } from 'vue-router';
    import { useAuthStore } from '@/stores/auth';
    import ButtonBase from '@/components/ui/ButtonBase.vue';
    import ModalBase from '@/components/ui/ModalBase.vue';

    const authStore = useAuthStore();
    const router = useRouter();
    const message = ref('');
    const showEditModal = ref(false);
    const profile = reactive({
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
    });

    const fullName = computed(() => {
        if (!authStore.user) return '';

        return [
            authStore.user.firstName,
            authStore.user.lastName
        ].filter(Boolean).join(' ');
    });

    watch(
        () => authStore.user,
        (user) => {
            profile.firstName = user?.firstName ?? '';
            profile.lastName = user?.lastName ?? '';
            profile.email = user?.email ?? '';
            profile.phone = user?.phone ?? '';
        },
        { immediate: true }
    );

    const orders = ref([]);
    const ordersLoading = ref(false);
    const ordersError = ref('');
    const selectedOrder = ref(null);
    const hasOrders = computed(() => orders.value.length > 0);
    const orderStatuses = {
        pending: 'Ожидает подтверждения',
        confirmed: 'Подтверждён',
        processing: 'В обработке',
        shipped: 'Отправлен',
        delivered: 'Доставлен',
        cancelled: 'Отменён'
    };

    const productTypes = {
        catalog: 'Готовый комплект',
        gallery: 'Индивидуальная мебель',
        decor: 'Декор'
    };

    function formatDate(date) {
        return new Date(date).toLocaleString('ru-RU');
    }

    async function fetchOrders(userId) {
        ordersLoading.value = true;
        ordersError.value = '';

        try {
            const response = await api.get(`/orders/user/${userId}`);

            if (authStore.user?.id !== userId) return;
            
            orders.value = response.data.sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
        } catch (error) {
            console.log(error);
            ordersError.value = 'Не удалось загрузить историю заказов.';
        } finally {
            ordersLoading.value = false;
        }
    }
    watch(
        () => authStore.user?.id,
        (userId) => {
            orders.value = [];
            selectedOrder.value = null;

            if (userId) {
                fetchOrders(userId);
            }
        },
        { immediate: true }
    );

    function startEditing() {
        profile.firstName = authStore.user?.firstName ?? '';
        profile.lastName = authStore.user?.lastName ?? '';
        profile.email = authStore.user?.email ?? '';
        profile.phone = authStore.user?.phone ?? '';

        message.value = '';
        showEditModal.value = true;
    }

    function cancelEditing() {
        if (authStore.loading) return;

        showEditModal.value = false;
        message.value = '';
    }

    async function saveProfile() {
        message.value = '';

        if (
            !profile.firstName.trim() ||
            !profile.lastName.trim() ||
            !profile.email.trim()
        ) {
            message.value = 'Имя, фамилия и email обязательны.';
            return;
        }

        const success = await authStore.updateProfile({
            firstName: profile.firstName.trim(),
            lastName: profile.lastName.trim(),
            email: profile.email.trim(),
            phone: profile.phone.trim()
        });

        if (success) {
            showEditModal.value = false;
        } else {
            message.value = 'Не удалось сохранить изменения.';
        }
    }

    function logout() {
        authStore.logout();
        router.push('/');
    }

    function formatPrice(price) {
        return new Intl.NumberFormat('ru-RU').format(price) + ' ₸';
    }
</script>

<template>
    <main class="account">
        <div v-if="authStore.isAuthenticated" class="wrap">
            <div class="heading">
                <p class="subtitle">MY ACCOUNT</p>
                <h1 class="title">Личный кабинет</h1>
                <p class="description">
                   Добро пожаловать, {{ fullName }}.
                </p>
            </div>
            <div class="big-box">
                <section class="profile">
                    <div class="section-heading">
                        <h2>Личные данные</h2>
                        <ButtonBase variant="text" size="sm" class="edit" @click="startEditing">
                            <i class="fa-solid fa-pen"></i>
                            Редактировать
                        </ButtonBase>
                    </div>
                    <div class="profile-info">
                        <div class="info-item">
                            <span>Имя</span>
                            <p>{{ authStore.user?.firstName || 'Не указано' }}</p>
                        </div>
                        <div class="info-item">
                            <span>Фамилия</span>
                            <p>{{ authStore.user?.lastName || 'Не указана' }}</p>
                        </div>
                        <div class="info-item">
                            <span>Email</span>
                            <p>{{ authStore.user?.email || 'Не указано' }}</p>
                        </div>
                        <div class="info-item">
                            <span>Телефон</span>
                            <p>{{ authStore.user?.phone || 'Не указан' }}</p>
                        </div>
                    </div>
                </section>
                <section class="orders">
                    <div class="section-heading">
                        <h2>История заказов</h2>
                    </div>
                    <p v-if="ordersError" class="error">
                        {{ ordersError }}
                    </p>
                    <p v-if="ordersLoading">
                        Загрузка заказов...
                    </p>
                    <div v-else-if="!hasOrders" class="no-stuff">
                        <i class="fa-solid fa-box-open"></i>
                        <h3>Заказов пока нет</h3>
                        <p>
                            Здесь будут отображаться ваши заказы
                            и информация об их статусе.
                        </p>
                        <RouterLink to="/catalog" class="catalog-link">
                            Перейти в каталог
                        </RouterLink>
                    </div>
                    <div v-else class="orders-list">
                        <article v-for="order in orders" :key="order._id" class="order">
                            <div class="order-heading">
                                <h3>Заказ №{{ order._id.slice(-8) }}</h3>
                                <span class="status">
                                    {{ orderStatuses[order.status] ?? order.status }}
                                </span>
                            </div>
                            <p>Дата: {{ formatDate(order.createdAt) }}</p>
                            <p>
                                Товаров:
                                {{ order.products.reduce((sum, item) => sum + item.quantity, 0) }}
                            </p>
                            <p>
                                Сумма: {{ formatPrice(order.totalPrice) }}
                            </p>
                            <ButtonBase variant="secondary" size="sm" @click="selectedOrder = order">
                                Подробнее
                            </ButtonBase>
                        </article>
                    </div>
                </section>
            </div>
            <div class="bottom">
                <ButtonBase variant="secondary" class="logout" @click="logout">
                    <i class="fa-solid fa-arrow-right-from-bracket"></i>
                    Выйти из аккаунта
                </ButtonBase>
            </div>
        </div>
        <div v-else class="auth-required">
            <h1>Требуется авторизация</h1>
            <p>
                Войдите в аккаунт, чтобы открыть личный кабинет.
            </p>
            <RouterLink to="/login">
                Войти
            </RouterLink>
        </div>
        <ModalBase v-if="showEditModal" @close="cancelEditing">
            <div class="edit-modal">
                <div class="heading">
                    <h2>Редактирование профиля</h2>
                    <p>Измените свои личные данные.</p>
                </div>
                <form class="form" @submit.prevent="saveProfile">
                <div class="field">
                        <label for="edit-first-name">Имя</label>
                        <input id="edit-first-name" v-model.trim="profile.firstName" type="text" autocomplete="given-name" required/>
                    </div>
                    <div class="field">
                        <label for="edit-last-name">Фамилия</label>
                        <input id="edit-last-name" v-model.trim="profile.lastName" type="text" autocomplete="family-name" required/>
                    </div>
                    <div class="field">
                        <label for="edit-email">Email</label>
                        <input id="edit-email" v-model.trim="profile.email" type="email" autocomplete="email" required/>
                    </div>
                    <div class="field">
                        <label for="edit-phone">Телефон</label>
                        <input id="edit-phone" v-model.trim="profile.phone" type="tel" autocomplete="tel" placeholder="+7"/>
                    </div>
                    <p v-if="message" class="error">
                        {{ message }}
                    </p>
                    <div class="actions">
                        <ButtonBase type="submit" :loading="authStore.loading">
                            Сохранить изменения
                        </ButtonBase>
                        <ButtonBase variant="secondary" :disabled="authStore.loading" @click="cancelEditing">
                            Отмена
                        </ButtonBase>
                    </div>
                </form>
            </div>
        </ModalBase>
        <ModalBase v-if="selectedOrder" @close="selectedOrder = null">
            <div class="order-details">
                <p class="subtitle">ORDER DETAILS</p>
                <h2>
                    Заказ №{{ selectedOrder._id.slice(-8) }}
                </h2>
                <p>
                    <strong>Дата:</strong>
                    {{ formatDate(selectedOrder.createdAt) }}
                </p>
                <p>
                    <strong>Статус:</strong>
                    {{ orderStatuses[selectedOrder.status] ?? selectedOrder.status }}
                </p>
                <h3>Товары</h3>
                <div v-for="product in selectedOrder.products" :key="product._id" class="order-product">
                    <strong>{{ product.title }}</strong>
                    <p>
                        {{ productTypes[product.type] ?? product.type }}
                    </p>
                    <template v-if="product.type === 'gallery'">
                        <p>
                            Материал:
                            {{ product.configuration?.material ?? 'Не указан' }}
                        </p>
                        <p>
                            Цвет:
                            {{ product.configuration?.color ?? 'Не указан' }}
                        </p>
                        <p>
                            Размер:
                            {{ product.configuration?.size ?? 'Не указан' }}
                        </p>
                    </template>
                    <p v-if="product.type === 'decor'">
                        Цвет: {{ product.configuration?.color ?? 'Не указан' }}
                    </p>
                    <p>Количество: {{ product.quantity }}</p>
                    <p>Цена за штуку: {{ formatPrice(product.price) }}</p>
                    <p>
                        Сумма:
                        {{ formatPrice(product.price * product.quantity) }}
                    </p>
                </div>
                <h3>
                    Итого: {{ formatPrice(selectedOrder.totalPrice) }}
                </h3>
                <h3>Адрес доставки</h3>
                <p>
                    {{ selectedOrder.address.city }},
                    {{ selectedOrder.address.street }},
                    дом {{ selectedOrder.address.house }}
                    <template v-if="selectedOrder.address.apartment">
                        , кв. {{ selectedOrder.address.apartment }}
                    </template>
                </p>
                <template v-if="selectedOrder.comment">
                    <h3>Комментарий к заказу</h3>
                    <p>{{ selectedOrder.comment }}</p>
                </template>
                <p>
                    Оплата и доставка согласовываются
                    с менеджером после подтверждения заказа.
                </p>
                <ButtonBase variant="secondary" @click="selectedOrder = null">
                    Закрыть
                </ButtonBase>
            </div>
        </ModalBase>
    </main>
</template>