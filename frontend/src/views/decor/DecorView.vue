<script setup>
    import { ref, computed } from 'vue';
    import { useProductsStore } from '@/stores/products';
    import SearchBlock from '@/components/products/SearchBlock.vue';
    import SortBlock from '@/components/products/SortBlock.vue';
    import ProductCard from '@/components/products/ProductCard.vue';

    const productsStore = useProductsStore();

    const searchQuery = ref('');
    const sortBy = ref('default');

    const products = computed(() => {
        let result = [...productsStore.decor];

        if (searchQuery.value.trim()) {
            const query = searchQuery.value.trim().toLowerCase();

            result = result.filter(product =>
                product.title.toLowerCase().includes(query)
            );
        }

        switch (sortBy.value) {
            case 'price-asc':
                result.sort((a, b) => a.finalPrice - b.finalPrice);
                break;

            case 'price-desc':
                result.sort((a, b) => b.finalPrice - a.finalPrice);
                break;

            case 'name':
                result.sort((a, b) => a.title.localeCompare(b.title));
                break;
        }

        return result;
    });
</script>

<template>
    <main class="decor">
        <div class="wrap">
            <div class="heading">
                <h1 class="title">Декор</h1>
                <p class="description">
                    Предметы интерьера и акценты, дополняющие ваше пространство.
                </p>
            </div>
            <div class="toolbar">
                <SearchBlock v-model="searchQuery" />
                <SortBlock v-model="sortBy" />
            </div>
            <div v-if="products.length" class="products-grid">
                <ProductCard v-for="product in products" :key="product.id" :product="product" type="decor"/>
            </div>
            <div v-else class="no-stuff">
                <p>По вашему запросу ничего не найдено.</p>
            </div>
        </div>
    </main>
</template>