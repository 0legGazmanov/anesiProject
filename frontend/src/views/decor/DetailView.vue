<script setup>
    import { ref, computed, watch } from 'vue';
    import { useRoute, RouterLink } from 'vue-router';
    import { useProductsStore } from '@/stores/products';
    import { useCartStore } from '@/stores/cart';
    import { useAuthStore } from '@/stores/auth';
    import { useNotificationsStore } from '@/stores/notifications';
    import ModalBase from '@/components/ui/ModalBase.vue';
    import ButtonBase from '@/components/ui/ButtonBase.vue';

    const route = useRoute();
    const productsStore = useProductsStore();
    const cartStore = useCartStore();
    const authStore = useAuthStore();
    const notificationsStore = useNotificationsStore();
    const showAuthModal = ref(false);

    const product = computed(() =>
        productsStore.getProduct('decor', route.params.id)
    );

    const selectedColor = ref('');
    const quantity = ref(1);

    watch(product, (newProduct) => {
        selectedColor.value = newProduct?.colors?.[0]?.name ?? '';
        quantity.value = 1;
    }, { immediate: true });

    watch(selectedColor, () => {
        quantity.value = 1;
    });

    const colorOption = computed(() =>
        product.value?.colors?.find(
            color => color.name === selectedColor.value
        )
    );

    const stock = computed(() =>
        Math.max(0, Number(colorOption.value?.inStock) || 0)
    );

    const formattedPrice = computed(() =>
        product.value
            ? new Intl.NumberFormat('ru-RU').format(product.value.finalPrice)
            : ''
    );

    const formattedOldPrice = computed(() =>
        product.value?.discount > 0
            ? new Intl.NumberFormat('ru-RU').format(product.value.price)
            : ''
    );

    const totalPrice = computed(() =>
        (product.value?.finalPrice ?? 0) * quantity.value
    );

    const formattedTotalPrice = computed(() =>
        new Intl.NumberFormat('ru-RU').format(totalPrice.value)
    );

    const canAddToCart = computed(() =>
        Boolean(
            product.value &&
            colorOption.value &&
            stock.value > 0 &&
            Number.isInteger(quantity.value) &&
            quantity.value >= 1 &&
            quantity.value <= stock.value
        )
    );

    function increaseQuantity() {
        if (quantity.value < stock.value) {
            quantity.value++;
        }
    }

    function decreaseQuantity() {
        if (quantity.value > 1) {
            quantity.value--;
        }
    }

    function addToCart() {
        if (!canAddToCart.value) return;

        if (!authStore.isAuthenticated) {
            showAuthModal.value = true;
            return;
        }

        const configuredProduct = {
            ...product.value,
            selectedColor: selectedColor.value,
            inStock: stock.value
        };

        const success = cartStore.addItem(
            configuredProduct,
            'decor',
            quantity.value
        );

        if (success) {
            notificationsStore.show('Товар добавлен в корзину');
        } else {
            notificationsStore.show(
                'Недостаточно товара выбранного цвета на складе',
                'error'
            );
        }
    }
</script>
<template>
    <main class="decor-detail">
        <div v-if="product" class="wrap">
            <RouterLink to="/decor" class="back">
                <i class="fa-solid fa-arrow-left"></i>
                Назад в декор
            </RouterLink>
            <div class="big-box">
                <div class="photos">
                    <div class="sad-image">
                        <span>IMAGE PLACEHOLDER</span>
                    </div>
                </div>
                <div class="info">
                    <p class="category">
                        {{ product.category }}
                    </p>
                    <h1 class="product-name">
                        {{ product.title }}
                    </h1>
                    <p class="description">
                        {{ product.description }}
                    </p>

                    <div class="characteristics">
                        <p v-if="product.materials?.length">
                            Материалы: {{ product.materials.join(', ') }}
                        </p>
                        <p v-if="product.dimensions">
                            Габариты: {{ product.dimensions }}
                        </p>
                    </div>
                    <div class="picks">
                        <div class="pick">
                            <label for="decor-color">Цвет</label>
                            <select id="decor-color" v-model="selectedColor">
                                <option v-for="color in product.colors" :key="color.name" :value="color.name">
                                    {{ color.name }}
                                </option>
                            </select>
                        </div>
                    </div>
                    <div class="stock">
                        <span v-if="stock > 0">
                            В наличии: {{ stock }} шт.
                        </span>
                        <span v-else>
                            Нет в наличии
                        </span>
                    </div>
                    <div v-if="stock > 0" class="quantity">
                        <p class="quantity-label">
                            Количество
                        </p>

                        <div class="counter">
                            <ButtonBase variant="secondary" size="sm" class="counter-btn" :disabled="quantity <= 1" @click="decreaseQuantity">
                                <i class="fa-solid fa-minus"></i>
                            </ButtonBase>
                            <span class="count">
                                {{ quantity }}
                            </span>
                            <ButtonBase variant="secondary" size="sm" class="counter-btn" :disabled="quantity >= stock" @click="increaseQuantity">
                                <i class="fa-solid fa-plus"></i>
                            </ButtonBase>
                        </div>
                    </div>

                    <div class="buy-box">
                        <div class="money-box">
                            <span class="price">
                                {{ formattedPrice }} ₸ / шт.
                            </span>
                            <span v-if="product.discount > 0" class="old-price">
                                {{ formattedOldPrice }} ₸
                            </span>
                            <span v-if="product.discount > 0" class="discount">
                                -{{ product.discount }}%
                            </span>
                        </div>
                        <p v-if="stock > 0" class="total-price">
                            Итого: {{ formattedTotalPrice }} ₸
                        </p>

                        <ButtonBase variant="primary" size="lg" class="cart-add" :disabled="!canAddToCart" @click="addToCart">
                            <i class="fa-solid fa-bag-shopping"></i>
                            Добавить в корзину
                        </ButtonBase>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="not-found">
            <h1>Товар не найден</h1>
            <RouterLink to="/decor">
                Вернуться в декор
            </RouterLink>
        </div>
        <ModalBase v-if="showAuthModal" @close="showAuthModal = false">
            <div class="auth-required">
                <h2>Требуется авторизация</h2>
                <p>
                    Чтобы добавить товар в корзину,
                    необходимо войти в аккаунт
                    или зарегистрироваться.
                </p>
                <div class="auth-buttons">
                    <RouterLink to="/login" @click="showAuthModal = false">
                        Войти
                    </RouterLink>
                    <RouterLink to="/regist" @click="showAuthModal = false">
                        Зарегистрироваться
                    </RouterLink>
                </div>
            </div>
        </ModalBase>
    </main>
</template>