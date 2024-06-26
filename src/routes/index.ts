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
import masterMaterial from "../controllers/masterMaterial";
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
import director from "../controllers/approvalDirector";
import approvalRequest from "../controllers/approvalRequest";
import poandso from "../controllers/poandso";
import kontraBon from "../controllers/kontraBon";
import cashier from "../controllers/cashier";
import cashAdv from "../controllers/cashAdvance";
import outgoing from "../controllers/outgoingMaterial";

/***************************AUTH********************************* */

router.post("/signup", auth.registerUser);
router.post("/signin", auth.loginUser);
router.post("/changepass", auth.updatePassword);
router.delete(
  "/signout",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
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
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
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
router.put(
  "/userPhoto/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR" }),
  upload.single("photo", 1000),
  user.updatePhoto
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
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
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
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
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
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
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
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
  employee.getEmployeeAll
);
router.get(
  "/employeDepart",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
  employee.getEmployeeSales
);
router.post(
  "/employe",
  jwt.authToken({ administrator: "ADMINISTRATOR", HRandGA: "HR & GA" }),
  upload.single("photo", 1000),
  employee.createEmployee
);
router.post(
  "/employeeedu",
  jwt.authToken({ administrator: "ADMINISTRATOR", HRandGA: "HR & GA" }),
  upload.array("ijazah", 1000),
  employee.createEmployeEdu
);
router.post(
  "/employeCertificate",
  jwt.authToken({ administrator: "ADMINISTRATOR", HRandGA: "HR & GA" }),
  upload.array("certificate_img", 1000),
  employee.createEmployeCertificate
);
router.put(
  "/employe/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR", HRandGA: "HR & GA" }),
  employee.updateEmployee
);
router.put(
  "/employechild",
  jwt.authToken({ administrator: "ADMINISTRATOR", HRandGA: "HR & GA" }),
  employee.updateEmployeeChild
);
router.put(
  "/employeEdu",
  jwt.authToken({ administrator: "ADMINISTRATOR", HRandGA: "HR & GA" }),
  upload.array("ijazah", 1000),
  employee.updateEmployeeEdu
);
router.put(
  "/employeCer",
  jwt.authToken({ administrator: "ADMINISTRATOR", HRandGA: "HR & GA" }),
  upload.array("certificate_img", 1000),
  employee.updateEmployeeCertificate
);
router.delete(
  "/employe/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR", HRandGA: "HR & GA" }),
  employee.deleteEmployee
);
router.delete(
  "/employeChild/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR", HRandGA: "HR & GA" }),
  employee.deleteEmployeeChild
);
router.delete(
  "/employeEdu/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR", HRandGA: "HR & GA" }),
  employee.deleteEmployeeEdu
);
router.delete(
  "/employeCer/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR", HRandGA: "HR & GA" }),
  employee.deleteEmployeeCertificate
);

/***************************EMPLOYEE********************************* */

/***************************CUSTOMER********************************* */

router.get(
  "/customer",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
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
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
  }),
  customer.createCustomer
);
router.post(
  "/customerCsvXlsx",
  middle.importData,
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
  }),
  customer.createCsvNxlsx
);
router.put(
  "/customer/:id",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
  }),
  customer.updateCustomer
);
router.put(
  "/customercontact",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
  }),
  customer.updateCustomerContact
);
router.put(
  "/customeraddress",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
  }),
  customer.updateCustomerAddress
);
router.delete(
  "/customer/:id",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
  }),
  customer.deleteCustomer
);

/***************************CUSTOMER********************************* */

/***************************SUPPLIER********************************* */

router.get(
  "/supplier",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
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
  jwt.authToken({ administrator: "ADMINISTRATOR", purchasing: "PURCHASING" }),
  supplier.createSupplier
);
router.put(
  "/supplier/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR", purchasing: "PURCHASING" }),
  supplier.updateSupplier
);
router.put(
  "/suppliercontact",
  jwt.authToken({ administrator: "ADMINISTRATOR", purchasing: "PURCHASING" }),
  supplier.updateSupplierContact
);
router.put(
  "/supplierbank",
  jwt.authToken({ administrator: "ADMINISTRATOR", purchasing: "PURCHASING" }),
  supplier.updateSupplierBank
);
router.delete(
  "/supplier/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR", purchasing: "PURCHASING" }),
  supplier.deleteSupplier
);

