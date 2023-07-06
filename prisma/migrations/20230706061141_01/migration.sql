-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('Male', 'Female');

-- CreateEnum
CREATE TYPE "Spouse_Gender" AS ENUM ('Male', 'Female');

-- CreateEnum
CREATE TYPE "Child_Gender" AS ENUM ('Male', 'Female');

-- CreateEnum
CREATE TYPE "Maritial" AS ENUM ('Single', 'Married', 'Divorce');

-- CreateEnum
CREATE TYPE "Employee_Status" AS ENUM ('Permanent', 'Contract', 'OJT');

-- CreateEnum
CREATE TYPE "Last_Edu" AS ENUM ('Elementary School', 'Junior High School', 'Senior High School', 'Bachelor Degree', 'Magister', 'Postgraduate');

-- CreateEnum
CREATE TYPE "Keterangan_Part" AS ENUM ('Rotating Part', 'Static Part', 'Consumable Part');

-- CreateEnum
CREATE TYPE "type_sup" AS ENUM ('Material Supplier', 'Service Vendor');

-- CreateEnum
CREATE TYPE "Tax" AS ENUM ('ppn', 'pph', 'ppn and pph');

-- CreateEnum
CREATE TYPE "Limit_Pay" AS ENUM ('Normal', 'Down_Payment', 'Termin_I', 'Termin_II', 'Termin_III', 'Termin_IV', 'Termin_V', 'Repayment');

-- CreateEnum
CREATE TYPE "Priority_Status" AS ENUM ('ST', 'XT', 'XXT', 'XT As Req', 'XXT As Req');

-- CreateEnum
CREATE TYPE "choice" AS ENUM ('Manufacture New', 'Supply New', 'Repair');

