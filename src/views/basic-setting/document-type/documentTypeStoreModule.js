import axios from "@axios";

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    fetchDocumentTypes(ctx, queryParams) {
      return new Promise((resolve, reject) => {
        axios
          .get("/document-type", { params: queryParams })
          .then((response) => resolve(response))
          .catch((error) => reject(error));
      });
    },
    fetchDocumentType(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .get(`/document-type/${id}`)
          .then((response) => resolve(response))
          .catch((error) => reject(error));
      });
    },
    addDocumentType(ctx, dataSend) {
      return new Promise((resolve, reject) => {
        axios
          .post("/document-type", dataSend)
          .then((response) => {
            return resolve(response);
          })
          .catch((error) => reject(error));
      });
    },
    editDocumentType(ctx, dataSend) {
      return new Promise((resolve, reject) => {
        axios
          .put(`/document-type/${dataSend.document_type_id}`, dataSend)
          .then((response) => {
            return resolve(response);
          })
          .catch((error) => reject(error));
      });
    },
    deleteDocumentType(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`/document-type/${id}`)
          .then((response) => {
            return resolve(response);
          })
          .catch((error) => reject(error));
      });
    },
    // addUser(ctx, userData) {
    //   return new Promise((resolve, reject) => {
    //     axios
    //       .post('/apps/user/users', { user: userData })
    //       .then(response => resolve(response))
    //       .catch(error => reject(error))
    //   })
    // },
  },
};
