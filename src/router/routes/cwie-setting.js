export default [
  {
    path: "/cwie-setting/teacher",
    name: "teacher",
    component: () => import("@/views/cwie-setting/teacher/Teacher.vue"),
    meta: {
      pageTitle: "Teacher",
      breadcrumb: [
        {
          text: "Teacher",
          active: true,
        },
      ],
    },
  },
  {
    path: "/cwie-setting/company",
    name: "company",
    component: () => import("@/views/cwie-setting/company/Company.vue"),
    meta: {
      pageTitle: "Company",
      breadcrumb: [
        {
          text: "Company",
          active: true,
        },
      ],
    },
  },

  {
    path: "/cwie-setting/semester",
    name: "semester",
    component: () => import("@/views/cwie-setting/semester/Semester.vue"),
    meta: {
      pageTitle: "Semester",
      breadcrumb: [
        {
          text: "Semester",
          active: true,
        },
      ],
    },
  },
];
