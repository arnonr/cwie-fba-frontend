import axios from "@axios";

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    fetchTeachers(ctx, queryParams) {
      return new Promise((resolve, reject) => {
        axios
          .get("/teacher", { params: queryParams })
          .then((response) => resolve(response))
          .catch((error) => reject(error));
      });
    },
    fetchTeacher(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .get(`/teacher-type/${id}`)
          .then((response) => resolve(response))
          .catch((error) => reject(error));
      });
    },
    addTeacher(ctx, { teachername }) {
      return new Promise((resolve, reject) => {
        axios
          .post(`/teacher/import-icit-account/${teachername}`)
          .then((response) => {
            return resolve(response);
          })
          .catch((error) => reject(error));
      });
    },
    editTeacher(ctx, dataSend) {
      return new Promise((resolve, reject) => {
        axios
          .put(`/teacher/${dataSend.teacher_id}`, dataSend)
          .then((response) => {
            return resolve(response);
          })
          .catch((error) => reject(error));
      });
    },
    deleteTeacher(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`/teacher/${id}`)
          .then((response) => {
            return resolve(response);
          })
          .catch((error) => reject(error));
      });
    },
    loadTeacher(ctx, queryParams) {
      return new Promise((resolve, reject) => {
        // req.body
        axios
          .get(`/teacher/hris-find-personnel`, { params: queryParams })
          .then((response) => {
            return resolve(response);
          })
          .catch((error) => reject(error));
      });
    },
    syncTeacher(ctx) {
      return new Promise((resolve, reject) => {
        axios
          .post(`/teacher/hris-sync-all-teacher`)
          .then((response) => {
            return resolve(response);
          })
          .catch((error) => reject(error));
      });
    },

    fetchProvinces(ctx, queryParams) {
      return new Promise((resolve, reject) => {
        axios
          .get("/province", { params: queryParams })
          .then((response) => resolve(response))
          .catch((error) => reject(error));
      });
    },

    fetchAmphurs(ctx, queryParams) {
      return new Promise((resolve, reject) => {
        axios
          .get("/amphur", { params: queryParams })
          .then((response) => resolve(response))
          .catch((error) => reject(error));
      });
    },

    fetchTumbols(ctx, queryParams) {
      return new Promise((resolve, reject) => {
        axios
          .get("/tumbol", { params: queryParams })
          .then((response) => resolve(response))
          .catch((error) => reject(error));
      });
    },

  },
};
