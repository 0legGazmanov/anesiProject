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
        productsStore.getProduct('gallery', route.params.id)
    );

    const selectedMaterial = ref('');
    const selectedColor = ref('');
    const selectedSize = ref('');

    watch(product, (newProduct) => {
        selectedMaterial.value = newProduct?.materials?.[0]?.name ?? '';
        selectedColor.value = newProduct?.colors?.[0]?.name ?? '';
        selectedSize.value = newProduct?.sizes?.[0]?.name ?? '';
    }, { immediate: true });

    const materialOption = computed(() =>
        product.value?.materials?.find(
            item => item.name === selectedMaterial.value
        )
    );

    const colorOption = computed(() =>
        product.value?.colors?.find(
            item => item.name === selectedColor.value
        )
    );

    const sizeOption = computed(() =>
        product.value?.sizes?.find(
            item => item.name === selectedSize.value
        )
    );

    const configurationPrice = computed(() => {
        if (!product.value) return 0;

        return product.value.price +
            (materialOption.value?.extraPrice ?? 0) +
            (colorOption.value?.extraPrice ?? 0) +
            (sizeOption.value?.extraPrice ?? 0);
    });

    const finalPrice = computed(() =>
        Math.round(
            configurationPrice.value *
            (1 - (product.value?.discount ?? 0) / 100)
        )
    );

    const formattedPrice = computed(() =>
        new Intl.NumberFormat('ru-RU').format(finalPrice.value)
    );

    const formattedOldPrice = computed(() =>
        product.value?.discount > 0 ? new Intl.NumberFormat('ru-RU').format(configurationPrice.value) : ''
    );

    const canAddToCart = computed(() =>
        Boolean(
            product.value &&
            materialOption.value &&
            colorOption.value &&
            sizeOption.value &&
            finalPrice.value > 0
        )
    );

    function addToCart() {
        if (!canAddToCart.value) return;

        if (!authStore.isAuthenticated) {
            showAuthModal.value = true;
            return;
        }

        const configuredProduct = {
            ...product.value,
            selectedMaterial: selectedMaterial.value,
            selectedColor: selectedColor.value,
            selectedSize: selectedSize.value,
            price: configurationPrice.value,
            finalPrice: finalPrice.value
        };

        const success = cartStore.addItem(configuredProduct, 'gallery');

        if (success) {
            notificationsStore.show('Товар добавлен в корзину');
        }
    }
</script>

<template>
    <main class="gallery-detail">
        <div v-if="product" class="wrap">
            <RouterLink to="/gallery" class="back">
                <i class="fa-solid fa-arrow-left"></i>
                Назад в галерею
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
                    <div class="picks">
                        <div class="pick">
                            <label for="gallery-material">
                                Материал
                            </label>
                            <select id="gallery-material" v-model="selectedMaterial">
                                <option v-for="material in product.materials" :key="material.name" :value="material.name">
                                    {{ material.name }}
                                </option>
                            </select>
                        </div>
                        <div class="pick">
                            <label for="gallery-color">
                                Цвет
                            </label>
                            <select id="gallery-color" v-model="selectedColor">
                                <option v-for="color in product.colors" :key="color.name" :value="color.name">
                                    {{ color.name }}
                                </option>
                            </select>
                        </div>
                        <div class="pick">
                            <label for="gallery-size">
                                Размер
                            </label>
                            <select id="gallery-size" v-model="selectedSize">
                                <option v-for="size in product.sizes" :key="size.name" :value="size.name">
                                    {{ size.name }}
                                </option>
                            </select>
                        </div>
                    </div>
                    <div class="buy-box">
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
            <RouterLink to="/gallery">
                Вернуться в галерею
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