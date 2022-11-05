<template>
  <div>
    <!-- modal Cwie Data Form -->
    <b-modal
      ref="modalCwieDataForm"
      id="modal-cwie-data-form"
      cancel-variant="outline-secondary"
      ok-title="Submit"
      cancel-title="Close"
      centered
      size="lg"
      title="Form"
      :visible="isModal"
      @ok="submit"
      :ok-disabled="isSubmit"
      :cancel-disabled="isSubmit"
      @change="(val) => $emit('update:is-modal', val)"
    >
      <b-overlay :show="isSubmit" opacity="0.17" spinner-variant="primary">
        <validation-observer ref="simpleRules">
          <b-form>
            <!-- ข้อมูลสหกิจศึกษา -->
            <b-row class="row mt-2">
              <b-col class="col-md-12 d-flex">
                <feather-icon icon="UserIcon" size="19" />
                <h4 class="mb-0 ml-50">ข้อมูลสหกิจศึกษา</h4>
              </b-col>
              <b-col class="col-md-12 mb-2">
                <small class="text-muted">
                  หมายเหตุ : โปรดระบุข้อมูลให้ครบถ้วน</small
                >
              </b-col>
            </b-row>

            <b-row>
              <b-col class="col-md-12">
                <b-row class="row">
                  <b-form-group
                    class="col-md-12"
                    label="เลือกรอบและปีการศึกษา"
                    label-for="semester"
                  >
                    <validation-provider
                      #default="{ errors }"
                      name="Student Code"
                      rules="required"
                    >
                      <v-select
                        input-id="semester"
                        v-model="item.semester"
                        :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                        :options="selectOptions.semesters"
                        :state="errors.length > 0 ? false : null"
                        placeholder="Choose Semester"
                        :clearable="true"
                      />

                      <small class="text-danger">{{ errors[0] }}</small>
                    </validation-provider>
                  </b-form-group>
                </b-row>
              </b-col>

              <b-col class="col-md-12">
                <b-row class="row">
                  <b-form-group
                    class="col-md-6"
                    label="วันที่เริ่มปฏิบัติสหกิจ"
                    label-for="firstname"
                  >
                    <validation-provider
                      #default="{ errors }"
                      name="firstname"
                      rules="required"
                    >
                      <b-form-input
                        id="firstname"
                        placeholder="Firstname"
                        :state="errors.length > 0 ? false : null"
                      />
                      <small class="text-danger">{{ errors[0] }}</small>
                    </validation-provider>
                  </b-form-group>

                  <b-form-group
                    class="col-md-6"
                    label="วันที่สิ้นสุดการปฏิบัติสหกิจ"
                    label-for="end date"
                  >
                    <validation-provider #default="{ errors }" name="End Date">
                      <flat-pickr
                        v-model="item.end_date"
                        :config="configFlatpickr"
                        placeholder="Select a date"
                        name="end_date"
                        class="form-control"
                        :state="errors.length > 0 ? false : null"
                      />

                      <small class="text-danger">{{ errors[0] }}</small>
                    </validation-provider>
                  </b-form-group>
                </b-row>
              </b-col>
            </b-row>

            <!-- ข้อมูลสถานประกอบการ -->
            <b-row class="row mt-2">
              <b-col class="col-md-12 d-flex mb-2">
                <feather-icon icon="UserIcon" size="19" />
                <h4 class="mb-0 ml-50">ข้อมูลสถานประกอบการ</h4>
              </b-col>
            </b-row>

            <b-row>
              <b-col class="col-md-12">
                <b-row class="row">
                  <b-form-group
                    class="col-md-12"
                    label="สถานประกอบการ (โปรดระบุชื่อเต็ม)"
                    label-for="company"
                  >
                    <validation-provider
                      #default="{ errors }"
                      name="company"
                      rules="required"
                    >
                      <vue-autosuggest
                        :suggestions="filteredOptions"
                        :limit="10"
                        v-model="item.company.label"
                        :input-props="{
                          id: 'autosuggest__input',
                          class: 'form-control',
                          placeholder: 'Type Company Name',
                        }"
                        @input="onInputChange"
                        @selected="selectHandler"
                      >
                        <template slot-scope="{ suggestion }">
                          <span class="my-suggestion-item">{{
                            suggestion.item.name_th
                          }}</span>
                        </template>
                      </vue-autosuggest>

                      <small class="text-danger">{{ errors[0] }}</small>
                    </validation-provider>
                  </b-form-group>
                </b-row>

                <b-row class="row">
                  <b-form-group
                    class="col-md-6"
                    label="ชื่อ-สกุล ผู้ประสานงาน"
                    label-for="co_name"
                  >
                    <validation-provider #default="{ errors }" name="co_name">
                      <b-form-input
                        id="co_name"
                        placeholder="Co Name"
                        :state="errors.length > 0 ? false : null"
                      />

                      <small class="text-danger">{{ errors[0] }}</small>
                    </validation-provider>
                  </b-form-group>

                  <b-form-group
                    class="col-md-6"
                    label="ตำแหน่ง ผู้ประสานงาน"
                    label-for="co_position"
                  >
                    <validation-provider
                      #default="{ errors }"
                      name="co_position"
                    >
                      <b-form-input
                        id="co_position"
                        placeholder="Co Position"
                        :state="errors.length > 0 ? false : null"
                      />

                      <small class="text-danger">{{ errors[0] }}</small>
                    </validation-provider>
                  </b-form-group>
                </b-row>

                <b-row class="row">
                  <b-form-group
                    class="col-md-6"
                    label="เบอร์โทรศัพท์"
                    label-for="co_tel"
                  >
                    <validation-provider #default="{ errors }" name="co_tel">
                      <b-form-input
                        id="co_tel"
                        placeholder="Co Tel"
                        :state="errors.length > 0 ? false : null"
                      />

                      <small class="text-danger">{{ errors[0] }}</small>
                    </validation-provider>
                  </b-form-group>

                  <b-form-group
                    class="col-md-6"
                    label="อีเมล"
                    label-for="co_email"
                  >
                    <validation-provider #default="{ errors }" name="co_email">
                      <b-form-input
                        id="co_email"
                        placeholder="Co Email"
                        :state="errors.length > 0 ? false : null"
                      />

                      <small class="text-danger">{{ errors[0] }}</small>
                    </validation-provider>
                  </b-form-group>
                </b-row>

                <b-row class="row">
                  <b-form-group
                    class="col-md-6"
                    label="ชื่อ-สกุล ผู้เรียนถึง (หนังสือ)"
                    label-for="request_name"
                  >
                    <validation-provider
                      #default="{ errors }"
                      name="request_name"
                    >
                      <b-form-input
                        id="request_name"
                        placeholder="Request Name"
                        :state="errors.length > 0 ? false : null"
                      />

                      <small class="text-danger">{{ errors[0] }}</small>
                    </validation-provider>
                  </b-form-group>

                  <b-form-group
                    class="col-md-6"
                    label="ตำแหน่ง ผู้เรียนถึง (หนังสือ)"
                    label-for="request_position"
                  >
                    <validation-provider
                      #default="{ errors }"
                      name="request_position"
                    >
                      <b-form-input
                        id="request_position"
                        placeholder="Request Position"
                        :state="errors.length > 0 ? false : null"
                      />

                      <small class="text-danger">{{ errors[0] }}</small>
                    </validation-provider>
                  </b-form-group>
                </b-row>
              </b-col>
            </b-row>
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
  BRow,
  BCol,
} from "bootstrap-vue";
import Ripple from "vue-ripple-directive";
import { ref } from "@vue/composition-api";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import { required, email } from "@validations";
import { Thai } from "flatpickr/dist/l10n/th.js";
import vSelect from "vue-select";
import { VueAutosuggest } from "vue-autosuggest";
import flatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";

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
    BRow,
    BCol,
    flatPickr,
    VueAutosuggest,
    vSelect,
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
    selectOptions: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      filteredOptions: [],
      limit: 10,
      date: null,
      config: {
        altFormat: "F j, Y",
        altInput: true,
      },
    };
  },
  methods: {
    onInputChange(text) {
      if (text === "" || text === undefined) {
        return;
      }
      const filteredData = this.selectOptions.companies
        .filter(
          (item) => item.name_th.toLowerCase().indexOf(text.toLowerCase()) > -1
        )
        .slice(0, this.limit);
      this.filteredOptions = [
        {
          data: filteredData,
        },
      ];
    },
    selectHandler(selected) {
      this.item.company.label = selected.item.name_th;
      this.item.company.code = selected.item.company_id;
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

    const configFlatpickr = ref({
      altFormat: "j M Y",
      dateFormat: "Y-m-d",
      locale: Thai, // locale for this instance only
    });

    return {
      submit,
      simpleRules,
      configFlatpickr,
    };
  },
};
</script>

<style lang="scss">
@import "@core/scss/vue/libs/vue-flatpicker.scss";
@import "@core/scss/vue/libs/vue-select.scss";
@import "@core/scss/vue/libs/vue-autosuggest.scss";
</style>
