<script setup>
    const menuItems = [
        {
            title: 'Обзор',
            icon: 'fa-chart-pie',
            section: 'overview'
        },
        {
            title: 'Каталог',
            icon: 'fa-couch',
            section: 'catalog'
        },
        {
            title: 'Галерея',
            icon: 'fa-images',
            section: 'gallery'
        },
        {
            title: 'Декор',
            icon: 'fa-spa',
            section: 'decor'
        },
        {
            title: 'Заказы',
            icon: 'fa-box',
            section: 'orders'
        },
        {
            title: 'Заявки Atelier',
            icon: 'fa-envelope',
            section: 'requests'
        }
    ];

    defineProps({
        activeSection: {
            type: String,
            default: 'overview'
        }
    });

    const emit = defineEmits(['changeSection']);

    function selectSection(section) {
        emit('changeSection', section);
    }
</script>
<template>
    <div class="admin-sidebar">
        <div class="brand">
            <p>ADMINISTRATION</p>
        </div>
        <nav class="menu">
            <button v-for="item in menuItems" :key="item.section" type="button" class="menu-item" :class="{ active: activeSection === item.section }" @click="selectSection(item.section)">
                <i :class="['fa-solid', item.icon]"></i>
                <span>{{ item.title }}</span>
            </button>
        </nav>
    </div>
</template>