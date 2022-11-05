<template>
  <!-- Table Container Card -->
  <!-- <b-card no-body> -->
  <b-overlay :show="isOverLay" opacity="0.3" spinner-variant="primary">
    <!-- Info  -->
    <div class="row">
      <!-- Status -->
      <div class="col-md-3">
        <b-card>
          <div><img src="#" alt="" /></div>
          <div class="mt-1">
            <span>ชื่อ : </span>
            <span
              >{{ student.prefix_name.label }} {{ student.firstname }}
              {{ student.surname }}</span
            >
            <hr />
          </div>
          <div>
            <span>รหัสนักศึกษา : </span>
            <span>{{ student.student_code }}</span>
            <hr />
          </div>
          <div>
            <span>คณะ : </span>
            <span>{{ student.faculty.name_th }}</span>
            <hr />
          </div>
          <div>
            <span>สาขาวิชา : </span>
            <span>{{ student.major.name_th }}</span>
            <hr />
          </div>
          <div>
            <span>ชั้นปี : </span>
            <span>{{ student.class_year.label }}</span>
            <hr />
          </div>
          <div>
            <span
              >สถานะ :
              <span>
                <b-badge pill variant="light-warning">
                  อยู่ระหว่างกรอกข้อมูล
                </b-badge>
              </span>
            </span>
          </div>
        </b-card>
      </div>
      <!-- Infomation -->
      <div class="col-md-9">
        <b-card>
          <b-tabs>
            <b-tab active>
              <template #title>
                <feather-icon icon="UserIcon" />
                <span>ข้อมูลทั่วไป</span>
              </template>

              <div class="mt-2">
                <h6 class="font-weight-bolder">
                  <feather-icon icon="UserIcon" class="font-weight-bolder" />
                  ข้อมูลการศึกษา
                </h6>
              </div>
              <div class="row mt-1">
                <span class="col-md-3"
                  >ห้อง : {{ student.class_room.label }}</span
                >
                <span class="col-md-6"
                  >อาจารย์ที่ปรึกษา : {{ student.advisor.label }}</span
                >
                <span class="col-md-3">เกรดเฉลี่ย : {{ student.gpa }}</span>
              </div>
              <hr />
              <div class="mt-2">
                <h6 class="font-weight-bolder">
                  <feather-icon icon="MapPinIcon" class="font-weight-bolder" />
                  {{ $t("Address") }}
                </h6>
              </div>
              <div class="row mt-1">
                <span class="col-md-12"
                  >ที่อยู่ปัจจุบัน : {{ student.address }}</span
                >
              </div>
              <div class="row mt-1">
                <span class="col-md-4"
                  >จังหวัด : {{ student.province.label }}</span
                >
                <span class="col-md-4"
                  >อำเภอ/เขต : {{ student.amphur.label }}</span
                >
                <span class="col-md-4"
                  >ตำบล/แขวง : {{ student.tumbol.label }}</span
                >
              </div>
              <div class="row mt-1">
                <span class="col-md-6">เบอร์โทรศัพท์ : {{ student.tel }}</span>
                <span class="col-md-6">เมล : {{ student.email }}</span>
              </div>

              <hr />
              <div class="mt-2">
                <h6 class="font-weight-bolder">
                  <feather-icon icon="UsersIcon" class="font-weight-bolder" />
                  {{ $t("Contact") }}
                </h6>
              </div>

              <div class="row mt-1">
                <span class="col-md-5"
                  >บุคคลที่ติตต่อได้ 1 : {{ student.contact1_name }}</span
                >
                <span class="col-md-4"
                  >ความสัมพันธ์ : {{ student.contact1_relation }}</span
                >
                <span class="col-md-3">โทร : {{ student.contact1_tel }}</span>
              </div>
              <div class="row mt-1">
                <span class="col-md-5"
                  >บุคคลที่ติตต่อได้ 2 : {{ student.contact2_name }}</span
                >
                <span class="col-md-4"
                  >ความสัมพันธ์ : {{ student.contact2_relation }}</span
                >
                <span class="col-md-3">โทร : {{ student.contact2_tel }}</span>
              </div>
            </b-tab>
            <b-tab>
              <template #title>
                <feather-icon icon="HeartIcon" />
                <span>ข้อมูลสุขภาพ</span>
              </template>

              <div class="mt-2">
                <h6 class="font-weight-bolder">
                  <feather-icon icon="HeartIcon" class="font-weight-bolder" />
                  ข้อมูลสุขภาพ
                </h6>
              </div>

              <div class="row mt-2">
                <span class="col-md-4"
                  >กลุ่มเลือด : {{ student.blood_group }}</span
                >
                <span class="col-md-4"
                  >ส่วนสูง (ซม.) : {{ student.height }}</span
                >
                <span class="col-md-4"
                  >น้ำหนัก (กก.) : {{ student.weight }}</span
                >
              </div>
              <div class="row mt-2">
                <span class="col-md-12"
                  >เบอร์โทรฉุกเฉิน : {{ student.emergency_tel }}</span
                >
              </div>
              <div class="row mt-1">
                <span class="col-md-6"
                  >โรคประจำตัว : {{ student.congenital_disease }}</span
                >
              </div>
              <div class="row mt-1">
                <span class="col-md-6"
                  >ประวัติการแพ้ยา : {{ student.drug_allergy }}</span
                >
              </div>
            </b-tab>
            <b-tab>
              <template #title>
                <feather-icon icon="BookIcon" />
                <span>ข้อมูลเอกสาร</span>
              </template>

              <div class="mt-2">
                <h6 class="font-weight-bolder">
                  <feather-icon icon="BookIcon" class="font-weight-bolder" />
                  ประกาศนียบัตร
                </h6>
              </div>

              <div class="mt-1">
                <span>อบรมระบบฐานข้อมูล : </span>
                <a href="#"> <feather-icon icon="FileIcon" /> เอกสาร</a>
              </div>

              <div class="mt-1">
                <span>อบรมการใช้งานคลาวด์ : </span>
                <a href="#"> <feather-icon icon="FileIcon" /> เอกสาร</a>
              </div>

              <hr />
              <div class="mt-2">
                <h6 class="font-weight-bolder">
                  <feather-icon icon="BookIcon" class="font-weight-bolder" />
                  เอกสาร
                </h6>
              </div>

              <div class="mt-1">
                <span>สำเนาบัตรประชาชน : </span>
                <a href="#"> <feather-icon icon="FileIcon" /> เอกสาร</a>
              </div>

              <div class="mt-1">
                <span>ใบแสดงผลการเรียน : </span>
                <a href="#"> <feather-icon icon="FileIcon" /> เอกสาร</a>
              </div>

              <div class="mt-1">
                <span>Resume : </span>
                <a href="#"> <feather-icon icon="FileIcon" /> เอกสาร</a>
              </div>
            </b-tab>
          </b-tabs>
        </b-card>
      </div>
    </div>

    <!-- Form -->
    <div>
      <b-button variant="success" class="mb-1" @click="handleAddFormClick()">
        <feather-icon icon="FileTextIcon" /> เพิ่มใบสมัคร
      </b-button>

      <div>
        <h3># 1</h3>
        <form-wizard
          color="#7367F0"
          :title="null"
          :subtitle="null"
          shape="square"
          finish-button-text="Submit"
          back-button-text="Previous"
          next-button-text="Go next!"
          class="mb-3"
          ref="formWizard"
          :startIndex="0"
          @on-complete="validationFormDocument"
        >
          <!-- accoint details tab -->
          <tab-content title="ข้อมูลใบสมัคร">
            <!-- Email ,tel, faculty major class_year class_room advisor_id gpa con-->
            <div class="col-md-12">
              <!-- style="border-right: 1px solid rgba(60, 60, 60, 0.26)" -->

              <div class="row mt-1">
                <div class="col-md-3" style="width: 50%">
                  <h6 class="mb-0">สถานะฟอร์ม :</h6>
                </div>
                <div class="col-md-3" style="width: 50%">
                  <span></span>
                </div>
                <div class="col-md-3" style="width: 50%">
                  <h6 class="mb-0">ปีการศึกษา :</h6>
                </div>
                <div class="col-md-3" style="width: 50%">
                  <span></span>
                </div>
              </div>

              <div class="row mt-1">
                <div class="col-md-3" style="width: 50%">
                  <h6 class="mb-0">ประธานอาจารย์นิเทศ :</h6>
                </div>
                <div class="col-md-3" style="width: 50%">
                  <span></span>
                </div>
                <div class="col-md-3" style="width: 50%">
                  <h6 class="mb-0">อาจารย์นิเทศ :</h6>
                </div>
                <div class="col-md-3" style="width: 50%">
                  <span></span>
                </div>
              </div>

              <div class="row mt-1">
                <div class="col-md-3" style="width: 50%">
                  <h6 class="mb-0">วันที่เริ่มปฏิบัติสหกิจ :</h6>
                </div>
                <div class="col-md-3" style="width: 50%">
                  <span></span>
                </div>
                <div class="col-md-3" style="width: 50%">
                  <h6 class="mb-0">วันสิ้นสุดปฏิบัติสหกิจ :</h6>
                </div>
                <div class="col-md-3" style="width: 50%">
                  <span></span>
                </div>
              </div>

              <!--  -->
              <div class="row">
                <div class="col-md-12">
                  <hr />
                </div>
              </div>

              <div class="row">
                <div class="col-md-3">
                  <h6 class="mb-0">สถานประกอบการ :</h6>
                </div>
                <div class="col-md-9">
                  <span>บริษัท ปูนซีเมนต์ไทย จำกัด</span>
                </div>
              </div>

              <div class="row mt-1">
                <div class="col-md-3">
                  <h6 class="mb-0">ชื่อ-สกุล ผู้ประสานงาน :</h6>
                </div>
                <div class="col-md-9">
                  <span>นายวิชัย รอดดี</span>
                </div>
              </div>

              <div class="row mt-1">
                <div class="col-md-3">
                  <h6 class="mb-0">ตำแหน่ง ผู้ประสานงาน :</h6>
                </div>
                <div class="col-md-9">
                  <span>Senior Programmer</span>
                </div>
              </div>

              <div class="row mt-1">
                <div class="col-md-3">
                  <h6 class="mb-0">เบอร์โทรศัพท์:</h6>
                </div>
                <div class="col-md-3">
                  <span>080-222-3333</span>
                </div>

                <div class="col-md-2">
                  <h6 class="mb-0">email:</h6>
                </div>
                <div class="col-md-4">
                  <span>arnon.r@tgde.kmutnb.ac.th</span>
                </div>
              </div>

              <div class="row mt-1">
                <div class="col-md-4">
                  <h6 class="mb-0">ชื่อ-สกุล ผู้เรียนถึง (หนังสือ):</h6>
                </div>
                <div class="col-md-8">
                  <span>นายอานนท์ รักจักร์</span>
                </div>
              </div>

              <div class="row mt-1">
                <div class="col-md-4">
                  <h6 class="mb-0">ตำแหน่ง ผู้เรียนถึง (หนังสือ):</h6>
                </div>
                <div class="col-md-8">
                  <span>หัวหน้าฝ่ายบุคลากร</span>
                </div>
              </div>

              <!-- <div><b-button variant="info">Edit</b-button></div> -->

              <cwie-data-form
                v-model="isModal"
                :isSubmit="isSubmit"
                :item="item"
                :selectOptions="selectOptions"
                @on-submit="onSubmit()"
              />
            </div>
          </tab-content>

          <!-- personal details tab -->
          <tab-content title="ข้อมูลเอกสารตอบรับ"> </tab-content>

          <tab-content title="ข้อมูลแผนการปฏิบัติงาน"> </tab-content>

          <template slot="footer" slot-scope="props">
            <div class="wizard-footer-right">
              <wizard-button class="btn-info finish-button mr-2"
                > <feather-icon icon="EditIcon" /> Edit</wizard-button
              >
              <wizard-button
                class="finish-button"
                slot="custom-buttons-right"
                :style="props.fillButtonStyle"
                ><feather-icon icon="SendIcon" /> Send</wizard-button
              >
            </div>
          </template>
        </form-wizard>
      </div>
    </div>
  </b-overlay>
  <!-- </b-card> -->
