<script setup>
    import ModalBase from '@/components/ui/ModalBase.vue';
    import ButtonBase from '@/components/ui/ButtonBase.vue';

    defineProps({
        title: {
            type: String,
            default: 'Успешно!'
        },
        message: {
            type: String,
            default: ''
        }
    });

    const emit = defineEmits(['close']);
</script>
<template>
    <ModalBase @close="emit('close')">
        <div class="success-modal">
            <i class="fa-solid fa-circle-check"></i>
            <h2 class="title">{{ title }}</h2>
            <p class="description">{{ message }}</p>
            <ButtonBase @click="emit('close')">
                Понятно
            </ButtonBase>
        </div>
    </ModalBase>
</template>
