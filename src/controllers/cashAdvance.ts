import { Request, Response } from "express";
import prisma from "../middleware/cashAdvance";
import pagging from "../utils/paggination";
import url from "url";
import { Prisma } from "@prisma/client";

const getCdv = async (request: Request, response: Response) => {
  try {
    const pencarian: any = request.query.search || "";
    const hostname: any = request.headers.host;
    const pathname = url.parse(request.url).pathname;
    const page: any = request.query.page;
    const perPage: any = request.query.perPage;
    const pagination: any = new pagging(page, perPage, hostname, pathname);
    const cdvCount = await prisma.cash_advance.count({
      where: {
        deleted: null,
      },
    });
    let results: any;
    if (request.query.page === undefined) {
      results = await prisma.cash_advance.findMany({
        where: {
          id_cash_advance: {
            contains: pencarian,
          },
          id_spj: null,
        },
        include: {
          cdv_detail: true,
          employee: true,
          user: {
            select: {
              id: true,
              username: true,
              employee: {
                select: {
                  id: true,
                  employee_name: true,
                  position: true,
                },
              },
            },
          },
          wor: {
            include: {
              customerPo: {
                include: {
                  quotations: {
                    include: {
                      Customer: true,
                      CustomerContact: true,
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
      });
    } else {
      results = await prisma.cash_advance.findMany({
        where: {
          id_cash_advance: {
            contains: pencarian,
          },
          id_spj: null,
        },
        include: {
          cdv_detail: true,
          employee: true,
          user: {
            select: {
              id: true,
              username: true,
              employee: {
                select: {
                  id: true,
                  employee_name: true,
                  position: true,
                },
              },
            },
          },
          wor: {
            include: {
              customerPo: {
                include: {
                  quotations: {
                    include: {
                      Customer: true,
                      CustomerContact: true,
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
        massage: "Get All Cash Advance",
        result: results,
        page: pagination.page,
        limit: pagination.perPage,
        totalData: cdvCount,
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

const getSPJCdv = async (request: Request, response: Response) => {
  try {
    const pencarian: any = request.query.search || "";
    const hostname: any = request.headers.host;
    const pathname = url.parse(request.url).pathname;
    const page: any = request.query.page;
    const perPage: any = request.query.perPage;
    const pagination: any = new pagging(page, perPage, hostname, pathname);
    const cdvCount = await prisma.cash_advance.count({
      where: {
        deleted: null,
      },
    });
    let results: any;
    if (request.query.page === undefined) {
      results = await prisma.cash_advance.findMany({
        where: {
          id_cash_advance: {
            contains: pencarian,
          },
        },
        include: {
          cdv_detail: true,
          employee: true,
          user: {
            select: {
              id: true,
              username: true,
              employee: {
                select: {
                  id: true,
                  employee_name: true,
                  position: true,
                },
              },
            },
          },
          wor: {
            include: {
              customerPo: {
                include: {
                  quotations: {
                    include: {
                      Customer: true,
                      CustomerContact: true,
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
      });
    } else {
      results = await prisma.cash_advance.findMany({
        where: {
          id_cash_advance: {
            contains: pencarian,
          },
          NOT: {
            id_spj: null,
          },
        },
        include: {
          cdv_detail: true,
          employee: true,
          user: {
            select: {
              id: true,
              username: true,
              employee: {
                select: {
                  id: true,
                  employee_name: true,
                  position: true,
                },
              },
            },
          },
          wor: {
            include: {
              customerPo: {
                include: {
                  quotations: {
                    include: {
                      Customer: true,
                      CustomerContact: true,
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
        massage: "Get All SPJ Cash Advance",
        result: results,
        page: pagination.page,
        limit: pagination.perPage,
        totalData: cdvCount,
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
        status: "valid",
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
        note: request.body.note,
        date_cash_advance: request.body.date_cash_advance,
        cdv_detail: {
          create: request.body.cdv_detail,
        },
      },
      include: {
        cdv_detail: true,
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

const updateCdv = async (request: Request, response: Response) => {
  try {
    const id: string = request.params.id;
    const updateCdv = await prisma.cash_advance.update({
      where: {
        id: id,
      },
      data: request.body,
    });
    if (updateCdv) {
      response.status(201).json({
        success: true,
        massage: "Success Update Data",
        results: updateCdv,
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

const createSpjCdv = async (request: Request, response: Response) => {
  try {
    await prisma.$transaction(
      async (prisma) => {
        let result: any = [];
        const id: string = request.params.id;
        result = await prisma.cash_advance.update({
          where: {
            id: id,
          },
          data: {
            id_spj: request.body.id_spj,
            grand_tot: request.body.grand_tot,
          },
        });
        const updateVerify = request.body.cdv_detail.map(
          (updateByveri: {
            actual: any;
            balance: any;
            id: any;
            cdvId: any;
          }) => {
            return {
              actual: updateByveri.actual,
              balance: updateByveri.balance,
              id: updateByveri.id,
              cdvId: updateByveri.cdvId,
            };
          }
        );
        let upsertDetailCdv: any;
        if (result) {          
          for (let i = 0; i < updateVerify.length; i++) {
            upsertDetailCdv = await prisma.cdv_detail.upsert({
              where: {
                id: updateVerify[i].id,
              },
              create: {
                cash_advance: { connect: { id: updateVerify[i].cdvId } },
                actual: updateVerify[i].actual,
                balance: updateVerify[i].balance,
              },
              update: {
                actual: updateVerify[i].actual,
                balance: updateVerify[i].balance,
              },
            });
          }
          response.status(201).json({
            success: true,
            massage: "Success Update Data",
            results: upsertDetailCdv,
          });
        } else {
          response.status(400).json({
            success: false,
            massage: "Unsuccess Update Data",
          });
        }
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable, // optional, default defined by database configuration
        maxWait: 5000, // default: 2000
        timeout: 10000, // default: 5000
      }
    );
  } catch (error) {
    response.status(500).json({ massage: error.message, code: error }); // this will log any error that prisma throws + typesafety. both code and message are a string
  }
};

const deleteCdv = async (request: Request, response: Response) => {
  try {
    const id: string = request.params.id;
    const deleteCdv = await prisma.cash_advance.delete({
      where: {
        id: id,
      },
    });
    if (deleteCdv) {
      response.status(201).json({
        success: true,
        massage: "Success Delete Data",
        results: deleteCdv,
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

const deleteCdvDetail = async (request: Request, response: Response) => {
  try {
    const id: string = request.params.id;
    const deleteCdv = await prisma.cdv_detail.delete({
      where: {
        id: id,
      },
    });
    if (deleteCdv) {
      response.status(201).json({
        success: true,
        massage: "Success Delete Data",
        results: deleteCdv,
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
          status_valid_spv: true,
        },
      });
    } else {
      result = await prisma.cash_advance.update({
        where: { id: id },
        data: {
          status_valid_manager: false,
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

export default {
  getCdv,
  getEmployeeCdv,
  getSPJCdv,
  getWorCdv,
  createCdv,
  createSpjCdv,
  updateStatusSpv,
  updateStatusM,
  updateCdv,
  deleteCdv,
  deleteCdvDetail,
};
