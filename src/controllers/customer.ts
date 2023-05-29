import { Request, Response } from "express";
import prisma from "../middleware/customer";
import pagging from "../utils/paggination";
import url from "url";

const getCustomer = async (request: Request, response: Response) => {
  try {
    const pencarian: any = request.query.search || "";
    const hostname: any = request.headers.host;
    const pathname = url.parse(request.url).pathname;
    const page: any = request.query.page;
    const perPage: any = request.query.perPage;
    const pagination: any = new pagging(page, perPage, hostname, pathname);
    const customerCount = await prisma.customer.count({
      where: {
        deleted: null,
      },
    });
    let results;
    if (request.query.page === undefined) {
      results = await prisma.customer.findMany({
        where: {
          name: {
            contains: "",
          },
        },
        include: {
          contact: true,
          address: true,
        },
      });
    } else {
      results = await prisma.customer.findMany({
        where: {
          name: {
            contains: pencarian,
          },
        },
        include: {
          contact: true,
          address: true,
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
        massage: "Get All Customer",
        result: results,
        page: pagination.page,
        limit: pagination.perPage,
        totalData: customerCount,
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

const createCustomer = async (request: Request, response: Response) => {
  try {
    const results = await prisma.customer.create({
      data: {
        id_custom: request.body.id_custom,
        name: request.body.name,
        email: request.body.email,
        ppn: request.body.ppn,
        pph: request.body.pph,
        contact: {
          create: request.body.contact,
        },
        address: {
          create: request.body.address,
        },
      },
      include: {
        contact: true,
        address: true,
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

const createCsvNxlsx = async (request: any, response: Response) => {
  try {
    console.log(request.convData);
    const createManyCus = await prisma.customer.createMany({
      data: request.convData,
    });
    if (createManyCus) {
      response.send({ msg: "succes" });
    }
  } catch (error) {
    console.log(error);
  }
};

const updateCustomer = async (request: Request, response: Response) => {
  try {
    const id: string = request.params.id;
    const updateCustomer = await prisma.customer.update({
      where: {
        id: id,
      },
      data: request.body,
    });
    if (updateCustomer) {
      response.status(201).json({
        success: true,
        massage: "Success Update Data",
        results: updateCustomer,
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

const updateCustomerContact = async (request: Request, response: Response) => {
  try {
    const updateVerify = request.body.map(
      (updateByveri: {
        contact_person: any;
        email_person: any;
        phone: any;
        customerID: any;
        id: any;
      }) => {
        return {
          contact_person: updateByveri.contact_person,
          email_person: updateByveri.email_person,
          phone: updateByveri.phone,
          customerID: updateByveri.customerID,
          id: updateByveri.id,
        };
      }
    );
    let result: any = [];
    for (let i = 0; i < updateVerify.length; i++) {
      const updateCustomerContact = await prisma.customerContact.upsert({
        where: {
          id: updateVerify[i].id,
        },
        create: {
          contact_person: updateVerify[i].contact_person,
          email_person: updateVerify[i].email_person,
          phone: updateVerify[i].phone,
          customer: { connect: { id: updateVerify[i].customerID } },
        },
        update: {
          contact_person: updateVerify[i].contact_person,
          email_person: updateVerify[i].email_person,
          phone: updateVerify[i].phone,
        },
      });
      result = [...result, updateCustomerContact];
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

const updateCustomerAddress = async (request: Request, response: Response) => {
  try {
    const updateVerify = request.body.map(
      (updateByveri: {
        address_person: any;
        address_workshop: any;
        recipient_address: any;
        provinces: any;
        cities: any;
        districts: any;
        sub_districts: any;
        ec_postalcode: any;
        customerID: any;
        id: any;
      }) => {
        return {
          address_person: updateByveri.address_person,
          address_workshop: updateByveri.address_workshop,
          recipient_address: updateByveri.recipient_address,
          provinces: updateByveri.provinces,
          cities: updateByveri.cities,
          districts: updateByveri.districts,
          sub_districts: updateByveri.sub_districts,
          ec_postalcode: updateByveri.ec_postalcode,
          customerID: updateByveri.customerID,
          id: updateByveri.id,
        };
      }
    );

    let result: any = [];
    for (let i = 0; i < updateVerify.length; i++) {
      const updateCustomerAddress = await prisma.customerAddress.upsert({
        where: {
          id: updateVerify[i].id,
        },
        create: {
          address_person: updateVerify[i].address_person,
          address_workshop: updateVerify[i].address_workshop,
          recipient_address: updateVerify[i].recipient_address,
          provinces: updateVerify[i].provinces,
          cities: updateVerify[i].cities,
          districts: updateVerify[i].districts,
          sub_districts: updateVerify[i].sub_districts,
          ec_postalcode: updateVerify[i].ec_postalcode,
          customer: { connect: { id: updateVerify[i].customerID } },
        },
        update: {
          address_person: updateVerify[i].address_person,
          address_workshop: updateVerify[i].address_workshop,
          recipient_address: updateVerify[i].recipient_address,
          provinces: updateVerify[i].provinces,
          cities: updateVerify[i].cities,
          districts: updateVerify[i].districts,
          sub_districts: updateVerify[i].sub_districts,
          ec_postalcode: updateVerify[i].ec_postalcode,
        },
      });
      result = [...result, updateCustomerAddress];
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

const deleteCustomer = async (request: Request, response: Response) => {
  try {
    const id: string = request.params.id;
    const deleteCustomer = await prisma.customer.delete({
      where: {
        id: id,
      },
    });
    if (deleteCustomer) {
      response.status(201).json({
        success: true,
        massage: "Success Delete Data",
        results: deleteCustomer,
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
  getCustomer,
  createCustomer,
  createCsvNxlsx,
  updateCustomer,
  updateCustomerContact,
  updateCustomerAddress,
  deleteCustomer,
};
