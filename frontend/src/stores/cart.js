import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';

export const useCartStore = defineStore('cart', () => {
    const authStore = useAuthStore();
    const items = ref([]);

    const storageKey = computed(() => {
        const userId = authStore.user?.id;

        return userId ? `anesi-cart-${userId}` : null;
    });

    const totalCount = computed(() =>
        items.value.reduce((sum, item) => sum + item.quantity, 0)
    );

    const totalPrice = computed(() =>
        items.value.reduce(
            (sum, item) => sum + (item.finalPrice ?? item.price) * item.quantity,
            0
        )
    );

    function getCartKey(product, type) {
        if (type === 'gallery') {
            return [
                type,
                product.id,
                product.selectedMaterial ?? '',
                product.selectedColor ?? '',
                product.selectedSize ?? ''
            ].join('-');
        }

        if (type === 'decor') {
            return [
                type,
                product.id,
                product.selectedColor ?? ''
            ].join('-');
        }

        return `${type}-${product.id}`;
    }

    function loadCart(key) {
        if (!key) {
            items.value = [];
            return;
        }

        try {
            const savedItems = localStorage.getItem(key);
            const parsedItems = savedItems ? JSON.parse(savedItems) : [];

            items.value = Array.isArray(parsedItems)
                ? parsedItems.map(item => ({
                    ...item,
                    cartKey: getCartKey(item, item.type)
                }))
                : [];
        } catch (error) {
            console.log(error);
            items.value = [];
        }
    }

    watch(storageKey, 
        (key) => {
            loadCart(key);
        },
        { immediate: true, flush: 'sync' }
    );

    watch(items,
        (value) => {
            if (!storageKey.value) return;
            localStorage.setItem(storageKey.value, JSON.stringify(value));
        },
        { deep: true, flush: 'sync' }
    );

    function addItem(product, type, quantity = 1) {
        if (!storageKey.value) return false;
        if (!Number.isInteger(quantity) || quantity < 1) return false;

        const cartKey = getCartKey(product, type);

        const existing = items.value.find(
            item => item.cartKey === cartKey
        );

        if (type === 'decor') {
            const stock = Number(product.inStock) || 0;
            const currentQuantity = existing?.quantity ?? 0;

            if (currentQuantity + quantity > stock) {
                return false;
            }
        }

        if (type === 'catalog' && !product.inStock) {
            return false;
        }

        if (existing) {
            existing.quantity += quantity;
        } else {
            items.value.push({
                ...product,
                type,
                cartKey,
                quantity
            });
        }

        return true;
    }

    function updateQuantity(cartKey, quantity) {
        const item = items.value.find(
            item => item.cartKey === cartKey
        );

        if (!item) return false;
        if (!Number.isInteger(quantity) || quantity < 1) return false;

        if (item.type === 'decor') {
            const stock = Number(item.inStock) || 0;

            if (quantity > stock) return false;
        }

        item.quantity = quantity;
        return true;
    }

    function removeItem(cartKey) {
        items.value = items.value.filter(
            item => item.cartKey !== cartKey
        );
    }

    function clearCart() {
        items.value = [];
    }

    return {
        items,
        totalCount,
        totalPrice,
        addItem,
        updateQuantity,
        removeItem,
        clearCart
    };
});
