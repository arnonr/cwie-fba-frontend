<template>
  <div>
    <!-- modal faculty edit -->
    <b-modal
      ref="modalFacultyForm"
      id="modal-faculty-form"
      cancel-variant="outline-secondary"
      ok-title="Submit"
      cancel-title="Close"
      centered
      title="Edit Faculty"
      :visible="isModal"
      @ok="submit"
      :ok-disabled="isSubmit"
      :cancel-disabled="isSubmit"
      @change="(val) => $emit('update:is-modal', val)"
    >
      <b-overlay :show="isSubmit" opacity="0.17" spinner-variant="primary">
        <validation-observer ref="simpleRules">
          <b-form>
            <b-form-group>
              <validation-provider
                #default="{ errors }"
                name="Name TH"
                rules="required"
              >
                <label for="name_th">Name TH:</label>
                <b-form-input
                  id="name_th"
                  placeholder="Name TH"
                  v-model="item.name_th"
                  :state="errors.length > 0 ? false : null"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
            <b-form-group>
              <label for="name_en">Name EN:</label>
              <b-form-input
                id="name_en"
                placeholder="Name EN"
                v-model="item.name_en"
              />
            </b-form-group>
            <b-form-group>
              <label for="tel">Telephone:</label>
              <b-form-input
                id="tel"
                placeholder="Telephone"
                v-model="item.tel"
              />
            </b-form-group>
            <b-form-group>
              <label for="fax">Fax:</label>
              <b-form-input id="fax" placeholder="Fax" v-model="item.fax" />
            </b-form-group>
            <b-form-group>
              <validation-provider
                #default="{ errors }"
                name="Email"
                rules="email"
              >
                <label for="email">Email:</label>
                <b-form-input
                  id="email"
                  type="email"
                  placeholder="Email"
                  v-model="item.email"
                  :state="errors.length > 0 ? false : null"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-form>
        </validation-observer>
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
import { required, email } from "@validations";

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
    email,
  },
  directives: {
    "b-modal": VBModal,
    Ripple,
  },
  emits: ["on-submit"],
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
