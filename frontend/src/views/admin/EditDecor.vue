<script setup>
    import { reactive, computed, watch } from 'vue';
    import { useRoute, useRouter, RouterLink } from 'vue-router';
    import { useProductsStore } from '@/stores/products';
    import ButtonBase from '@/components/ui/ButtonBase.vue';

    const route = useRoute();
    const router = useRouter();
    const productsStore = useProductsStore();
    const isEditing = computed(() => route.name === 'decor-edit');

    const product = computed(() =>
        isEditing.value ? productsStore.getProduct('decor', route.params.id) : null
    );

    const form = reactive({
        title: '',
        category: '',
        description: '',
        materials: '',
        dimensions: '',
        price: 2990,
        discount: 0,
        colors: [{ name: '', inStock: 0 }]
    });

    function normalizeColors(colors) {
        if (!Array.isArray(colors) || !colors.length) {
            return [{ name: '', inStock: 0 }];
        }

        return colors.map(color => {
            if (typeof color === 'string') {
                return { name: color, inStock: 0 };
            }

            return {
                name: color.name ?? '',
                inStock: color.inStock ?? 0
            };
        });
    }

    watch(product, (value) => {
        form.title = value?.title ?? '';
        form.category = value?.category ?? '';
        form.description = value?.description ?? '';
        form.materials = value?.materials?.join(', ') ?? '';
        form.dimensions = value?.dimensions ?? '';
        form.price = value?.price ?? 2990;
        form.discount = value?.discount ?? 0;
        form.colors = normalizeColors(value?.colors);
    }, { immediate: true });

    const finalPrice = computed(() =>
        Math.round(form.price * (1 - form.discount / 100))
    );

    const formattedFinalPrice = computed(() =>
        new Intl.NumberFormat('ru-RU').format(finalPrice.value)
    );

    const totalStock = computed(() =>
        form.colors.reduce(
            (sum, color) => sum + (Number(color.inStock) || 0),
            0
    ));

    function addColor() {
        form.colors.push({ name: '', inStock: 0 });
    }

    function removeColor(index) {
        if (form.colors.length <= 1) return;

        form.colors.splice(index, 1);
    }

    function validateColors() {
        if (!form.colors.length) return false;

        const names = new Set();
        for (const color of form.colors) {
            const name = color.name.trim();

            if (!name) return false;
            if (!Number.isSafeInteger(color.inStock) || color.inStock < 0) {
                return false;
            }

            const normalizedName = name.toLowerCase();
            if (names.has(normalizedName)) return false;
            names.add(normalizedName);
        }

        return true;
    }

    async function saveProduct() {
        if (!form.title.trim() || !form.category.trim()) return;

        if (!Number.isFinite(form.price) || form.price < 2990) return;

        if (!Number.isFinite(form.discount) ||
            form.discount < 0 ||
            form.discount > 90) return;

        if (!validateColors()) return;

        const productData = {
            title: form.title.trim(),
            category: form.category.trim(),
            description: form.description.trim(),
            materials: form.materials.split(',').map(item => item.trim()).filter(Boolean),
            dimensions: form.dimensions.trim(),
            price: form.price,
            discount: form.discount,
            colors: form.colors.map(color => ({name: color.name.trim(), inStock: color.inStock}))
        };

        const success = isEditing.value ? await productsStore.updateProduct('decor', route.params.id, productData) : await productsStore.addProduct('decor', productData);
        if (success) router.push('/admin');
    }
</script>

<template>
    <main class="admin-edit decor-edit">
        <div class="wrap">
            <div class="heading">
                <RouterLink to="/admin" class="back">
                    <i class="fa-solid fa-arrow-left"></i>
                    Назад в админ-панель
                </RouterLink>
                <p class="subtitle">DECOR MANAGEMENT</p>
                <h1 class="title">
                    {{ isEditing ? 'Редактирование декора' : 'Новый предмет декора' }}
                </h1>
            </div>
            <div v-if="isEditing && !product" class="not-found">
                <h2>Товар не найден</h2>
            </div>
            <form v-else class="form" @submit.prevent="saveProduct">
                <div class="field">
                    <label for="decor-title">Название</label>
                    <input id="decor-title" v-model.trim="form.title" required/>
                </div>
                <div class="field">
                    <label for="decor-category">Категория</label>
                    <input id="decor-category" v-model.trim="form.category" required/>
                </div>
                <div class="field">
                    <label for="decor-description">Описание</label>
                    <textarea id="decor-description" v-model="form.description" rows="5"></textarea>
                </div>
                <div class="field">
                    <label for="decor-materials">Материалы</label>
                    <input id="decor-materials" v-model="form.materials" placeholder="Керамика, Стекло, Металл"/>
                </div>
                <div class="field">
                    <label for="decor-dimensions">Габариты</label>
                    <input id="decor-dimensions" v-model="form.dimensions" placeholder="30 × 15 × 15 см"/>
                </div>
                <div class="row">
                    <div class="field">
                        <label for="decor-price">
                            Первоначальная цена (₸)
                        </label>
                        <input id="decor-price" v-model.number="form.price" type="number" min="2990" required/>
                    </div>
                    <div class="field">
                        <label for="decor-discount">
                            Скидка (%)
                        </label>
                        <input id="decor-discount" v-model.number="form.discount" type="number" min="0" max="90" required/>
                    </div>
                </div>
                <div class="money-box">
                    <span>Итоговая стоимость</span>
                    <p class="final-price">
                        {{ formattedFinalPrice }} ₸
                    </p>
                </div>
            
                <div class="field options-field">
                    <label>Доступные цвета</label>
                    <div v-for="(color, index) in form.colors" :key="index" class="option-row">
                        <input v-model.trim="color.name" placeholder="Название цвета" required/>
                        <input v-model.number="color.inStock" type="number" min="0" step="1" placeholder="Количество" required/>
                        <button type="button" :disabled="form.colors.length === 1" @click="removeColor(index)">
                            Удалить
                        </button>
                    </div>
                    <button type="button" class="add-option" @click="addColor">
                        + Добавить цвет
                    </button>
                </div>
                <div class="money-box">
                    <span>Всего на складе</span>
                    <p>{{ totalStock }} шт.</p>
                </div>
                <div class="actions">
                    <ButtonBase type="submit">
                        {{ isEditing ? 'Сохранить изменения' : 'Добавить декор' }}
                    </ButtonBase>
                    <RouterLink to="/admin" class="cancel">
                        Отмена
                    </RouterLink>
                </div>
            </form>
        </div>
    </main>
</template>