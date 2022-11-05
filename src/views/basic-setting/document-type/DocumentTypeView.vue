<template>
  <div>
    <!-- modal document-type edit -->
    <b-modal
      ref="modalProvinceView"
      id="modal-document-type-view"
      ok-variant="outline-secondary"
      ok-only
      ok-title="Close"
      centered
      title="View DocumentType"
      :visible="isViewModal"
      @change="(val) => $emit('update:is-view-modal', val)"
    >
      <table class="table">
        <tr>
          <td class="p-1 dotted border-top-none">Name :</td>
          <td class="p-1 dotted border-top-none">{{ item.name }}</td>
        </tr>
        <tr>
          <td class="p-1 dotted">Description :</td>
          <td class="p-1 dotted">{{ item.description }}</td>
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
