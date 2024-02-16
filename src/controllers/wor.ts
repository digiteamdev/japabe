import { Request, Response } from "express";
import prisma from "../middleware/wor";
import pagging from "../utils/paggination";
import url from "url";

const getJobStatus = async (request: Request, response: Response) => {
  try {
    const pencarian: any = request.query.search || "";
    const hostname: any = request.headers.host;
    const pathname = url.parse(request.url).pathname;
    const page: any = request.query.page;
    const perPage: any = request.query.perPage;
    const pagination: any = new pagging(page, perPage, hostname, pathname);
    const worCount = await prisma.wor.count({
      where: {
        AND: [
          {
            status: "valid",
          },
          { deleted: null },
        ],
      },
    });
    const results = await prisma.wor.findMany({
      where: {
        AND: [
          {
            status: "valid",
          },
        ],
        job_no: {
          contains: pencarian,
          mode: "insensitive",
        },
      },
      include: {
        customerPo: {
          include: {
            quotations: {
              include: {
                Quotations_Detail: true,
                CustomerContact: true,
                Customer: {
                  include: {
                    address: true,
                  },
                },
                price_quotation: true,
              },
            },
          },
        },
        timeschedule: {
          include: {
            drawing: true,
            srimg: {
              include: {
                dispacth: true,
              },
            },
          },
        },
        employee: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: parseInt(pagination.perPage),
      skip: parseInt(pagination.page) * parseInt(pagination.perPage),
    });
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
        totalData: 0,
        result: [],
      });
    }
  } catch (error) {
    response.status(500).json({ massage: error.message, code: error }); // this will log any error that prisma throws + typesafety. both code and message are a string
  }
};

const getWor = async (request: Request, response: Response) => {
  try {
    const pencarian: any = request.query.search || "";
    const status: any = request.query.status || undefined;
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
    if (request.query.page === undefined && status != undefined) {
      results = await prisma.wor.findMany({
        where: {
          status: status,
          timeschedule: {
            deleted: null,
          },
          OR: [
            {
              timeschedule: {
                deleted: { not: null },
              },
            },
            {
              timeschedule: null,
            },
          ],
          NOT: {
            timeschedule: null,
          },
        },
        include: {
          customerPo: {
            include: {
              quotations: {
                include: {
                  Quotations_Detail: true,
                  CustomerContact: true,
                  Customer: {
                    include: {
                      address: true,
                    },
                  },
                  price_quotation: true,
                },
              },
            },
          },
          timeschedule: true,
          employee: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      results = await prisma.wor.findMany({
        where: {
          OR: [
            {
              job_no: {
                contains: pencarian,
                mode: "insensitive",
              },
            },
            {
              customerPo: {
                quotations: {
                  Customer: {
                    name: {
                      contains: pencarian,
                      mode: "insensitive",
                    },
                  },
                },
              },
            },
          ],
          NOT: {
            customerPo: null,
          },
        },
        include: {
          customerPo: {
            include: {
              quotations: {
                include: {
                  Quotations_Detail: true,
                  CustomerContact: true,
                  Customer: {
                    include: {
                      address: true,
                    },
                  },
                  price_quotation: true,
                },
              },
            },
          },
          timeschedule: {
            include: {
              drawing: true,
              srimg: {
                include: {
                  dispacth: true,
                },
              },
            },
          },
          employee: true,
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
        totalData: 0,
        result: [],
      });
    }
  } catch (error) {
    response.status(500).json({ massage: error.message, code: error }); // this will log any error that prisma throws + typesafety. both code and message are a string
  }
};

const getWorTimes = async (request: any, response: Response) => {
  try {
    const results = await prisma.wor.findMany({
      where: {
        OR: [
          {
            status: "valid",
          },
          {
            timeschedule: null,
          },
          {
            timeschedule: {
              deleted: null,
            },
          },
        ],
        NOT: [
          {
            timeschedule: {
              deleted: null,
            },
          },
          {
            status: null,
          },
        ],
      },
      include: {
        customerPo: {
          include: {
            quotations: {
              include: {
                Quotations_Detail: true,
                CustomerContact: true,
                Customer: {
                  include: {
                    address: true,
                  },
                },
                price_quotation: true,
              },
            },
          },
        },
        employee: true,
        timeschedule: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (results.length > 0) {
      return response.status(200).json({
        success: true,
        massage: "Get All Wor",
        result: results,
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

const createWor = async (request: any, response: Response) => {
  try {
    let results;
    if (request.body.cuspoId === null) {
      results = await prisma.wor.create({
        data: {
          job_no: request.body.job_no,
          date_wor: new Date(request.body.date_wor),
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
          file_list: !request.file ? null : request.file.path,
          noted: request.body.noted,
          status: request.body.status,
          job_operational: request.body.job_operational,
        },
      });
    } else {
      results = await prisma.wor.create({
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
          file_list: !request.file ? null : request.file.path,
          noted: request.body.noted,
          status: request.body.status,
          job_operational: request.body.job_operational,
        },
      });
    }
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
    let updateWor;
    if (request.body.cuspoId === null) {
      updateWor = await prisma.wor.update({
        where: {
          id: id,
        },
        data: {
          job_no: request.body.job_no,
          date_wor: new Date(request.body.date_wor),
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
    } else {
      updateWor = await prisma.wor.update({
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
    }
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
    const setNum = (num: any) => {
      return "00" + num;
    };
    const lastRes = await prisma.wor.findFirst({
      where: {
        status: "valid",
      },
      take: 1,
      orderBy: {
        updatedAt: "desc",
      },
    });
    const d = new Date();
    let year = d.getUTCFullYear().toString().substring(2);

    const count = lastRes?.job_no;
    const i: any = count?.substring(4);
    const autoIn: any = parseInt(i) + 1;

    const genarateS = "S" + year + setNum(0 + autoIn);
    const genarateMr = "B" + year + setNum(0 + autoIn);
    const generatJobS = "S" + year + setNum(0);
    const generatJobB = "B" + year + setNum(0);

    const id = request.params.id;
    const statusPenc = await prisma.wor.findFirst({
      where: {
        id: id,
      },
    });
    let result;
    if (statusPenc?.job_no === "" && statusPenc?.job_operational === "S") {
      const id = request.params.id;
      result = await prisma.wor.update({
        where: { id: id },
        data: {
          status: "valid",
          job_no:
            statusPenc.job_operational === "S"
              ? generatJobS
              : statusPenc.job_no,
        },
      });
    }
    if (statusPenc?.job_no === "" && statusPenc?.job_operational === "B") {
      const id = request.params.id;
      result = await prisma.wor.update({
        where: { id: id },
        data: {
          status: "valid",
          job_no:
            statusPenc.job_operational === "B"
              ? generatJobB
              : statusPenc.job_no,
        },
      });
    }
    if (statusPenc?.job_operational === "S" && lastRes) {
      const id = request.params.id;
      result = await prisma.wor.update({
        where: { id: id },
        data: {
          status: "valid",
          job_no:
            statusPenc.job_operational === "S" ? genarateS : statusPenc.job_no,
        },
      });
    } else if (statusPenc?.job_operational === "B" && lastRes) {
      result = await prisma.wor.update({
        where: { id: id },
        data: {
          status: "valid",
          job_no:
            statusPenc.job_operational === "B" ? genarateMr : statusPenc.job_no,
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
  getJobStatus,
  getWorTimes,
  createWor,
  updateWor,
  updateWorStatus,
  deleteWor,
};
