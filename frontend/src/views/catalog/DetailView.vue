<script setup>
    import { computed, ref } from 'vue'
    import { useRoute, RouterLink } from 'vue-router';
    import { useProductsStore } from '@/stores/products'
    import { useCartStore } from '@/stores/cart'
    import { useAuthStore } from '@/stores/auth'
    import ModalBase from '@/components/ui/ModalBase.vue'
    import ButtonBase from '@/components/ui/ButtonBase.vue';
    import { useNotificationsStore } from '@/stores/notifications';
    
    const route = useRoute();
    const productsStore = useProductsStore();
    const cartStore = useCartStore();
    const authStore = useAuthStore();
    const showAuthModal = ref(false);
    const notificationsStore = useNotificationsStore();

    const product = computed(() =>
        productsStore.getProduct('catalog', route.params.id)
    );

    const formattedPrice = computed(() =>
        product.value ? new Intl.NumberFormat('ru-RU').format(product.value.finalPrice) : ''
    );

    const formattedOldPrice = computed(() =>
        product.value?.discount > 0 ? new Intl.NumberFormat('ru-RU').format(product.value.price) : ''
    );

    function addToCart() {
        if (!product.value) return;
    
        if (!authStore.isAuthenticated) {
            showAuthModal.value = true
            return
        }
        cartStore.addItem(product.value, 'catalog');
        notificationsStore.show('Товар добавлен в корзину');
        
    }
</script>
<template>
    <main class="catalog-detail">
        <div v-if="product" class="wrap">
            <RouterLink to="/catalog" class="back">
                <i class="fa-solid fa-arrow-left"></i>
                Назад в каталог
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
                    <div class="money-box">
                        <span class="price">
                            {{ formattedPrice }} ₸
                        </span>
                        <span v-if="product.discount > 0" class="old-price">
                            {{ formattedOldPrice }} ₸
                        </span>
                        <span v-if="product.discount > 0" class="discount">
                            -{{ product.discount }}%
                        </span>
                    </div>
                    <p class="stock">
                        {{ product.inStock ? 'В наличии' : 'Нет в наличии' }}
                    </p>
                    <ButtonBase variant="primary" size="lg" class="cart-add" :disabled="!product.inStock" @click="addToCart">
                        <i class="fa-solid fa-bag-shopping"></i>
                        Добавить в корзину
                    </ButtonBase>
                </div>
            </div>
            <section class="included">
                <h2 class="section-title">
                    Состав комплекта
                </h2>
                <ul class="items">
                    <li v-for="(item, index) in product.items" :key="index" class="item">
                        {{ item }}
                    </li>
                </ul>
            </section>
        </div>
        <div v-else class="not-found">
            <h1>Товар не найден</h1>
            <RouterLink to="/catalog">
                Вернуться в каталог
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