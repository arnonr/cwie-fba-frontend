import axios from "@axios";

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    fetchPersonalDatas(ctx, queryParams) {
      return new Promise((resolve, reject) => {
        axios
          .get("/student", { params: queryParams })
          .then((response) => resolve(response))
          .catch((error) => reject(error));
      });
    },

    editPersonalData(ctx, dataSend) {
      return new Promise((resolve, reject) => {
        axios
          .put(`/student/${dataSend.student_id}`, dataSend)
          .then((response) => {
            return resolve(response);
          })
          .catch((error) => reject(error));
      });
    },

    fetchTeachers(ctx, queryParams) {
      return new Promise((resolve, reject) => {
        axios
          .get("/teacher", { params: queryParams })
          .then((response) => resolve(response))
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

    fetchDocumentTypes(ctx, queryParams) {
      return new Promise((resolve, reject) => {
        axios
          .get("/document-type", { params: queryParams })
          .then((response) => resolve(response))
          .catch((error) => reject(error));
      });
    },

    fetchStudentDocuments(ctx, queryParams) {
      return new Promise((resolve, reject) => {
        axios
          .get("/student-document", { params: queryParams })
          .then((response) => resolve(response))
          .catch((error) => reject(error));
      });
    },

    addStudentDocument(ctx, documentData) {
      var form_data = new FormData();

      for (var key in documentData) {
        form_data.append(key, documentData[key]);
      }

      return new Promise((resolve, reject) => {
        axios
          .post("/student-document", form_data, {
            headers: {
              "content-type": "multipart/form-data",
            },
          })
          .then((response) => resolve(response))
          .catch((error) => reject(error));
      });
      
      
    },
  },
};
