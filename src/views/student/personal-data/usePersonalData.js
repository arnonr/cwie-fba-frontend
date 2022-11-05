import { ref, watch, computed, reactive } from "@vue/composition-api";
import store from "@/store";

// Notification
import { useToast } from "vue-toastification/composition";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import data from "@/router/routes/ui-elements";
import Swal from "sweetalert2";
import { getUserData } from "@/auth/utils";
import {
  class_year,
  class_room,
  blood_group,
  prefix_name,
} from "@/data-constant/data";

export default function usePersonalData() {
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
  });

  const documentTypes = ref([]);

  const item = ref({
    student_id: null,

    faculty: {
      name_th: "",
    },
    major: {
      name_th: "",
    },
    province: { label: null, code: null },
    amphur: { label: null, code: null },
    tumbol: { label: null, code: null },
    certificates: [],
    documents: [],
  });

  const fetchDocumentTypes = (ctx, callback) => {
    store
      .dispatch("student-personal-data/fetchDocumentTypes", { active: 1 })
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

  const fetchTeachers = (ctx, callback) => {
    store
      .dispatch("student-personal-data/fetchTeachers")
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
      .dispatch("student-personal-data/fetchProvinces")
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
    if (item.value.province.code != null) {
      store
        .dispatch("student-personal-data/fetchAmphurs", {
          province_id: item.value.province.code,
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
    if (item.value.amphur.code != null) {
      store
        .dispatch("student-personal-data/fetchTumbols", {
          amphur_id: item.value.amphur.code,
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

  const initDataConvert = (data) => {
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
        code: r.teacher_id,
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
      .dispatch("student-personal-data/fetchPersonalDatas", {
        student_code: getUserData().username.replace("s", ""),
      })
      .then((response) => {
        const { rows } = response.data;
        item.value = initDataConvert(rows[0]);
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
      .dispatch("student-personal-data/fetchStudentDocuments", {
        student_id: item.student_id,
      })
      .then((response) => {
        const { rows } = response.data;
        let document = rows.filter((d) => {
          return d.document_type_id != 1;
        });

        item.value.documents = item.value.documents.map((d) => {
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

  // Start Form
  const onSubmit = (step) => {
    return new Promise((resolve, reject) => {
      isSubmit.value = true;
      isOverLay.value = true;

      let dataSend = {
        student_id: item.value.id,
      };
      if (step == "step1") {
        dataSend = {
          student_id: item.value.id,
          prefix_id: item.value.prefix_name.code,
          firstname: item.value.firstname,
          surname: item.value.surname,
          class_year: item.value.class_year.code,
          class_room: item.value.class_room.code,
          advisor_id: item.value.advisor.code,
          gpa: item.value.gpa,
          address: item.value.address,
          province_id: item.value.province.code,
          amphur_id: item.value.amphur.code,
          tumbol_id: item.value.tumbol.code,
          tel: item.value.tel,
          email: item.value.email,
          contact1_name: item.value.contact1_name,
          contact1_relation: item.value.contact1_relation,
          contact1_tel: item.value.contact1_tel,
          contact2_name: item.value.contact2_name,
          contact2_relation: item.value.contact2_relation,
          contact2_tel: item.value.contact2_tel,
        };
      } else if (step == "step2") {
        dataSend = {
          student_id: item.value.id,
          blood_group: item.value.blood_group.code,
          height: item.value.height,
          weight: item.value.weight,
          emergency_tel: item.value.emergency_tel,
          congenital_disease: item.value.congenital_disease,
          drug_allergy: item.value.drug_allergy,
        };
      } else {
        dataSend = {
          student_id: item.value.id,
        };
      }

      store
        .dispatch("student-personal-data/editPersonalData", dataSend)
        .then(async (response) => {
          if (response.status == 200) {
            let { data } = response;
            item.value = initDataConvert(data);

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

  const validationFormInfo = () => {
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
      item.value.documents.forEach((d) => {
        if (d.document_file != null) {
          let dataSend = {
            student_id: item.value.id,
            document_file_upload: d.document_file,
            document_type_id: d.document_type_id,
            document_name: d.document_name,
          };

          if (d.document_id == null) {
            store
              .dispatch("student-personal-data/addStudentDocument", dataSend)
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
              .dispatch("student-personal-data/editStudentDocument", dataSend)
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
            console.log("FREEDOM2");
            reject();
          }
        })
        .then((res) => {
          resolve(res);
        });
    });
  };

  watch(
    () => item.value.province,
    (value) => {
      if (value != null) {
        fetchAmphurs();
      }
    }
  );

  watch(
    () => item.value.amphur,
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
    item,
    isSubmit,
    onSubmit,
    isOverLay,
    selectOptions,
    validationFormInfo,
    validationFormHealth,
    validationFormDocument,
    infoRules,
    healthRules,
    documentRules,
    certificateForm,
    formWizard,
    documentTypes,
  };
}