</template>

<script>
import { FormWizard, TabContent, WizardButton } from "vue-form-wizard";
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
  BCardText,
} from "bootstrap-vue";

import { onMounted, onUnmounted } from "@vue/composition-api";
import store from "@/store";
import useCwieData from "./useCwieData";
import flatPickr from "vue-flatpickr-component";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import Ripple from "vue-ripple-directive";
import cwieDataStoreModule from "./cwieDataStoreModule";
import { required, email } from "@validations";
import { ref } from "@vue/composition-api";
import CwieDataForm from "./CwieDataForm.vue";

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
    WizardButton,
    TabContent,
    required,
    BCardText,
    CwieDataForm,
  },
  directives: {
    Ripple,
  },
  setup() {
    const CWIE_DATA_APP_STORE_MODULE_NAME = "student-cwie-data";

    // Register module
    if (!store.hasModule(CWIE_DATA_APP_STORE_MODULE_NAME))
      store.registerModule(
        CWIE_DATA_APP_STORE_MODULE_NAME,
        cwieDataStoreModule
      );

    onMounted(() => {
      // formWizard.value.activateAll();

      // var wizard = this.$refs.wizard;
      formWizard.value.maxStep = formWizard.value.tabs.length - 1;
      formWizard.value.tabs.forEach((tab) => {
        tab.checked = true;
      });
    });

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(CWIE_DATA_APP_STORE_MODULE_NAME))
        store.unregisterModule(CWIE_DATA_APP_STORE_MODULE_NAME);
    });

    const {
      student,
      items,
      item,
      isSubmit,
      onSubmit,
      isOverLay,
      selectOptions,
      validationForm,
      validationFormHealth,
      validationFormDocument,
      formWizard,
      infoRules,
      healthRules,
      documentRules,
      certificateForm,
      documentTypes,
      isModal,
      blankForm,
    } = useCwieData();

    const handleAddFormClick = () => {
      item.value = JSON.parse(JSON.stringify(blankForm));
      isModal.value = true;
    };

    const handleFormClick = (data) => {
      item.value = { ...data.item };
      isModal.value = true;
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
    };

    const removeItem = (index) => {
      certItems.value.splice(index, 1);
    };

    const initTrHeight = (index) => {};

    return {
      student,
      items,
      item,
      isSubmit,
      onSubmit,
      handleAddFormClick,
      handleFormClick,
      isOverLay,
      selectOptions,
      validationForm,
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
      isModal,
      blankForm,
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

.vue-form-wizard .wizard-card-footer .wizard-footer-right .wizard-btn::after {
  content: "";
}
</style>

<style lang="scss">
@import "@core/scss/vue/libs/vue-wizard.scss";
// @import "@core/scss/vue/libs/vue-select.scss";
// @import "@core/scss/vue/libs/vue-flatpicker.scss";
</style>
