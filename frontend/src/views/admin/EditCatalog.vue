<script setup>
    import { reactive, computed, watch } from 'vue';
    import { useRoute, useRouter, RouterLink } from 'vue-router';
    import { useProductsStore } from '@/stores/products';
    import ButtonBase from '@/components/ui/ButtonBase.vue';

    const route = useRoute();
    const router = useRouter();
    const productsStore = useProductsStore();

    const isEditing = computed(() => route.name === 'catalog-edit');

    const product = computed(() =>
        isEditing.value ? productsStore.getProduct('catalog', route.params.id) : null
    );

    const form = reactive({
        title: '',
        category: '',
        description: '',
        price: 2990,
        discount: 0,
        inStock: true,
        items: ''
    });

    watch(product, (value) => {
        form.title = value?.title ?? '';
        form.category = value?.category ?? '';
        form.description = value?.description ?? '';
        form.price = value?.price ?? 2990;
        form.discount = value?.discount ?? 0;
        form.inStock = value?.inStock ?? true;
        form.items = value?.items?.join('\n') ?? '';
    }, { immediate: true });

    const finalPrice = computed(() =>
        Math.round(form.price * (1 - form.discount / 100))
    );

    const formattedFinalPrice = computed(() =>
        new Intl.NumberFormat('ru-RU').format(finalPrice.value)
    );

    async function saveProduct() {
        if (!form.title.trim() || !form.category.trim()) return;

        if (!Number.isFinite(form.price) || form.price < 2990) return;

        if (!Number.isFinite(form.discount) ||
            form.discount < 0 ||
            form.discount > 90) return;

        const productData = {
            title: form.title.trim(),
            category: form.category.trim(),
            description: form.description.trim(),
            price: form.price,
            discount: form.discount,
            inStock: form.inStock,
            items: form.items
                .split('\n')
                .map(item => item.trim())
                .filter(Boolean)
        };

        const success = isEditing.value ? await productsStore.updateProduct('catalog', route.params.id, productData) : await productsStore.addProduct('catalog', productData);
        if (success) router.push('/admin');
    }
</script>
<template>
    <main class="admin-edit catalog-edit">
        <div class="wrap">
            <div class="heading">
            <RouterLink to="/admin" class="back">
                <i class="fa-solid fa-arrow-left"></i>
                Назад
            </RouterLink>
                <p class="subtitle">CATALOG MANAGEMENT</p>
                <h1 class="title">
                    {{ isEditing ? 'Редактирование комплекта' : 'Новый комплект' }}
                </h1>
            </div>
            <div v-if="isEditing && !product" class="not-found">
                <h2>Товар не найден</h2>
            </div>
            <form v-else class="form" @submit.prevent="saveProduct">
                <div class="field">
                    <label for="catalog-title">Название</label>
                    <input id="catalog-title" v-model.trim="form.title" required/>
                </div>
                <div class="field">
                    <label for="catalog-category">Категория</label>
                    <input id="catalog-category" v-model.trim="form.category" required/>
                </div>

                <div class="field">
                    <label for="catalog-description">Описание</label>
                    <textarea id="catalog-description" v-model="form.description" rows="5"></textarea>
                </div>
                <div class="row">
                    <div class="field">
                        <label for="catalog-price">
                            Первоначальная цена (₸)
                        </label>
                        <input id="catalog-price" v-model.number="form.price" type="number" min="2990" required />
                    </div>
                    <div class="field">
                        <label for="catalog-discount">
                            Скидка (%)
                        </label>
                        <input id="catalog-discount" v-model.number="form.discount" type="number" min="0" max="90" required/>
                    </div>
                </div>
                <div class="money-box">
                    <span>Итоговая стоимость</span>
                    <p class="final-price">
                        {{ formattedFinalPrice }} ₸
                    </p>
                </div>
                <div class="field">
                    <label for="catalog-items">Состав комплекта</label>
                    <p class="note">
                        Каждый предмет указывай с новой строки.
                    </p>
                    <textarea id="catalog-items" v-model="form.items" rows="6" placeholder="Диван&#10;Кресло&#10;Журнальный столик"></textarea>
                </div>
                <div class="checkbox">
                    <input id="catalog-stock" v-model="form.inStock" type="checkbox"/>
                    <label for="catalog-stock">
                        В наличии
                    </label>
                </div>
                <div class="actions">
                    <ButtonBase type="submit">
                        {{ isEditing ? 'Сохранить изменения' : 'Создать комплект' }}
                    </ButtonBase>
                    <RouterLink to="/admin" class="cancel">
                        Отмена
                    </RouterLink>
                </div>
            </form>
        </div>
    </main>
</template>