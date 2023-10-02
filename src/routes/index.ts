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
import drawing from "../controllers/drawing";
import bom from "../controllers/bom";
import MR from "../controllers/mRequest";
import SR from "../controllers/Sr";
import coa from "../controllers/coa";

/***************************AUTH********************************* */

router.post("/signup", auth.registerUser);
router.post("/signin", auth.loginUser);
router.post("/changepass", auth.updatePassword);
router.delete(
  "/signout",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketing: "MARKETING",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
  auth.logoutUser
);

/***************************AUTH********************************* */

/***************************USER********************************* */

router.get(
  "/user",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketing: "MARKETING",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
  user.getUser
);
router.put(
  "/user/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  user.updateUser
);
router.delete(
  "/user/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  user.deleteUser
);

/***************************USER********************************* */

/***************************ROLE********************************* */

router.get(
  "/role",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketing: "MARKETING",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
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
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketing: "MARKETING",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
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
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketing: "MARKETING",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
  employee.getEmployee
);
router.get(
  "/employeeAll",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  employee.getEmployeeAll
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
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketing: "MARKETING",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
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
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketing: "MARKETING",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
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
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketing: "MARKETING",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
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
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketing: "MARKETING",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
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
  upload.single("part_img", 1000),
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
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketing: "MARKETING",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
  quotation.getQuotation
);
router.get(
  "/quotation/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR", marketing: "MARKETING" }),
  quotation.getEditPoQuotation
);
router.post(
  "/quotation",
  jwt.authToken({ administrator: "ADMINISTRATOR", marketing: "MARKETING" }),
  upload.single("quo_img", 1),
  quotation.createQuotation
);
router.put(
  "/quotation/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR", marketing: "MARKETING" }),
  upload.single("quo_img", 1),
  quotation.updateQuotation
);
router.put(
  "/quotationDetail",
  jwt.authToken({ administrator: "ADMINISTRATOR", marketing: "MARKETING" }),
  quotation.updateQuotationDetail
);
router.put(
  "/quotationEqPart",
  jwt.authToken({ administrator: "ADMINISTRATOR", marketing: "MARKETING" }),
  quotation.updateQuotationEqPart
);
router.delete(
  "/quotation/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR", marketing: "MARKETING" }),
  quotation.deleteQuotation
);
router.delete(
  "/quotationDetail/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR", marketing: "MARKETING" }),
  quotation.deleteQuotationDetail
);
router.delete(
  "/quotationEqPart/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR", marketing: "MARKETING" }),
  quotation.deleteQuotationEqPart
);

/***************************QUOTATION********************************* */

/***************************CUSTOMERPO********************************* */

router.get(
  "/customerPo",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketing: "MARKETING",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
  customerPo.getcusPo
);
router.post(
  "/customerPo",
  jwt.authToken({ administrator: "ADMINISTRATOR", marketing: "MARKETING" }),
  customerPo.createcusPo
);
router.put(
  "/customerPo/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR", marketing: "MARKETING" }),
  customerPo.updatecusPo
);
router.put(
  "/customerPoDetail",
  jwt.authToken({ administrator: "ADMINISTRATOR", marketing: "MARKETING" }),
  customerPo.updatePoDetail
);
router.put(
  "/customerPoTermOfPay",
  jwt.authToken({ administrator: "ADMINISTRATOR", marketing: "MARKETING" }),
  customerPo.updatePoTermOfPay
);
router.delete(
  "/po/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR", marketing: "MARKETING" }),
  customerPo.deletecusPo
);
router.delete(
  "/customerPoDetail/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR", marketing: "MARKETING" }),
  customerPo.deletecusPoDetail
);
router.delete(
  "/customerPoTermOfPay/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR", marketing: "MARKETING" }),
  customerPo.deletecusPoTermOfPay
);

/***************************CUSTOMERPO********************************* */

/***************************WOR********************************* */

