import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useNotificationsStore = defineStore('notifications', () => {
    const message = ref('');
    const type = ref('success');
    const notificationId = ref(0);

    function show(text, notificationType = 'success') {
        message.value = text;
        type.value = notificationType;
        notificationId.value++;
    }

    function close() {
        message.value = '';
    }

    return {
        message,
        type,
        notificationId,
        show,
        close
    };
});
