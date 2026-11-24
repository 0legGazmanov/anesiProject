<script setup>
    import { reactive } from 'vue';
    import { useAuthStore } from '@/stores/auth';
    import api from '@/api';
    import { ref, computed } from 'vue';
    import { useCartStore } from '@/stores/cart';
    import ButtonBase from '@/components/ui/ButtonBase.vue';
    import SuccessModal from '@/components/ui/SuccessModal.vue';
    import ModalBase from '@/components/ui/ModalBase.vue';

    const cartStore = useCartStore();
    const authStore = useAuthStore();
    const showCheckout = ref(false);
    const isSubmitting = ref(false);
    const checkoutError = ref('');

    const orderForm = reactive({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        city: '',
        street: '',
        house: '',
        apartment: '',
        comment: ''
    });

    function openCheckout() {
        orderForm.firstName = authStore.user?.firstName ?? '';
        orderForm.lastName = authStore.user?.lastName ?? '';
        orderForm.email = authStore.user?.email ?? '';
        orderForm.phone = authStore.user?.phone ?? '';

        checkoutError.value = '';
        showCheckout.value = true;
    }
    const showSuccess = ref(false);
    const isEmpty = computed(() => cartStore.items.length === 0);

    const productTypes = {
        catalog: 'Готовый комплект',
        gallery: 'Индивидуальная мебель',
        decor: 'Декор'
    };

    function increaseQuantity(item) {
        cartStore.updateQuantity(item.cartKey, item.quantity + 1);
    }

    function decreaseQuantity(item) {
        if (item.quantity <= 1) return;

        cartStore.updateQuantity(item.cartKey, item.quantity - 1);
    }

    function removeProduct(item) {
        cartStore.removeItem(item.cartKey);
    }

    function formatPrice(price) {
        return new Intl.NumberFormat('ru-RU').format(price) + ' ₸';
    }

    async function checkout() {
        if (isSubmitting.value || isEmpty.value) return;

        isSubmitting.value = true;
        checkoutError.value = '';

        try {
            const products = cartStore.items.map(item => ({
                productId: item.id,
                type: item.type,
                quantity: item.quantity,
                configuration: {
                    material: item.selectedMaterial,
                    color: item.selectedColor,
                    size: item.selectedSize
                }
            }));

            await api.post('/orders', {
                user: authStore.user.id,
                products,
                person: {
                    firstName: orderForm.firstName,
                    lastName: orderForm.lastName,
                    email: orderForm.email,
                    phone: orderForm.phone
                },
                address: {
                    city: orderForm.city,
                    street: orderForm.street,
                    house: orderForm.house,
                    apartment: orderForm.apartment
                },
                comment: orderForm.comment
            });

            showCheckout.value = false;
            cartStore.clearCart();
            showSuccess.value = true;
        } catch (error) {
            console.log('Ошибка заказа:', error.response?.data);
            console.log('Отправленные товары:', cartStore.items);

            checkoutError.value =
                error.response?.data?.message ??
                'Не удалось оформить заказ.';

            checkoutError.value =
                error.response?.data?.message ??
                'Не удалось оформить заказ.';
        } finally {
            isSubmitting.value = false;
        }
    }
