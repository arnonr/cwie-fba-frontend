import axios from "@axios";

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    fetchCompanies(ctx, queryParams) {
      return new Promise((resolve, reject) => {
        axios
          .get("/company", { params: queryParams })
          .then((response) => resolve(response))
          .catch((error) => reject(error));
      });
    },
    fetchCompany(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .get(`/company/${id}`)
          .then((response) => resolve(response))
          .catch((error) => reject(error));
      });
    },
    addCompany(ctx, dataSend) {
      var form_data = new FormData();

      for (var key in dataSend) {
        form_data.append(key, dataSend[key]);
      }

      return new Promise((resolve, reject) => {
        axios
          .post("/company", form_data, {
            headers: {
              "content-type": "multipart/form-data",
            },
          })
          .then((response) => {
            return resolve(response);
          })
          .catch((error) => reject(error));
      });
    },

    editCompany(ctx, dataSend) {
      var form_data = new FormData();

      for (var key in dataSend) {
        form_data.append(key, dataSend[key]);
      }

      form_data.append("_method", "PUT");
      
      return new Promise((resolve, reject) => {
        axios
          .post(`/company/${dataSend.company_id}`, form_data, {
            headers: {
              "content-type": "multipart/form-data",
            },
          })
          .then((response) => {
            return resolve(response);
          })
          .catch((error) => reject(error));
      });
    },

    deleteCompany(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`/company/${id}`)
          .then((response) => {
            return resolve(response);
          })
          .catch((error) => reject(error));
      });
    },
  },
};
