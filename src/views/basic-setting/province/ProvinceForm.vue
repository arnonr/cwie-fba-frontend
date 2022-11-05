<template>
  <div>
    <!-- modal province edit -->
    <b-modal
      ref="modalProvinceForm"
      id="modal-province-form"
      cancel-variant="outline-secondary"
      ok-title="Submit"
      cancel-title="Close"
      centered
      title="Edit Province"
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
              <validation-provider #default="{ errors }" name="Name EN">
                <label for="name_en">Name EN:</label>
                <b-form-input
                  id="name_en"
                  placeholder="Name EN"
                  v-model="item.name_en"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
            <b-form-group>
              <validation-provider #default="{ errors }" name="Visit Expense">
                <label for="visit_expense">Visit Expense:</label>
                <b-form-input
                  id="visit_expense"
                  placeholder="Visit Expense"
                  v-model="item.visit_expense"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
            <b-form-group>
              <validation-provider #default="{ errors }" name="Travel Expense">
                <label for="travel_expense">Travel Expense:</label>
                <b-form-input
                  id="travel_expense"
                  placeholder="travel_expense"
                  v-model="item.travel_expense"
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