</script>
<template>
    <main class="basket">
        <div class="wrap">
            <div class="heading">
                <p class="subtitle">YOUR SELECTION</p>
                <h1 class="title">Корзина</h1>
                <p v-if="!isEmpty" class="count">
                    Товаров: {{ cartStore.totalCount }}
                </p>
            </div>
            <section v-if="isEmpty" class="no-stuff">
                <i class="fa-solid fa-basket-shopping"></i>
                <h2>Ваша корзина пуста</h2>
                <p>
                    Вы ещё не добавили товары.
                    Посмотрите нашу коллекцию мебели и декора.
                </p>
                <RouterLink to="/catalog" class="catalog-link">
                    Перейти в каталог
                    <i class="fa-solid fa-arrow-right"></i>
                </RouterLink>
            </section>
            <div v-else class="big-box">
                <section class="items">
                    <div class="section-heading">
                        <h2>Выбранные товары</h2>
                        <ButtonBase variant="text" size="sm" class="clear" @click="cartStore.clearCart()">
                            Очистить корзину
                        </ButtonBase>
                    </div>
                    <article v-for="item in cartStore.items" :key="item.cartKey" class="item">
                        <div class="photos">
                            <div class="sad-image">
                                <span>IMAGE PLACEHOLDER</span>
                            </div>
                        </div>
                        <div class="info">
                            <p class="category">
                                {{ productTypes[item.type] || 'Товар' }}
                            </p>
                            <h3 class="product-name">
                                {{ item.title }}
                            </h3>
                            <p v-if="item.type === 'decor'">
                                Цвет: {{ item.selectedColor }}
                            </p>
                            <div v-if="item.type === 'gallery'" class="options">
                                <p>Материал: {{ item.selectedMaterial }}</p>
                                <p>Цвет: {{ item.selectedColor }}</p>
                                <p>Размер: {{ item.selectedSize }}</p>
                            </div>
                            <p class="price">
                                {{ formatPrice(item.finalPrice ?? item.price) }} / шт.
                            </p>
                            <div class="actions">
                                <div class="counter">
                                    <ButtonBase variant="secondary" size="sm" class="counter-btn" :disabled="item.quantity <= 1" @click="decreaseQuantity(item)">
                                        <i class="fa-solid fa-minus"></i>
                                    </ButtonBase>
                                    <span class="count">
                                        {{ item.quantity }}
                                    </span>
                                    <ButtonBase variant="secondary" size="sm" class="counter-btn" @click="increaseQuantity(item)">
                                        <i class="fa-solid fa-plus"></i>
                                    </ButtonBase>
                                </div>
                                <ButtonBase variant="text" size="sm" class="remove" @click="removeProduct(item)">
                                    <i class="fa-solid fa-trash"></i>
                                    Удалить
                                </ButtonBase>
                            </div>
                        </div>
                        <div class="total-price">
                            <p>
                                {{ formatPrice((item.finalPrice ?? item.price) * item.quantity) }}
                            </p>
                        </div>
                    </article>
                </section>
                <div class="summary">
                    <h2 class="section-title">
                        Ваш заказ
                    </h2>
                    <div class="summary-details">
                        <div class="summary-row">
                            <span>Количество товаров</span>
                            <span>{{ cartStore.totalCount }}</span>
                        </div>
                        <div class="summary-row">
                            <span>Стоимость товаров</span>
                            <span>{{ formatPrice(cartStore.totalPrice) }}</span>
                        </div>
                        <div class="summary-row">
                            <span>Доставка</span>
                            <span>Рассчитывается при оформлении</span>
                        </div>
                    </div>
                    <div class="money-box">
                        <span>Итого</span>
                        <strong>
                            {{ formatPrice(cartStore.totalPrice) }}
                        </strong>
                    </div>
                    <ButtonBase size="lg" full-width @click="openCheckout">
                        Оформить заказ
                        <i class="fa-solid fa-arrow-right"></i>
                    </ButtonBase>
                    <p class="note">
                        Итоговая стоимость доставки будет определена
                        при оформлении заказа.
                    </p>
                </div>
            </div>
        </div>
        <ModalBase v-if="showCheckout" @close="!isSubmitting && (showCheckout = false)">
            <div class="checkout-modal">
                <h2>Оформление заказа</h2>
                <form @submit.prevent="checkout">
                    <h3>Контактные данные</h3>
                    <input v-model.trim="orderForm.firstName" placeholder="Имя" required/>
                    <input v-model.trim="orderForm.lastName" placeholder="Фамилия" required/>
                    <input v-model.trim="orderForm.email"type="email" placeholder="Email" required/>
                    <input v-model.trim="orderForm.phone" type="tel" placeholder="Телефон" required/>
                    <h3>Адрес доставки</h3>
                    <input v-model.trim="orderForm.city" placeholder="Город" required/>
                    <input v-model.trim="orderForm.street" placeholder="Улица" required/>
                    <input v-model.trim="orderForm.house" placeholder="Дом" required />
                    <input v-model.trim="orderForm.apartment" placeholder="Квартира (необязательно)"/>
                    <textarea v-model.trim="orderForm.comment" placeholder="Комментарий к заказу"></textarea>
                    <p>
                        Итого: {{ formatPrice(cartStore.totalPrice) }}
                    </p>
                    <p>
                        Доставка и оплата согласовываются
                        с менеджером после подтверждения заказа.
                    </p>
                    <p v-if="checkoutError" class="error">
                        {{ checkoutError }}
                    </p>
                    <ButtonBase type="submit" :loading="isSubmitting" :disabled="isSubmitting">
                        Подтвердить заказ
                    </ButtonBase>
                </form>
            </div>
        </ModalBase>

        <SuccessModal v-if="showSuccess" title="Заказ оформлен" message="Ваш заказ успешно оформлен. Информация о нём доступна в личном кабинете." @close="showSuccess = false"/>
    </main>
</template>