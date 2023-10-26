import { Request, Response } from "express";
import prisma from "../middleware/supplier";
import pagging from "../utils/paggination";
import url from "url";

const getSupplier = async (request: Request, response: Response) => {
  try {
    const pencarian: any = request.query.search || "";
    const hostname: any = request.headers.host;
    const pathname = url.parse(request.url).pathname;
    const page: any = request.query.page;
    const perPage: any = request.query.perPage;
    const pagination: any = new pagging(page, perPage, hostname, pathname);
    const supplierCount = await prisma.supplier.count({
      where: {
        deleted: null,
      },
    });
    let results;
    if (request.query.page === undefined) {
      results = await prisma.supplier.findMany({
        include: {
          SupplierBank: true,
          SupplierContact: true,
        },
      });
    } else {
      results = await prisma.supplier.findMany({
        where: {
          supplier_name: {
            contains: pencarian,
            mode: "insensitive"
          },
        },
        include: {
          SupplierBank: true,
          SupplierContact: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: parseInt(pagination.perPage),
        skip: parseInt(pagination.page) * parseInt(pagination.perPage),
      });
    }
    if (results.length > 0) {
      return response.status(200).json({
        success: true,
        massage: "Get All Supplier",
        result: results,
        page: pagination.page,
        limit: pagination.perPage,
        totalData: supplierCount,
        currentPage: pagination.currentPage,
        nextPage: pagination.next(),
        previouspage: pagination.prev(),
      });
    } else {
      return response.status(200).json({
        success: false,
        massage: "No data",
        totalData: 0,
        result: [],
      });
    }
  } catch (error) {
    response.status(500).json({ massage: error.message, code: error }); // this will log any error that prisma throws + typesafety. both code and message are a string
  }
};

const createSupplier = async (request: Request, response: Response) => {
  try {
    const results = await prisma.supplier.create({
      data: {
        type_supplier: request.body.type_supplier,
        id_sup: request.body.id_sup,
        supplier_name: request.body.supplier_name,
        addresses_sup: request.body.addresses_sup,
        provinces: request.body.provinces,
        cities: request.body.cities,
        districts: request.body.districts,
        sub_districts: request.body.sub_districts,
        ec_postalcode: request.body.ec_postalcode,
        office_email: request.body.office_email,
        NPWP: request.body.NPWP,
        ppn: request.body.ppn,
        pph: request.body.pph,
        SupplierContact: {
          create: request.body.SupplierContact,
        },
        SupplierBank: {
          create: request.body.SupplierBank,
        },
      },
      include: {
        SupplierContact: true,
        SupplierBank: true,
      },
    });
    if (results) {
      response.status(201).json({
        success: true,
        massage: "Success Add Data",
        results: results,
      });
    } else {
      response.status(400).json({
        success: false,
        massage: "Unsuccess Add Data",
      });
    }
  } catch (error) {
    response.status(500).json({ massage: error.message, code: error }); // this will log any error that prisma throws + typesafety. both code and message are a string
  }
};

const updateSupplier = async (request: Request, response: Response) => {
  try {
    const id: string = request.params.id;
    const updateSupplier = await prisma.supplier.update({
      where: {
        id: id,
      },
      data: request.body,
    });
    if (updateSupplier) {
      response.status(201).json({
        success: true,
        massage: "Success Update Data",
        results: updateSupplier,
      });
    } else {
      response.status(400).json({
        success: false,
        massage: "Unsuccess Update Data",
      });
    }
  } catch (error) {
    response.status(500).json({ massage: error.message, code: error }); // this will log any error that prisma throws + typesafety. both code and message are a string
  }
};

const updateSupplierContact = async (request: Request, response: Response) => {
  try {
    const updateVerify = request.body.map(
      (updateByveri: {
        contact_person: any;
        email_person: any;
        phone: any;
        supplierId: any;
        id: any;
      }) => {
        return {
          contact_person: updateByveri.contact_person,
          email_person: updateByveri.email_person,
          phone: updateByveri.phone,
          supplierId: updateByveri.supplierId,
          id: updateByveri.id,
        };
      }
    );
    let result: any = [];
    for (let i = 0; i < updateVerify.length; i++) {
      const updateSupplierContact = await prisma.supplierContact.upsert({
        where: {
          id: updateVerify[i].id,
        },
        create: {
          contact_person: updateVerify[i].contact_person,
          email_person: updateVerify[i].email_person,
          phone: updateVerify[i].phone,
          supplier: { connect: { id: updateVerify[i].supplierId } },
        },
        update: {
          contact_person: updateVerify[i].contact_person,
          email_person: updateVerify[i].email_person,
          phone: updateVerify[i].phone,
          supplier: { connect: { id: updateVerify[i].supplierId } },
        },
      });
      result = [...result, updateSupplierContact];
    }
    if (result) {
      response.status(201).json({
        success: true,
        massage: "Success Update Data",
        result: result,
      });
    } else {
      response.status(400).json({
        success: false,
        massage: "Unsuccess Update Data",
      });
    }
  } catch (error) {
    response.status(500).json({ massage: error.message, code: error }); // this will log any error that prisma throws + typesafety. both code and message are a string
  }
};

const updateSupplierBank = async (request: Request, response: Response) => {
  try {
    const updateVerify = request.body.map(
      (updateByveri: {
        account_name: any;
        bank_name: any;
        rekening: any;
        supplierId: any;
        id: any;
      }) => {
        return {
          account_name: updateByveri.account_name,
          bank_name: updateByveri.bank_name,
          rekening: updateByveri.rekening,
          supplierId: updateByveri.supplierId,
          id: updateByveri.id,
        };
      }
    );
    let result: any = [];
    for (let i = 0; i < updateVerify.length; i++) {
      const updateSupplierBank = await prisma.supplierBank.upsert({
        where: {
          id: updateVerify[i].id,
        },
        create: {
          account_name: updateVerify[i].account_name,
          bank_name: updateVerify[i].bank_name,
          rekening: updateVerify[i].rekening,
          supplier: { connect: { id: updateVerify[i].supplierId } },
        },
        update: {
          account_name: updateVerify[i].account_name,
          bank_name: updateVerify[i].bank_name,
          rekening: updateVerify[i].rekening,
          supplier: { connect: { id: updateVerify[i].supplierId } },
        },
      });
      result = [...result, updateSupplierBank];
    }
    if (result) {
      response.status(201).json({
        success: true,
        massage: "Success Update Data",
        result: result,
      });
    } else {
      response.status(400).json({
        success: false,
        massage: "Unsuccess Update Data",
      });
    }
  } catch (error) {
    response.status(500).json({ massage: error.message, code: error }); // this will log any error that prisma throws + typesafety. both code and message are a string
  }
};

const deleteSupplier = async (request: Request, response: Response) => {
  try {
    const id: string = request.params.id;
    const deleteSupplier = await prisma.supplier.delete({
      where: {
        id: id,
      },
    });
    if (deleteSupplier) {
      response.status(201).json({
        success: true,
        massage: "Success Delete Data",
        results: deleteSupplier,
      });
    } else {
      response.status(400).json({
        success: false,
        massage: "Unsuccess Delete Data",
      });
    }
  } catch (error) {
    response.status(500).json({ massage: error.message, code: error }); // this will log any error that prisma throws + typesafety. both code and message are a string
  }
};

export default {
  getSupplier,
  createSupplier,
  updateSupplier,
  updateSupplierContact,
  updateSupplierBank,
  deleteSupplier,
};
