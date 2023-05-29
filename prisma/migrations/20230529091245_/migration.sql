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
CREATE TABLE "Type_Mr" (
    "id" TEXT NOT NULL,
    "nama_jenis" VARCHAR(200),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" TIMESTAMP(3),

    CONSTRAINT "Type_Mr_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Material_Name" (
    "id" TEXT NOT NULL,
    "typeId" TEXT NOT NULL,
    "material_name" VARCHAR(200),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" TIMESTAMP(3),

    CONSTRAINT "Material_Name_pkey" PRIMARY KEY ("id")
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
    "noted" VARCHAR(200),
    "status" VARCHAR(20),
    "refivision" VARCHAR(20),
    "refevision_desc" VARCHAR(225),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" TIMESTAMP(3),
    "quotationsId" TEXT,

    CONSTRAINT "wor_pkey" PRIMARY KEY ("id")
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
CREATE INDEX "Type_Mr_id_nama_jenis_idx" ON "Type_Mr"("id", "nama_jenis");

-- CreateIndex
CREATE INDEX "Material_Name_id_material_name_idx" ON "Material_Name"("id", "material_name");

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
CREATE INDEX "wor_id_job_no_idx" ON "wor"("id", "job_no");

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
ALTER TABLE "Material_Name" ADD CONSTRAINT "Material_Name_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "Type_Mr"("id") ON DELETE CASCADE ON UPDATE CASCADE;

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