-- CreateTable
CREATE TABLE "role" (
    "id" TEXT NOT NULL,
    "role_name" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" TEXT NOT NULL,
    "NIP" VARCHAR(200),
    "NIK" VARCHAR(200),
    "NPWP" VARCHAR(200),
    "id_card" TEXT,
    "employee_name" VARCHAR(200),
    "nick_name" VARCHAR(50),
    "email" VARCHAR(100),
    "birth_place" VARCHAR(100),
    "birth_date" TIMESTAMP(3),
    "address" TEXT,
    "province" VARCHAR(100),
    "city" VARCHAR(100),
    "districts" VARCHAR(100),
    "sub_districts" VARCHAR(100),
    "ec_postalcode" INTEGER DEFAULT 0,
    "phone_number" VARCHAR(50),
    "start_join" TIMESTAMP(3),
    "remaining_days_of" INTEGER DEFAULT 0,
    "gender" "Gender",
    "marital_status" "Maritial",
    "subdepartId" TEXT NOT NULL,
    "employee_status" "Employee_Status",
    "spouse_name" VARCHAR(200),
    "gender_spouse" "Spouse_Gender",
    "spouse_birth_place" VARCHAR(100),
    "spouse_birth_date" TIMESTAMP(3),
    "status_user" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" TIMESTAMP(3),

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "hashed_password" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "employeeId" TEXT,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userRole" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "userRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "acces_token" TEXT,
    "refresh_token" TEXT,
    "clint_ip" VARCHAR(100),
    "is_bloked" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer" (
    "id" TEXT NOT NULL,
    "id_custom" VARCHAR(100),
    "name" VARCHAR(200),
    "email" VARCHAR(100),
    "ppn" INTEGER DEFAULT 0,
    "pph" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" TIMESTAMP(3),

    CONSTRAINT "customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerContact" (
    "id" TEXT NOT NULL,
    "contact_person" VARCHAR(100),
    "email_person" VARCHAR(100),
    "phone" VARCHAR(50),
    "customerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" TIMESTAMP(3),

    CONSTRAINT "CustomerContact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerAddress" (
    "id" TEXT NOT NULL,
    "address_person" TEXT,
    "address_workshop" TEXT,
    "recipient_address" TEXT,
    "provinces" VARCHAR(100),
    "cities" VARCHAR(100),
    "districts" VARCHAR(100),
    "sub_districts" VARCHAR(100),
    "ec_postalcode" INTEGER DEFAULT 0,
    "customerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" TIMESTAMP(3),

    CONSTRAINT "CustomerAddress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Departement" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" TIMESTAMP(3),

    CONSTRAINT "Departement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sub_depart" (
    "id" TEXT NOT NULL,
    "deptId" TEXT,
    "name" VARCHAR(200) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" TIMESTAMP(3),

    CONSTRAINT "sub_depart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Educational_Employee" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "school_name" VARCHAR(200),
    "last_edu" "Last_Edu",
    "graduation" VARCHAR(10),
    "ijazah" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" TIMESTAMP(3),

    CONSTRAINT "Educational_Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Certificate_Employee" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "certificate_name" VARCHAR(200),
    "certificate_img" TEXT,
    "end_date" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" TIMESTAMP(3),

    CONSTRAINT "Certificate_Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee_Child" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(200),
    "gender_child" "Child_Gender",
    "child_birth_place" VARCHAR(100),
    "child_birth_date" TIMESTAMP(3),
    "employeeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" TIMESTAMP(3),

    CONSTRAINT "Employee_Child_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Equipment" (
    "id" TEXT NOT NULL,
    "id_equipment" VARCHAR(200),
    "nama" VARCHAR(200),
    "keterangan_eq" TEXT,
    "eq_image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" TIMESTAMP(3),

    CONSTRAINT "Equipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eq_part" (
    "id" TEXT NOT NULL,
    "id_equipment" TEXT NOT NULL,
    "id_part" VARCHAR(200),
    "nama_part" VARCHAR(200),
    "keterangan_part" "Keterangan_Part",
    "part_img" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" TIMESTAMP(3),

    CONSTRAINT "eq_part_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eqandpart" (
    "id" TEXT NOT NULL,
    "id_equipment" TEXT NOT NULL,
    "id_part" TEXT NOT NULL,
    "id_quotation" TEXT NOT NULL,
    "qty" INTEGER NOT NULL DEFAULT 0,
    "keterangan" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" TIMESTAMP(3),

    CONSTRAINT "eqandpart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Material" (
    "id" TEXT NOT NULL,
    "nama_type" VARCHAR(200),
    "material_name" VARCHAR(200),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" TIMESTAMP(3),

    CONSTRAINT "Material_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Material_Spek" (
    "id" TEXT NOT NULL,
    "materialId" TEXT,
    "jumlah" VARCHAR(200),
    "unit" VARCHAR(200),
    "detail" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" TIMESTAMP(3),

    CONSTRAINT "Material_Spek_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Supplier" (
    "id" TEXT NOT NULL,
    "type_supplier" "type_sup" NOT NULL,
    "id_sup" VARCHAR(200),
    "supplier_name" VARCHAR(200),
    "addresses_sup" TEXT,
    "provinces" VARCHAR(100),
    "cities" VARCHAR(100),
    "districts" VARCHAR(100),
    "sub_districts" VARCHAR(100),
    "ec_postalcode" INTEGER DEFAULT 0,
    "office_email" TEXT,
    "NPWP" VARCHAR(200),
    "ppn" INTEGER DEFAULT 0,
    "pph" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" TIMESTAMP(3),

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupplierContact" (
    "id" TEXT NOT NULL,
    "contact_person" VARCHAR(100),
    "email_person" VARCHAR(100),
    "phone" VARCHAR(50),
    "supplierId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" TIMESTAMP(3),

    CONSTRAINT "SupplierContact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupplierBank" (
    "id" TEXT NOT NULL,
    "account_name" VARCHAR(100),
    "bank_name" VARCHAR(100),
    "rekening" VARCHAR(100),
    "supplierId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" TIMESTAMP(3),

    CONSTRAINT "SupplierBank_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quotations" (
    "id" TEXT NOT NULL,
    "quo_num" VARCHAR(200),
    "quo_auto" VARCHAR(200),
    "customerId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "deskription" TEXT,
    "quo_img" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" TIMESTAMP(3),
    "customerContactId" TEXT NOT NULL,

    CONSTRAINT "Quotations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quotations_Detail" (
    "id" TEXT NOT NULL,
    "item_of_work" VARCHAR(200),
    "volume" INTEGER DEFAULT 0,
    "unit" VARCHAR(20),
    "quo_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" TIMESTAMP(3),

    CONSTRAINT "Quotations_Detail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerPo" (
    "id" TEXT NOT NULL,
    "id_po" VARCHAR(100),
    "po_num_auto" VARCHAR(200),
    "quo_id" TEXT NOT NULL,
    "tax" "Tax",
    "noted" TEXT,
    "vat" TEXT NOT NULL,
    "grand_tot" TEXT NOT NULL,
    "total" TEXT NOT NULL,
    "date_of_po" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" TIMESTAMP(3),

    CONSTRAINT "CustomerPo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Deskription_CusPo" (
    "id" TEXT NOT NULL,
    "cuspoId" TEXT NOT NULL,
    "qty" INTEGER DEFAULT 0,
    "unit" VARCHAR(50),
    "price" TEXT,
    "discount" TEXT,
    "total" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" TIMESTAMP(3),

    CONSTRAINT "Deskription_CusPo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "term_of_pay" (
    "id" TEXT NOT NULL,
    "cuspoId" TEXT NOT NULL,
    "limitpay" "Limit_Pay",
    "percent" INTEGER DEFAULT 0,
    "price" TEXT,
    "date_limit" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" TIMESTAMP(3),

    CONSTRAINT "term_of_pay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wor" (
    "id" TEXT NOT NULL,
    "job_no" VARCHAR(200),
    "date_wor" TIMESTAMP(3),
    "cuspoId" TEXT NOT NULL,
    "subject" VARCHAR(200),
    "job_desk" TEXT,
    "contract_no_spk" VARCHAR(100),
    "employeeId" TEXT NOT NULL,
    "value_contract" TEXT,
    "priority_status" "Priority_Status",
    "qty" INTEGER DEFAULT 0,
    "unit" VARCHAR(20),
    "date_of_order" TIMESTAMP(3),
    "delivery_date" TIMESTAMP(3),
    "shipping_address" TEXT,
    "estimated_man_our" INTEGER DEFAULT 0,
    "eq_model" VARCHAR(100),
    "eq_mfg" VARCHAR(100),
    "eq_rotation" VARCHAR(200),
    "eq_power" VARCHAR(200),
    "scope_of_work" TEXT,
    "file_list" TEXT,
    "noted" TEXT,
    "status" VARCHAR(20),
    "refivision" VARCHAR(20),
    "refevision_desc" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" TIMESTAMP(3),
    "quotationsId" TEXT,

    CONSTRAINT "wor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "srimg" (
    "id" TEXT NOT NULL,
    "id_summary" VARCHAR(200),
    "date_of_summary" TIMESTAMP(3),
    "worId" TEXT,
    "ioem" VARCHAR(100),
    "isr" VARCHAR(100),
    "itn" VARCHAR(100),
    "introduction" TEXT,
    "inimg" VARCHAR(100),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" TIMESTAMP(3),

    CONSTRAINT "srimg_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "srimgdetail" (
    "id" TEXT NOT NULL,
    "name_part" VARCHAR(100),
    "srId" TEXT,
    "qty" INTEGER NOT NULL,
    "input_finding" TEXT,
    "choice" "choice",
    "noted" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" TIMESTAMP(3),

    CONSTRAINT "srimgdetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "imgSummary" (
    "id" TEXT NOT NULL,
    "srimgdetailId" TEXT,
    "img" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" TIMESTAMP(3),

    CONSTRAINT "imgSummary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workCenter" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(20),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" TIMESTAMP(3),

    CONSTRAINT "workCenter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dispacth" (
    "id" TEXT NOT NULL,
    "srId" TEXT NOT NULL,
    "id_dispatch" VARCHAR(20),
    "dispacth_date" TIMESTAMP(3) NOT NULL,
    "remark" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" TIMESTAMP(3),

    CONSTRAINT "dispacth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dispatchDetail" (
    "id" TEXT NOT NULL,
    "dispacthID" TEXT NOT NULL,
    "workId" TEXT NOT NULL,
    "subdepId" TEXT NOT NULL,
    "part" VARCHAR(100),
    "start" TIMESTAMP(3),
    "finish" TIMESTAMP(3),
    "actual" TIMESTAMP(3),
    "operatorID" TEXT NOT NULL,
    "approvebyID" TEXT,
    "remark" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" TIMESTAMP(3),

    CONSTRAINT "dispatchDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "masterAktivitas" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" TIMESTAMP(3),

    CONSTRAINT "masterAktivitas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "timeschedule" (
    "id" TEXT NOT NULL,
    "idTs" VARCHAR(100),
    "timesch" TIMESTAMP(3) NOT NULL,
    "worId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" TIMESTAMP(3),

    CONSTRAINT "timeschedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "aktivitas" (
    "id" TEXT NOT NULL,
    "timeId" TEXT NOT NULL,
    "aktivitasId" TEXT NOT NULL,
    "days" INTEGER NOT NULL,
    "startday" TIMESTAMP(3) NOT NULL,
    "endday" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" TIMESTAMP(3),

    CONSTRAINT "aktivitas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "holidayTms" (
    "id" TEXT NOT NULL,
    "date_holiday" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" TIMESTAMP(3),

    CONSTRAINT "holidayTms_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "role_role_name_idx" ON "role"("role_name");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_id_card_key" ON "Employee"("id_card");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_nick_name_key" ON "Employee"("nick_name");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_email_key" ON "Employee"("email");

-- CreateIndex
CREATE INDEX "Employee_id_nick_name_NIK_id_card_NIP_employee_name_idx" ON "Employee"("id", "nick_name", "NIK", "id_card", "NIP", "employee_name");

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE INDEX "user_id_idx" ON "user"("id");

-- CreateIndex
CREATE UNIQUE INDEX "session_username_key" ON "session"("username");

-- CreateIndex
CREATE INDEX "session_username_idx" ON "session"("username");

-- CreateIndex
CREATE UNIQUE INDEX "customer_email_key" ON "customer"("email");

-- CreateIndex
CREATE INDEX "customer_id_custom_name_idx" ON "customer"("id_custom", "name");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerContact_email_person_key" ON "CustomerContact"("email_person");

-- CreateIndex
CREATE INDEX "CustomerContact_id_contact_person_idx" ON "CustomerContact"("id", "contact_person");

-- CreateIndex
CREATE INDEX "CustomerAddress_id_address_person_idx" ON "CustomerAddress"("id", "address_person");

-- CreateIndex
CREATE INDEX "Departement_id_name_idx" ON "Departement"("id", "name");

-- CreateIndex
CREATE INDEX "Educational_Employee_id_school_name_idx" ON "Educational_Employee"("id", "school_name");

-- CreateIndex
CREATE INDEX "Certificate_Employee_id_certificate_name_idx" ON "Certificate_Employee"("id", "certificate_name");

-- CreateIndex
CREATE INDEX "Equipment_id_nama_id_equipment_idx" ON "Equipment"("id", "nama", "id_equipment");

-- CreateIndex
CREATE INDEX "eq_part_id_nama_part_idx" ON "eq_part"("id", "nama_part");

-- CreateIndex
CREATE INDEX "Material_id_nama_type_material_name_idx" ON "Material"("id", "nama_type", "material_name");

-- CreateIndex
CREATE INDEX "Material_Spek_id_detail_materialId_idx" ON "Material_Spek"("id", "detail", "materialId");

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_office_email_key" ON "Supplier"("office_email");

-- CreateIndex
CREATE INDEX "Supplier_id_id_sup_supplier_name_idx" ON "Supplier"("id", "id_sup", "supplier_name");

-- CreateIndex
CREATE UNIQUE INDEX "SupplierContact_email_person_key" ON "SupplierContact"("email_person");

-- CreateIndex
CREATE INDEX "SupplierContact_id_contact_person_idx" ON "SupplierContact"("id", "contact_person");

-- CreateIndex
CREATE INDEX "SupplierBank_id_account_name_bank_name_idx" ON "SupplierBank"("id", "account_name", "bank_name");

-- CreateIndex
CREATE INDEX "Quotations_id_quo_num_idx" ON "Quotations"("id", "quo_num");

-- CreateIndex
CREATE INDEX "Quotations_Detail_id_item_of_work_idx" ON "Quotations_Detail"("id", "item_of_work");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerPo_quo_id_key" ON "CustomerPo"("quo_id");

-- CreateIndex
CREATE INDEX "CustomerPo_id_id_po_idx" ON "CustomerPo"("id", "id_po");

-- CreateIndex
CREATE INDEX "Deskription_CusPo_id_cuspoId_idx" ON "Deskription_CusPo"("id", "cuspoId");

-- CreateIndex
CREATE INDEX "term_of_pay_id_cuspoId_idx" ON "term_of_pay"("id", "cuspoId");

-- CreateIndex
CREATE INDEX "wor_id_job_no_idx" ON "wor"("id", "job_no");

-- CreateIndex
CREATE UNIQUE INDEX "srimg_worId_key" ON "srimg"("worId");

-- CreateIndex
CREATE INDEX "srimg_id_worId_idx" ON "srimg"("id", "worId");

-- CreateIndex
CREATE INDEX "srimgdetail_id_name_part_idx" ON "srimgdetail"("id", "name_part");

-- CreateIndex
CREATE INDEX "imgSummary_id_img_idx" ON "imgSummary"("id", "img");

-- CreateIndex
CREATE INDEX "workCenter_id_name_idx" ON "workCenter"("id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "dispacth_srId_key" ON "dispacth"("srId");

-- CreateIndex
CREATE INDEX "dispacth_id_id_dispatch_idx" ON "dispacth"("id", "id_dispatch");

-- CreateIndex
CREATE INDEX "dispatchDetail_id_part_idx" ON "dispatchDetail"("id", "part");

-- CreateIndex
CREATE INDEX "masterAktivitas_id_name_idx" ON "masterAktivitas"("id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "timeschedule_worId_key" ON "timeschedule"("worId");

-- CreateIndex
CREATE INDEX "timeschedule_id_idTs_idx" ON "timeschedule"("id", "idTs");

-- CreateIndex
CREATE INDEX "aktivitas_id_idx" ON "aktivitas"("id");

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_subdepartId_fkey" FOREIGN KEY ("subdepartId") REFERENCES "sub_depart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userRole" ADD CONSTRAINT "userRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userRole" ADD CONSTRAINT "userRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_username_fkey" FOREIGN KEY ("username") REFERENCES "user"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerContact" ADD CONSTRAINT "CustomerContact_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerAddress" ADD CONSTRAINT "CustomerAddress_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sub_depart" ADD CONSTRAINT "sub_depart_deptId_fkey" FOREIGN KEY ("deptId") REFERENCES "Departement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Educational_Employee" ADD CONSTRAINT "Educational_Employee_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certificate_Employee" ADD CONSTRAINT "Certificate_Employee_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee_Child" ADD CONSTRAINT "Employee_Child_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eq_part" ADD CONSTRAINT "eq_part_id_equipment_fkey" FOREIGN KEY ("id_equipment") REFERENCES "Equipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eqandpart" ADD CONSTRAINT "eqandpart_id_equipment_fkey" FOREIGN KEY ("id_equipment") REFERENCES "Equipment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eqandpart" ADD CONSTRAINT "eqandpart_id_part_fkey" FOREIGN KEY ("id_part") REFERENCES "eq_part"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eqandpart" ADD CONSTRAINT "eqandpart_id_quotation_fkey" FOREIGN KEY ("id_quotation") REFERENCES "Quotations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Material_Spek" ADD CONSTRAINT "Material_Spek_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierContact" ADD CONSTRAINT "SupplierContact_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierBank" ADD CONSTRAINT "SupplierBank_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quotations" ADD CONSTRAINT "Quotations_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quotations" ADD CONSTRAINT "Quotations_customerContactId_fkey" FOREIGN KEY ("customerContactId") REFERENCES "CustomerContact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quotations_Detail" ADD CONSTRAINT "Quotations_Detail_quo_id_fkey" FOREIGN KEY ("quo_id") REFERENCES "Quotations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerPo" ADD CONSTRAINT "CustomerPo_quo_id_fkey" FOREIGN KEY ("quo_id") REFERENCES "Quotations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deskription_CusPo" ADD CONSTRAINT "Deskription_CusPo_cuspoId_fkey" FOREIGN KEY ("cuspoId") REFERENCES "CustomerPo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "term_of_pay" ADD CONSTRAINT "term_of_pay_cuspoId_fkey" FOREIGN KEY ("cuspoId") REFERENCES "CustomerPo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wor" ADD CONSTRAINT "wor_cuspoId_fkey" FOREIGN KEY ("cuspoId") REFERENCES "CustomerPo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wor" ADD CONSTRAINT "wor_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wor" ADD CONSTRAINT "wor_quotationsId_fkey" FOREIGN KEY ("quotationsId") REFERENCES "Quotations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "srimg" ADD CONSTRAINT "srimg_worId_fkey" FOREIGN KEY ("worId") REFERENCES "wor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "srimgdetail" ADD CONSTRAINT "srimgdetail_srId_fkey" FOREIGN KEY ("srId") REFERENCES "srimg"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "imgSummary" ADD CONSTRAINT "imgSummary_srimgdetailId_fkey" FOREIGN KEY ("srimgdetailId") REFERENCES "srimgdetail"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dispacth" ADD CONSTRAINT "dispacth_srId_fkey" FOREIGN KEY ("srId") REFERENCES "srimg"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dispatchDetail" ADD CONSTRAINT "dispatchDetail_dispacthID_fkey" FOREIGN KEY ("dispacthID") REFERENCES "dispacth"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dispatchDetail" ADD CONSTRAINT "dispatchDetail_workId_fkey" FOREIGN KEY ("workId") REFERENCES "workCenter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dispatchDetail" ADD CONSTRAINT "dispatchDetail_subdepId_fkey" FOREIGN KEY ("subdepId") REFERENCES "sub_depart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dispatchDetail" ADD CONSTRAINT "dispatchDetail_operatorID_fkey" FOREIGN KEY ("operatorID") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dispatchDetail" ADD CONSTRAINT "dispatchDetail_approvebyID_fkey" FOREIGN KEY ("approvebyID") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timeschedule" ADD CONSTRAINT "timeschedule_worId_fkey" FOREIGN KEY ("worId") REFERENCES "wor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aktivitas" ADD CONSTRAINT "aktivitas_timeId_fkey" FOREIGN KEY ("timeId") REFERENCES "timeschedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aktivitas" ADD CONSTRAINT "aktivitas_aktivitasId_fkey" FOREIGN KEY ("aktivitasId") REFERENCES "masterAktivitas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;