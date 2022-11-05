import { ref, watch, computed } from "@vue/composition-api";
import store from "@/store";

// Notification
import { useToast } from "vue-toastification/composition";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import data from "@/router/routes/ui-elements";
import Swal from "sweetalert2";

export default function useDocumentType() {
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
  const refDocumentTypeListTable = ref(null);

  // Table Handlers
  const tableColumns = [
    { key: "name", sortable: true },
    { key: "description", sortable: false },
    { key: "active", sortable: true },
    { key: "actions" },
  ];

  const perPage = ref(25);
  const totalDocumentTypes = ref(0);
  const currentPage = ref(1);
  const perPageOptions = [1, 10, 25, 50, 100];
  const searchQuery = ref("");
  const sortBy = ref("id");
  const isSortDirDesc = ref(false);

  const isViewModal = ref(false);
  const isModal = ref(false);
  const isSubmit = ref(false);
  const isOverLay = ref(false);

  const dataMeta = computed(() => {
    const localItemsCount = refDocumentTypeListTable.value
      ? refDocumentTypeListTable.value.localItems.length
      : 0;
    return {
      from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
      to: perPage.value * (currentPage.value - 1) + localItemsCount,
      of: totalDocumentTypes.value,
    };
  });

  const refetchData = () => {
    // refDocumentTypeListTable.value.refresh();

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
      return data.name?.toLowerCase().includes(queryLowered);
    });

    const sortedData = filteredData.sort(sortCompare(sortBy));
    if (sortDesc) sortedData.reverse();

    items.value = paginateArray(sortedData, perPage, page);
    totalDocumentTypes.value = filteredData.length;
  };

  watch([currentPage, perPage, searchQuery], () => {
    refetchData();
  });

  const items = ref([]);
  const initialItems = ref([]);
  const fetchDocumentTypes = (ctx, callback) => {
    isOverLay.value = true;
    store
      .dispatch(
        "document-type/fetchDocumentTypes"
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
          r.id = r.document_type_id;
          return r;
        });
        items.value = initialItems.value.slice(0, perPage.value);
        totalDocumentTypes.value = total;
        isOverLay.value = false;
      })
      .catch((error) => {
        toast({
          component: ToastificationContent,
          props: {
            title: "Error fetching DocumentTypes' list",
            icon: "AlertTriangleIcon",
            variant: "danger",
          },
        });
        isOverLay.value = false;
      });
  };
  fetchDocumentTypes();

  // End List

  // Start Form

  const blankDocumentType = {
    id: null,
    document_type_id: null,
    name: "",
    description: "",
    active: 1,
  };

  const item = ref(JSON.parse(JSON.stringify(blankDocumentType)));

  const onSubmit = () => {
    isSubmit.value = true;

    let dataSend = {
      name: item.value.name,
      description: item.value.description,
      active: item.value.active,
    };

    if (item.value.id == null) {
      store
        .dispatch("document-type/addDocumentType", dataSend)
        .then(async (response) => {
          if (response.status == 201) {
            let { data } = response;
            data.id = data.document_type_id;

            items.value.push(data);

            initialItems.value.push(data);

            refetchData();

            isSubmit.value = false;
            isModal.value = false;

            toast({
              component: ToastificationContent,
              props: {
                title: "Success : Added DocumentType",
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
            "document_type.",
            ""
          );
          errorText = errorText.replaceAll("\n", "<br>");
          errorText = errorText.slice(0, 0) + "<br>" + errorText.slice(0);
          errorToast(errorText);
        });
    } else {
      // Update
      dataSend["document_type_id"] = item.value.id;

      store
        .dispatch("document-type/editDocumentType", dataSend)
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
                title: "Success : Updated DocumentType",
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
            "document_type.",
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
          .dispatch("document-type/deleteDocumentType", { id: item.value.id })
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
              "document_type.",
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

  return {
    fetchDocumentTypes,
    tableColumns,
    perPage,
    currentPage,
    totalDocumentTypes,
    dataMeta,
    perPageOptions,
    searchQuery,
    sortBy,
    isSortDirDesc,
    refDocumentTypeListTable,
    blankDocumentType,
    items,
    item,
    isModal,
    isViewModal,
    isSubmit,
    refetchData,
    onSubmit,
    onDelete,
    isOverLay,
  };
}
