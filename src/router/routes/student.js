export default [
  {
    path: "/student/personal-data",
    name: "student-personal-data",
    component: () => import("@/views/student/personal-data/PersonalData.vue"),
    meta: {
      pageTitle: "Personal Data",
      breadcrumb: [
        {
          text: "Personal Data",
          active: true,
        },
      ],
    },
  },
  {
    path: "/student/student-cwie-data",
    name: "student-cwie-data",
    component: () => import("@/views/student/cwie-data/CwieData.vue"),
    meta: {
      pageTitle: "Cwie Data",
      breadcrumb: [
        {
          text: "Cwie Data",
          active: true,
        },
      ],
    },
  },
];
