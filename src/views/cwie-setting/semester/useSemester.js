import { ref, watch, computed, reactive } from "@vue/composition-api";
import store from "@/store";

// Notification
import { useToast } from "vue-toastification/composition";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import data from "@/router/routes/ui-elements";
import Swal from "sweetalert2";

export default function useSemester() {
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
  const refSemesterListTable = ref(null);

  // Table Handlers
  const tableColumns = [
    { key: "semester_year", sortable: true },
    { key: "term", sortable: true },
    { key: "round_no", sortable: true },
    { key: "start_date", sortable: true },
    { key: "end_date", sortable: true },
    { key: "regis_start_date", sortable: true },
    { key: "regis_end_date", sortable: true },
    { key: "active", sortable: true },
    { key: "actions" },
  ];

  const perPage = ref(25);
  const totalSemesters = ref(0);
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

  const blankSemester = {
    id: null,
    semester_id: null,
    semester_year: null,
    term: null,
    round_no: null,
    chairman_id: null,
    chairman: { label: "", code: "" },
    default_request_doc_no: "",
    default_request_doc_date: null,
    start_date: null,
    end_date: null,
    regis_start_date: null,
    regis_end_date: null,
    active: 1,
  };

  const item = ref(JSON.parse(JSON.stringify(blankSemester)));

  const dataMeta = computed(() => {
    const localItemsCount = refSemesterListTable.value
      ? refSemesterListTable.value.localItems.length
      : 0;
    return {
      from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
      to: perPage.value * (currentPage.value - 1) + localItemsCount,
      of: totalSemesters.value,
    };
  });

  const refetchData = () => {
    // refSemesterListTable.value.refresh();

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
        data.semester_year?.toLowerCase().includes(queryLowered) ||
        data.term?.toString().includes(queryLowered) ||
        data.round_no?.toString().includes(queryLowered) ||
        data.chairman.label?.toLowerCase().includes(queryLowered)
      );
    });

    const sortedData = filteredData.sort(sortCompare(sortBy));
    if (sortDesc) sortedData.reverse();

    items.value = paginateArray(sortedData, perPage, page);
    totalSemesters.value = filteredData.length;
  };
  // ถึงนี้
  const initDataConvert = (data) => {
    data.id = data.semester_id;

    if (data.chairman_id) {
      data.chairman = {
        label: data.chairman.name,
        code: data.chairman_id,
      };
    } else {
      data.chairman = { label: "", code: null };
    }

    return data;
  };

  const fetchSemesters = (ctx, callback) => {
    isOverLay.value = true;
    store
      .dispatch(
        "semester/fetchSemesters"
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
        totalSemesters.value = total;
        isOverLay.value = false;
      })
      .catch((error) => {
        toast({
          component: ToastificationContent,
          props: {
            title: "Error fetching Semesters' list",
            icon: "AlertTriangleIcon",
            variant: "danger",
          },
        });
        isOverLay.value = false;
      });
  };
  fetchSemesters();

  // End List

  // Start Form
  const onSubmit = () => {
    isSubmit.value = true;
    isOverLay.value = true;

    let dataSend = {
      semester_year: item.value.semester_year,
      term: item.value.term,
      round_no: item.value.round_no,
      chairman_id: item.value.chairman_id,
      email: item.value.email,
      default_request_doc_no: item.value.default_request_doc_no,
      default_request_doc_date: item.value.default_request_doc_date,
      start_date: item.value.start_date,
      end_date: item.value.end_date,
      regis_start_date: item.value.regis_start_date,
      regis_end_date: item.value.regis_end_date,
      active: item.value.active == true ? 1 : 0,
    };

    if (item.value.id == null) {
      store
        .dispatch("semester/addSemester", dataSend)
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
                title: "Success : Added Semester",
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
            "semester.",
            ""
          );
          errorText = errorText.replaceAll("\n", "<br>");
          errorText = errorText.slice(0, 0) + "<br>" + errorText.slice(0);
          errorToast(errorText);
        });
    } else {
      // Update
      dataSend["semester_id"] = item.value.id;

      store
        .dispatch("semester/editSemester", dataSend)
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
                title: "Success : Updated Semester",
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
            "semester.",
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
          .dispatch("semester/deleteSemester", { id: item.value.id })
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
              "semester.",
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
    () => [item.value.chairman.code],
    (value) => {
      item.value.chairman_id = item.value.chairman.code;
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
    fetchSemesters,
    tableColumns,
    perPage,
    currentPage,
    totalSemesters,
    dataMeta,
    perPageOptions,
    searchQuery,
    sortBy,
    isSortDirDesc,
    refSemesterListTable,
    blankSemester,
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
