export default [
  {
    path: "/basic-setting/user",
    name: "user",
    component: () => import("@/views/basic-setting/user/User.vue"),
    meta: {
      pageTitle: "User",
      breadcrumb: [
        {
          text: "User",
          active: true,
        },
      ],
    },
  },
  {
    path: "/basic-setting/faculty",
    name: "faculty",
    component: () => import("@/views/basic-setting/faculty/Faculty.vue"),
    meta: {
      pageTitle: "Faculty",
      breadcrumb: [
        {
          text: "Faculty",
          active: true,
        },
      ],
    },
  },
  {
    path: "/basic-setting/province",
    name: "province",
    component: () => import("@/views/basic-setting/province/Province.vue"),
    meta: {
      pageTitle: "Province",
      breadcrumb: [
        {
          text: "Province",
          active: true,
        },
      ],
    },
  },
  {
    path: "/basic-setting/document-type",
    name: "document-type",
    component: () =>
      import("@/views/basic-setting/document-type/DocumentType.vue"),
    meta: {
      pageTitle: "DocumentType",
      breadcrumb: [
        {
          text: "DocumentType",
          active: true,
        },
      ],
    },
  },
];
