<template>
  <div>
    <!-- modal user edit -->
    <b-modal
      ref="modalSemesterForm"
      id="modal-semester-form"
      cancel-variant="outline-secondary"
      ok-title="Submit"
      cancel-title="Close"
      centered
      size="lg"
      title="Semester Form"
      :visible="isModal"
      @ok="submit"
      :ok-disabled="isSubmit"
      :cancel-disabled="isSubmit"
      @change="(val) => $emit('update:is-modal', val)"
    >
      <b-overlay :show="isSubmit" opacity="0.17" spinner-variant="primary">
        <validation-observer ref="simpleRules">
          <b-form>
            <div class="row">
              <b-form-group class="col-md">
                <validation-provider
                  #default="{ errors }"
                  name="Semester Year"
                  rules="required"
                >
                  <label for="name">Semester Year:</label>
                  <b-form-input
                    id="semester_year"
                    placeholder="Semester Year"
                    v-model="item.semester_year"
                    :state="errors.length > 0 ? false : null"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <b-form-group class="col-md">
                <validation-provider #default="{ errors }" name="Term">
                  <label for="name">Term:</label>
                  <b-form-input
                    id="term"
                    placeholder="Term"
                    v-model="item.term"
                    :state="errors.length > 0 ? false : null"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <b-form-group class="col-md">
                <validation-provider #default="{ errors }" name="Round No">
                  <label for="round_no">Round No:</label>
                  <b-form-input
                    id="round_no"
                    placeholder="Round No"
                    v-model="item.round_no"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </div>

            <div class="row">
              <b-form-group class="col-md">
                <validation-provider #default="{ errors }" name="Chairman">
                  <label for="chairman_id">Chairman:</label>
                  <v-select
                    input-id="chairman_id"
                    v-model="item.chairman"
                    :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                    :options="[
                      { label: 'อาจารย์ชานินทร์ จูฉิม', code: 109 },
                      { label: 'อาจารย์สมชาย ใจรัก', code: 110 },
                    ]"
                    placeholder="Choose Chairman"
                    :clearable="true"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </div>

            <div class="row">
              <b-form-group class="col-md">
                <validation-provider
                  #default="{ errors }"
                  name="Default Request Doc No"
                >
                  <label for="default_request_doc_no"
                    >Default Request Doc No:</label
                  >
                  <b-form-input
                    id="default_request_doc_no"
                    placeholder="Default Request Doc No"
                    v-model="item.default_request_doc_no"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <b-form-group class="col-md">
                <validation-provider
                  #default="{ errors }"
                  name="Default Request Doc Date"
                >
                  <label for="default_request_doc_date"
                    >Default Request Doc Date:</label
                  >
                  <b-form-input
                    id="default_request_doc_date"
                    placeholder="Default Request Doc Date"
                    v-model="item.default_request_doc_date"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </div>

            <div class="row">
              <b-form-group class="col-md">
                <validation-provider #default="{ errors }" name="Start Date">
                  <label for="start_date">start_date:</label>
                  <b-form-input
                    id="start_date"
                    placeholder="Start Date"
                    v-model="item.start_date"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <b-form-group class="col-md">
                <validation-provider #default="{ errors }" name="End Date">
                  <label for="end_date">end_date:</label>
                  <b-form-input
                    id="end_date"
                    placeholder="End Date"
                    v-model="item.end_date"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </div>

            <div class="row">
              <b-form-group class="col-md">
                <validation-provider
                  #default="{ errors }"
                  name="Register Start Date"
                >
                  <label for="regis_start_date">Register Start Date:</label>
                  <b-form-input
                    id="regis_start_date"
                    placeholder="Register Start Date"
                    v-model="item.regis_start_date"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <b-form-group class="col-md">
                <validation-provider
                  #default="{ errors }"
                  name="Register End Date"
                >
                  <label for="regis_end_date">Register End Date:</label>
                  <b-form-input
                    id="regis_end_date"
                    placeholder="Register End Date"
                    v-model="item.regis_end_date"
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
  BFormCheckbox,
  BInputGroup,
  BInputGroupPrepend,
  BFormFile,
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
    BFormCheckbox,
    BInputGroup,
    BInputGroupPrepend,
    BFormFile,
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
