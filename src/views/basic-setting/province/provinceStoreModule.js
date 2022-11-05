import axios from '@axios'

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    fetchProvinces(ctx, queryParams) {
      return new Promise((resolve, reject) => {
        axios
          .get('/province', { params: queryParams })
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    fetchProvince(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .get(`/province/${id}`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    addProvince(ctx, dataSend) {
      return new Promise((resolve, reject) => {
        axios
          .post("/province", dataSend)
          .then((response) => {
            return resolve(response);
          })
          .catch((error) => reject(error));
      });
    },
    editProvince(ctx, dataSend) {
      return new Promise((resolve, reject) => {
        axios
          .put(`/province/${dataSend.province_id}`, dataSend)
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
