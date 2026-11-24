<script setup>
    import { watch, onUnmounted } from 'vue';

    const props = defineProps({
        message: {
            type: String,
            default: ''
        },
        type: {
            type: String,
            default: 'success'
        }
    });

    const emit = defineEmits(['close']);
    let timeoutId = null;

    watch(() => props.message, (value) => {
        clearTimeout(timeoutId);

        if (value) {
            timeoutId = setTimeout(() => {
                emit('close');
            }, 3500);
        }
    }, { immediate: true });

    onUnmounted(() => {
        clearTimeout(timeoutId);
    });
</script>
<template>
    <Teleport to="body">
        <div v-if="message" class="toast" :class="type">
            <i :class="['fa-solid', type === 'success' ? 'fa-circle-check' : type === 'error' ? 'fa-circle-exclamation' : 'fa-circle-info']"></i>
            <span class="message">{{ message }}</span>
            <button type="button" class="close" @click="emit('close')">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </div>
    </Teleport>
</template>
