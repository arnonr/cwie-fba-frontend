<template>
  <div>
    <!-- modal company edit -->
    <b-modal
      ref="modalCompanyView"
      id="modal-company-view"
      ok-variant="outline-secondary"
      ok-only
      ok-title="Close"
      centered
      title="View Company"
      :visible="isViewModal"
      @change="(val) => $emit('update:is-view-modal', val)"
    >
      <table class="table">
        <tr>
          <td class="p-1 dotted border-top-none">Name TH :</td>
          <td class="p-1 dotted border-top-none">{{ item.name_th }}</td>
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
        <tr>
          <td class="p-1 dotted">Website :</td>
          <td class="p-1 dotted">{{ item.website }}</td>
        </tr>
        <tr>
          <td class="p-1 dotted">Blacklist :</td>
          <td class="p-1 dotted">
            <b-badge
              :variant="item.blacklist == true ? 'light-danger' : 'light-primary'"
            >
              {{ item.blacklist == true ? "YES" : "NO" }}
            </b-badge>
          </td>
        </tr>

        <tr>
          <td class="p-1 dotted">namecard :</td>
          <td class="p-1 dotted">{{ item.namecard_file }}</td>
        </tr>

        <tr>
          <td class="p-1 pt-2" colspan="2">
            <h3>Address</h3>
          </td>
        </tr>

        <tr>
          <td class="p-1 dotted">address :</td>
          <td class="p-1 dotted">{{ item.address }}</td>
        </tr>

        <tr>
          <td class="p-1 dotted">province :</td>
          <td class="p-1 dotted">{{ item.province.label }}</td>
        </tr>

        <tr>
          <td class="p-1 dotted">Amphur :</td>
          <td class="p-1 dotted">{{ item.amphur.label }}</td>
        </tr>

        <tr>
          <td class="p-1 dotted">Tumbol :</td>
          <td class="p-1 dotted">{{ item.tumbol.label }}</td>
        </tr>

        <tr>
          <td class="p-1 dotted">Active :</td>
          <td class="p-1 dotted">
            <b-badge
              :variant="item.active == true ? 'light-success' : 'light-secondary'"
            >
              {{ item.active == true ? "ENABLED" : "DISABLED" }}
            </b-badge>
          </td>
        </tr>
      </table>
    </b-modal>
  </div>
</template>

<script>
import { BButton, BModal, VBModal, BBadge } from "bootstrap-vue";
import Ripple from "vue-ripple-directive";
import { ref } from "@vue/composition-api";

export default {
  components: {
    BButton,
    BModal,
    BBadge,
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