router.get(
  "/wor",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketing: "MARKETING",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
  wor.getWor
);
router.get(
  "/worTime",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketing: "MARKETING",
    ppic: "Ppic",
  }),
  wor.getWorTimes
);
router.post(
  "/wor",
  jwt.authToken({ administrator: "ADMINISTRATOR", marketing: "MARKETING" }),
  upload.single("file_list", 1),
  wor.createWor
);
router.put(
  "/wor/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR", marketing: "MARKETING" }),
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
  jwt.authToken({ administrator: "ADMINISTRATOR", marketing: "MARKETING" }),
  wor.deleteWor
);

/***************************WOR********************************* */

/***************************TYPEMR********************************* */

router.get(
  "/groupMaterial",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketing: "MARKETING",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
  typeMr.getTypeMr
);
router.get(
  "/masterMaterial",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketing: "MARKETING",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
  typeMr.getMasterM
);
router.get(
  "/stockMaterial",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  typeMr.getStock
);
router.post(
  "/stockMaterial",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  typeMr.createMasterSpesifikasi
);
router.post(
  "/stock",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  typeMr.createMasterOne
);
router.post(
  "/groupMaterial",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  typeMr.createTypeMr
);
router.post(
  "/masterMaterial",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  typeMr.createMaster
);
router.put(
  "/groupMaterial/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  typeMr.updateMaterial
);
router.put(
  "/masterMaterial/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  typeMr.updateMaterialSpek
);
router.put(
  "/stockMaterial/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  typeMr.updateStokMaterial
);
router.delete(
  "/groupMaterial/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  typeMr.deleteMaterial
);
router.delete(
  "/masterMaterial/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  typeMr.deleteMaterialSpek
);
router.delete(
  "/stockMaterial/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  typeMr.deleteStokMaterial
);

/***************************TYPEMR********************************* */

/***************************SRIMG********************************* */

router.get(
  "/summary",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketing: "MARKETING",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
  srimg.getSrimg
);
router.post(
  "/summary",
  jwt.authToken({ administrator: "ADMINISTRATOR", QAandEng: "QA & ENG" }),
  upload.single("inimg", 1),
  srimg.createSrimg
);
router.post(
  "/summaryImg",
  upload.array("img", 1000),
  jwt.authToken({ administrator: "ADMINISTRATOR", QAandEng: "QA & ENG" }),
  srimg.createImgMany
);
router.put(
  "/summary/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR", QAandEng: "QA & ENG" }),
  upload.single("inimg", 1),
  srimg.updateSrimg
);
router.put(
  "/summaryDetail",
  jwt.authToken({ administrator: "ADMINISTRATOR", QAandEng: "QA & ENG" }),
  srimg.updateSrimgDetail
);
router.put(
  "/summaryImgH",
  jwt.authToken({ administrator: "ADMINISTRATOR", QAandEng: "QA & ENG" }),
  upload.array("img", 1000),
  srimg.updateImgSr
);
router.delete(
  "/summaryStatusSpv/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR", QAandEng: "QA & ENG" }),
  srimg.updateSumaryStatus
);
router.delete(
  "/summaryStatusManager/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR", QAandEng: "QA & ENG" }),
  srimg.updateSumaryStatusM
);
router.delete(
  "/summary/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR", QAandEng: "QA & ENG" }),
  srimg.deleteSrimg
);
router.delete(
  "/summaryDetail/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR", QAandEng: "QA & ENG" }),
  srimg.deleteSrimgDetail
);
router.delete(
  "/summaryImgH/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR", QAandEng: "QA & ENG" }),
  srimg.deleteSrimgImg
);

/***************************SRIMG********************************* */

/***************************WORKCENTER********************************* */

