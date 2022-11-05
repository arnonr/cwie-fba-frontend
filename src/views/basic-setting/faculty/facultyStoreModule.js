import axios from '@axios'

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    fetchFaculties(ctx, queryParams) {
      return new Promise((resolve, reject) => {
        axios
          .get('/faculty', { params: queryParams })
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    fetchFaculty(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .get(`/faculty/${id}`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    addFaculty(ctx, dataSend) {
      return new Promise((resolve, reject) => {
        axios
          .post("/faculty", dataSend)
          .then((response) => {
            return resolve(response);
          })
          .catch((error) => reject(error));
      });
    },
    editFaculty(ctx, dataSend) {
      return new Promise((resolve, reject) => {
        axios
          .put(`/faculty/${dataSend.faculty_id}`, dataSend)
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
}
