<script setup>
    import { ref, computed, watch, onMounted } from 'vue';
    import api from '@/api';
    import { RouterLink } from 'vue-router';
    import { useProductsStore } from '@/stores/products';
    import AdminSideBar from '@/components/admin/AdminSideBar.vue';
    import ModalBase from '@/components/ui/ModalBase.vue';
    import ButtonBase from '@/components/ui/ButtonBase.vue';

    const productsStore = useProductsStore();
    const activeSection = ref('overview');
    const productToDelete = ref(null);
    const isDeleting = ref(false);
    const requests = ref([]);
    const requestsLoading = ref(false);
    const requestsError = ref('');
    const updatingRequestId = ref(null);
    const selectedRequest = ref(null);
    const orders = ref([]);
    const ordersLoading = ref(false);
    const ordersError = ref('');
    const updatingOrderId = ref(null);
    const selectedOrder = ref(null);

    const requestStatuses = {
        pending: 'Ожидает обработки',
        processing: 'В работе',
        completed: 'Завершена',
        cancelled: 'Отменена'
    };

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

    const sortedOrders = computed(() =>
        [...orders.value].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )
    );

    async function fetchOrders() {
        ordersLoading.value = true;
        ordersError.value = '';

        try {
            const response = await api.get('/orders');
            orders.value = response.data;
        } catch (error) {
            console.log(error);
            ordersError.value = 'Не удалось загрузить заказы.';
        } finally {
            ordersLoading.value = false;
        }
    }

    async function updateOrderStatus(order, status) {
        if (updatingOrderId.value) return;

        updatingOrderId.value = order._id;
        ordersError.value = '';

        try {
            const response = await api.patch(
                `/orders/${order._id}/status`,
                { status }
            );

            const index = orders.value.findIndex(
                item => item._id === order._id
            );

            if (index !== -1) {
                orders.value[index] = response.data;
            }

            if (selectedOrder.value?._id === order._id) {
                selectedOrder.value = response.data;
            }
        } catch (error) {
            console.log(error);
            ordersError.value = 'Не удалось изменить статус заказа.';
            await fetchOrders();
        } finally {
            updatingOrderId.value = null;
        }
    }

    const sortedRequests = computed(() =>
        [...requests.value].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )
    );

    function formatDate(date) {
        return new Date(date).toLocaleString('ru-RU');
    }

    async function fetchRequests() {
        requestsLoading.value = true;
        requestsError.value = '';

        try {
            const response = await api.get('/requests');
            requests.value = response.data;
        } catch (error) {
            console.log(error);
            requestsError.value = 'Не удалось загрузить заявки.';
        } finally {
            requestsLoading.value = false;
        }
    }

    async function updateRequestStatus(request, status) {
        if (updatingRequestId.value) return;

        updatingRequestId.value = request._id;

        try {
            const response = await api.patch(
                `/requests/${request._id}/status`,
                { status }
            );

            const index = requests.value.findIndex(
                item => item._id === request._id
            );

            if (index !== -1) {
                requests.value[index] = response.data;
            }

            if (selectedRequest.value?._id === request._id) {
                selectedRequest.value = response.data;
            }
        } catch (error) {
            console.log(error);
            requestsError.value = 'Не удалось изменить статус заявки.';
        } finally {
            updatingRequestId.value = null;
        }
    }

    onMounted(() => {
        fetchRequests();
        fetchOrders();
    });

    const categories = {
        catalog: {
            title: 'Каталог',
            label: 'Готовые комплекты',
            createRoute: '/admin/catalog/new',
            editRoute: '/admin/catalog/edit'
        },
        gallery: {
            title: 'Галерея',
            label: 'Индивидуальная мебель',
            createRoute: '/admin/gallery/new',
            editRoute: '/admin/gallery/edit'
        },
        decor: {
            title: 'Декор',
            label: 'Предметы декора',
            createRoute: '/admin/decor/new',
            editRoute: '/admin/decor/edit'
        }
    };

    const currentCategory = computed(() => categories[activeSection.value]);

    const currentProducts = computed(() => {
        if (!currentCategory.value) return [];

        return productsStore[activeSection.value] ?? [];
    });

    const totalProducts = computed(() =>
        productsStore.catalog.length +
        productsStore.gallery.length +
        productsStore.decor.length
    );

    const productStats = computed(() => [
        { title: 'Каталог', count: productsStore.catalog.length, section: 'catalog' },
        { title: 'Галерея', count: productsStore.gallery.length, section: 'gallery' },
        { title: 'Декор', count: productsStore.decor.length, section: 'decor' }
    ]);

    function formatPrice(price) {
        return new Intl.NumberFormat('ru-RU').format(price) + ' ₸';
    }

    function openDeleteModal(product) {
        productToDelete.value = {
            id: product.id,
            title: product.title,
            type: activeSection.value
        };
    }

    function closeDeleteModal() {
        if (isDeleting.value) return;

        productToDelete.value = null;
    }

    async function deleteSelectedProduct() {
        if (!productToDelete.value || isDeleting.value) return;

        isDeleting.value = true;

        try {
            const success = await productsStore.deleteProduct(
                productToDelete.value.type,
                productToDelete.value.id
            );

            if (success) {
                productToDelete.value = null;
            }
        } finally {
            isDeleting.value = false;
        }
    }