/***************************SUPPLIER********************************* */

/***************************EQUIPMENT********************************* */

router.get(
  "/equipment",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
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
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
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
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
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
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
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
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
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
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
  }),
  quotation.getEditPoQuotation
);

router.post(
  "/quotation",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
  }),
  upload.single("quo_img", 1000),
  quotation.createQuotation
);

router.put(
  "/quotation/:id",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
  }),
  upload.single("quo_img", 1000),
  quotation.updateQuotation
);
// router.put(
//   "/quotationDetail",
//   jwt.authToken({ administrator: "ADMINISTRATOR", marketing: "MARKETING" }),
//   quotation.updateQuotationDetail
// );
// router.put(
//   "/quotationDetailChild",
//   jwt.authToken({ administrator: "ADMINISTRATOR", marketing: "MARKETING" }),
//   quotation.updateQuoDetChild
// );
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
// router.delete(
//   "/quotationDetail/:id",
//   jwt.authToken({ administrator: "ADMINISTRATOR", marketing: "MARKETING" }),
//   quotation.deleteQuotationDetail
// );
// router.delete(
//   "/quotationEqPart/:id",
//   jwt.authToken({ administrator: "ADMINISTRATOR", marketing: "MARKETING" }),
//   quotation.deleteQuotationEqPart
// );
// router.delete(
//   "/quotationDetailChild/:id",
//   jwt.authToken({ administrator: "ADMINISTRATOR", marketing: "MARKETING" }),
//   quotation.deleteQuotationDetailChild
// );

/***************************QUOTATION********************************* */

/***************************CUSTOMERPO********************************* */

router.get(
  "/customerPo",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
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
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
  }),
  upload.single("upload_doc", 1000),
  customerPo.createcusPo
);
router.put(
  "/customerPo/:id",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
  }),
  upload.single("upload_doc", 1000),
  customerPo.updatecusPo
);
router.put(
  "/customerPoDetail",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
  }),
  customerPo.updatePoDetail
);
router.put(
  "/customerPoTermOfPay",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
  }),
  customerPo.updatePoTermOfPay
);
router.delete(
  "/po/:id",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
  }),
  customerPo.deletecusPo
);
router.delete(
  "/customerPoDetail/:id",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
  }),
  customerPo.deletecusPoDetail
);
router.delete(
  "/customerPoTermOfPay/:id",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
  }),
  customerPo.deletecusPoTermOfPay
);

/***************************CUSTOMERPO********************************* */

/***************************WOR********************************* */

router.get(
  "/jobStatus",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
  wor.getJobStatus
);

router.get(
  "/wor",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
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
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
  wor.getWorTimes
);
router.post(
  "/wor",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
  }),
  upload.single("file_list", 1000),
  wor.createWor
);
router.put(
  "/wor/:id",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
  }),
  upload.single("file_list", 1000),
  wor.updateWor
);

router.put(
  "/worScope",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
  }),
  wor.updateWorkscope
);

router.put(
  "/worStatus/:id",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
  }),
  wor.updateWorStatus
);

router.delete(
  "/wor/:id",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
  }),
  wor.deleteWor
);

router.delete(
  "/worScope/:id",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
  }),
  wor.deleteWork
);

/***************************WOR********************************* */

/***************************TYPEMR********************************* */

