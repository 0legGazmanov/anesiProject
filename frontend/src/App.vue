<script setup>
    import { computed, onMounted } from 'vue';
    import { useRoute } from 'vue-router';
    import HeaderBlock from '@/components/layout/HeaderBlock.vue';
    import FooterBlock from '@/components/layout/FooterBlock.vue';
    import ToastBase from '@/components/ui/ToastBase.vue';
    import { useProductsStore } from '@/stores/products';
    import { useNotificationsStore } from '@/stores/notifications';

    const productsStore = useProductsStore();
    const notificationsStore = useNotificationsStore();
    const route = useRoute();
    const showLayout = computed(() => !route.meta.hideLayout);

    onMounted(async () => {
      await productsStore.fetchProducts();
    });
</script>

<template>
  <HeaderBlock v-if="showLayout"/>
  <RouterView v-slot="{ Component }">
    <transition name="container">
      <component :is="Component"/>
    </transition>
  </RouterView>
  <FooterBlock v-if="showLayout"/>
  <ToastBase :key="notificationsStore.notificationId" :message="notificationsStore.message" :type="notificationsStore.type" @close="notificationsStore.close()"/>
</template>
