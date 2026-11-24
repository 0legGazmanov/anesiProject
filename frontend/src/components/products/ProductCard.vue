<script setup>
    import { computed } from 'vue';

    const props = defineProps({
        product: {
            type: Object,
            required: true
        },
        type: {
            type: String,
            required: true
        }
    });

    const productLink = computed(() =>
        `/${props.type}/${props.product.id}`
    );

    const formattedPrice = computed(() =>
        new Intl.NumberFormat('ru-RU').format(props.product.finalPrice)
    );

    const formattedOldPrice = computed(() =>
        props.product.discount > 0 ? new Intl.NumberFormat('ru-RU').format(props.product.price) : null
    );
</script>
<template>
    <article class="product-card">
        <RouterLink :to="productLink" class="image-link">
            <div class="sad-image">
                <span>IMAGE PLACEHOLDER</span>
            </div>
        </RouterLink>
        <div class="content">
            <p class="category">
                {{ product.category }}
            </p>
            <RouterLink :to="productLink" class="title-link">
                <h3 class="product-name">
                    {{ product.title }}
                </h3>
            </RouterLink>
            <p class="description">
                {{ product.description }}
            </p>
            <div class="bottom">
                <div class="money-box">
                    <span class="price">
                        {{ formattedPrice }} ₸
                    </span>
                    <span v-if="formattedOldPrice" class="old-price">
                        {{ formattedOldPrice }} ₸
                    </span>
                    <span v-if="product.discount > 0" class="discount">
                        -{{ product.discount }}%
                    </span>
                </div>
                <RouterLink :to="productLink" class="link">
                    Подробнее
                    <i class="fa-solid fa-arrow-right"></i>
                </RouterLink>
            </div>
        </div>
    </article>
</template>
