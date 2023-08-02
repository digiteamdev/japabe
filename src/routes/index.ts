import express from "express";
const router = express.Router();

import upload from "../utils/cloudinary";
import jwt from "../middleware/jwt";
import middle from "../middleware/csv";

import auth from "../controllers/auth";
import depart from "../controllers/depart";
import employee from "../controllers/employee";
import user from "../controllers/user";
import role from "../controllers/role";
import customer from "../controllers/customer";
import supplier from "../controllers/supplier";
import equipment from "../controllers/equipment";
import quotation from "../controllers/quotation";
import customerPo from "../controllers/customerPo";
import wor from "../controllers/wor";
import typeMr from "../controllers/mrType";
import srimg from "../controllers//srimg";
import workcenter from "../controllers/workcenter";
import dispacth from "../controllers/dispacth";
import masterAktivitas from "../controllers/masterAktivitas";
import timeschedule from "../controllers/timeschedule";
import holidayTms from "../controllers/masterHoliday";

/***************************AUTH********************************* */

router.post("/signup", auth.registerUser);
router.post("/signin", auth.loginUser);
router.post("/changepass", auth.updatePassword);
router.delete(
  "/signout",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  auth.logoutUser
);

/***************************AUTH********************************* */

/***************************USER********************************* */

router.get(
  "/user",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  user.getUser
);

/***************************USER********************************* */

/***************************ROLE********************************* */

router.get(
  "/role",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  role.getRole
);
router.post(
  "/role",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  role.createRole
);
router.put(
  "/role/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  role.updateRole
);
router.delete(
  "/role/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  role.deleteRole
);

/***************************ROLE********************************* */

/***************************DEPART********************************* */

router.get(
  "/depart",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  depart.getDepart
);
router.get(
  "/subdepart",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  depart.getsubDepart
);
router.post(
  "/depart",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  depart.createDepart
);
router.post(
  "/departMany",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  depart.createDepartMany
);
router.post(
  "/subMany",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  depart.createSubMany
);
router.put(
  "/depart",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  depart.updateDepart
);
router.delete(
  "/depart/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  depart.deleteDepart
);
router.delete(
  "/subdepart/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  depart.deleteSubDepart
);

/***************************DEPART********************************* */

/***************************EMPLOYEE********************************* */

router.get(
  "/employe",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  employee.getEmployee
);
router.get(
  "/employeDepart",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  employee.getEmployeeSales
);
router.post(
  "/employe",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  employee.createEmployee
);
router.post(
  "/employeeedu",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),

  upload.array("ijazah", 1000),
  employee.createEmployeEdu
);
router.post(
  "/employeCertificate",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),

  upload.array("certificate_img", 1000),
  employee.createEmployeCertificate
);
router.put(
  "/employe/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  employee.updateEmployee
);
router.put(
  "/employechild",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  employee.updateEmployeeChild
);
router.put(
  "/employeEdu",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  upload.array("ijazah", 1000),
  employee.updateEmployeeEdu
);
router.put(
  "/employeCer",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  upload.array("certificate_img", 1000),
  employee.updateEmployeeCertificate
);
router.delete(
  "/employe/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  employee.deleteEmployee
);
router.delete(
  "/employeChild/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  employee.deleteEmployeeChild
);
router.delete(
  "/employeEdu/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  employee.deleteEmployeeEdu
);
router.delete(
  "/employeCer/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  employee.deleteEmployeeCertificate
);

/***************************EMPLOYEE********************************* */

/***************************CUSTOMER********************************* */

router.get(
  "/customer",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  customer.getCustomer
);
router.post(
  "/customer",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  customer.createCustomer
);
router.post(
  "/customerCsvXlsx",
  middle.importData,
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  customer.createCsvNxlsx
);
router.put(
  "/customer/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  customer.updateCustomer
);
router.put(
  "/customercontact",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  customer.updateCustomerContact
);
router.put(
  "/customeraddress",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  customer.updateCustomerAddress
);
router.delete(
  "/customer/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  customer.deleteCustomer
);

