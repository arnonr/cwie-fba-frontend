<template>
  <!-- Table Container Card -->
  <!-- <b-card no-body> -->
  <b-overlay :show="isOverLay" opacity="0.3" spinner-variant="primary">
    <div>
      <form-wizard
        color="#7367F0"
        :title="null"
        :subtitle="null"
        shape="square"
        finish-button-text="Submit"
        back-button-text="Previous"
        class="mb-3"
        ref="formWizard"
        :startIndex="0"
        @on-complete="validationFormDocument"
      >
        <!-- accoint details tab -->
        <tab-content title="ข้อมูลทั่วไป" :before-change="validationFormInfo">
          <validation-observer ref="infoRules" tag="form">
            <b-row>
              <b-col cols="12" class="d-flex">
                <feather-icon icon="UserIcon" size="19" />
                <h4 class="mb-0 ml-50">ข้อมูลทั่วไป</h4>
              </b-col>
              <b-col cols="12" class="mb-2">
                <small class="text-muted">
                  หมายเหตุ : โปรดระบุข้อมูลให้ครบถ้วน</small
                >
              </b-col>
            </b-row>
            <b-row>
              <b-col class="col-md-5">
                <b-row>
                  <b-form-group
                    class="col-md-7"
                    label="รหัสนักศึกษา"
                    label-for="student_code"
                  >
                    <validation-provider
                      #default="{ errors }"
                      name="Student Code"
                      rules="required"
                    >
                      <b-form-input
                        id="student_code"
                        placeholder="Student Code"
                        v-model="item.student_code"
                        :state="errors.length > 0 ? false : null"
                        disabled
                      />
                      <small class="text-danger">{{ errors[0] }}</small>
                    </validation-provider>
                  </b-form-group>

                  <b-form-group
                    class="col-md-5"
                    label="คำนำหน้า"
                    label-for="prefix_name"
                  >
                    <validation-provider
                      #default="{ errors }"
                      name="Prefix Name"
                      rules="required"
                    >
                      <v-select
                        input-id="prefix"
                        v-model="item.prefix_name"
                        :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                        :options="selectOptions.prefix_names"
                        placeholder="Choose Prefix"
                        :state="errors.length > 0 ? false : null"
                        :clearable="true"
                      />
                      <small class="text-danger">{{ errors[0] }}</small>
                    </validation-provider>
                  </b-form-group>
                </b-row>
              </b-col>

              <b-col class="col-md-7">
                <b-row>
                  <b-form-group
                    class="col-md-6"
                    label="ชื่อ"
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
                        v-model="item.firstname"
                      />
                      <small class="text-danger">{{ errors[0] }}</small>
                    </validation-provider>
                  </b-form-group>

                  <b-form-group
                    class="col-md-6"
                    label="นามสกุล"
                    label-for="surname"
                  >
                    <validation-provider
                      #default="{ errors }"
                      name="Surname"
                      rules="required"
                    >
                      <b-form-input
                        id="surname"
                        placeholder="Surname"
                        :state="errors.length > 0 ? false : null"
                        v-model="item.surname"
                      />
                      <small class="text-danger">{{ errors[0] }}</small>
                    </validation-provider>
                  </b-form-group>
                </b-row>
              </b-col>
            </b-row>

            <b-row>
              <b-form-group class="col-md-6" label="คณะ" label-for="faculty">
                <validation-provider
                  #default="{ errors }"
                  name="Faculty"
                  rules="required"
                >
                  <b-form-input
                    id="faculty"
                    placeholder="Faculty"
                    v-model="item.faculty.name_th"
                    :state="errors.length > 0 ? false : null"
                    disabled
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <b-form-group class="col-md-6" label="สาขาวิชา" label-for="major">
                <validation-provider
                  #default="{ errors }"
                  name="Major"
                  rules="required"
                >
                  <b-form-input
                    id="major"
                    placeholder="Major"
                    v-model="item.major.name_th"
                    :state="errors.length > 0 ? false : null"
                    disabled
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-row>

            <b-row>
              <b-form-group
                class="col-md-2"
                label="ชั้นปีที่"
                label-for="class_year"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Class Year"
                  rules="required"
                >
                  <v-select
                    input-id="class_year"
                    v-model="item.class_year"
                    :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                    :options="selectOptions.class_years"
                    :state="errors.length > 0 ? false : null"
                    placeholder="Choose Class Year"
                    :clearable="true"
                  />

                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <b-form-group
                class="col-md-2"
                label="ห้อง"
                label-for="class_room"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Class Room"
                  rules="required"
                >
                  <v-select
                    input-id="class_room"
                    v-model="item.class_room"
                    :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                    :options="selectOptions.class_rooms"
                    :state="errors.length > 0 ? false : null"
                    placeholder="Choose Class Room"
                    :clearable="true"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <b-form-group
                class="col-md-6"
                label="อาจารย์ที่ปรึกษา"
                label-for="advisor"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Advisor"
                  rules="required"
                >
                  <v-select
                    input-id="advisor"
                    v-model="item.advisor"
                    :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                    :options="selectOptions.advisors"
                    :state="errors.length > 0 ? false : null"
                    placeholder="Choose Advisor"
                    :clearable="true"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <b-form-group class="col-md-2">
                <validation-provider
                  #default="{ errors }"
                  name="GPA"
                  rules="required"
                >
                  <label for="gpa">{{ $t("GPA") }}:</label>
                  <b-form-input
                    id="gpa"
                    type="number"
                    placeholder="GPA"
                    v-model="item.gpa"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-row>

            <b-row>
              <b-col cols="12" class="mb-2 d-flex mt-2">
                <feather-icon icon="MapPinIcon" size="19" />
                <h4 class="mb-0 ml-50">{{ $t("Address") }}</h4>
              </b-col>
            </b-row>

            <b-row class="mt-1">
              <b-form-group
                class="col-md-12"
                label="ที่อยู่ปัจจุบัน"
                label-for="address"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Address"
                  rules="required"
                >
                  <b-form-input
                    id="address"
                    placeholder="Address"
                    v-model="item.address"
                    :state="errors.length > 0 ? false : null"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-row>
            <!--  -->

            <b-row>
              <b-form-group
                class="col-md-4"
                label="จังหวัด"
                label-for="province"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Province"
                  rules="required"
                >
                  <v-select
                    input-id="province_id"
                    v-model="item.province"
                    :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                    :options="selectOptions.provinces"
                    placeholder="Choose Province"
                    :state="errors.length > 0 ? false : null"
                    :clearable="true"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <b-form-group
                class="col-md-4"
                label="อำเภอ/เขต"
                label-for="amphur"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Amphur"
                  rules="required"
                >
                  <v-select
                    input-id="amphur_id"
                    v-model="item.amphur"
                    :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                    :options="selectOptions.amphurs"
                    placeholder="Choose Amphur"
                    :state="errors.length > 0 ? false : null"
                    :clearable="true"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <b-form-group
                class="col-md-4"
                label="ตำบล/แขวง"
                label-for="amphur"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Tumbol"
                  rules="required"
                >
                  <v-select
                    input-id="tumbol_id"
                    v-model="item.tumbol"
                    :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                    :options="selectOptions.tumbols"
                    placeholder="Choose Tumbol"
                    :state="errors.length > 0 ? false : null"
                    :clearable="true"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-row>

            <b-row>
              <b-form-group
                class="col-md-6"
                label="เบอร์โทรศัพท์"
                label-for="tel"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Tel"
                  rules="required"
                >
                  <b-form-input
                    id="tel"
                    placeholder="Tel"
                    v-model="item.tel"
                    :state="errors.length > 0 ? false : null"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <b-form-group class="col-md-6" label="เมล" label-for="email">
                <validation-provider
                  #default="{ errors }"
                  name="Email"
                  rules="required"
                >
                  <b-form-input
                    id="email"
                    placeholder="Email"
                    v-model="item.email"
                    :state="errors.length > 0 ? false : null"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-row>

            <!--  -->
            <b-row>
              <b-col cols="12" class="mb-2 d-flex mt-2">
                <feather-icon icon="UsersIcon" size="19" />
                <h4 class="mb-0 ml-50">{{ $t("Contact") }}</h4>
              </b-col>
            </b-row>

            <b-row class="mt-1">
              <b-form-group
                class="col-md-5"
                label="บุคคลที่ติตต่อได้ 1"
                label-for="contact1_name"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Contact Name 1"
                  rules="required"
                >
                  <b-form-input
                    id="contact1_name"
                    placeholder="Contact Name 1"
                    v-model="item.contact1_name"
                    :state="errors.length > 0 ? false : null"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <b-form-group
                class="col-md-4"
                label="ความสัมพันธ์"
                label-for="contact1_relation"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Contact Relation 1"
                  rules="required"
                >
                  <b-form-input
                    id="contact1_relation"
                    placeholder="Contact Relation 1"
                    v-model="item.contact1_relation"
                    :state="errors.length > 0 ? false : null"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <b-form-group
                class="col-md-3"
                label="เบอร์โทรศัพท์"
                label-for="contact1_tel"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Contact Tel 1"
                  rules="required"
                >
                  <b-form-input
                    id="contact1_tel"
                    placeholder="Contact Tel 1"
                    v-model="item.contact1_tel"
                    :state="errors.length > 0 ? false : null"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-row>

            <b-row>
              <b-form-group
                class="col-md-5"
                label="บุคคลที่ติตต่อได้ 2"
                label-for="contact2_name"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Contact Name 2"
                >
                  <b-form-input
                    id="contact2_name"
                    placeholder="Contact Name 2"
                    v-model="item.contact2_name"
                    :state="errors.length > 0 ? false : null"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <b-form-group
                class="col-md-4"
                label="ความสัมพันธ์"
                label-for="contact2_relation"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Contact Relation 2"
                >
                  <b-form-input
                    id="contact1_relation"
                    placeholder="Contact Relation 2"
                    v-model="item.contact2_relation"
                    :state="errors.length > 0 ? false : null"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <b-form-group
                class="col-md-3"
                label="เบอร์โทรศัพท์"
                label-for="contact2_tel"
              >
                <validation-provider #default="{ errors }" name="Contact Tel 2">
                  <b-form-input
                    id="contact2_tel"
                    placeholder="Contact Tel 2"
                    v-model="item.contact2_tel"
                    :state="errors.length > 0 ? false : null"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-row>
          </validation-observer>
        </tab-content>

        <!-- personal details tab -->
        <tab-content title="ข้อมูลสุขภาพ" :before-change="validationFormHealth">
          <validation-observer ref="healthRules" tag="form">
            <b-row>
              <b-col cols="12" class="d-flex">
                <feather-icon icon="HeartIcon" size="19" />
                <h4 class="mb-0 ml-50">{{ $t("Health Information") }}</h4>
              </b-col>
              <b-col cols="12" class="mb-2">
                <small class="text-muted">
                  หมายเหตุ : โปรดระบุข้อมูลให้ครบถ้วน</small
                >
              </b-col>
            </b-row>
            <b-row>
              <b-form-group
                class="col-md-3"
                label="กลุ่มเลือด"
                label-for="blood_group"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Blood Group"
                  rules="required"
                >
                  <v-select
                    input-id="blood_group"
                    v-model="item.blood_group"
                    :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                    :options="selectOptions.blood_groups"
                    :state="errors.length > 0 ? false : null"
                    placeholder="Choose Blood Group"
                    :clearable="true"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <b-form-group
                class="col-md-3"
                label="ส่วนสูง (ซม.)"
                label-for="height"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Height"
                  rules="required"
                >
                  <b-form-input
                    id="height"
                    placeholder="Height"
                    type="number"
                    v-model="item.height"
                    :state="errors.length > 0 ? false : null"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <b-form-group
                class="col-md-3"
                label="น้ำหนัก (กก.)"
                label-for="weight"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Weight"
                  rules="required"
                >
                  <b-form-input
                    id="weight"
                    placeholder="Weight"
                    type="number"
                    v-model="item.weight"
                    :state="errors.length > 0 ? false : null"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <b-form-group
                class="col-md-3"
                label="เบอร์โทรฉุกเฉิน"
                label-for="emergency_tel"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Emergency Tel"
                  rules="required"
                >
                  <b-form-input
                    id="emergency_tel"
                    placeholder="Emergency Tel"
                    v-model="item.emergency_tel"
                    :state="errors.length > 0 ? false : null"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-row>

            <b-row>
              <b-form-group
                class="col-md-12"
                label="โรคประจำตัว"
                label-for="congenital_disease"
              >
                <validation-provider #default="{ errors }" name="Disease">
                  <b-form-textarea
                    id="congenital_disease"
                    placeholder="Disease"
                    v-model="item.congenital_disease"
                    :state="errors.length > 0 ? false : null"
                    rows="3"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <b-form-group
                class="col-md-12"
                label="ประวัติการแพ้ยา"
                label-for="drug_allergy"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Drug Allergy"
                  label="ประวัติการแพ้ยา"
                  label-for="druga_allergy"
                >
                  <b-form-textarea
                    id="drug_allergy"
                    placeholder="Drug Allergy"
                    v-model="item.drug_allergy"
                    :state="errors.length > 0 ? false : null"
                    rows="3"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-row>
          </validation-observer>
        </tab-content>

        <tab-content title="เอกสาร">
          <validation-observer ref="documentRules" tag="form">
            <!-- Certificates -->
            <b-row>
              <b-col cols="12" class="d-flex mb-2">
                <feather-icon icon="BookIcon" size="19" />
                <h4 class="mb-0 ml-50">{{ $t("Certificate Name") }}</h4>
              </b-col>
            </b-row>

            <b-row ref="certificateForm" v-for="(certItem, index) in certItems" :key="index">
              <b-form-group class="col-md-5">
                <validation-provider
                  #default="{ errors }"
                  name="Certificate Name"
                >
                  <label for="certificate_name"
                    >{{ $t("Certificate Name") }}:</label
                  >
                  <b-form-input
                    id="certificate_name"
                    placeholder="Certificate Name"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <b-form-group class="col-md-5">
                <validation-provider #default="{ errors }" name="File">
                  <label for="file">{{ $t("File") }}:</label>
                  <b-input-group>
                    <b-input-group-prepend>
                      <b-button
                        :variant="`outline-${
                          item.document_2 == null ? 'dark' : 'warning'
                        }`"
                        target="_blank"
                        :disabled="item.document_2_old == null"
                        :href="item.document_2_old"
                      >
                        <feather-icon icon="FileTextIcon" />
                        {{ $t("View File") }}
                      </b-button>
                    </b-input-group-prepend>
                    <b-form-file
                      id="h-file-success"
                      v-model="item.document_2"
                      placeholder="Choose a new file or drop it here..."
                      drop-placeholder="Drop file here..."
                    />
                  </b-input-group>
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <b-col lg="2" md="2" class="mb-50">
                <b-button
                  v-ripple.400="'rgba(234, 84, 85, 0.15)'"
                  variant="outline-danger"
                  class="mt-0 mt-md-2"
                  @click="removeItem(index)"
                >
                  <feather-icon icon="XIcon" class="mr-25" />
                  <span>Delete</span>
                </b-button>
              </b-col>
            </b-row>

            <b-row>
              <b-col class="md-12">
                <b-button
                  v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                  variant="info"
                  @click="repeateAgain"
                >
                  <feather-icon icon="PlusIcon" class="mr-25" />
                  <span>{{ $t("Add New") }}</span>
                </b-button>
              </b-col>
            </b-row>

            <b-row>
              <b-col class="md-12"><hr /></b-col>
            </b-row>

            <!-- Documents -->
            <b-row>
              <b-col cols="12" class="d-flex mb-2">
                <feather-icon icon="BookIcon" size="19" />
                <h4 class="mb-0 ml-50">{{ $t("Documents") }}</h4>
              </b-col>
            </b-row>

            <b-row
              v-for="(document, index) in item.documents"
              :key="document.document_type_id"
            >
              <b-form-group class="col-md-6">
                <validation-provider #default="{ errors }" name="File">
                  <label for="height">{{ document.document_name }}:</label>
                  <b-input-group>
                    <b-input-group-prepend>
                      <b-button
                        :variant="`outline-${
                          document.document_file == null ? 'dark' : 'warning'
                        }`"
                        target="_blank"
                        :disabled="document.document_file_old == null"
                        :href="document.document_file_old"
                      >
                        <feather-icon icon="FileTextIcon" />
                        {{ $t("View File") }}
                      </b-button>
                    </b-input-group-prepend>
                    <b-form-file
                      v-model="document.document_file"
                      placeholder="Choose a new file or drop it here..."
                      drop-placeholder="Drop file here..."
                    />
                  </b-input-group>
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-row>
          </validation-observer>
        </tab-content>
      </form-wizard>
    </div>
  </b-overlay>
  <!-- </b-card> -->
</template>

<script>
import { FormWizard, TabContent } from "vue-form-wizard";
import vSelect from "vue-select";
import "vue-form-wizard/dist/vue-form-wizard.min.css";
import {
  BCard,
  BRow,
  BCol,
  BFormInput,
  BButton,
  BTable,
  BMedia,
  BAvatar,
  BLink,
  BBadge,
  BDropdown,
  BDropdownItem,
  BPagination,
  BTooltip,
  BSpinner,
  BOverlay,
  BFormCheckbox,
  BTabs,
  BTab,
  BFormTextarea,
  BForm,
  BFormGroup,
  BFormCheckboxGroup,
  BFormRadioGroup,
  BInputGroup,
  BInputGroupPrepend,
  BFormFile,
} from "bootstrap-vue";

import { onUnmounted } from "@vue/composition-api";
import store from "@/store";
import usePersonalData from "./usePersonalData";
import flatPickr from "vue-flatpickr-component";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import Ripple from "vue-ripple-directive";
import personalDataStoreModule from "./personalDataStoreModule";
import { required, email } from "@validations";
import { ref } from "@vue/composition-api";

export default {
  components: {
    BCard,
    BRow,
    BCol,
    BFormInput,
    BButton,
    BTable,
    BMedia,
    BAvatar,
    BLink,
    BBadge,
    BDropdown,
    BDropdownItem,
    BPagination,
    BTooltip,
    BSpinner,
    BOverlay,
    BFormCheckbox,
    BTabs,
    BTab,
    BForm,
    BFormGroup,
    BFormCheckboxGroup,
    BFormRadioGroup,
    BFormTextarea,
    BInputGroup,
    BInputGroupPrepend,
    BFormFile,
    vSelect,
    flatPickr,
    ValidationProvider,
    ValidationObserver,
    FormWizard,
    TabContent,
    required,
  },
  directives: {
    Ripple,
  },
  setup() {
    const STUDENT_PERSONAL_DATA_APP_STORE_MODULE_NAME = "student-personal-data";

    // Register module
    if (!store.hasModule(STUDENT_PERSONAL_DATA_APP_STORE_MODULE_NAME))
      store.registerModule(
        STUDENT_PERSONAL_DATA_APP_STORE_MODULE_NAME,
        personalDataStoreModule
      );

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(STUDENT_PERSONAL_DATA_APP_STORE_MODULE_NAME))
        store.unregisterModule(STUDENT_PERSONAL_DATA_APP_STORE_MODULE_NAME);
    });

    const {
      item,
      isSubmit,
      onSubmit,
      isOverLay,
      selectOptions,
      validationFormInfo,
      validationFormHealth,
      validationFormDocument,
      formWizard,
      infoRules,
      healthRules,
      documentRules,
      certificateForm,
      documentTypes,
    } = usePersonalData();

    const handleFormClick = (data) => {
      // item.value = { ...data.item };
      // onSubmit();
    };

    const certItems = ref([
      {
        id: 1,
        file_name: "male",
        file: "designer",
        prevHeight: 0,
      },
    ]);
    const nextTodoId = ref(1);

    const repeateAgain = () => {
      certItems.value.push({
        id: (nextTodoId.value += nextTodoId.value),
      });

      // this.$nextTick(() => {
      //   this.trAddHeight(this.$refs.row[0].offsetHeight);
      // });
    };

    const removeItem = (index) => {
      certItems.value.splice(index, 1);
      // trTrimHeight(certificateForm.row[0].offsetHeight);
    };

    const initTrHeight = (index) => {
      // this.trSetHeight(null);
      // this.$nextTick(() => {
      //   trSetHeight(certificateForm.scrollHeight);
      // });
    };

    return {
      item,
      isSubmit,
      onSubmit,
      handleFormClick,
      isOverLay,
      selectOptions,
      validationFormInfo,
      validationFormHealth,
      validationFormDocument,
      formWizard,
      infoRules,
      healthRules,
      documentRules,
      certificateForm,
      certItems,
      repeateAgain,
      removeItem,
      initTrHeight,
      documentTypes,
    };
  },
};
</script>

<style lang="scss" scoped>
.per-page-selector {
  width: 90px;
}

.invoice-filter-select {
  min-width: 190px;

  ::v-deep .vs__selected-options {
    flex-wrap: nowrap;
  }

  ::v-deep .vs__selected {
    width: 100px;
  }
}
</style>

<style lang="scss">
@import "@core/scss/vue/libs/vue-wizard.scss";
// @import "@core/scss/vue/libs/vue-select.scss";
// @import "@core/scss/vue/libs/vue-flatpicker.scss";
</style>
