export default [
  {
    path: "/",
    redirect: "/car-rental-seremban",
  },
  
  {
    path: "/car-rental-seremban",
    meta: { layout: "default", noScroll: true, guest: true },
    name: "car-rental-seremban",
    component: () => import("@/pages/cars.vue"),
  },

  {
    path: "/login",
    meta: { layout: "default", guest: true, noScroll: true },
    name: "login",
    component: () => import("@/pages/login.vue"),
  },

  {
    path: "/register",
    meta: { layout: "default", guest: true, noScroll: true },
    name: "register",
    component: () => import("@/pages/register.vue"),
  },

  {
    path: "/home",
    meta: { layout: "default", noScroll: true, renderNavBar: true },
    name: "home",
    component: () => import("@/pages/home.vue"),
  },

  {
    path: "/addCar",
    meta: { layout: "default", noScroll: true, renderNavBar: true },
    name: "addCar",
    component: () => import("@/pages/addCar.vue"),
  },

  {
    path: "/addBooking",
    meta: { layout: "default", noScroll: true, renderNavBar: true },
    name: "addBooking",
    component: () => import("@/pages/addBooking.vue"),
  },

  {
    path: "/edit",
    meta: { layout: "default", noScroll: true, renderNavBar: true },
    name: "edit",
    component: () => import("@/pages/edit.vue"),
  },

  {
    path: "/reset",
    meta: { layout: "default", noScroll: true, guest: true },
    name: "reset",
    component: () => import("@/pages/resetPassword.vue"),
  },

  {
    path: "/car/:cardId",
    name: "car",
    meta: { layout: "default", renderNavBar: true },
    component: () => import("@/pages/car.vue"),
  },

  {
    path: "/editUser/:cardId",
    name: "editUser",
    meta: { layout: "default", renderNavBar: true },
    component: () => import("@/pages/editUser.vue"),
  },

  {
    path: "/editBooking/:cardId",
    name: "editBooking",
    meta: { layout: "default", renderNavBar: true },
    component: () => import("@/pages/editBooking.vue"),
  },

  {
    path: "/404",
    name: "AccessDenied",
    meta: { layout: "default", guest: true, noScroll: true },
    component: () => import("@/pages/Deny.vue"),
  },
];
