import { Request, Response } from "express";
import prisma from "../middleware/wor";
import pagging from "../utils/paggination";
import url from "url";

const getWor = async (request: Request, response: Response) => {
  try {
    const pencarian: any = request.query.search || "";
    const hostname: any = request.headers.host;
    const pathname = url.parse(request.url).pathname;
    const page: any = request.query.page;
    const perPage: any = request.query.perPage;
    const pagination: any = new pagging(page, perPage, hostname, pathname);
    const worCount = await prisma.wor.count({
      where: {
        deleted: null,
      },
    });
    let results;
    if (request.query.page === undefined) {
      results = await prisma.wor.findMany({
        where: {
          job_no: {
            contains: "",
          },
        },
      });
    } else {
      results = await prisma.wor.findMany({
        where: {
          job_no: {
            contains: pencarian,
          },
        },
        include: {
          customerPo: {
            include: {
              quotations: {
                include: {
                  CustomerContact: true,
                  Customer: {
                    include: {
                      address: true,
                    },
                  },
                  eqandpart: {
                    include: {
                      equipment: true,
                      eq_part: true,
                    },
                  },
                },
              },
            },
          },
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
        massage: "Get All Wor",
        result: results,
        page: pagination.page,
        limit: pagination.perPage,
        totalData: worCount,
        currentPage: pagination.currentPage,
        nextPage: pagination.next(),
        previouspage: pagination.prev(),
      });
    } else {
      return response.status(200).json({
        success: false,
        massage: "No data",
        result: [],
      });
    }
  } catch (error) {
    response.status(500).json({ massage: error.message, code: error }); // this will log any error that prisma throws + typesafety. both code and message are a string
  }
};

const getWorStatus = async (request: Request, response: Response) => {
  try {
    const pencarian: any = request.query.search || "";
    const hostname: any = request.headers.host;
    const pathname = url.parse(request.url).pathname;
    const page: any = request.query.page;
    const perPage: any = request.query.perPage;
    const pagination: any = new pagging(page, perPage, hostname, pathname);
    const worCount = await prisma.wor.count({
      where: {
        deleted: null,
        status: pencarian,
      },
    });

    let statusPenc: any = [];
    statusPenc = await prisma.wor.findMany({
      where: {
        status: pencarian,
      },
    });
    statusPenc.forEach((e: any) => {
      statusPenc = e;
    });

    let result: any = [];
    if (statusPenc.status === "valid") {
      result = await prisma.wor.findMany({
        where: {
          status: "valid",
        },
        orderBy: {
          createdAt: "desc",
        },
        take: parseInt(pagination.perPage),
        skip: parseInt(pagination.page) * parseInt(pagination.perPage),
      });
    } else if (statusPenc.status === "unvalid") {
      result = await prisma.wor.findMany({
        where: {
          status: "unvalid",
        },
        include: {
          customerPo: {
            include: {
              quotations: {
                include: {
                  CustomerContact: true,
                  Customer: {
                    include: {
                      address: true,
                    },
                  },
                  eqandpart: {
                    include: {
                      equipment: true,
                      eq_part: true,
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: parseInt(pagination.perPage),
        skip: parseInt(pagination.page) * parseInt(pagination.perPage),
      });
    }
    result.forEach((e: any) => {
      result = e;
    });
    if (result.status === "valid" || result.status === "unvalid") {
      return response.status(200).json({
        success: true,
        massage: "Get All Wor",
        result: result,
        page: pagination.page,
        limit: pagination.perPage,
        totalData: worCount,
        currentPage: pagination.currentPage,
        nextPage: pagination.next(),
        previouspage: pagination.prev(),
      });
    } else if (result.status === undefined) {
      return response.status(200).json({
        success: false,
        massage: "No data",
        result: [],
      });
    }
  } catch (error) {
    response.status(500).json({ massage: error.message, code: error }); // this will log any error that prisma throws + typesafety. both code and message are a string
  }
};

const createWor = async (request: any, response: Response) => {
  try {
    if (!request.file) {
      response.status(204).json({ msg: "img not found" });
    }
    const results = await prisma.wor.create({
      data: {
        job_no: request.body.job_no,
        date_wor: new Date(request.body.date_wor),
        customerPo: { connect: { id: request.body.cuspoId } },
        subject: request.body.subject,
        job_desk: request.body.job_desk,
        contract_no_spk: request.body.contract_no_spk,
        employee: { connect: { id: request.body.employeeId } },
        value_contract: request.body.value_contract,
        priority_status: request.body.priority_status,
        qty: parseInt(request.body.qty),
        unit: request.body.unit,
        date_of_order: new Date(request.body.date_of_order),
        delivery_date: new Date(request.body.delivery_date),
        shipping_address: request.body.shipping_address,
        estimated_man_our: parseInt(request.body.estimated_man_our),
        eq_model: request.body.eq_model,
        eq_mfg: request.body.eq_mfg,
        eq_rotation: request.body.eq_rotation,
        eq_power: request.body.eq_power,
        scope_of_work: request.body.scope_of_work,
        file_list: request.file.path,
        noted: request.body.noted,
        status: request.body.status,
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

const updateWor = async (request: Request, response: Response) => {
  try {
    const id: string = request.params.id;
    const updateWor = await prisma.wor.update({
      where: {
        id: id,
      },
      data: {
        job_no: request.body.job_no,
        date_wor: new Date(request.body.date_wor),
        customerPo: { connect: { id: request.body.cuspoId } },
        subject: request.body.subject,
        job_desk: request.body.job_desk,
        contract_no_spk: request.body.contract_no_spk,
        employee: { connect: { id: request.body.employeeId } },
        value_contract: request.body.value_contract,
        priority_status: request.body.priority_status,
        qty: parseInt(request.body.qty),
        unit: request.body.unit,
        date_of_order: new Date(request.body.date_of_order),
        delivery_date: new Date(request.body.delivery_date),
        shipping_address: request.body.shipping_address,
        estimated_man_our: parseInt(request.body.estimated_man_our),
        eq_mfg: request.body.eeq_mfg,
        eq_model: request.body.eq_model,
        eq_rotation: request.body.eq_rotation,
        eq_power: request.body.eq_power,
        scope_of_work: request.body.scope_of_work,
        file_list: !request.file ? request.body.file_list : request.file.path,
        noted: request.body.noted,
        status: request.body.status,
        refivision: request.body.refivision,
        refevision_desc: request.body.refevision_desc,
      },
    });
    if (updateWor) {
      response.status(201).json({
        success: true,
        massage: "Success Update Data",
        results: updateWor,
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

const updateWorStatus = async (request: Request, response: Response) => {
  try {
    const r = Math.floor(Math.random() * 10000);

    const d = new Date();
    let year = d.getUTCFullYear().toString().substring(2);

    const genarate = year + '.' + r
    const id = request.params.id;
    const statusPenc = await prisma.wor.findFirst({
      where: {
        id: id,
      },
    });

    let result;
    if (statusPenc?.status === "" || statusPenc?.status === "unvalid") {
      const id = request.params.id;
      result = await prisma.wor.update({
        where: { id: id },
        data: {
          status: "valid",
          job_no: statusPenc.status === "" ? genarate : statusPenc.status
        },
      });
    } else {
      result = await prisma.wor.update({
        where: { id: id },
        data: {
          status: "unvalid",
        },
      });
    }
    if (result) {
      response.status(201).json({
        success: true,
        massage: "Success Update Data",
        results: result,
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

const deleteWor = async (request: Request, response: Response) => {
  try {
    const id: string = request.params.id;
    const deleteWor = await prisma.wor.delete({
      where: {
        id: id,
      },
    });
    if (deleteWor) {
      response.status(201).json({
        success: true,
        massage: "Success Delete Data",
        results: deleteWor,
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
  getWor,
  getWorStatus,
  createWor,
  updateWor,
  updateWorStatus,
  deleteWor,
};
