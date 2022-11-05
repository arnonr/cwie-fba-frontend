<template>
  <!-- Table Container Card -->
  <b-card no-body>
    <div class="m-2">
      <!-- Table Top -->
      <b-row>
        <!-- Per Page -->
        <b-col
          cols="12"
          md="6"
          class="d-flex align-items-center justify-content-start mb-1 mb-md-0"
        >
          <label>Entries</label>
          <v-select
            v-model="perPage"
            :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
            :options="perPageOptions"
            :clearable="false"
            class="per-page-selector d-inline-block ml-50 mr-1"
          />
        </b-col>

        <!-- Search -->
        <b-col cols="12" md="6">
          <div class="d-flex align-items-center justify-content-end">
            <b-form-input
              v-model="searchQuery"
              class="d-inline-block mr-1"
              placeholder="Search..."
            />
          </div>
        </b-col>
      </b-row>
    </div>
    <div class="m-2">
      <b-table
        ref="refFacultyListTable"
        :items="items"
        responsive
        :fields="tableColumns"
        primary-key="id"
        :sort-by.sync="sortBy"
        show-empty
        empty-text="No matching records found"
        :sort-desc.sync="isSortDirDesc"
        class="position-relative table table-bordered"
      >
        <template #cell(major)="data">
          <div class="text-nowrap">
            <!-- sss -->
            <b-button variant="warning">Major</b-button>
          </div>
        </template>

        <!-- Column: Actions -->
        <template #cell(actions)="data">
          <div class="text-nowrap">
            <b-button variant="info" class="mr-1" @click="handleViewClick(data)"
              >View</b-button
            >

            <b-button variant="success" @click="handleFormClick(data)"
              >Edit</b-button
            >
          </div>
        </template>
      </b-table>
    </div>
    <div class="mx-2 mb-2">
      <b-row>
        <b-col
          cols="12"
          sm="6"
          class="d-flex align-items-center justify-content-center justify-content-sm-start"
        >
          <span class="text-muted"
            >Showing {{ dataMeta.from }} to {{ dataMeta.to }} of
            {{ dataMeta.of }} entries</span
          >
        </b-col>
        <!-- Pagination -->
        <b-col
          cols="12"
          sm="6"
          class="d-flex align-items-center justify-content-center justify-content-sm-end"
        >
          <b-pagination
            v-model="currentPage"
            :total-rows="totalFaculties"
            :per-page="perPage"
            first-number
            last-number
            class="mb-0 mt-1 mt-sm-0"
            prev-class="prev-item"
            next-class="next-item"
          >
            <template #prev-text>
              <feather-icon icon="ChevronLeftIcon" size="18" />
            </template>
            <template #next-text>
              <feather-icon icon="ChevronRightIcon" size="18" />
            </template>
          </b-pagination>
        </b-col>
      </b-row>
    </div>

    <faculty-form
      v-model="isModal"
      :isSubmit="isSubmit"
      :item="item"
      @on-submit="onSubmit()"
    />

    <faculty-view v-model="isViewModal" :item="item" />
  </b-card>
</template>

<script>
import {
  BCard,
  BRow,
  BCol,
  BFormInput,
  BButton,
  BTable,
  BMedia,
  BAvatar,
  BLink,
  BBadge,
  BDropdown,
  BDropdownItem,
  BPagination,
  BTooltip,
} from "bootstrap-vue";
import vSelect from "vue-select";
import { onUnmounted } from "@vue/composition-api";
import store from "@/store";
import useFaculty from "./useFaculty";

import FacultyForm from "./FacultyForm.vue";
import FacultyView from "./FacultyView.vue";

import facultyStoreModule from "./facultyStoreModule";

export default {
  components: {
    BCard,
    BRow,
    BCol,
    BFormInput,
    BButton,
    BTable,
    BMedia,
    BAvatar,
    BLink,
    BBadge,
    BDropdown,
    BDropdownItem,
    BPagination,
    BTooltip,
    vSelect,
    FacultyForm,
    FacultyView,
  },
  setup() {
    const FACULTY_APP_STORE_MODULE_NAME = "faculty";

    // Register module
    if (!store.hasModule(FACULTY_APP_STORE_MODULE_NAME))
      store.registerModule(FACULTY_APP_STORE_MODULE_NAME, facultyStoreModule);

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(FACULTY_APP_STORE_MODULE_NAME))
        store.unregisterModule(FACULTY_APP_STORE_MODULE_NAME);
    });

    const {
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
    } = useFaculty();

    const handleFormClick = (data) => {
      item.value = { ...data.item };
      isModal.value = true;
    };

    const handleViewClick = (data) => {
      item.value = data.item;
      isViewModal.value = true;
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
      isViewModal,
      handleViewClick,
      handleFormClick,
    };
  },
};
</script>

<style lang="scss" scoped>
.per-page-selector {
  width: 90px;
}

.invoice-filter-select {
  min-width: 190px;

  ::v-deep .vs__selected-options {
    flex-wrap: nowrap;
  }

  ::v-deep .vs__selected {
    width: 100px;
  }
}
</style>

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";
</style>
