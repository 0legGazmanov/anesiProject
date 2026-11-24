<script setup>
    import { computed } from 'vue';
    import { useProductsStore } from '@/stores/products';

    const productsStore = useProductsStore();
    const projects = computed(() => productsStore.gallery.slice(0, 3));
</script>
<template>
    <section id="projects" class="projects">
        <div class="wrap">
            <div class="heading">
                <div>
                    <p class="subtitle">SELECTED WORKS</p>
                    <h2 class="title">Наши проекты</h2>
                </div>
                <p class="description">
                    Воплощение идей, где эстетика встречается
                    с функциональностью.
                </p>
            </div>
            <div class="grid">
                <RouterLink v-for="project in projects" :key="project.id" :to="`/gallery/${project.id}`" class="card">
                    <div class="sad-image">
                        <span>IMAGE PLACEHOLDER</span>
                    </div>
                    <div class="info">
                        <div class="details">
                            <p class="category">
                                {{ project.category }}
                            </p>
                            <h3 class="product-name">
                                {{ project.title }}
                            </h3>
                        </div>
                        <span class="arrow">
                            <i class="fa-solid fa-arrow-up-right"></i>
                        </span>
                    </div>
                </RouterLink>
            </div>
            <div class="bottom">
                <RouterLink to="/gallery" class="link">
                    Смотреть всю галерею
                    <i class="fa-solid fa-arrow-right"></i>
                </RouterLink>
            </div>
        </div>
    </section>
</template>
