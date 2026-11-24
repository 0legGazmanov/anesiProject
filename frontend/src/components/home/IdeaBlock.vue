
<script setup>
    import { ref, onMounted, onUnmounted } from 'vue';

    const phrases = [
        'Формы, вдохновлённые классикой',
        'Комфорт как искусство',
        'Индивидуальные решения для вашего пространства'
    ];

    const activeIndex = ref(1);
    let intervalId = null;

    function nextPhrase() {
        activeIndex.value = (activeIndex.value + 1) % phrases.length;
    }

    function getPosition(index) {
        const position = (index - activeIndex.value + phrases.length) % phrases.length;
        if (position === 0) return 'center';
        if (position === 1) return 'right';
        return 'left';
    }

    onMounted(() => {
        intervalId = setInterval(nextPhrase, 5000);
    });

    onUnmounted(() => {
        clearInterval(intervalId);
    });
</script>

<template>
    <section id="philosophy" class="philosophy">
        <div class="wrap">
            <div class="heading">
                <span class="line"></span>
                <h2 class="title">НАША ФИЛОСОФИЯ</h2>
                <span class="line"></span>
            </div>
            <div class="content">
                <div v-for="(phrase, index) in phrases" :key="phrase" class="item" :class="getPosition(index)">
                    <p class="text">{{ phrase }}</p>
                </div>
            </div>
            <div class="controls">
                <button v-for="(phrase, index) in phrases" :key="phrase" type="button" class="dot" :class="{ active: activeIndex === index }" @click="activeIndex = index"></button>
            </div>
        </div>
    </section>
</template>
