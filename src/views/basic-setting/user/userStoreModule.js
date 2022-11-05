import axios from "@axios";

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    fetchUsers(ctx, queryParams) {
      return new Promise((resolve, reject) => {
        axios
          .get("/user", { params: queryParams })
          .then((response) => resolve(response))
          .catch((error) => reject(error));
      });
    },
    fetchUser(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .get(`/user-type/${id}`)
          .then((response) => resolve(response))
          .catch((error) => reject(error));
      });
    },
    addUser(ctx, {username}) {
      return new Promise((resolve, reject) => {
        axios
          .post(`/user/import-icit-account/${username}`)
          .then((response) => {
            return resolve(response);
          })
          .catch((error) => reject(error));
      });
    },
    editUser(ctx, dataSend) {
      return new Promise((resolve, reject) => {
        axios
          .put(`/user/${dataSend.user_id}`, dataSend)
          .then((response) => {
            return resolve(response);
          })
          .catch((error) => reject(error));
      });
    },
    deleteUser(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`/user/${id}`)
          .then((response) => {
            return resolve(response);
          })
          .catch((error) => reject(error));
      });
    },
    loadUser(ctx, { username }) {
      return new Promise((resolve, reject) => {
        axios
          .get(`/user/get-icit-account/${username}`)
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