router.get(
  "/workcenter",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketing: "MARKETING",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
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
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketing: "MARKETING",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
  dispacth.getDispatch
);
router.get(
  "/sumarryDispacth",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    ppic: "Ppic",
    QAandEng: "QA & ENG",
  }),
  dispacth.getSumaryDispacth
);
router.post(
  "/dispacth",
  jwt.authToken({ administrator: "ADMINISTRATOR", ppic: "Ppic" }),
  dispacth.createDispacth
);
router.put(
  "/dispacth/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR", ppic: "Ppic" }),
  dispacth.updateDispacth
);
router.put(
  "/dispacthStart/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR", ppic: "Ppic" }),
  dispacth.updateStart
);
router.put(
  "/dispacthfinish/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR", ppic: "Ppic" }),
  dispacth.updateFinish
);
router.put(
  "/dispacthDetail",
  jwt.authToken({ administrator: "ADMINISTRATOR", ppic: "Ppic" }),
  dispacth.updateDetailDispacth
);
router.delete(
  "/dispacth/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR", ppic: "Ppic" }),
  dispacth.deleteDispacth
);
router.delete(
  "/dispacthDetail/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR", ppic: "Ppic" }),
  dispacth.deleteDetailDispacth
);

/***************************DISPACTH********************************* */

/***************************MASTER AKTIVITAS********************************* */

router.get(
  "/masterAktivitas",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketing: "MARKETING",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
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
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketing: "MARKETING",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
  timeschedule.getTimeschedule
);
router.get(
  "/summaryTms",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    QAandEng: "QA & ENG",
    ppic: "Ppic",
  }),
  srimg.getSumaryTms
);
router.post(
  "/timeschedule",
  jwt.authToken({ administrator: "ADMINISTRATOR", ppic: "Ppic" }),
  timeschedule.createTimeschedule
);
router.put(
  "/timeschedule/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR", ppic: "Ppic" }),
  timeschedule.updateTimeschedule
);
router.put(
  "/timescheduleSpv/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR", ppic: "Ppic" }),
  timeschedule.updateTimeSchStatus
);
router.put(
  "/timescheduleMgr/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR", ppic: "Ppic" }),
  timeschedule.updateTimeSchStatusM
);
router.put(
  "/timeschedule",
  jwt.authToken({ administrator: "ADMINISTRATOR", ppic: "Ppic" }),
  timeschedule.updateTimeAktivity
);
router.delete(
  "/timeschedule/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR", ppic: "Ppic" }),
  timeschedule.deleteTimeschedule
);
router.delete(
  "/timescheduleActivity/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR", ppic: "Ppic" }),
  timeschedule.deleTimeAktivty
);

/***************************TIMESCHEDULE********************************* */

/***************************MASTER HOLIDAY********************************* */

router.get(
  "/masterHoliday",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketing: "MARKETING",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
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

/***************************DRAWING********************************* */

router.get(
  "/tmsdrawing",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketing: "MARKETING",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
  drawing.getDrawingTms
);
router.get(
  "/drawing",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketing: "MARKETING",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
  drawing.getDrawing
);
router.post(
  "/drawing",
  jwt.authToken({ administrator: "ADMINISTRATOR", QAandEng: "QA & ENG" }),
  upload.array("file_upload", 1000),
  drawing.createDrawing
);
router.put(
  "/drawing/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR", QAandEng: "QA & ENG" }),
  drawing.updateDrawing
);
router.put(
  "/drawing",
  jwt.authToken({ administrator: "ADMINISTRATOR", QAandEng: "QA & ENG" }),
  upload.array("file_upload", 1000),
  drawing.updateFileDrawing
);
router.delete(
  "/drawing/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR", QAandEng: "QA & ENG" }),
  drawing.deleteDrawing
);
router.delete(
  "/drawingFile/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR", QAandEng: "QA & ENG" }),
  drawing.deleteFileDrawing
);

/***************************DRAWING********************************* */

/***************************BOM********************************* */

