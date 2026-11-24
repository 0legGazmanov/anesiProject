<script setup>
    defineProps({
        type: {
            type: String,
            default: 'button'
        },
        variant: {
            type: String,
            default: 'primary',
            validator: value => ['primary', 'secondary', 'text', 'danger'].includes(value)
        },
        size: {
            type: String,
            default: 'md',
            validator: value => ['sm', 'md', 'lg'].includes(value)
        },
        disabled: {
            type: Boolean,
            default: false
        },
        loading: {
            type: Boolean,
            default: false
        },
        fullWidth: {
            type: Boolean,
            default: false
        }
    });
</script>

<template>
    <button :type="type" :disabled="disabled || loading" :aria-busy="loading" class="button-base"
        :class="[`button-base--${variant}`,`button-base--${size}`,
            {
                'button-base--loading': loading,
                'button-base--full': fullWidth
            }
        ]">
        <i v-if="loading" class="fa-solid fa-spinner fa-spin"></i>
        <slot v-else />
    </button>
</template>