router.get(
  "/groupMaterial",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
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
  "/materialMaster",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
  masterMaterial.getMaterialMaster
);
router.post(
  "/materialMaster",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
  masterMaterial.createMaterialMaster
);
router.get(
  "/masterMaterial",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
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
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
  typeMr.getStock
);
router.post(
  "/stockMaterial",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
  typeMr.createMasterSpesifikasi
);
router.post(
  "/stock",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
  typeMr.createMasterOne
);
router.post(
  "/groupMaterial",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
  typeMr.createTypeMr
);
router.post(
  "/masterMaterial",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
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
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
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
  upload.single("inimg", 100),
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
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
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
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
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
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
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
  "/operatorStart",
  jwt.authToken({ administrator: "ADMINISTRATOR", ppic: "Ppic" }),
  dispacth.createOperatorStart
);
router.post(
  "/operatorFinish/:id",
  jwt.authToken({ administrator: "ADMINISTRATOR", ppic: "Ppic" }),
  dispacth.createOperatorFinish
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
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
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
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
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
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
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
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
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
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
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
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
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
  "/bomPart",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
  bom.getPartBom
);

router.get(
  "/bomMaterial",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
  bom.getBomMaterial
);

router.get(
  "/srBom",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
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
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
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
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
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
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
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
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
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
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
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
  "/mrDetail",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
  MR.getdetailMr
);

router.post(
  "/MR",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
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
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
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
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
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
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
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
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
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
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
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
router.put(
  "/MRdetailUpdate",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
  MR.updateApprovalOne
);

router.delete(
  "/MR/:id",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
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
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
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
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
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
  "/detailSR",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
  SR.getdetailSr
);

router.post(
  "/SR",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
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
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
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
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
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
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
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
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
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
  "/detailSR",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
  SR.updateApprovalOneSR
);

router.put(
  "/SRapprove",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
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
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
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
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
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
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
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
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
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

/***************************PurchaseMR********************************* */
router.get(
  "/mrPR",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
  MR.getPrM
);

router.put(
  "/mrPr",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
  MR.updatePr
);

router.put(
  "/mrPrdetail",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
  MR.updatedetailPr
);

router.put(
  "/prStatusSpv/:id",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
  MR.updatePrStatus
);

router.put(
  "/prStatusMgr/:id",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    purchasing: "PURCHASING",
  }),
  MR.updatePrStatusM
);

/***************************PurchaseMR********************************* */

/***************************PurchaseSR********************************* */
router.get(
  "/srPR",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
  SR.getPsR
);

router.put(
  "/srPR",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
  SR.updatePsr
);

router.put(
  "/srPsR",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
  SR.updatedetailPsr
);

router.put(
  "/psrStatusMgr/:id",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
  SR.updatePsrStatusM
);
/***************************PurchaseSR********************************* */

/***************************Director********************************* */
router.get(
  "/directorApproval",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
  }),
  director.getAllApprove
);

router.put(
  "/directorApproval/:id",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
  }),
  director.updateStatusDpoandso
);
/***************************Director********************************* */

/***************************Approval Request********************************* */

router.get(
  "/approvalRequest",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
  approvalRequest.getAllApproveRequest
);

/***************************Approval Request********************************* */

/***************************PO AND SO**************************************** */

router.get(
  "/poandso",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
  poandso.getPo
);

router.get(
  "/poandsoAll",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
  poandso.getPoandSo
);

router.post(
  "/poandso",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    purchasing: "PURCHASING",
  }),
  poandso.createPo
);

router.put(
  "/poandsoStatus/:id",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    purchasing: "PURCHASING",
  }),
  poandso.updateStatusMpoandso
);

/***************************PO AND SO**************************************** */

/***************************Receive PO AND SO**************************************** */

router.get(
  "/poandsoReceive",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
  poandso.getAllReceive
);

router.put(
  "/poandsoReceive",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    purchasing: "PURCHASING",
  }),
  poandso.updatePoandSo
);

router.put(
  "/poandsoTermOfPay",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    purchasing: "PURCHASING",
  }),
  poandso.updatePoSoTerm
);

router.post(
  "/poandsoTermOfPay",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    purchasing: "PURCHASING",
  }),
  poandso.deleteTermOf
);

/***************************Receive PO AND SO**************************************** */

/***************************Kontra Bon**************************************** */

