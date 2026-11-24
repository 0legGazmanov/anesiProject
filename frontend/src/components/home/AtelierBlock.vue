<script setup>
    const features = [
        'Индивидуальный дизайн',
        'Подбор материалов и отделки',
        'Внимание к каждой детали'
    ];
</script>
<template>
    <section id="atelier" class="atelier-preview">
        <div class="wrap">
            <div class="visual">
                <div class="sad-image">
                    <span>IMAGE PLACEHOLDER</span>
                </div>
            </div>
            <div class="content">
                <p class="subtitle">ANESI ATELIER</p>
                <h2 class="title">
                    Создано для вас
                </h2>
                <p class="description">
                    Пространство должно отражать вашу индивидуальность.
                    Мы создаём мебель и интерьерные решения,
                    которые рождаются из ваших идей,
                    привычек и представлений о комфорте.
                </p>
                <ul class="features">
                    <li v-for="feature in features" :key="feature" class="feature">
                        <span class="marker">✦</span>
                        {{ feature }}
                    </li>
                </ul>
                <RouterLink to="/atelier" class="link">
                    Обсудить проект
                    <i class="fa-solid fa-arrow-right"></i>
                </RouterLink>
            </div>
        </div>
    </section>
</template>