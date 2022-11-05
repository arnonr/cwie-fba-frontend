import { ref, watch, computed } from "@vue/composition-api";
import store from "@/store";

// Notification
import { useToast } from "vue-toastification/composition";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import data from "@/router/routes/ui-elements";
import Swal from "sweetalert2";

export default function useUser() {
  const toast = useToast();

  const errorToast = (message) => {
    toast({
      component: ToastificationContent,
      props: {
        title: "Error : " + message,
        icon: "AlertTriangleIcon",
        variant: "danger",
      },
    });
  };

  // Start List
  const refUserListTable = ref(null);

  // Table Handlers
  const tableColumns = [
    { key: "name", sortable: true },
    { key: "username", sortable: true },
    { key: "email", sortable: false },
    { key: "account_type", sortable: true },

    { key: "active", sortable: true },
    { key: "actions" },
  ];

  const perPage = ref(25);
  const totalUsers = ref(0);
  const currentPage = ref(1);
  const perPageOptions = [1, 10, 25, 50, 100];
  const searchQuery = ref("");
  const sortBy = ref("id");
  const isSortDirDesc = ref(false);

  const isViewModal = ref(false);
  const isModal = ref(false);
  const isAddModal = ref(false);
  const isSubmit = ref(false);
  const isOverLay = ref(false);

  const dataMeta = computed(() => {
    const localItemsCount = refUserListTable.value
      ? refUserListTable.value.localItems.length
      : 0;
    return {
      from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
      to: perPage.value * (currentPage.value - 1) + localItemsCount,
      of: totalUsers.value,
    };
  });

  const refetchData = () => {
    // refUserListTable.value.refresh();

    refetchClient({
      q: searchQuery.value,
      perPage: perPage.value,
      page: currentPage.value,
      sortBy: sortBy.value,
      sortDesc: isSortDirDesc.value,
    });
  };

  const refetchClient = (config) => {
    const {
      q = "",
      perPage = 25,
      page = 1,
      sortBy = "id",
      sortDesc = false,
    } = config;

    const queryLowered = q.toLowerCase();
    const filteredData = initialItems.value.filter((data) => {
      return (
        data.name?.toLowerCase().includes(queryLowered) ||
        data.username?.toLowerCase().includes(queryLowered) ||
        data.email?.toLowerCase().includes(queryLowered) ||
        data.account_type_name?.toLowerCase().includes(queryLowered)
      );
    });

    const sortedData = filteredData.sort(sortCompare(sortBy));
    if (sortDesc) sortedData.reverse();

    items.value = paginateArray(sortedData, perPage, page);
    totalUsers.value = filteredData.length;
  };

  watch([currentPage, perPage, searchQuery], () => {
    refetchData();
  });

  const items = ref([]);
  const initialItems = ref([]);
  const fetchUsers = (ctx, callback) => {
    isOverLay.value = true;
    store
      .dispatch(
        "user/fetchUsers"
        // , {
        //   name_th: searchQuery.value,
        //   perPage: perPage.value,
        //   page: currentPage.value,
        //   sortBy: sortBy.value,
        //   sortDesc: isSortDirDesc.value,
        // }
      )
      .then((response) => {
        const { rows, currPage, lastPage, total } = response.data;
        // callback(rows);
        initialItems.value = rows.map((r) => {
          r.id = r.user_id;
          r.account_type_name = resolveAccountType(r.account_type);
          return r;
        });
        items.value = initialItems.value.slice(0, perPage.value);
        totalUsers.value = total;
        isOverLay.value = false;
      })
      .catch((error) => {
        toast({
          component: ToastificationContent,
          props: {
            title: "Error fetching Users' list",
            icon: "AlertTriangleIcon",
            variant: "danger",
          },
        });
        isOverLay.value = false;
      });
  };
  fetchUsers();

  // End List

  // Start Form

  const blankUser = {
    id: null,
    user_id: null,
    name: "",
    username: "",
    tel: "",
    email: "",
    citizen_id: "",
    account_type: "",
    active: 1,
  };

  const item = ref(JSON.parse(JSON.stringify(blankUser)));

  const onSubmit = () => {
    isSubmit.value = true;

    let dataSend = {
      name: item.value.name,
      tel: item.value.tel,
      email: item.value.email,
      active: item.value.active,
    };

    if (item.value.id == null) {
      store
        .dispatch("user/addUser", { username: item.value.username })
        .then(async (response) => {
          if (response.status == 200) {
            let { data } = response;

            data.id = data.user_id;
            data.account_type_name = resolveAccountType(data.account_type);

            const index = items.value.findIndex((e) => {
              return data.id === e.id;
            });

            if (index != -1) {
              items.value.splice(index, 1, { ...data });
            } else {
              items.value.push(data);
            }

            const indexInit = initialItems.value.findIndex((e) => {
              return data.id == e.id;
            });
            if (indexInit != -1) {
              initialItems.value.splice(indexInit, 1, { ...data });
            } else {
              initialItems.value.push(data);
            }

            refetchData();

            isSubmit.value = false;
            isAddModal.value = false;

            toast({
              component: ToastificationContent,
              props: {
                title: "Success : Added User",
                icon: "CheckIcon",
                variant: "success",
              },
            });
          } else {
            isSubmit.value = false;
            errorToast(response.data);
          }
        })
        .catch((error) => {
          isSubmit.value = false;

          let errorText = error.response.data.error.message.replaceAll(
            "user.",
            ""
          );
          errorText = errorText.replaceAll("\n", "<br>");
          errorText = errorText.slice(0, 0) + "<br>" + errorText.slice(0);
          errorToast(errorText);
        });
    } else {
      // Update
      dataSend["user_id"] = item.value.id;

      store
        .dispatch("user/editUser", dataSend)
        .then(async (response) => {
          if (response.status == 200) {
            const index = items.value.findIndex((e) => {
              return item.value.id === e.id;
            });
            items.value.splice(index, 1, { ...item.value });

            const indexInit = initialItems.value.findIndex((e) => {
              return item.value.id === e.id;
            });
            initialItems.value.splice(indexInit, 1, { ...item.value });

            isSubmit.value = false;
            isModal.value = false;

            toast({
              component: ToastificationContent,
              props: {
                title: "Success : Updated User",
                icon: "CheckIcon",
                variant: "success",
              },
            });
          } else {
            isSubmit.value = false;
            errorToast(response.data);
          }
        })
        .catch((error) => {
          isSubmit.value = false;

          let errorText = error.response.data.error.message.replaceAll(
            "user.",
            ""
          );
          errorText = errorText.replaceAll("\n", "<br>");
          errorText = errorText.slice(0, 0) + "<br>" + errorText.slice(0);
          errorToast(errorText);
        });
    }
  };

  const onDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      customClass: {
        confirmButton: "btn btn-primary",
        cancelButton: "btn btn-outline-danger ml-1",
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed) {
        isOverLay.value = true;
        store
          .dispatch("user/deleteUser", { id: item.value.id })
          .then(async (response) => {
            if (response.status == 204) {
              const index = items.value.findIndex((e) => {
                return item.value.id === e.id;
              });
              items.value.splice(index, 1);

              const indexInit = initialItems.value.findIndex((e) => {
                return item.value.id === e.id;
              });

              initialItems.value.splice(indexInit, 1);

              refetchData();

              isOverLay.value = false;

              Swal.fire({
                icon: "success",
                title: "Deleted!",
                text: "Your file has been deleted.",
                customClass: {
                  confirmButton: "btn btn-success",
                },
              });
            } else {
              errorToast(response.data);
              isOverLay.value = false;
            }
          })
          .catch((error) => {
            let errorText = error.response.data.error.message.replaceAll(
              "user.",
              ""
            );
            errorText = errorText.replaceAll("\n", "<br>");
            errorText = errorText.slice(0, 0) + "<br>" + errorText.slice(0);
            errorToast(errorText);
            isOverLay.value = false;
          });
      }
    });
  };

  const onLoadUser = () => {
    isSubmit.value = true;
    store
      .dispatch("user/loadUser", { username: item.value.username })
      .then(async (response) => {
        if (response.status == 200) {
          item.value = response.data;

          item.value.account_type_name = resolveAccountType(
            item.value.account_type
          );
          item.value.id = null;

          isSubmit.value = false;
        } else {
          isSubmit.value = false;
          errorToast(response.data);
        }
      })
      .catch((error) => {
        let errorText = error.response.data.error.message.replaceAll(
          "user.",
          ""
        );
        errorText = errorText.replaceAll("\n", "<br>");
        errorText = errorText.slice(0, 0) + "<br>" + errorText.slice(0);
        errorToast(errorText);
        isSubmit.value = false;
      });
  };

  // *===============================================---*
  // *--------- UI ---------------------------------------*
  // *===============================================---*
  const paginateArray = (array, perPage, page) =>
    array.slice((page - 1) * perPage, page * perPage);

  const sortCompare = (key) => (a, b) => {
    const fieldA = a[key];
    const fieldB = b[key];

    let comparison = 0;
    if (fieldA > fieldB) {
      comparison = 1;
    } else if (fieldA < fieldB) {
      comparison = -1;
    }
    return comparison;
  };

  const resolveAccountType = (account_type) => {
    if (account_type === 1) return "นักศึกษา";
    if (account_type === 2) return "อาจารย์";
    if (account_type === 3) return "เจ้าหน้าที่";
    return "";
  };

  return {
    fetchUsers,
    tableColumns,
    perPage,
    currentPage,
    totalUsers,
    dataMeta,
    perPageOptions,
    searchQuery,
    sortBy,
    isSortDirDesc,
    refUserListTable,
    blankUser,
    items,
    item,
    isModal,
    isAddModal,
    isViewModal,
    isSubmit,
    refetchData,
    onSubmit,
    onDelete,
    onLoadUser,
    isOverLay,
  };
}
