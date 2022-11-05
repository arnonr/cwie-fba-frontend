import axios from "@axios";

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    fetchSemesters(ctx, queryParams) {
      return new Promise((resolve, reject) => {
        axios
          .get("/semester", { params: queryParams })
          .then((response) => resolve(response))
          .catch((error) => reject(error));
      });
    },
    fetchSemester(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .get(`/semester/${id}`)
          .then((response) => resolve(response))
          .catch((error) => reject(error));
      });
    },

    addSemester(ctx, dataSend) {
      return new Promise((resolve, reject) => {
        axios
          .post("/semester", dataSend)
          .then((response) => {
            return resolve(response);
          })
          .catch((error) => reject(error));
      });
    },

    editSemester(ctx, dataSend) {
      return new Promise((resolve, reject) => {
        axios
          .put(`/semester/${dataSend.semester_id}`, dataSend)
          .then((response) => {
            return resolve(response);
          })
          .catch((error) => reject(error));
      });
    },

    deleteSemester(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`/semester/${id}`)
          .then((response) => {
            return resolve(response);
          })
          .catch((error) => reject(error));
      });
    },
  },
};
