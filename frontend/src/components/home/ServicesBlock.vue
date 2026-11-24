<script setup>
    const services = [
        {
            id: 1,
            title: 'Каталог',
            subtitle: 'Готовые коллекции',
            description: 'Продуманные мебельные комплекты для гармоничного пространства.',
            link: '/catalog'
        },
        {
            id: 2,
            title: 'Галерея',
            subtitle: 'Мебель на заказ',
            description: 'Индивидуальный выбор материалов, оттенков и размеров.',
            link: '/gallery'
        },
        {
            id: 3,
            title: 'Декор',
            subtitle: 'Детали интерьера',
            description: 'Предметы, которые дополняют пространство и создают атмосферу.',
            link: '/decor'
        }
    ];
</script>
<template>
    <section id="services" class="services">
        <div class="wrap">
            <div class="heading">
                <p class="subtitle">EXPLORE ANESI</p>
                <h2 class="title">Наши направления</h2>
                <p class="description">
                    Искусство комфорта в каждой детали.
                </p>
            </div>

            <div class="grid">
                <article v-for="service in services" :key="service.id" class="card">
                    <div class="sad-image">
                        <span>IMAGE PLACEHOLDER</span>
                    </div>
                    <div class="content">
                        <p class="subtitle">
                            {{ service.subtitle }}
                        </p>
                        <h3 class="service-name">
                            {{ service.title }}
                        </h3>
                        <p class="description">
                            {{ service.description }}
                        </p>
                        <RouterLink :to="service.link" class="link">
                            Подробнее
                            <i class="fa-solid fa-arrow-right"></i>
                        </RouterLink>
                    </div>
                </article>
            </div>
        </div>
    </section>
</template>