import { defineStore } from 'pinia';
import { ref } from 'vue';

import api from '@/api';

export const useProductsStore = defineStore('products', () => {
    const catalog = ref([]);
    const gallery = ref([]);
    const decor = ref([]);

    async function fetchCatalog() {
        try {
            const response = await api.get('/catalog');
            catalog.value = response.data;
        } catch (error) {
            console.log(error);
        }
    }

    async function fetchGallery() {
        try {
            const response = await api.get('/gallery');
            gallery.value = response.data;
        } catch (error) {
            console.log(error);
        }
    }

    async function fetchDecor() {
        try {
            const response = await api.get('/decor');
            decor.value = response.data;
        } catch (error) {
            console.log(error);
        }
    }

    async function fetchProducts() {
        await Promise.all([
            fetchCatalog(),
            fetchGallery(),
            fetchDecor()
        ]);
    }

    function getProduct(type, id) {
        const collections = {
            catalog: catalog.value,
            gallery: gallery.value,
            decor: decor.value
        };

        return collections[type]?.find(
            product => String(product.id) === String(id)
        );
    }

    async function addProduct(type, product) {
        const collections = {
            catalog,
            gallery,
            decor
        };

        const collection = collections[type]?.value;
        if (!collection) return false;

        try {
            const response = await api.post(`/${type}`, product);

            collection.push(response.data);

            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async function updateProduct(type, id, updatedData) {
        const collections = {
            catalog,
            gallery,
            decor
        };

        const collection = collections[type]?.value;
        if (!collection) return false;

        const index = collection.findIndex(
            item => String(item.id) === String(id)
        );

        if (index === -1) return false;

        try {
            const response = await api.put(`/${type}/${id}`, updatedData);

            collection[index] = response.data;

            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async function deleteProduct(type, id) {
        const collections = {
            catalog,
            gallery,
            decor
        };

        const collection = collections[type]?.value;
        if (!collection) return false;

        const index = collection.findIndex(
            item => String(item.id) === String(id)
        );

        if (index === -1) return false;

        try {
            await api.delete(`/${type}/${id}`);

            collection.splice(index, 1);

            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    return {
        catalog,
        gallery,
        decor,
        fetchCatalog,
        fetchGallery,
        fetchDecor,
        fetchProducts,
        getProduct,
        addProduct,
        updateProduct,
        deleteProduct
    };
});