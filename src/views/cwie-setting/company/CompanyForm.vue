<template>
  <div>
    <!-- modal user edit -->
    <b-modal
      ref="modalCompanyForm"
      id="modal-company-form"
      cancel-variant="outline-secondary"
      ok-title="Submit"
      cancel-title="Close"
      centered
      size="lg"
      title="Company Form"
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
                  name="Name TH"
                  rules="required"
                >
                  <label for="name">Name TH:</label>
                  <b-form-input
                    id="name_th"
                    placeholder="Name TH"
                    v-model="item.name_th"
                    :state="errors.length > 0 ? false : null"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </div>

            <div class="row">
              <b-form-group class="col-md">
                <validation-provider #default="{ errors }" name="Name EN">
                  <label for="name">Name EN:</label>
                  <b-form-input
                    id="name_en"
                    placeholder="Name EN"
                    v-model="item.name_en"
                    :state="errors.length > 0 ? false : null"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </div>

            <div class="row">
              <b-form-group class="col-md">
                <validation-provider #default="{ errors }" name="tel">
                  <label for="tel">Tel:</label>
                  <b-form-input id="tel" placeholder="Tel" v-model="item.tel" />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <b-form-group class="col-md">
                <validation-provider #default="{ errors }" name="fax">
                  <label for="fax">Fax:</label>
                  <b-form-input id="tel" placeholder="Fax" v-model="item.fax" />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </div>

            <div class="row">
              <b-form-group class="col-md">
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

              <b-form-group class="col-md">
                <validation-provider #default="{ errors }" name="website">
                  <label for="website">Website:</label>
                  <b-form-input
                    id="website"
                    placeholder="Website"
                    v-model="item.website"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </div>

            <div class="row">
            <b-form-group class="col-md">
              <validation-provider #default="{ errors }" name="namecard_file">
                <label for="namecard_file">Name Card:</label>
                <b-input-group>
                  <b-input-group-prepend>
                    <b-button
                      :variant="`outline-${
                        item.namecard_file_old == null ? 'dark' : 'warning'
                      }`"
                      target="_blank"
                      :disabled="item.namecard_file_old == null"
                      :href="item.namecard_file_old"
                    >
                      <feather-icon icon="FileTextIcon" /> View File
                    </b-button>
                  </b-input-group-prepend>
                  <b-form-file
                    id="h-file-success"
                    v-model="item.namecard_file"
                    placeholder="Choose a new file or drop it here..."
                    drop-placeholder="Drop file here..."
                  />
                </b-input-group>
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
            </div>

            <div class="row">
              <b-form-group class="col-md">
                <validation-provider #default="{ errors }" name="Blacklist">
                  <label for="blacklist">Blacklist:</label>
                  <b-form-checkbox
                    id="blacklist"
                    class="custom-control-danger"
                    name="check-button"
                    v-model="item.blacklist"
                    switch
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </div>

            <div class="mt-2">
              <h2>Address</h2>
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
                    :options="[
                      { label: 'กรุงเทพมหานคร', code: 1 },
                      { label: 'ชลบุรี', code: 2 },
                    ]"
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
                    :options="[
                      { label: 'กรุงเทพมหานคร1', code: 1 },
                      { label: 'ชลบุรี2', code: 2 },
                    ]"
                    placeholder="Choose Amphur"
                    :clearable="true"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <b-form-group class="col-md">
                <validation-provider #default="{ errors }" name="Tumbol">
                  <label for="tumbol">Tumbol:</label>
                  <v-select
                    input-id="tumbol_id"
                    v-model="item.tumbol"
                    :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                    :options="[
                      { label: 'กรุงเทพมหานคร3', code: 1 },
                      { label: 'ชลบุรี4', code: 2 },
                    ]"
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
