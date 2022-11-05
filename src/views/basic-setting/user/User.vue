<template>
  <!-- Table Container Card -->
  <b-card no-body>
    <b-overlay :show="isOverLay" opacity="0.3" spinner-variant="primary">
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

            <b-button variant="primary" @click="handleAddFormClick()">
              ADD STAFF
            </b-button>
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
          ref="refUserListTable"
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
          <template #cell(account_type)="data">
            <div class="text-nowrap">
              {{ data.item.account_type_name }}
            </div>
          </template>

          <template #cell(active)="data">
            <b-form-checkbox
              :checked="data.item.active == 1 ? true : false"
              class="custom-control-success"
              name="check-button"
              @change="
                (val) => {
                  handleChangeActive(data, val);
                }
              "
              switch
            />
          </template>

          <!-- Column: Actions -->
          <template #cell(actions)="data">
            <div class="text-nowrap">
              <b-button
                variant="info"
                class="mr-1"
                @click="handleViewClick(data)"
                >View</b-button
              >

              <b-button
                variant="success"
                class="mr-1"
                @click="handleFormClick(data)"
                >Edit</b-button
              >

              <b-button
                variant="danger"
                class="btn-icon"
                @click="handleDeleteClick(data)"
              >
                <feather-icon icon="TrashIcon" />
              </b-button>
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
              :total-rows="totalUsers"
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

      <user-form
        v-model="isModal"
        :isSubmit="isSubmit"
        :item="item"
        @on-submit="onSubmit()"
      />

      <user-add-form
        v-model="isAddModal"
        :isSubmit="isSubmit"
        :item="item"
        @on-load-user="onLoadUser()"
        @on-submit="onSubmit()"
      />

      <user-view v-model="isViewModal" :item="item" />
    </b-overlay>
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
  BSpinner,
  BOverlay,
  BFormCheckbox,
} from "bootstrap-vue";
import vSelect from "vue-select";
import { onUnmounted } from "@vue/composition-api";
import store from "@/store";
import useUser from "./useUser";

import UserForm from "./UserForm.vue";
import UserAddForm from "./UserAddForm.vue";
import UserView from "./UserView.vue";

import userStoreModule from "./userStoreModule";

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
    BSpinner,
    BOverlay,
    BFormCheckbox,
    vSelect,
    UserForm,
    UserAddForm,
    UserView,
  },
  setup() {
    const USER_APP_STORE_MODULE_NAME = "user";

    // Register module
    if (!store.hasModule(USER_APP_STORE_MODULE_NAME))
      store.registerModule(USER_APP_STORE_MODULE_NAME, userStoreModule);

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(USER_APP_STORE_MODULE_NAME))
        store.unregisterModule(USER_APP_STORE_MODULE_NAME);
    });

    const {
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
    } = useUser();

    const handleFormClick = (data) => {
      item.value = { ...data.item };
      isModal.value = true;
    };

    const handleAddFormClick = () => {
      item.value = JSON.parse(JSON.stringify(blankUser));
      isAddModal.value = true;
    };

    const handleViewClick = (data) => {
      item.value = data.item;
      isViewModal.value = true;
    };

    const handleDeleteClick = (data) => {
      item.value = data.item;
      onDelete();
    };

    const handleChangeActive = (data, value) => {
      item.value = data.item;
      item.value.active = value == true ? 1 : 0;
      onSubmit();
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
      isViewModal,
      handleViewClick,
      handleFormClick,
      handleAddFormClick,
      handleDeleteClick,
      handleChangeActive,
      isOverLay,
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