/***************************CUSTOMER********************************* */

/***************************SUPPLIER********************************* */

router.get(
  "/supplier",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  supplier.getSupplier
);
router.post(
  "/supplier",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  supplier.createSupplier
);
router.put(
  "/supplier/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  supplier.updateSupplier
);
router.put(
  "/suppliercontact",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  supplier.updateSupplierContact
);
router.put(
  "/supplierbank",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  supplier.updateSupplierBank
);
router.delete(
  "/supplier/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  supplier.deleteSupplier
);

/***************************SUPPLIER********************************* */

/***************************EQUIPMENT********************************* */

router.get(
  "/equipment",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  equipment.getEquipment
);
router.post(
  "/equipment",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  upload.single("eq_image", 1),
  equipment.createEquipment
);
router.post(
  "/equipmentMany",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  equipment.createEquipmenMany
);
router.post(
  "/partMany",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  equipment.createPartMany
);
router.put(
  "/equipment/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  upload.single("eq_image", 1),
  equipment.updateEquipment
);
router.delete(
  "/equipment/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  equipment.deleteEquipment
);

/***************************EQUIPMENT********************************* */

/***************************PART********************************* */

router.get(
  "/part",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  equipment.getEquipment
);
router.post(
  "/part",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  upload.array("part_img", 1000),
  equipment.createPart
);
router.put(
  "/part",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  upload.array("part_img", 1000),
  equipment.updatePart
);
router.delete(
  "/part/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  equipment.deleteDPart
);

/***************************PART********************************* */

/***************************QUOTATION********************************* */

router.get(
  "/quotation",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  quotation.getQuotation
);
router.get(
  "/quotation/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  quotation.getEditPoQuotation
);
router.post(
  "/quotation",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  upload.single("quo_img", 1),
  quotation.createQuotation
);
router.put(
  "/quotation/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  upload.single("quo_img", 1),
  quotation.updateQuotation
);
router.put(
  "/quotationDetail",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  quotation.updateQuotationDetail
);
router.put(
  "/quotationEqPart",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  quotation.updateQuotationEqPart
);
router.delete(
  "/quotation/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  quotation.deleteQuotation
);
router.delete(
  "/quotationDetail/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  quotation.deleteQuotationDetail
);
router.delete(
  "/quotationEqPart/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  quotation.deleteQuotationEqPart
);

/***************************QUOTATION********************************* */

/***************************CUSTOMERPO********************************* */

router.get(
  "/customerPo",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  customerPo.getcusPo
);
router.post(
  "/customerPo",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  customerPo.createcusPo
);
router.put(
  "/customerPo/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  customerPo.updatecusPo
);
router.put(
  "/customerPoDetail",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  customerPo.updatePoDetail
);
router.put(
  "/customerPoTermOfPay",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  customerPo.updatePoTermOfPay
);
router.delete(
  "/customerPo/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  customerPo.deletecusPo
);
router.delete(
  "/customerPoDetail",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  customerPo.deletecusPoDetail
);
router.delete(
  "/customerPoTermOfPay",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  customerPo.deletecusPoTermOfPay
);

/***************************CUSTOMERPO********************************* */

/***************************WOR********************************* */

router.get(
  "/wor",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  wor.getWor
);
router.get(
  "/worTime",
  // jwt.authToken({ administrator: "ADMINISTRATOR" }),
  wor.getWorTimes
);
router.post(
  "/wor",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  upload.single("file_list", 1),
  wor.createWor
);
router.put(
  "/wor/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  upload.single("file_list", 1),
  wor.updateWor
);
router.put(
  "/worStatus/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  wor.updateWorStatus
);
router.delete(
  "/wor/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  wor.deleteWor
);

/***************************WOR********************************* */

/***************************TYPEMR********************************* */

