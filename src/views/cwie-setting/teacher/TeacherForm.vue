<template>
  <div>
    <!-- modal teacher edit -->
    <b-modal
      ref="modalTeacherForm"
      id="modal-teacher-form"
      cancel-variant="outline-secondary"
      ok-title="Submit"
      cancel-title="Close"
      centered
      size="lg"
      title="Teacher Form"
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
                name="Prefix"
                rules="required"
              >
                <label for="prefix">Prefix:</label>
                <b-form-input
                  id="prefix"
                  placeholder="Prefix"
                  v-model="item.prefix"
                  :state="errors.length > 0 ? false : null"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>

            <b-form-group>
              <validation-provider
                #default="{ errors }"
                name="Firstname"
                rules="required"
              >
                <label for="firstname">Firstname:</label>
                <b-form-input
                  id="firstname"
                  placeholder="Firstname"
                  v-model="item.firstname"
                  :state="errors.length > 0 ? false : null"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>

            <b-form-group>
              <validation-provider
                #default="{ errors }"
                name="Surname"
                rules="required"
              >
                <label for="surname">Surname:</label>
                <b-form-input
                  id="surname"
                  placeholder="Surname"
                  v-model="item.surname"
                  :state="errors.length > 0 ? false : null"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>

            <b-form-group>
              <validation-provider #default="{ errors }" name="tel">
                <label for="tel">Tel:</label>
                <b-form-input id="tel" placeholder="Tel" v-model="item.tel" />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>

            <b-form-group>
              <validation-provider #default="{ errors }" name="email">
                <label for="email">Email:</label>
                <b-form-input
                  id="email"
                  placeholder="Email"
                  v-model="item.email"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>

            <div class="mt-2">
              <h2>Address (ที่อยู่ตามบัตรประชาชน)</h2>
              <hr />
            </div>

            <div class="row">
              <b-form-group class="col-md">
                <validation-provider #default="{ errors }" name="Address">
                  <label for="address">Address:</label>
                  <b-form-input
                    id="address"
                    placeholder="Address"
                    v-model="item.address"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </div>

            <div class="row">
              <b-form-group class="col-md">
                <validation-provider #default="{ errors }" name="Province">
                  <label for="province">Province:</label>
                  <v-select
                    input-id="province_id"
                    v-model="item.province"
                    :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                    :options="selectOptions.provinces"
                    placeholder="Choose Province"
                    :clearable="true"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <b-form-group class="col-md">
                <validation-provider #default="{ errors }" name="Amphur">
                  <label for="amphur">Amphur:</label>
                  <v-select
                    input-id="amphur_id"
                    v-model="item.amphur"
                    :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                    :options="selectOptions.amphurs"
                    placeholder="Choose Amphur"
                    :clearable="true"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </div>
            <div class="row">
              <b-form-group class="col-md">
                <validation-provider #default="{ errors }" name="Tumbol">
                  <label for="tumbol">Tumbol:</label>

                  <v-select
                    input-id="tumbol_id"
                    v-model="item.tumbol"
                    :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                    :options="selectOptions.tumbols"
                    placeholder="Choose Tumbol"
                    :clearable="true"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </div>
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
  BCardText,
} from "bootstrap-vue";
import Ripple from "vue-ripple-directive";
import { ref } from "@vue/composition-api";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import { required, email } from "@validations";
import vSelect from "vue-select";

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
    vSelect,
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
    selectOptions: {
      type: Object,
      required: true,
    },
  },
  // data() {
  //   return {};
  // },
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
