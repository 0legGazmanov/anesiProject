<script setup>
    defineProps({
        modelValue: {
            type: String,
            default: ''
        }
    });
    const emit = defineEmits(['update:modelValue']);
</script>
<template>
    <div class="search-bar">
        <i class="fa-solid fa-magnifying-glass"></i>
        <input type="text" placeholder="Поиск..." :value="modelValue" @input="emit('update:modelValue', $event.target.value)"/>
    </div>
</template>
