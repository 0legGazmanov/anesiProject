<script setup>
    defineProps({
        modelValue: {
            type: String,
            default: 'default'
        }
    });

    const emit = defineEmits(['update:modelValue']);
    const options = [
        { value: 'default', label: 'По умолчанию' },
        { value: 'price-asc', label: 'Сначала дешевле' },
        { value: 'price-desc', label: 'Сначала дороже' },
        { value: 'name', label: 'По названию' }
    ];
</script>
<template>
    <div class="sort">
        <label for="product-sort">
            Сортировка:
        </label>
        <select id="product-sort" :value="modelValue" @change="emit('update:modelValue', $event.target.value)">
            <option v-for="option in options" :key="option.value" :value="option.value">
                {{ option.label }}
            </option>
        </select>
    </div>
</template>
