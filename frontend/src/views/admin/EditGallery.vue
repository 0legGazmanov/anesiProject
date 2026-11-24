<script setup>
    import { reactive, computed, watch } from 'vue';
    import { useRoute, useRouter, RouterLink } from 'vue-router';
    import { useProductsStore } from '@/stores/products';
    import ButtonBase from '@/components/ui/ButtonBase.vue';

    const route = useRoute();
    const router = useRouter();
    const productsStore = useProductsStore();

    const isEditing = computed(() => route.name === 'gallery-edit');

    const product = computed(() =>
        isEditing.value
            ? productsStore.getProduct('gallery', route.params.id)
            : null
    );

    const form = reactive({
        title: '',
        category: '',
        description: '',
        price: 2990,
        discount: 0,
        materials: [{ name: '', extraPrice: 0 }],
        colors: [{ name: '', extraPrice: 0 }],
        sizes: [{ name: '', extraPrice: 0 }]
    });

    function normalizeOptions(options) {
        if (!Array.isArray(options) || !options.length) {
            return [{ name: '', extraPrice: 0 }];
        }

        return options.map(option => {
            if (typeof option === 'string') {
                return { name: option, extraPrice: 0 };
            }

            return {
                name: option.name ?? '',
                extraPrice: option.extraPrice ?? 0
            };
        });
    }

    watch(product, (value) => {
        form.title = value?.title ?? '';
        form.category = value?.category ?? '';
        form.description = value?.description ?? '';
        form.price = value?.price ?? 2990;
        form.discount = value?.discount ?? 0;
        form.materials = normalizeOptions(value?.materials);
        form.colors = normalizeOptions(value?.colors);
        form.sizes = normalizeOptions(value?.sizes);
    }, { immediate: true });

    const finalPrice = computed(() =>
        Math.round(form.price * (1 - form.discount / 100))
    );

    const formattedFinalPrice = computed(() =>
        new Intl.NumberFormat('ru-RU').format(finalPrice.value)
    );

    function addOption(type) {
        form[type].push({
            name: '',
            extraPrice: 0
        });
    }

    function removeOption(type, index) {
        if (form[type].length <= 1) return;

        form[type].splice(index, 1);
    }

    function validateOptions(options) {
        if (!options.length) return false;

        const names = new Set();

        for (const option of options) {
            const name = option.name.trim();

            if (!name) return false;

            if (
                !Number.isSafeInteger(option.extraPrice) ||
                option.extraPrice < 0
            ) return false;

            const normalizedName = name.toLowerCase();

            if (names.has(normalizedName)) return false;

            names.add(normalizedName);
        }

        return true;
    }

    function prepareOptions(options) {
        return options.map(option => ({
            name: option.name.trim(),
            extraPrice: option.extraPrice
        }));
    }

    async function saveProduct() {
        if (!form.title.trim() || !form.category.trim()) return;
        if (!form.description.trim()) return;

        if (!Number.isFinite(form.price) || form.price < 2990) return;

        if (
            !Number.isFinite(form.discount) ||
            form.discount < 0 ||
            form.discount > 90
        ) return;

        if (!validateOptions(form.materials)) return;
        if (!validateOptions(form.colors)) return;
        if (!validateOptions(form.sizes)) return;

        const productData = {
            title: form.title.trim(),
            category: form.category.trim(),
            description: form.description.trim(),
            price: form.price,
            discount: form.discount,
            materials: prepareOptions(form.materials),
            colors: prepareOptions(form.colors),
            sizes: prepareOptions(form.sizes)
        };

        const success = isEditing.value ? await productsStore.updateProduct('gallery', route.params.id, productData) : await productsStore.addProduct('gallery', productData);
        if (success) router.push('/admin');
    }
</script>
<template>
    <main class="admin-edit gallery-edit">
        <div class="wrap">
            <div class="heading">
                <RouterLink to="/admin" class="back">
                    <i class="fa-solid fa-arrow-left"></i>
                    Назад в админ-панель
                </RouterLink>
                <p class="subtitle">GALLERY MANAGEMENT</p>
                <h1 class="title">
                    {{ isEditing ? 'Редактирование мебели' : 'Новая мебель' }}
                </h1>
            </div>
            <div v-if="isEditing && !product" class="not-found">
                <h2>Товар не найден</h2>
            </div>
            <form v-else class="form" @submit.prevent="saveProduct">
                <div class="field">
                    <label for="gallery-title">Название</label>
                    <input id="gallery-title" v-model.trim="form.title" required/>
                </div>
                <div class="field">
                    <label for="gallery-category">Категория</label>
                    <input id="gallery-category" v-model.trim="form.category" required/>
                </div>
                <div class="field">
                    <label for="gallery-description">Описание</label>
                    <textarea id="gallery-description" v-model="form.description" rows="5" required></textarea>
                </div>
                <div class="row">
                    <div class="field">
                        <label for="gallery-price">
                            Базовая цена (₸)
                        </label>
                        <input id="gallery-price" v-model.number="form.price" type="number" min="2990" required/>
                    </div>
                    <div class="field">
                        <label for="gallery-discount">
                            Скидка (%)
                        </label>
                        <input id="gallery-discount" v-model.number="form.discount" type="number" min="0" max="90" required/>
                    </div>
                </div>
                <div class="money-box">
                    <span>Базовая стоимость со скидкой</span>
                    <p class="final-price">
                        {{ formattedFinalPrice }} ₸
                    </p>
                </div>
                <div class="field options-field">
                    <label>Материалы</label>
                    <div v-for="(material, index) in form.materials" :key="index" class="option-row" >
                        <input v-model.trim="material.name" placeholder="Название материала" required/>
                        <input v-model.number="material.extraPrice" type="number" min="0"step="1" placeholder="Наценка (₸)" required/>
                        <button type="button" :disabled="form.materials.length === 1" @click="removeOption('materials', index)">
                            Удалить
                        </button>
                    </div>
                    <button type="button" class="add-option" @click="addOption('materials')">
                        + Добавить материал
                    </button>
                </div>
                <div class="field options-field">
                    <label>Цвета</label>
                    <div v-for="(color, index) in form.colors" :key="index" class="option-row">
                        <input v-model.trim="color.name" placeholder="Название цвета" required/>
                        <input v-model.number="color.extraPrice" type="number" min="0"step="1" placeholder="Наценка (₸)" required/>
                        <button type="button" :disabled="form.colors.length === 1" @click="removeOption('colors', index)">
                            Удалить
                        </button>
                    </div>
                    <button type="button" class="add-option" @click="addOption('colors')">
                        + Добавить цвет
                    </button>
                </div>
                <div class="field options-field">
                    <label>Размеры</label>
                    <div v-for="(size, index) in form.sizes" :key="index" class="option-row">
                        <input v-model.trim="size.name" placeholder="Название размера" required/>
                        <input v-model.number="size.extraPrice" type="number" min="0"step="1" placeholder="Наценка (₸)" required/>
                        <button type="button" :disabled="form.sizes.length === 1" @click="removeOption('sizes', index)">
                            Удалить
                        </button>
                    </div>
                    <button type="button" class="add-option" @click="addOption('sizes')">
                        + Добавить размер
                    </button>
                </div>
                <div class="actions">
                    <ButtonBase type="submit">
                        {{ isEditing ? 'Сохранить изменения' : 'Добавить мебель' }}
                    </ButtonBase>
                    <RouterLink to="/admin" class="cancel">
                        Отмена
                    </RouterLink>
                </div>
            </form>
        </div>
    </main>
</template>
