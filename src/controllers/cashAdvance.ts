import { Request, Response } from "express";
import prisma from "../middleware/cashAdvance";
import pagging from "../utils/paggination";
import url from "url";

const getEmployeeCdv = async (request: Request, response: Response) => {
  try {
    const results = await prisma.employee.findMany({
      select: {
        id: true,
        employee_name: true,
        position: true,
        sub_depart: {
          select: {
            departement: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    if (results.length > 0) {
      return response.status(200).json({
        success: true,
        massage: "Get All Employee Cash Adv",
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

const getWorCdv = async (request: Request, response: Response) => {
  try {
    const results = await prisma.wor.findMany({
      select: {
        id: true,
        job_no: true,
        subject: true,
        customerPo: {
          select: {
            quotations: {
              select: {
                Customer: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
      where: {
        job_operational: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    if (results.length > 0) {
      return response.status(200).json({
        success: true,
        massage: "Get All Employee Cash Adv",
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

const createCdv = async (request: Request, response: Response) => {
  try {
    const results = await prisma.cash_advance.create({
      data: {
        id_cash_advance: request.body.id_cash_advance,
        employee: { connect: { id: request.body.employeeId } },
        wor: { connect: { id: request.body.worId } },
        user: { connect: { id: request.body.userId } },
        status_payment: request.body.status_payment,
        total: request.body.total,
        description: request.body.description,
        note: request.body.note,
        date_cash_advance: request.body.date_cash_advance,
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

const updateStatusSpv = async (request: any, response: Response) => {
  try {
    const id = request.params.id;
    const userLogin = await prisma.user.findFirst({
      where: {
        username: request.session.userId,
      },
    });
    const a: any = userLogin?.employeeId;
    const emplo = await prisma.employee.findFirst({
      where: {
        id: a,
      },
    });
    const statusPenc = await prisma.cash_advance.findFirst({
      where: {
        id: id,
      },
    });
    let result;
    if (
      (emplo?.position === "Supervisor" &&
        statusPenc?.status_valid_spv === null) ||
      statusPenc?.status_valid_spv === false
    ) {
      result = await prisma.cash_advance.update({
        where: { id: id },
        data: {
          status_valid_spv: true,
        },
      });
    } else {
      result = await prisma.cash_advance.update({
        where: { id: id },
        data: {
          status_valid_spv: false,
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

const updateStatusM = async (request: any, response: Response) => {
  try {
    const id = request.params.id;
    const userLogin = await prisma.user.findFirst({
      where: {
        username: request.session.userId,
      },
    });
    const a: any = userLogin?.employeeId;
    const emplo = await prisma.employee.findFirst({
      where: {
        id: a,
      },
    });
    const statusPenc = await prisma.cash_advance.findFirst({
      where: {
        id: id,
      },
    });
    let result;
    if (
      (emplo?.position === "Manager" &&
        statusPenc?.status_valid_manager === null) ||
      statusPenc?.status_valid_manager === false
    ) {
      result = await prisma.cash_advance.update({
        where: { id: id },
        data: {
          status_valid_manager: true,
        },
      });
    } else {
      result = await prisma.cash_advance.update({
        where: { id: id },
        data: {
          status_valid_manager: false,
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

export default {
  getEmployeeCdv,
  getWorCdv,
  createCdv,
  updateStatusSpv,
  updateStatusM,
};
