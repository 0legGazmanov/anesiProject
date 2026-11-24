import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth';

const routes = [
  {
    path: "/",
    name: "home",
    component: ()=> import("@/views/HomeView.vue"),
    meta: {title: "home"}
  },
  {
    path: "/catalog",
    name: "catalog",
    component: ()=> import("@/views/catalog/CatalogView.vue"),
    meta: {title: "catalog"}
  },
  {
    path: "/catalog/:id",
    name: "catalog-detail", 
    component: ()=> import("@/views/catalog/DetailView.vue"),
    meta: {title: "catalog"}
  },
  {
    path: "/gallery",
    name: "gallery", 
    component: ()=> import("@/views/gallery/GalleryView.vue"),
    meta: {title: "gallery"}
  },
  {
    path: "/gallery/:id",
    name: "gallery-detail", 
    component: ()=> import("@/views/gallery/DetailView.vue"),
    meta: {title: "gallery"}
  },
  {
    path: "/atelier",
    name: "atelier",
    component:()=> import("@/views/AtelierView.vue"),
    meta: {title: "atelier"}
  },
  {
    path: "/decor",
    name: "decor",
    component:()=> import("@/views/decor/DecorView.vue"),
    meta: {title: "decor"}
  },
  {
    path: "/decor/:id",
    name: "decor-detail",
    component:()=> import("@/views/decor/DetailView.vue"),
    meta: {title: "decor"}
  }, 
  {
    path: "/basket",
    name: "basket",
    component: ()=> import("@/views/user/BasketView.vue"),
    meta: {title: "basket", requiresAuth: true}
  },
  {
    path: "/account", 
    name: "account",
    component: ()=> import("@/views/user/AccountView.vue"),
    meta: {title: "account", requiresAuth: true}
  },
  {
    path: "/login",
    name: "login",
    component:()=> import("@/views/auth/LogView.vue"),
    meta: {title: "logIn", hideLayout: true }
  },
  {
    path: "/regist", 
    name: "regist",
    component:()=> import("@/views/auth/RegView.vue"),
    meta: {title: "regist", hideLayout: true }
  },
  {
    path: '/admin',
    name: 'admin',
    component:() => import("@/views/admin/AdminView.vue"),
    meta: { title: 'admin', requiresAdmin: true}
  },
  {
    path: '/admin/catalog/new',
    name: 'catalog-create',
    component: () => import('@/views/admin/EditCatalog.vue'),
    meta: { title: 'Create Catalog', requiresAdmin: true }
  },
  {
    path: '/admin/gallery/new',
    name: 'gallery-create',
    component: () => import('@/views/admin/EditGallery.vue'),
    meta: { title: 'Create Gallery', requiresAdmin: true }
  },
  {
    path: '/admin/decor/new',
    name: 'decor-create',
    component: () => import('@/views/admin/EditDecor.vue'),
    meta: { title: 'Create Decor', requiresAdmin: true }
  },
  {
    path: "/admin/catalog/edit/:id", 
    name: "catalog-edit",
    component:()=> import("@/views/admin/EditCatalog.vue"), 
    meta:{title: "edit-catalog", requiresAdmin: true}
  }, 
  {
    path: "/admin/gallery/edit/:id", 
    name: "gallery-edit",
    component:()=> import("@/views/admin/EditGallery.vue"), 
    meta:{title: "edit-gallery", requiresAdmin: true}
  }, 
  {
    path: "/admin/decor/edit/:id", 
    name: "decor-edit",
    component:()=> import("@/views/admin/EditDecor.vue"), 
    meta:{title: "edit-decor", requiresAdmin: true}
  }, 
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to) => {
    const authStore = useAuthStore();

    if (to.meta.requiresAdmin && !authStore.isAdmin) {
        return '/';
    }

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        return '/login';
    }

    if (to.meta.title) {
        document.title = to.meta.title;
    }
});

export default router
