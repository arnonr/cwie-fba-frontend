import { ref, watch, computed } from "@vue/composition-api";
import store from "@/store";

// Notification
import { useToast } from "vue-toastification/composition";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import data from "@/router/routes/ui-elements";

export default function useFaculty() {
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
  const refFacultyListTable = ref(null);

  // Table Handlers
  const tableColumns = [
    // { key: "id", label: "#", sortable: true, visible: false },
    { key: "name_th", sortable: true },
    { key: "tel", sortable: false },
    { key: "email", sortable: false },
    { key: "major", sortable: false },
    // { key: 'total', sortable: true, formatter: val => `$${val}` },
    { key: "actions" },
  ];

  const perPage = ref(50);
  const totalFaculties = ref(0);
  const currentPage = ref(1);
  const perPageOptions = [1, 10, 25, 50, 100];
  const searchQuery = ref("");
  const sortBy = ref("id");
  const isSortDirDesc = ref(false);

  const dataMeta = computed(() => {
    const localItemsCount = refFacultyListTable.value
      ? refFacultyListTable.value.localItems.length
      : 0;
    return {
      from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
      to: perPage.value * (currentPage.value - 1) + localItemsCount,
      of: totalFaculties.value,
    };
  });

  const refetchData = () => {
    // refFacultyListTable.value.refresh();

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
      perPage = 50,
      page = 1,
      sortBy = "id",
      sortDesc = false,
    } = config;

    const queryLowered = q.toLowerCase();
    const filteredData = initialItems.value.filter((data) => {
      return (
        data.faculty_code?.toLowerCase().includes(queryLowered) ||
        data.name_th?.toLowerCase().includes(queryLowered) ||
        data.name_en?.toLowerCase().includes(queryLowered) ||
        data.email?.toLowerCase().includes(queryLowered) ||
        data.tel?.toLowerCase().includes(queryLowered) ||
        data.fax?.toLowerCase().includes(queryLowered)
      );
    });

    const sortedData = filteredData.sort(sortCompare(sortBy));
    if (sortDesc) sortedData.reverse();

    items.value = paginateArray(sortedData, perPage, page);
    totalFaculties.value = filteredData.length;
  };

  watch([currentPage, perPage, searchQuery], () => {
    refetchData();
  });

  const items = ref([]);
  const initialItems = ref([]);
  const fetchFaculties = (ctx, callback) => {
    store
      .dispatch(
        "faculty/fetchFaculties"
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
          r.id = r.faculty_id;
          return r;
        });
        items.value = initialItems.value.slice(0, perPage.value);
        totalFaculties.value = total;
      })
      .catch((error) => {
        console.log(error);
        toast({
          component: ToastificationContent,
          props: {
            title: "Error fetching Faculties' list",
            icon: "AlertTriangleIcon",
            variant: "danger",
          },
        });
      });
  };
  fetchFaculties();

  // End List

  // Start Form
  const isViewModal = ref(false);
  const isModal = ref(false);
  const isSubmit = ref(false);

  const blankFaculty = {
    id: null,
    faculty_id: null,
    name_th: "",
    name_en: "",
    tel: "",
    fax: "",
    email: "",
  };

  const item = ref(JSON.parse(JSON.stringify(blankFaculty)));

  const onSubmit = () => {
    isSubmit.value = true;

    let dataSend = {
      faculty_id: item.value.id,
      name_th: item.value.name_th,
      name_en: item.value.name_en,
      tel: item.value.tel,
      fax: item.value.fax,
      email: item.value.email,
    };

    store
      .dispatch("faculty/editFaculty", dataSend)
      .then(async (response) => {
        if (response.status == 200) {
          console.log(response);

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
              title: "Success : Updated Faculty",
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
          "faculty.",
          ""
        );
        errorText = errorText.replaceAll("\n", "<br>");
        errorText = errorText.slice(0,0) + "<br>" + errorText.slice(0);
        errorToast(errorText);
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
    fetchFaculties,
    tableColumns,
    perPage,
    currentPage,
    totalFaculties,
    dataMeta,
    perPageOptions,
    searchQuery,
    sortBy,
    isSortDirDesc,
    refFacultyListTable,
    items,
    item,
    isModal,
    isViewModal,
    isSubmit,
    refetchData,
    onSubmit,
  };
}