router.get(
  "/srBom",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketing: "MARKETING",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
  srimg.getSrimBom
);
router.get(
  "/SummaryBom",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketing: "MARKETING",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
  srimg.getSrimBom
);
router.get(
  "/bom",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketing: "MARKETING",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
  bom.getBom
);
router.get(
  "/mrBom",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketing: "MARKETING",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
  bom.getBomMr
);
router.get(
  "/mrUser/:id",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketing: "MARKETING",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
  bom.getUserMr
);
router.post(
  "/bom",
  jwt.authToken({ administrator: "ADMINISTRATOR", QAandEng: "QA & ENG" }),
  bom.CreateBom
);
router.put(
  "/bom/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR", QAandEng: "QA & ENG" }),
  bom.UpdategetBom
);
router.put(
  "/bomSpv/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR", QAandEng: "QA & ENG" }),
  bom.updateBomStatusSpv
);
router.put(
  "/bomManger/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR", QAandEng: "QA & ENG" }),
  bom.updateBomStatusM
);
router.put(
  "/bom",
  jwt.authToken({ administrator: "ADMINISTRATOR", QAandEng: "QA & ENG" }),
  bom.updateBom
);
router.delete(
  "/bom/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR", QAandEng: "QA & ENG" }),
  bom.DeleteBom
);
router.delete(
  "/bomDetail/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR", QAandEng: "QA & ENG" }),
  bom.DeleteBomDetail
);

/***************************BOM********************************* */

/***************************Material Request********************************* */

router.get(
  "/MR",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketing: "MARKETING",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
  MR.getMr
);
router.get(
  "/MRapprove",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketing: "MARKETING",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
  MR.getApproval
);
router.post(
  "/MR",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketing: "MARKETING",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
  MR.createMr
);
router.put(
  "/MR",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketing: "MARKETING",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
  MR.upsertMr
);
router.put(
  "/MR/:id",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketing: "MARKETING",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
  MR.updateMr
);
router.put(
  "/MRStatusSpv/:id",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketing: "MARKETING",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
  MR.updateMrStatus
);
router.put(
  "/MRStatusManger/:id",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketing: "MARKETING",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
  MR.updateMrStatusM
);
router.put(
  "/MRapprove",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketing: "MARKETING",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
  MR.updateApproval
);
router.delete(
  "/MR/:id",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketing: "MARKETING",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
  MR.deleteMr
);
router.delete(
  "/MRdetail/:id",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketing: "MARKETING",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
  MR.deleteMrDetail
);

/***************************Material Request********************************* */

/***************************Service Request********************************* */

router.get(
  "/SR",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketing: "MARKETING",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
  SR.getSr
);
router.get(
  "/SRapprove",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketing: "MARKETING",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
  SR.getApprovalSr
);
router.post(
  "/SR",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketing: "MARKETING",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
  SR.createSr
);
router.put(
  "/SR/:id",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketing: "MARKETING",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
  SR.updateSr
);
router.put(
  "/SRstatusSpv/:id",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketing: "MARKETING",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
  SR.updateSrStatus
);
router.put(
  "/SRstatusManager/:id",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketing: "MARKETING",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
  SR.updateSrStatusM
);
router.put(
  "/SR",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketing: "MARKETING",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
  SR.upsertSr
);
router.put(
  "/SRapprove",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketing: "MARKETING",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
  SR.updateApprovalSr
);
router.delete(
  "/SR/:id",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketing: "MARKETING",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
  SR.deleteSr
);
router.delete(
  "/SRdetail/:id",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketing: "MARKETING",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
  SR.deleteDetailSr
);

/***************************Service Request********************************* */

/***************************Master COA********************************* */

router.get(
  "/coa",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketing: "MARKETING",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
  coa.getCoa
);
router.post(
  "/coa",
  jwt.authToken({ administrator: "ADMINISTRATOR", utility: "Utility/ty" }),
  coa.createCoa
);
router.put(
  "/coa/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR", utility: "Utility/ty" }),
  coa.updateCoa
);
router.delete(
  "/coa/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR", utility: "Utility/ty" }),
  coa.deleteCoa
);

/***************************Master COA********************************* */

export default router;
