<template>
  <div>
    <!-- modal faculty edit -->
    <b-modal
      ref="modalFacultyView"
      id="modal-faculty-view"
      ok-variant="outline-secondary"
      ok-only
      ok-title="Close"
      centered
      title="View Faculty"
      :visible="isViewModal"
      @change="(val) => $emit('update:is-view-modal', val)"
    >
      <table class="table">
        <tr>
          <td class="p-1 dotted border-top-none">Code :</td>
          <td class="p-1 dotted border-top-none">{{ item.faculty_code }}</td>
        </tr>
        <tr>
          <td class="p-1 dotted">Name TH :</td>
          <td class="p-1 dotted">{{ item.name_th }}</td>
        </tr>
        <tr>
          <td class="p-1 dotted">Name EN :</td>
          <td class="p-1 dotted">{{ item.name_en }}</td>
        </tr>
        <tr>
          <td class="p-1 dotted">Tel :</td>
          <td class="p-1 dotted">{{ item.tel }}</td>
        </tr>
        <tr>
          <td class="p-1 dotted">Fax :</td>
          <td class="p-1 dotted">{{ item.fax }}</td>
        </tr>
        <tr>
          <td class="p-1 dotted">Email :</td>
          <td class="p-1 dotted">{{ item.email }}</td>
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
