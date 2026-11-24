<script setup>
    import { onMounted, onUnmounted } from 'vue';
    import ButtonBase from '@/components/ui/ButtonBase.vue';

    const emit = defineEmits(['close']);

    function closeModal() {
        emit('close');
    }

    function handleKeydown(event) {
        if (event.key === 'Escape') {
            closeModal();
        }
    }

    onMounted(() => {
        window.addEventListener('keydown', handleKeydown);
    });

    onUnmounted(() => {
        window.removeEventListener('keydown', handleKeydown);
    });
</script>

<template>
    <Teleport to="body">
        <div class="modal-overlay" @click.self="closeModal">
            <div class="modal">
                <ButtonBase variant="text" size="sm" class="close" @click="closeModal">
                    <i class="fa-solid fa-xmark"></i>
                </ButtonBase>
                <div class="content">
                    <slot />
                </div>
            </div>
        </div>
    </Teleport>
</template>
