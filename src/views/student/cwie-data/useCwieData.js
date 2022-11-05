import store from "@/store";
import { ref, watch } from "@vue/composition-api";

// Notification
import { getUserData } from "@/auth/utils";
import {
  blood_group,
  class_room,
  class_year,
  prefix_name,
} from "@/data-constant/data";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import { useToast } from "vue-toastification/composition";

export default function useCwieData() {
  const pathUploads = "http://freedom-learn.com:8084/static/uploads/";
  const toast = useToast();

  const errorToast = (message) => {
    toast({
      component: ToastificationContent,
      props: {
        title: "Error : " + message,
        icon: "AlertTriangleIcon",
        variant: "danger",
      },
    });
  };
  const isModal = ref(false);
  const isSubmit = ref(false);
  const isOverLay = ref(false);
  const formWizard = ref(null);

  const infoRules = ref(null);
  const healthRules = ref(null);
  const documentRules = ref(null);
  const certificateForm = ref(null);

  const selectOptions = ref({
    class_years: class_year,
    class_rooms: class_room,
    prefix_names: prefix_name,
    advisors: [],
    provinces: [],
    amphurs: [],
    tumbols: [],
    blood_groups: blood_group,
    semesters: [],
    companies: [],
  });

  const documentTypes = ref([]);

  const items = ref([]);

  const student = ref({
    student_id: null,
    prefix_name: {
      label: "",
      code: "",
    },
    faculty: {
      label: "",
      code: "",
    },
    major: {
      label: "",
      code: "",
    },
    class_year: {
      label: "",
      code: "",
    },
    class_room: {
      label: "",
      code: "",
    },
    advisor: {
      label: "",
      code: "",
    },
    province: { label: null, code: null },
    amphur: { label: null, code: null },
    tumbol: { label: null, code: null },
    certificates: [],
    documents: [],
  });

  const fetchDocumentTypes = (ctx, callback) => {
    store
      .dispatch("student-cwie-data/fetchDocumentTypes", { active: 1 })
      .then((response) => {
        const { rows } = response.data;

        documentTypes.value = rows.filter((d) => {
          return d.document_type_id != 1;
        });
      })
      .catch((error) => {
        toast({
          component: ToastificationContent,
          props: {
            title: "Error fetching Document Type's list",
            icon: "AlertTriangleIcon",
            variant: "danger",
          },
        });
      });
  };
  fetchDocumentTypes();

  const fetchSemesters = (ctx, callback) => {
    store
      .dispatch("student-cwie-data/fetchSemesters")
      .then((response) => {
        const { rows } = response.data;
        // callback(rows);
        selectOptions.value.semesters = rows.map((a) => {
          return {
            label: `ปีการศึกษาที่ ${a.term}/${a.semester_year} รอบที่ ${a.round_no}`,
            code: a.semester_id,
          };
        });
      })
      .catch((error) => {
        toast({
          component: ToastificationContent,
          props: {
            title: "Error fetching Semester's list",
            icon: "AlertTriangleIcon",
            variant: "danger",
          },
        });
      });
  };
  fetchSemesters();

  const fetchCompanies = (ctx, callback) => {
    store
      .dispatch("student-cwie-data/fetchCompanies")
      .then((response) => {
        const { rows } = response.data;

        selectOptions.value.companies = rows.map((a) => {
          return a;
        });
      })
      .catch((error) => {
        toast({
          component: ToastificationContent,
          props: {
            title: "Error fetching Company's list",
            icon: "AlertTriangleIcon",
            variant: "danger",
          },
        });
      });
  };
  fetchCompanies();

  const fetchTeachers = (ctx, callback) => {
    store
      .dispatch("student-cwie-data/fetchTeachers")
      .then((response) => {
        const { rows } = response.data;
        // callback(rows);
        selectOptions.value.advisors = rows.map((a) => {
          return {
            label: `${a.prefix} ${a.firstname} ${a.surname}`,
            code: a.teacher_id,
          };
        });
      })
      .catch((error) => {
        toast({
          component: ToastificationContent,
          props: {
            title: "Error fetching Teacher's list",
            icon: "AlertTriangleIcon",
            variant: "danger",
          },
        });
      });
  };
  fetchTeachers();

  const fetchProvinces = (ctx, callback) => {
    store
      .dispatch("student-cwie-data/fetchProvinces")
      .then((response) => {
        const { rows, currPage, lastPage, total } = response.data;
        selectOptions.value.provinces = rows.map((r) => {
          return { label: r.name_th, code: r.province_id };
        });
      })
      .catch((error) => {
        toast({
          component: ToastificationContent,
          props: {
            title: "Error fetching Province's list",
            icon: "AlertTriangleIcon",
            variant: "danger",
          },
        });
      });
  };
  fetchProvinces();

  const fetchAmphurs = (ctx, callback) => {
    if (student.value.province.code != null) {
      store
        .dispatch("student-cwie-data/fetchAmphurs", {
          province_id: student.value.province.code,
        })
        .then((response) => {
          const { rows, currPage, lastPage, total } = response.data;
          selectOptions.value.amphurs = rows.map((r) => {
            return {
              label: r.name_th,
              code: r.amphur_id,
            };
          });
        })
        .catch((error) => {
          toast({
            component: ToastificationContent,
            props: {
              title: "Error fetching Amphur's list",
              icon: "AlertTriangleIcon",
              variant: "danger",
            },
          });
        });
    }
  };

  const fetchTumbols = (ctx, callback) => {
    if (student.value.amphur.code != null) {
      store
        .dispatch("student-cwie-data/fetchTumbols", {
          amphur_id: student.value.amphur.code,
        })
        .then((response) => {
          const { rows, currPage, lastPage, total } = response.data;
          selectOptions.value.tumbols = rows.map((r) => {
            return {
              label: r.name_th + " " + r.postcode,
              code: r.tumbol_id,
            };
          });
        })
        .catch((error) => {
          toast({
            component: ToastificationContent,
            props: {
              title: "Error fetching Tumbol's list",
              icon: "AlertTriangleIcon",
              variant: "danger",
            },
          });
        });
    }
  };

  const initDataConvertPersonal = (data) => {
    let r = { ...data };
    r.id = r.student_id;

    if (r.prefix_name != null) {
      r.prefix_name = { label: r.prefix_name.prefix_name, code: r.prefix_id };
    }

    if (r.province_id != null) {
      r.province = { label: r.province.name_th, code: r.province_id };
    }

    if (r.amphur_id != null) {
      r.amphur = { label: r.amphur.name_th, code: r.amphur_id };
    }

    if (r.tumbol_id != null) {
      r.tumbol = { label: r.tumbol.name_th, code: r.tumbol_id };
    }

    if (r.advisor_id != null) {
      r.advisor = {
        label: `${r.advisor.prefix} ${r.advisor.firstname} ${r.advisor.surname}`,
        code: r.advisor.teacher_id,
      };
    }

    if (r.class_year != null) {
      r.class_year = class_year.find((c) => {
        return c.code == r.class_year;
      });
    }

    if (r.class_room != null) {
      r.class_room = class_room.find((c) => {
        return c.code == r.class_room;
      });
    }

    r.documents = documentTypes.value.map((d) => {
      return {
        document_id: d.document_id,
        document_type_id: d.document_type_id,
        document_name: d.name,
        document_file_old: null,
        document_file: null,
        student_id: r.student_id,
      };
    });

    return r;
  };

  const fetchPersonalData = (ctx, callback) => {
    isOverLay.value = true;
    store
      .dispatch("student-cwie-data/fetchPersonalDatas", {
        student_code: getUserData().username.replace("s", ""),
      })
      .then((response) => {
        const { rows } = response.data;
        student.value = initDataConvertPersonal(rows[0]);
        fetchStudentDocuments();

        isOverLay.value = false;
      })
      .catch((error) => {
        console.log(error);
        toast({
          component: ToastificationContent,
          props: {
            title: "Error fetching PersonalData list",
            icon: "AlertTriangleIcon",
            variant: "danger",
          },
        });
        isOverLay.value = false;
      });
  };
  fetchPersonalData();

  const fetchStudentDocuments = (ctx, callback) => {
    store
      .dispatch("student-cwie-data/fetchStudentDocuments", {
        student_id: student.student_id,
      })
      .then((response) => {
        const { rows } = response.data;
        let document = rows.filter((d) => {
          return d.document_type_id != 1;
        });

        student.value.documents = student.value.documents.map((d) => {
          let index = document.find((e) => {
            return d.document_type_id == e.document_type_id;
          });
          if (index) {
            d.document_id = index.document_id;
            d.document_file_old = pathUploads + index.document_file;
            // d.document_file = null;
          }
          return d;
        });
      })
      .catch((error) => {
        console.log(error);
        toast({
          component: ToastificationContent,
          props: {
            title: "Error fetching Student Document's List",
            icon: "AlertTriangleIcon",
            variant: "danger",
          },
        });
      });
  };

  const initDataConvert = (data) => {
    let r = { ...data };
    return r;
  };

  const blankForm = {
    id: null,
    form_id: null,
    supervision_id: null,
    semester_id: null,
    student_id: null,
    company_id: null,
    status_id: null,
    start_date: null,
    end_date: null,
    co_name: null,
    co_position: null,
    co_tel: null,
    co_email: null,
    request_name: null,
    request_position: null,
    request_document_date: null,
    request_document_number: null,
    max_response_date: null,
    send_document_date: null,
    send_document_number: null,
    response_document_file: null,
    response_send_at: null,
    response_province_id: null,
    confirm_response_at: null,
    workplace_address: null,
    workplace_province_id: null,
    workplace_amphur_id: null,
    workplace_tumbol_id: null,
    workplace_googlemap_url: null,
    workplace_googlemap_file: null,
    plan_document_file: null,
    plan_send_at: null,
    plan_accept_at: null,
    reject_status_id: null,
    advisor_verified_at: null,
    chairman_approved_at: null,
    faculty_confirmed_at: null,
    company_rating: null,
    rating_comment: null,
    next_coop: null,
    province_id: null,
    amphur_id: null,
    tumbol_id: null,

    //
    company: { label: null, code: null },
  };

  const item = ref(JSON.parse(JSON.stringify(blankForm)));

  const fetchForms = (ctx, callback) => {
    isOverLay.value = true;
    store
      .dispatch("student-cwie-data/fetchForms", {
        student_id: student.value.id,
      })
      .then((response) => {
        const { rows } = response.data;

        items.value = rows.map((r) => {
          r = initDataConvert(r);

          return r;
        });

        isOverLay.value = false;
      })
      .catch((error) => {
        toast({
          component: ToastificationContent,
          props: {
            title: "Error fetching Forms list",
            icon: "AlertTriangleIcon",
            variant: "dang'er",
          },
        });
        isOverLay.value = false;
      });
  };
  fetchForms();

  // Start Form
  const onSubmit = (step) => {
    return new Promise((resolve, reject) => {
      isSubmit.value = true;
      isOverLay.value = true;

      let dataSend = {
        student_id: student.value.id,
      };
      if (step == "step1") {
        dataSend = {
          student_id: student.value.id,
          prefix_id: student.value.prefix_name.code,
          firstname: student.value.firstname,
          surname: student.value.surname,
          class_year: student.value.class_year.code,
          class_room: student.value.class_room.code,
          advisor_id: student.value.advisor.code,
          gpa: student.value.gpa,
          address: student.value.address,
          province_id: student.value.province.code,
          amphur_id: student.value.amphur.code,
          tumbol_id: student.value.tumbol.code,
          tel: student.value.tel,
          email: student.value.email,
          contact1_name: student.value.contact1_name,
          contact1_relation: student.value.contact1_relation,
          contact1_tel: student.value.contact1_tel,
          contact2_name: student.value.contact2_name,
          contact2_relation: student.value.contact2_relation,
          contact2_tel: student.value.contact2_tel,
        };
      } else if (step == "step2") {
        dataSend = {
          student_id: student.value.id,
          blood_group: student.value.blood_group.code,
          height: student.value.height,
          weight: student.value.weight,
          emergency_tel: student.value.emergency_tel,
          congenital_disease: student.value.congenital_disease,
          drug_allergy: student.value.drug_allergy,
        };
      } else {
        dataSend = {
          student_id: student.value.id,
        };
      }

      store
        .dispatch("student-cwie-data/editPersonalData", dataSend)
        .then(async (response) => {
          if (response.status == 200) {
            let { data } = response;
            student.value = initDataConvert(data);

            isSubmit.value = false;
            isOverLay.value = false;

            toast({
              component: ToastificationContent,
              props: {
                title: "Success : Updated Student Data",
                icon: "CheckIcon",
                variant: "success",
              },
            });

            resolve(true);
          } else {
            isSubmit.value = false;
            isOverLay.value = false;

            errorToast(response.data);
            resolve(false);
          }
        })
        .catch((error) => {
          isSubmit.value = false;
          isOverLay.value = false;

          let errorText = error.response.data.error.message.replaceAll(
            "personalData.",
            ""
          );
          errorText = errorText.replaceAll("\n", "<br>");
          errorText = errorText.slice(0, 0) + "<br>" + errorText.slice(0);
          errorToast(errorText);
          resolve(false);
        });
    });
  };

  const validationForm = () => {
    return new Promise((resolve, reject) => {
      infoRules.value
        .validate()
        .then((success) => {
          if (success) {
            return onSubmit("step1");
          } else {
            reject();
          }
        })
        .then((res) => {
          resolve(res);
        });
    });
  };

  const validationFormHealth = () => {
    return new Promise((resolve, reject) => {
      healthRules.value
        .validate()
        .then((success) => {
          if (success) {
            return onSubmit("step2");
          } else {
            reject();
          }
        })
        .then((res) => {
          resolve(res);
        });
    });
  };

  // Start Form
  const onStudentDocumentSubmit = () => {
    return new Promise((resolve, reject) => {
      isSubmit.value = true;
      isOverLay.value = true;
      //
      student.value.documents.forEach((d) => {
        if (d.document_file != null) {
          let dataSend = {
            student_id: student.value.id,
            document_file_upload: d.document_file,
            document_type_id: d.document_type_id,
            document_name: d.document_name,
          };

          if (d.document_id == null) {
            store
              .dispatch("student-cwie-data/addStudentDocument", dataSend)
              .then(async (response) => {
                if (response.status == 201) {
                  let { data } = response;
                  resolve(true);
                } else {
                  errorToast(response.data);
                }
              })
              .catch((error) => {
                let errorText = error.response.data.error.message.replaceAll(
                  "personalData.",
                  ""
                );
                errorText = errorText.replaceAll("\n", "<br>");
                errorText = errorText.slice(0, 0) + "<br>" + errorText.slice(0);
                errorToast(errorText);
              });
          } else {
            dataSend.document_id = d.document_id;
            store
              .dispatch("student-cwie-data/editStudentDocument", dataSend)
              .then(async (response) => {
                if (response.status == 204) {
                  let { data } = response;
                  resolve(true);
                } else {
                  errorToast(response.data);
                }
              })
              .catch((error) => {
                let errorText = error.response.data.error.message.replaceAll(
                  "personalData.",
                  ""
                );
                errorText = errorText.replaceAll("\n", "<br>");
                errorText = errorText.slice(0, 0) + "<br>" + errorText.slice(0);
                errorToast(errorText);
              });
          }
        }
      });

      //
      isSubmit.value = false;
      isOverLay.value = false;
    });
  };

  const validationFormDocument = () => {
    return new Promise((resolve, reject) => {
      documentRules.value
        .validate()
        .then((success) => {
          if (success) {
            return onStudentDocumentSubmit();
          } else {
            reject();
          }
        })
        .then((res) => {
          resolve(res);
        });
    });
  };

  watch(
    () => student.value.province,
    (value) => {
      if (value != null) {
        fetchAmphurs();
      }
    }
  );

  watch(
    () => student.value.amphur,
    (value) => {
      if (value != null) {
        fetchTumbols();
      }
    }
  );

  watch(
    () => student.value.amphur,
    (value) => {
      if (value != null) {
        fetchTumbols();
      }
    }
  );

  // *===============================================---*
  // *--------- UI ---------------------------------------*
  // *===============================================---*

  return {
    student,
    items,
    item,
    isModal,
    isSubmit,
    onSubmit,
    isOverLay,
    selectOptions,
    validationForm,
    validationFormHealth,
    validationFormDocument,
    infoRules,
    healthRules,
    documentRules,
    certificateForm,
    formWizard,
    documentTypes,
    blankForm,
  };
}
