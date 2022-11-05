<template>
  <div>
    <!-- modal user edit -->
    <b-modal
      ref="modalUserAddForm"
      id="modal-user-add-form"
      cancel-variant="outline-secondary"
      ok-title="Submit"
      cancel-title="Close"
      centered
      title="User Add Form"
      :visible="isModal"
      @ok="submit"
      :ok-disabled="isSubmit || item.name == ''"
      :cancel-disabled="isSubmit"
      @change="(val) => $emit('update:is-modal', val)"
    >
      <b-overlay :show="isSubmit" opacity="0.17" spinner-variant="primary">
        <validation-observer ref="simpleRules">
          <b-form>
            <b-form-group>
              <validation-provider
                #default="{ errors }"
                name="ICIT Account"
                rules="required"
              >
                <label for="username">ICIT Account:</label>
                <b-form-input
                  id="username"
                  placeholder="Username"
                  v-model="item.username"
                  :state="errors.length > 0 ? false : null"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
            <b-form-group>
              <b-button
                class="mt-1"
                variant="success"
                @click="$emit('on-load-user')"
                >Load Data</b-button
              >
            </b-form-group>
          </b-form>
        </validation-observer>

        <div v-if="item.name != ''">
          <table class="table">
            <tr>
              <td class="p-1 dotted border-top-none">Name :</td>
              <td class="p-1 dotted border-top-none">{{ item.name }}</td>
            </tr>
            <tr>
              <td class="p-1 dotted">Username :</td>
              <td class="p-1 dotted">{{ item.username }}</td>
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
              <td class="p-1 dotted">Account Type :</td>
              <td class="p-1 dotted">
                {{ item.account_type_name }}
              </td>
            </tr>
          </table>
        </div>
      </b-overlay>
    </b-modal>
  </div>
</template>

<script>
import {
  BButton,
  BModal,
  VBModal,
  BForm,
  BFormInput,
  BFormGroup,
  BSpinner,
  BOverlay,
} from "bootstrap-vue";
import Ripple from "vue-ripple-directive";
import { ref } from "@vue/composition-api";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import { required } from "@validations";

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
    BButton,
    BModal,
    BForm,
    BFormInput,
    BFormGroup,
    BSpinner,
    BOverlay,
    required,
  },
  directives: {
    "b-modal": VBModal,
    Ripple,
  },
  emits: ["on-submit", "on-load-user"],
  model: {
    prop: "isModal",
    event: "update:is-modal",
  },
  props: {
    isModal: {
      type: Boolean,
      required: true,
    },
    isSubmit: {
      type: Boolean,
      required: true,
    },
    item: {
      type: Object,
      required: true,
    },
  },
  setup(props, { emit }) {
    const simpleRules = ref(null);

    const submit = (bvModalEvent) => {
      bvModalEvent.preventDefault();

      simpleRules.value.validate().then((success) => {
        if (success) {
          emit("on-submit");
        }
      });
    };

    return {
      submit,
      simpleRules,
    };
  },
};
</script>
