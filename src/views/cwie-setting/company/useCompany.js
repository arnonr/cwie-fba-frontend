import { ref, watch, computed, reactive } from "@vue/composition-api";
import store from "@/store";

// Notification
import { useToast } from "vue-toastification/composition";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import data from "@/router/routes/ui-elements";
import Swal from "sweetalert2";

export default function useCompany() {
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
  const refCompanyListTable = ref(null);

  // Table Handlers
  const tableColumns = [
    { key: "name_th", sortable: true },
    { key: "name_en", sortable: true },
    { key: "province.label", sortable: true, label: "Province" },
    { key: "amhpur.label", sortable: true, label: "Amphur" },
    { key: "tumbol.label", sortable: true, label: "Tumbol" },
    { key: "active", sortable: true },
    { key: "actions" },
  ];

  const perPage = ref(25);
  const totalCompanies = ref(0);
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

  const items = ref([]);
  const initialItems = ref([]);

  const blankCompany = {
    id: null,
    company_id: null,
    name_th: "",
    name_en: "",
    tel: "",
    fax: "",
    email: "",
    website: "",
    blacklist: false,
    comment: "",
    namecard_file: null,
    namecard_file_old: null,
    address: "",
    province_id: null,
    province: { label: "", code: "" },
    amphur_id: null,
    amphur: { label: "", code: "" },
    tumbol_id: null,
    tumbol: { label: "", code: "" },

    active: 1,
  };

  const item = ref(JSON.parse(JSON.stringify(blankCompany)));

  const dataMeta = computed(() => {
    const localItemsCount = refCompanyListTable.value
      ? refCompanyListTable.value.localItems.length
      : 0;
    return {
      from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
      to: perPage.value * (currentPage.value - 1) + localItemsCount,
      of: totalCompanies.value,
    };
  });

  const refetchData = () => {
    // refCompanyListTable.value.refresh();

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
        data.name_th?.toLowerCase().includes(queryLowered) ||
        data.name_en?.toLowerCase().includes(queryLowered) ||
        data.province.label?.toLowerCase().includes(queryLowered) ||
        data.amphur.label?.toLowerCase().includes(queryLowered) ||
        data.tumbol.label?.toLowerCase().includes(queryLowered)
      );
    });

    const sortedData = filteredData.sort(sortCompare(sortBy));
    if (sortDesc) sortedData.reverse();

    items.value = paginateArray(sortedData, perPage, page);
    totalCompanies.value = filteredData.length;
  };

  const initDataConvert = (data) => {
    data.id = data.company_id;
    data.blacklist = data.blacklist == 1 ? true : false;
    data.active = data.active == 1 ? true : false;
    
    data.namecard_file_old = null;
    if (data.namecard_file != null) {
      data.namecard_file_old =
        window.location.origin + "/storage" + data.namecard_file;
    }

    if (data.province_id) {
      data.province = {
        label: data.province.name_th,
        code: data.province_id,
      };
    } else {
      data.province = { label: "", code: null };
    }

    if (data.amphur_id) {
      data.amphur = {
        label: data.amphur.name_th,
        code: data.amphur_id,
      };
    } else {
      data.amphur = { label: "", code: null };
    }

    if (data.tumbol_id) {
      data.tumbol = {
        label: data.tumbol.name_th,
        code: data.tumbol_id,
      };
    } else {
      data.tumbol = { label: "", code: null };
    }

    return data;
  };

  const fetchCompanies = (ctx, callback) => {
    isOverLay.value = true;
    store
      .dispatch(
        "company/fetchCompanies"
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
          r = initDataConvert(r);

          return r;
        });

        items.value = initialItems.value.slice(0, perPage.value);
        totalCompanies.value = total;
        isOverLay.value = false;
      })
      .catch((error) => {
        toast({
          component: ToastificationContent,
          props: {
            title: "Error fetching Companies' list",
            icon: "AlertTriangleIcon",
            variant: "danger",
          },
        });
        isOverLay.value = false;
      });
  };
  fetchCompanies();

  // End List

  // Start Form
  const onSubmit = () => {
    isSubmit.value = true;
    isOverLay.value = true;

    let dataSend = {
      name_th: item.value.name_th,
      name_en: item.value.name_en,
      tel: item.value.tel,
      fax: item.value.fax,
      email: item.value.email,
      website: item.value.website,
      blacklist: item.value.blacklist,
      namecard_file: item.value.namecard_file,
      address: item.value.address,
      province_id: item.value.province_id,
      amphur_id: item.value.amphur_id,
      tumbol_id: item.value.tumbol_id,
      active: item.value.active == true ? 1 : 0,
    };

    if (item.value.id == null) {
      store
        .dispatch("company/addCompany", dataSend)
        .then(async (response) => {
          if (response.status == 201) {
            let { data } = response;

            data = initDataConvert(data);

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
            isModal.value = false;
            isOverLay.value = false;

            toast({
              component: ToastificationContent,
              props: {
                title: "Success : Added Company",
                icon: "CheckIcon",
                variant: "success",
              },
            });
          } else {
            isSubmit.value = false;
            isOverLay.value = false;
            errorToast(response.data);
          }
        })
        .catch((error) => {
          isSubmit.value = false;
          isOverLay.value = false;

          let errorText = error.response.data.error.message.replaceAll(
            "company.",
            ""
          );
          errorText = errorText.replaceAll("\n", "<br>");
          errorText = errorText.slice(0, 0) + "<br>" + errorText.slice(0);
          errorToast(errorText);
        });
    } else {
      // Update
      dataSend["company_id"] = item.value.id;

      store
        .dispatch("company/editCompany", dataSend)
        .then(async (response) => {
          if (response.status == 200) {
            let { data } = response;

            data = initDataConvert(data);

            const indexInit = initialItems.value.findIndex((e) => {
              return item.value.id === e.id;
            });

            initialItems.value.splice(indexInit, 1, { ...data });

            const index = items.value.findIndex((e) => {
              return item.value.id === e.id;
            });
            items.value.splice(index, 1, { ...data });

            isSubmit.value = false;
            isModal.value = false;
            isOverLay.value = false;

            toast({
              component: ToastificationContent,
              props: {
                title: "Success : Updated Company",
                icon: "CheckIcon",
                variant: "success",
              },
            });
          } else {
            isSubmit.value = false;
            isOverLay.value = false;

            errorToast(response.data);
          }
        })
        .catch((error) => {
          isSubmit.value = false;
          isOverLay.value = false;

          let errorText = error.response.data.error.message.replaceAll(
            "company.",
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
          .dispatch("company/deleteCompany", { id: item.value.id })
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
              "company.",
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

  watch([currentPage, perPage, searchQuery], () => {
    refetchData();
  });

  watch(
    () => [item.value.province.code],
    (value) => {
      item.value.province_id = item.value.province.code;
    }
  );

  watch(
    () => [item.value.amphur.code],
    (value) => {
      item.value.amphur_id = item.value.amphur.code;
    }
  );

  watch(
    () => [item.value.tumbol.code],
    (value) => {
      item.value.tumbol_id = item.value.tumbol.code;
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
    fetchCompanies,
    tableColumns,
    perPage,
    currentPage,
    totalCompanies,
    dataMeta,
    perPageOptions,
    searchQuery,
    sortBy,
    isSortDirDesc,
    refCompanyListTable,
    blankCompany,
    items,
    item,
    isModal,
    isAddModal,
    isViewModal,
    isSubmit,
    refetchData,
    onSubmit,
    onDelete,
    isOverLay,
  };
}