</script>
<template>
    <main class="admin">
        <div class="layout">
            <AdminSideBar :active-section="activeSection" @change-section="activeSection = $event"/>
            <div class="content">
                <section v-if="activeSection === 'overview'" class="overview">
                    <div class="heading">
                        <p class="subtitle">OVERVIEW</p>
                        <h1 class="title">Панель управления</h1>
                        <p class="description">
                            Общая информация о магазине ANESI.
                        </p>
                    </div>
                    <div class="stats">
                        <button
                            v-for="stat in productStats" :key="stat.section" type="button" class="stat-card" @click="activeSection = stat.section">
                            <span>{{ stat.title }}</span>
                            <strong>{{ stat.count }}</strong>
                        </button>
                    </div>
                    <p class="total">
                        Всего товаров: {{ totalProducts }}
                    </p>
                    <div class="overview-blocks">
                        <section class="overview-block">
                            <h2 class="section-title">Последние заказы</h2>
                            <p>Всего заказов: {{ orders.length }}</p>
                            <p v-if="sortedOrders.length">
                                Последний заказ:
                                {{ formatPrice(sortedOrders[0].totalPrice) }}
                            </p>
                            <ButtonBase variant="secondary" @click="activeSection = 'orders'">
                                Перейти к заказам
                            </ButtonBase>
                        </section>
                        <section class="overview-block">
                            <h2 class="section-title">Заявки Atelier</h2>
                            <p>
                                Всего заявок: {{ requests.length }}
                            </p>
                            <ButtonBase variant="secondary" @click="activeSection = 'requests'">
                                Перейти к заявкам
                            </ButtonBase>
                        </section>
                    </div>
                </section>
                <section v-else-if="currentCategory" class="products">
                    <div class="heading">
                        <div>
                            <p class="subtitle">PRODUCT MANAGEMENT</p>
                            <h1 class="title">{{ currentCategory.title }}</h1>
                            <p class="description">{{ currentCategory.label }}</p>
                        </div>
                        <RouterLink :to="currentCategory.createRoute" class="create-link">
                            <i class="fa-solid fa-plus"></i>
                            Добавить товар
                        </RouterLink>
                    </div>
                    <div v-if="currentProducts.length === 0" class="no-stuff">
                        <h2>Товаров пока нет</h2>
                        <p>Добавьте первый товар в этот раздел.</p>
                    </div>
                    <div v-else class="table-wrap">
                        <table class="products-table">
                            <thead>
                                <tr>
                                    <th>Товар</th>
                                    <th>Категория</th>
                                    <th>Цена</th>
                                    <th>Наличие</th>
                                    <th>Действия</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="product in currentProducts" :key="product.id">
                                    <td>
                                        <div class="product-info">
                                            <div class="sad-image">
                                                IMAGE
                                            </div>
                                            <div>
                                                <strong>{{ product.title }}</strong>
                                                <p class="product-id">
                                                    ID: {{ product.id }}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        {{ product.category || '—' }}
                                    </td>
                                    <td>
                                        <div class="money-box">
                                            <span class="price">
                                                {{ formatPrice(product.finalPrice) }}
                                            </span>
                                            <span v-if="product.discount > 0" class="old-price">
                                                {{ formatPrice(product.price) }}
                                            </span>
                                            <span v-if="product.discount > 0" class="discount">
                                                -{{ product.discount }}%
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <template v-if="activeSection === 'decor'">
                                            {{ product.inStock > 0 ? `${product.inStock} шт.` : 'Нет в наличии' }}
                                        </template>
                                        <template v-else-if="activeSection === 'gallery'">
                                            Под заказ
                                        </template>
                                        <template v-else>
                                            {{ product.inStock ? 'В наличии' : 'Нет в наличии' }}
                                        </template>
                                    </td>
                                    <td>
                                        <div class="actions">
                                            <RouterLink :to="`${currentCategory.editRoute}/${product.id}`" class="edit-link">
                                                <i class="fa-solid fa-pen"></i>
                                                Редактировать
                                            </RouterLink>
                                            <ButtonBase variant="text" size="sm" class="remove" @click="openDeleteModal(product)">
                                                <i class="fa-solid fa-trash"></i>
                                                Удалить
                                            </ButtonBase>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>
                <section v-else-if="activeSection === 'orders'" class="orders">
                    <div class="heading">
                        <p class="subtitle">ORDERS</p>
                        <h1 class="title">Заказы</h1>
                        <p class="description">
                            Управление заказами клиентов.
                        </p>
                    </div>
                    <p v-if="ordersError" class="error">
                        {{ ordersError }}
                    </p>
                    <p v-if="ordersLoading">Загрузка заказов...</p>
                    <div v-else-if="!orders.length" class="no-stuff">
                        <h2>Заказов пока нет</h2>
                        <p>Новые заказы клиентов появятся здесь.</p>
                    </div>
                    <div v-else class="table-wrap">
                        <table class="orders-table">
                            <thead>
                                <tr>
                                    <th>Заказ</th>
                                    <th>Клиент</th>
                                    <th>Дата</th>
                                    <th>Товары</th>
                                    <th>Сумма</th>
                                    <th>Статус</th>
                                    <th>Действия</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="order in sortedOrders" :key="order._id">
                                    <td>
                                        {{ order._id.slice(-8) }}
                                    </td>
                                    <td>
                                        <strong>
                                            {{ order.person.firstName }}
                                            {{ order.person.lastName }}
                                        </strong>
                                        <p>{{ order.person.email }}</p>
                                    </td>
                                    <td>{{ formatDate(order.createdAt) }}</td>
                                    <td>
                                        {{ order.products.reduce((sum, item) => sum + item.quantity, 0) }}
                                    </td>
                                    <td>{{ formatPrice(order.totalPrice) }}</td>
                                    <td>
                                        <select :value="order.status" :disabled="updatingOrderId === order._id" @change="updateOrderStatus(order, $event.target.value)">
                                            <option v-for="(label, value) in orderStatuses":key="value" :value="value">
                                                {{ label }}
                                            </option>
                                        </select>
                                    </td>
                                    <td>
                                        <ButtonBase variant="secondary" size="sm" @click="selectedOrder = order">
                                            Подробнее
                                        </ButtonBase>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <section v-else-if="activeSection === 'requests'" class="requests">
                    <div class="heading">
                        <p class="subtitle">ATELIER REQUESTS</p>
                        <h1 class="title">Заявки Atelier</h1>
                        <p class="description">
                            Заявки на индивидуальные проекты.
                        </p>
                    </div>
                    <p v-if="requestsError" class="error">
                        {{ requestsError }}
                    </p>
                    <p v-if="requestsLoading">
                        Загрузка заявок...
                    </p>
                    <div v-else-if="!requests.length" class="no-stuff">
                        <h2>Заявок пока нет</h2>
                        <p>Новые обращения клиентов появятся здесь.</p>
                    </div>
                    <div v-else class="table-wrap">
                        <table class="requests-table">
                            <thead>
                                <tr>
                                    <th>Клиент</th>
                                    <th>Контакты</th>
                                    <th>Дата</th>
                                    <th>Статус</th>
                                    <th>Действия</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="request in sortedRequests" :key="request._id">
                                    <td>
                                        <strong>
                                            {{ request.firstName }} {{ request.lastName }}
                                        </strong>
                                    </td>
                                    <td>
                                        <p>{{ request.email }}</p>
                                        <p>{{ request.phone }}</p>
                                    </td>
                                    <td>
                                        {{ formatDate(request.createdAt) }}
                                    </td>
                                    <td>
                                        <select :value="request.status" :disabled="updatingRequestId === request._id" @change="updateRequestStatus(request, $event.target.value)">
                                            <option v-for="(label, value) in requestStatuses" :key="value" :value="value">
                                                {{ label }}
                                            </option>
                                        </select>
                                    </td>
                                    <td>
                                        <ButtonBase variant="secondary" size="sm" @click="selectedRequest = request">
                                            Подробнее
                                        </ButtonBase>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </div>
        <ModalBase v-if="productToDelete" @close="closeDeleteModal">
            <div class="delete-modal">
                <div class="warning-icon">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                </div>
                <h2>Удалить товар?</h2>
                <p>
                    Вы действительно хотите удалить
                    «{{ productToDelete.title }}»?
                </p>
                <p>Это действие нельзя будет отменить.</p>
                <div class="actions">
                    <ButtonBase variant="secondary" :disabled="isDeleting" @click="closeDeleteModal">
                        Отмена
                    </ButtonBase>
                    <ButtonBase class="delete-confirm" :loading="isDeleting" @click="deleteSelectedProduct">
                        Удалить
                    </ButtonBase>
                </div>
            </div>
        </ModalBase>
        <ModalBase v-if="selectedRequest" @close="selectedRequest = null">
            <div class="request-details">
                <p class="subtitle">ATELIER REQUEST</p>
                <h2>Информация о заявке</h2>
                <p>
                    <strong>Клиент:</strong>
                    {{ selectedRequest.firstName }}
                    {{ selectedRequest.lastName }}
                </p>
                <p>
                    <strong>Email:</strong>
                    {{ selectedRequest.email }}
                </p>
                <p>
                    <strong>Телефон:</strong>
                    {{ selectedRequest.phone }}
                </p>
                <p>
                    <strong>Дата:</strong>
                    {{ formatDate(selectedRequest.createdAt) }}
                </p>
                <p>
                    <strong>Статус:</strong>
                    {{ requestStatuses[selectedRequest.status] }}
                </p>
                <div class="description">
                    <strong>Описание проекта:</strong>
                    <p style="white-space: pre-line;">
                        {{ selectedRequest.description }}
                    </p>
                </div>
                <ButtonBase variant="secondary" @click="selectedRequest = null">
                    Закрыть
                </ButtonBase>
            </div>
        </ModalBase>
        <ModalBase v-if="selectedOrder"@close="selectedOrder = null">
            <div class="order-details">
                <p class="subtitle">ORDER DETAILS</p>
                <h2>Заказ №{{ selectedOrder._id.slice(-8) }}</h2>
                <p>
                    <strong>Дата:</strong>
                    {{ formatDate(selectedOrder.createdAt) }}
                </p>
                <p>
                    <strong>Статус:</strong>
                    {{ orderStatuses[selectedOrder.status] }}
                </p>
                <h3>Покупатель</h3>
                <p>
                    {{ selectedOrder.person.firstName }}
                    {{ selectedOrder.person.lastName }}
                </p>
                <p>{{ selectedOrder.person.email }}</p>
                <p>{{ selectedOrder.person.phone }}</p>
                <h3>Адрес доставки</h3>
                <p>
                    {{ selectedOrder.address.city }},
                    {{ selectedOrder.address.street }},
                    дом {{ selectedOrder.address.house }}
                    <template v-if="selectedOrder.address.apartment">
                        , кв. {{ selectedOrder.address.apartment }}
                    </template>
                </p>
                <h3>Товары</h3>
                <div
                    v-for="product in selectedOrder.products"
                    :key="product._id"
                    class="order-product">
                    <strong>{{ product.title }}</strong>
                    <p>{{ productTypes[product.type] ?? product.type }}</p>
                    <template v-if="product.type === 'gallery'">
                        <p>Материал: {{ product.configuration?.material ?? 'Не указан' }}</p>
                        <p>Цвет: {{ product.configuration?.color ?? 'Не указан' }}</p>
                        <p>Размер: {{ product.configuration?.size ?? 'Не указан' }}</p>
                    </template>

                    <p v-if="product.type === 'decor'">
                        Цвет: {{ product.configuration?.color ?? 'Не указан' }}
                    </p>
                    <p>Количество: {{ product.quantity }}</p>
                    <p>Цена за штуку: {{ formatPrice(product.price) }}</p>
                    <p>
                        Сумма: {{ formatPrice(product.price * product.quantity) }}
                    </p>
                </div>
                <h3>Итого: {{ formatPrice(selectedOrder.totalPrice) }}</h3>
                <template v-if="selectedOrder.comment">
                    <h3>Комментарий покупателя</h3>
                    <p>{{ selectedOrder.comment }}</p>
                </template>
                <ButtonBase variant="secondary" @click="selectedOrder = null">
                    Закрыть
                </ButtonBase>
            </div>
        </ModalBase>
    </main>
</template>