router.get(
  "/typemr",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  typeMr.getTypeMr
);
router.post(
  "/typemr",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  typeMr.createTypeMr
);
router.put(
  "/typemr/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  typeMr.updateMaterial
);
router.put(
  "/typemr",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  typeMr.updateMaterialSpek
);
router.delete(
  "/typemr/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  typeMr.deleteMaterial
);
router.delete(
  "/typemrspek/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  typeMr.deleteMaterialSpek
);

/***************************TYPEMR********************************* */

/***************************SRIMG********************************* */

router.get(
  "/summary",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  srimg.getSrimg
);
router.post(
  "/summary",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  upload.single("inimg", 1),
  srimg.createSrimg
);
router.post(
  "/summaryImg",
  upload.array("img", 1000),
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  srimg.createImgMany
);
router.put(
  "/summary/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  upload.single("inimg", 1),
  srimg.updateSrimg
);
router.put(
  "/summaryDetail",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  srimg.updateSrimgDetail
);
router.put(
  "/summaryImgH",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  upload.array("img", 1000),
  srimg.updateImgSr
);
router.delete(
  "/summary/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  srimg.deleteSrimg
);
router.delete(
  "/summaryDetail/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  srimg.deleteSrimgDetail
);
router.delete(
  "/summaryImgH/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  srimg.deleteSrimgImg
);

/***************************SRIMG********************************* */

/***************************WORKCENTER********************************* */

router.get(
  "/workcenter",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  workcenter.getWorkCenter
);
router.post(
  "/workcenter",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  workcenter.createWorkCenter
);
router.post(
  "/workcentermany",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  workcenter.createWorkCenterMany
);
router.put(
  "/workcenter/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  workcenter.updatecreateWorkCenter
);
router.delete(
  "/workcenter/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  workcenter.deleteworkCenter
);

/***************************WORKCENTER********************************* */

/***************************DISPACTH********************************* */

router.get(
  "/dispacth",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  dispacth.getDispatch
);
router.post(
  "/dispacth",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  dispacth.createDispacth
);
router.put(
  "/dispacth/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  dispacth.updateDispacth
);
router.put(
  "/dispacthStart/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  dispacth.updateStart
);
router.put(
  "/dispacthfinish/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  dispacth.updateFinish
);
router.put(
  "/dispacthDetail",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  dispacth.updateDetailDispacth
);
router.delete(
  "/dispacth/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  dispacth.deleteDispacth
);
router.delete(
  "/dispacthDetail/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  dispacth.deleteDetailDispacth
);

/***************************DISPACTH********************************* */

/***************************MASTER AKTIVITAS********************************* */

router.get(
  "/masterAktivitas",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  masterAktivitas.getAktivitas
);
router.post(
  "/masterAktivitas",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  masterAktivitas.createMasterAktivitas
);
router.put(
  "/masterAktivitas/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  masterAktivitas.updateMasterAktivitas
);
router.delete(
  "/masterAktivitas/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  masterAktivitas.deleteMasterAktivitas
);

/***************************MASTER AKTIVITAS********************************* */

/***************************TIMESCHEDULE********************************* */

router.get(
  "/timeschedule",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  timeschedule.getTimeschedule
);
router.post(
  "/timeschedule",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  timeschedule.createTimeschedule
);
router.put(
  "/timeschedule/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  timeschedule.updateTimeschedule
);
router.put(
  "/timeschedule",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  timeschedule.updateTimeAktivity
);
router.delete(
  "/timeschedule/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  timeschedule.deleteTimeschedule
);
router.delete(
  "/timescheduleActivity/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  timeschedule.deleTimeAktivty
);

/***************************TIMESCHEDULE********************************* */

/***************************MASTER HOLIDAY********************************* */

router.get(
  "/masterHoliday",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  holidayTms.getHoliday
);
router.post(
  "/masterHoliday",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  holidayTms.createMasterHoliday
);
router.put(
  "/masterHoliday/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  holidayTms.updateMasterHoliday
);
router.delete(
  "/masterHoliday/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  holidayTms.deleteMasterHoliday
);

/***************************MASTER HOLIDAY********************************* */

export default router;