router.get(
  "/kontrabonAll",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
  kontraBon.getKontraBon
);

router.post(
  "/kontrabon",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    finance: "FINANCE & ACC",
  }),
  kontraBon.createKontraBon
);

router.put(
  "/kontrabon/:id",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    finance: "FINANCE & ACC",
  }),
  kontraBon.updateKontraBon
);

router.delete(
  "/kontrabon/:id",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    finance: "FINANCE & ACC",
  }),
  kontraBon.deleteKontraBon
);

router.put(
  "/kontrabonValid/:id",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    finance: "FINANCE & ACC",
  }),
  kontraBon.updateStatusM
);

/***************************Kontra Bon**************************************** */

/***************************Cashier**************************************** */

router.get(
  "/cashier",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
  cashier.getCashier
);

router.get(
  "/posting",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
  cashier.getPosting
);

router.get(
  "/duedate",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
  cashier.getDueDate
);

router.post(
  "/cashier",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    finance: "FINANCE & ACC",
  }),
  cashier.createCashier
);

router.put(
  "/cashier/:id",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    finance: "FINANCE & ACC",
  }),
  cashier.updateCashier
);

router.put(
  "/posting/:id",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    finance: "FINANCE & ACC",
  }),
  cashier.updatePosting
);

router.put(
  "/duedate/:id",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    finance: "FINANCE & ACC",
  }),
  cashier.updateDuedate
);

router.put(
  "/duedatevalid",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    finance: "FINANCE & ACC",
  }),
  cashier.updateDuedateStatus
);

router.delete(
  "/cashier/:id",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    finance: "FINANCE & ACC",
  }),
  cashier.deleteCashier
);

router.delete(
  "/journalCashier/:id",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    finance: "FINANCE & ACC",
  }),
  cashier.deleteDetailCashier
);

router.put(
  "/cashierValid/:id",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    finance: "FINANCE & ACC",
  }),
  cashier.updateStatusM
);

/***************************Cashier**************************************** */

/***************************Cash Advance**************************************** */

router.get(
  "/cashAdv",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
  cashAdv.getCdv
);

router.get(
  "/cashAdvEmployee",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
  cashAdv.getEmployeeCdv
);

router.get(
  "/cashAdvWor",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
  cashAdv.getWorCdv
);

router.get(
  "/SPJ",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
  cashAdv.getSPJCdv
);

router.post(
  "/cashAdv",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
  cashAdv.createCdv
);

router.put(
  "/SPJ/:id",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
  cashAdv.createSpjCdv
);

router.put(
  "/SPJ",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
  cashAdv.updateSpj
);

router.put(
  "/cashAdvStatusSpv/:id",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
  cashAdv.updateStatusSpv
);

router.put(
  "/cashAdvStatusMgr/:id",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
  cashAdv.updateStatusM
);

router.put(
  "/cashAdv/:id",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
  cashAdv.updateCdv
);

router.delete(
  "/cashAdv/:id",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
  cashAdv.deleteCdv
);

router.delete(
  "/SPJ/:id",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
  cashAdv.deleteCdvDetail
);

/***************************Cash Advance**************************************** */

/***************************Outgoing Material**************************************** */

router.get(
  "/outgoingMaterial",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
  approvalRequest.getOutgoingMaterial
);

router.get(
  "/outgoingMaterialAll",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    marketingbumn: "MARKETING BUMN",
    marketingswasta: "MARKETING SWASTA",
    HRandGA: "HR & GA",
    finance: "FINANCE & ACC",
    QAandEng: "QA & ENG",
    purchasing: "PURCHASING",
    drafter: "DRAFTER",
    ppic: "Ppic",
    utility: "Utility/ty",
  }),
  outgoing.getOutgoingMaterial
);

router.post(
  "/outgoingMaterial",
  jwt.authToken({
    administrator: "ADMINISTRATOR",
    purchasing: "PURCHASING",
  }),
  outgoing.createOutgoingMaterial
);

/***************************Outgoing Material**************************************** */

export default router;
