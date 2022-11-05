<template>
  <div>
    <!-- modal teacher edit -->
    <b-modal
      ref="modalTeacherView"
      id="modal-teacher-view"
      ok-variant="outline-secondary"
      ok-only
      ok-title="Close"
      centered
      title="View Teacher"
      :visible="isViewModal"
      @change="(val) => $emit('update:is-view-modal', val)"
    >
      <table class="table">
        <tr>
          <td class="p-1 dotted border-top-none">Name :</td>
          <td class="p-1 dotted border-top-none">
            {{ item.prefix + " " + item.firstname + " " + item.surname }}
          </td>
        </tr>
        <tr>
          <td class="p-1 dotted">Department  :</td>
          <td class="p-1 dotted">{{ item.department_name }}</td>
        </tr>
        <tr>
          <td class="p-1 dotted">Tel :</td>
          <td class="p-1 dotted">{{ item.tel }}</td>
        </tr>
        <tr>
          <td class="p-1 dotted">Email :</td>
          <td class="p-1 dotted">{{ item.email }}</td>
        </tr>
        <tr>
          <td class="p-1 dotted">User ID :</td>
          <td class="p-1 dotted">
            {{ item.user_id }}
          </td>
        </tr>
        <tr>
          <td class="p-1 dotted">Active :</td>
          <td class="p-1 dotted">
            {{ item.active == 1 ? "เปิดใช้งาน" : "ปิดใช้งาน" }}
          </td>
        </tr>
      </table>
    </b-modal>
  </div>
</template>

<script>
import { BButton, BModal, VBModal } from "bootstrap-vue";
import Ripple from "vue-ripple-directive";
import { ref } from "@vue/composition-api";

export default {
  components: {
    BButton,
    BModal,
  },
  directives: {
    "b-modal": VBModal,
    Ripple,
  },
  model: {
    prop: "isViewModal",
    event: "update:is-view-modal",
  },
  props: {
    isViewModal: {
      type: Boolean,
      required: true,
    },
    item: {
      type: Object,
      required: true,
    },
  },
  setup(props, { emit }) {
    return {};
  },
};
</script>

<style>
.dotted {
  border-top: 1px dotted #ebe9f1 !important;
}

.modal-footer,
.border-top-none {
  border-top: none !important;
}
</style>
