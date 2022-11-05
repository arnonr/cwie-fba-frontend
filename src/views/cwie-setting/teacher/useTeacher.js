import { ref, watch, computed } from "@vue/composition-api";
import store from "@/store";

// Notification
import { useToast } from "vue-toastification/composition";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
// import data from "@/router/routes/ui-elements";
import Swal from "sweetalert2";

export default function useTeacher() {
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
  const refTeacherListTable = ref(null);

  // Table Handlers
  const tableColumns = [
    { key: "prefix", sortable: true },
    { key: "firstname", sortable: true },
    { key: "surname", sortable: false },
    { key: "department_name", sortable: true },
    { key: "active", sortable: true },
    { key: "actions" },
  ];

  const perPage = ref(25);
  const totalTeachers = ref(0);
  const currentPage = ref(1);
  const perPageOptions = [1, 10, 25, 50, 100];
  const searchQuery = ref("");
  const sortBy = ref("firstname");
  const isSortDirDesc = ref(false);

  const isViewModal = ref(false);
  const isModal = ref(false);
  const isAddModal = ref(false);
  const isSubmit = ref(false);
  const isOverLay = ref(false);

  const dataMeta = computed(() => {
    const localItemsCount = refTeacherListTable.value
      ? refTeacherListTable.value.localItems.length
      : 0;
    return {
      from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
      to: perPage.value * (currentPage.value - 1) + localItemsCount,
      of: totalTeachers.value,
    };
  });

  const refetchData = () => {
    // refTeacherListTable.value.refresh();

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
      sortBy = "firstname",
      sortDesc = false,
    } = config;

    const queryLowered = q.toLowerCase();
    const filteredData = initialItems.value.filter((data) => {
      return (
        data.prefix?.toLowerCase().includes(queryLowered) ||
        data.firstname?.toLowerCase().includes(queryLowered) ||
        data.surname?.toLowerCase().includes(queryLowered) ||
        data.department_name?.toLowerCase().includes(queryLowered)
      );
    });

    const sortedData = filteredData.sort(sortCompare(sortBy));
    if (sortDesc) sortedData.reverse();

    items.value = paginateArray(sortedData, perPage, page);
    totalTeachers.value = filteredData.length;
  };

  watch([currentPage, perPage, searchQuery], () => {
    refetchData();
  });

  const items = ref([]);
  const initialItems = ref([]);

  const selectOptions = ref({
    provinces: [],
    amphurs: [],
    tumbols: [],
  });

  const blankTeacher = {
    id: null,
    teacher_id: null,
    prefix: null,
    name: "",
    teachername: "",
    firstname: null,
    surname: null,
    tel: null,
    email: null,
    citizen_id: "",
    account_type: "",
    address: null,
    province: {label: null, code: null},
    amphur: {label: null, code: null},
    tumbol: {label: null, code: null},
    active: 1,
    signature_file: null


  };

  const item = ref(JSON.parse(JSON.stringify(blankTeacher)));

  const fetchProvinces = (ctx, callback) => {
    store
      .dispatch("teacher/fetchProvinces")
      .then((response) => {
        const { rows, currPage, lastPage, total } = response.data;
        selectOptions.value.provinces = rows.map((r) => {
          return { label: r.name_th, code: r.province_id };
        });
      })
      .catch((error) => {
        toast({
          component: ToastificationContent,
          props: {
            title: "Error fetching Province's list",
            icon: "AlertTriangleIcon",
            variant: "danger",
          },
        });
        isOverLay.value = false;
      });
  };
  fetchProvinces();

  const fetchAmphurs = (ctx, callback) => {
    if (item.value.province.code != null) {
      store
        .dispatch("teacher/fetchAmphurs", {
          province_id: item.value.province.code,
        })
        .then((response) => {
          const { rows, currPage, lastPage, total } = response.data;
          selectOptions.value.amphurs = rows.map((r) => {
            return {
              label: r.name_th,
              code: r.amphur_id,
            };
          });
        })
        .catch((error) => {
          toast({
            component: ToastificationContent,
            props: {
              title: "Error fetching Amphur's list",
              icon: "AlertTriangleIcon",
              variant: "danger",
            },
          });
          isOverLay.value = false;
        });
    }
  };

  const fetchTumbols = (ctx, callback) => {
    if (item.value.amphur.code != null) {
      store
        .dispatch("teacher/fetchTumbols", { amphur_id: item.value.amphur.code })
        .then((response) => {
          const { rows, currPage, lastPage, total } = response.data;
          selectOptions.value.tumbols = rows.map((r) => {
            return {
              label: r.name_th + " " + r.postcode,
              code: r.tumbol_id,
            };
          });
        })
        .catch((error) => {
          toast({
            component: ToastificationContent,
            props: {
              title: "Error fetching Tumbol's list",
              icon: "AlertTriangleIcon",
              variant: "danger",
            },
          });
          isOverLay.value = false;
        });
    }
  };


  
  const fetchTeachers = (ctx, callback) => {
    isOverLay.value = true;
    store
      .dispatch("teacher/fetchTeachers", {
        // name_th: searchQuery.value,
        // perPage: perPage.value,
        // page: currentPage.value,
        sortBy: sortBy.value,
        // sortDesc: isSortDirDesc.value,
      })
      .then((response) => {
        const { rows, currPage, lastPage, total } = response.data;
        // callback(rows);
        initialItems.value = rows.map((r) => {
          r.id = r.teacher_id;
          r.department_name = r.department.name_th;

          if (r.province != null) {
            r.province = { label: r.province.name_th, code: r.province.id };
          } else {
            r.province = { label: null, code: null };
          }

          if (r.amphur != null) {
            r.amphur = { label: r.amphur.name_th, code: r.amphur.id };
          } else {
            r.amphur = { label: null, code: null };
          }


          if (r.tumbol != null) {
            r.tumbol = { label: r.tumbol.name_th, code: r.tumbol.id };
          } else {
            r.tumbol = { label: null, code: null };
          }

          return r;
        });
        items.value = initialItems.value.slice(0, perPage.value);
        totalTeachers.value = total;
        isOverLay.value = false;
      })
      .catch((error) => {
        toast({
          component: ToastificationContent,
          props: {
            title: "Error fetching Teachers' list",
            icon: "AlertTriangleIcon",
            variant: "danger",
          },
        });
        isOverLay.value = false;
      });
  };
  fetchTeachers();

  // End List

  // Start Form

  const onSubmit = () => {
    isSubmit.value = true;

    let dataSend = {
      prefix: item.value.prefix,
      firstname: item.value.firstname,
      surname: item.value.surname,
      tel: item.value.tel,
      email: item.value.email,
      address: item.value.address,
      province_id: item.value.province.code,
      amphur_id: item.value.amphur.code,
      tumbol_id: item.value.tumbol.code,
      active: item.value.active,
      signature_file: item.value.signature_file
    };

    if (item.value.id == null) {
      store
        .dispatch("teacher/addTeacher", { teachername: item.value.teachername })
        .then(async (response) => {
          if (response.status == 200) {
            let { data } = response;

            data.id = data.teacher_id;
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
                title: "Success : Added Teacher",
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
            "teacher.",
            ""
          );
          errorText = errorText.replaceAll("\n", "<br>");
          errorText = errorText.slice(0, 0) + "<br>" + errorText.slice(0);
          errorToast(errorText);
        });
    } else {
      // Update
      dataSend["teacher_id"] = item.value.id;

      store
        .dispatch("teacher/editTeacher", dataSend)
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
                title: "Success : Updated Teacher",
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
            "teacher.",
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
          .dispatch("teacher/deleteTeacher", { id: item.value.id })
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
              "teacher.",
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

  const onLoadTeacher = () => {
    isSubmit.value = true;
    let dataSend = {
      firstname: item.value.firstname,
      lastname: item.value.lastname,
    };
    console.log(item.value.firstname);
    console.log(item.value.lastname);
    store
      .dispatch("teacher/loadTeacher", { ...dataSend })
      .then(async (response) => {
        if (response.status == 200) {
          item.value.name =
            response.data[0].firstname + " " + response.data[0].surname;
          // console.log(response.data)

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
          "teacher.",
          ""
        );
        errorText = errorText.replaceAll("\n", "<br>");
        errorText = errorText.slice(0, 0) + "<br>" + errorText.slice(0);
        errorToast(errorText);
        isSubmit.value = false;
      });
  };

  const onSync = () => {
    isOverLay.value = true;
    store
      .dispatch("teacher/syncTeacher")
      .then(async (response) => {
        if (response.status == 200) {
          fetchTeachers();
          toast({
            component: ToastificationContent,
            props: {
              title: "Success : Sync Teacher Success",
              icon: "CheckIcon",
              variant: "success",
            },
          });
        } else {
          isOverLay.value = false;
          errorToast(response.data);
        }
      })
      .catch((error) => {
        let errorText = error.response.data.error.message.replaceAll(
          "teacher.",
          ""
        );
        errorText = errorText.replaceAll("\n", "<br>");
        errorText = errorText.slice(0, 0) + "<br>" + errorText.slice(0);
        errorToast(errorText);
        isOverLay.value = false;
      });
  };

  watch(
    () => [item.value.province],
    (value) => {
      if (value != null) {
        fetchAmphurs();
      }
    }
  );

  watch(
    () => [item.value.amphur],
    (value) => {
      if (value != null) {
        fetchTumbols();
      }
    }
  );

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
    fetchTeachers,
    tableColumns,
    perPage,
    currentPage,
    totalTeachers,
    dataMeta,
    perPageOptions,
    searchQuery,
    sortBy,
    isSortDirDesc,
    refTeacherListTable,
    blankTeacher,
    items,
    item,
    isModal,
    isAddModal,
    isViewModal,
    isSubmit,
    refetchData,
    onSubmit,
    onDelete,
    onLoadTeacher,
    onSync,
    isOverLay,
    selectOptions,
  };
}
