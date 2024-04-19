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
                CustomerContact: true,
                Customer: {
                  include: {
                    address: true,
                  },
                },
              },
            },
          },
        },
        timeschedule: {
          include: {
            drawing: true,
            srimg: true,
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
    const divisi: any = request.query.divisi || "";
    const hostname: any = request.headers.host;
    const pathname = url.parse(request.url).pathname;
    const page: any = request.query.page;
    const perPage: any = request.query.perPage;
    const pagination: any = new pagging(page, perPage, hostname, pathname);
    const worCount = await prisma.wor.count({
      where: {
        deleted: null,
        job_operational: divisi,
      },
    });
    let results;
    if (request.query.page === undefined && status != undefined) {
      results = await prisma.wor.findMany({
        where: {
          status: status,
          deleted: null,
          job_operational: divisi,
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
          work_scope_item: true,
          customerPo: {
            include: {
              quotations: {
                include: {
                  price_quotation: true,
                  CustomerContact: true,
                  Customer: {
                    include: {
                      address: true,
                    },
                  },
                },
              },
            },
          },
          timeschedule: true,
          employee: true,
        },
        orderBy: {
          no: "asc",
        },
      });
    } else {
      results = await prisma.wor.findMany({
        where: {
          deleted: null,
          job_operational: divisi,
          OR: [
            {
              job_no: {
                contains: pencarian,
                mode: "insensitive",
              },
            },
            {
              OR: [
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
                {
                  customerPo: {
                    quotations: {
                      quo_num: {
                        contains: pencarian,
                        mode: "insensitive",
                      },
                    },
                  },
                },
                {
                  customerPo: {
                    id_po: {
                      contains: pencarian,
                      mode: "insensitive",
                    },
                  },
                },
              ],
            },
          ],
          NOT: {
            customerPo: null,
          },
        },
        include: {
          work_scope_item: true,
          customerPo: {
            include: {
              quotations: {
                include: {
                  price_quotation: true,
                  CustomerContact: true,
                  Customer: {
                    include: {
                      address: true,
                    },
                  },
                },
              },
            },
          },
          timeschedule: {
            include: {
              drawing: true,
              srimg: true,
            },
          },
          employee: true,
          estimator: true,
        },
        orderBy: {
          job_no: "asc",
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

const getWorbyId = async (request: Request, response: Response) => {
  try {
    const divisi: any = request.query.divisi || "";
    let results;
    results = await prisma.wor.findMany({
      where: {
        deleted: null,
        job_operational: divisi,
        id: request.params.id,
      },
      include: {
        work_scope_item: true,
        customerPo: {
          include: {
            quotations: {
              include: {
                price_quotation: true,
                CustomerContact: true,
                Customer: {
                  include: {
                    address: true,
                  },
                },
              },
            },
          },
        },
        timeschedule: {
          include: {
            drawing: true,
            srimg: true,
          },
        },
        employee: true,
        estimator: true,
      },
    });
    if (results.length > 0) {
      return response.status(200).json({
        success: true,
        massage: "Get All Wor by Id",
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

const getWorTimes = async (request: any, response: Response) => {
  try {
    const results = await prisma.wor.findMany({
      where: {
        timeschedule: null,
        NOT: [
          {
            job_no: null,
          },
          {
            status: null,
          },
        ],
      },
      include: {
        work_scope_item: true,
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
              },
            },
          },
        },
        employee: true,
        timeschedule: true,
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
    const newArrEdu = [];
    if (request.body.work_scope_item) {
      const arr = JSON.parse(request.body.work_scope_item);
      for (let i = 0; i < arr.length; i++) {
        newArrEdu.push({
          worId: arr[i].worId,
          qty: arr[i].qty.toString(),
          item: arr[i].item,
          unit: arr[i].unit,
        });
      }
    }
    let results;
    if (request.body.cuspoId === null) {
      results = await prisma.wor.create({
        data: {
          job_no: request.body.job_no,
          date_wor: new Date(request.body.date_wor),
          employee: { connect: { id: request.body.employeeId } },
          estimator: { connect: { id: request.body.estimatorId } },
          job_description: request.body.job_description,
          priority_status: request.body.priority_status,
          no: request.body.no,
          qty: parseInt(request.body.qty),
          date_of_order: new Date(request.body.date_of_order),
          delivery_date: new Date(request.body.delivery_date),
          shipping_address: request.body.shipping_address,
          eq_model: request.body.eq_model,
          eq_mfg: request.body.eq_mfg,
          eq_rotation: request.body.eq_rotation,
          eq_power: request.body.eq_power,
          file_list: !request.file ? null : request.file.path,
          noted: request.body.noted,
          status: request.body.status,
          job_operational: request.body.job_operational,
          work_scope_item: {
            create: newArrEdu,
          },
        },
      });
    } else {
      results = await prisma.wor.create({
        data: {
          job_no: request.body.job_no,
          date_wor: new Date(request.body.date_wor),
          customerPo: { connect: { id: request.body.cuspoId } },
          employee: { connect: { id: request.body.employeeId } },
          estimator: { connect: { id: request.body.estimatorId } },
          job_description: request.body.job_description,
          no: request.body.no,
          priority_status: request.body.priority_status,
          qty: parseInt(request.body.qty),
          date_of_order: new Date(request.body.date_of_order),
          delivery_date: new Date(request.body.delivery_date),
          shipping_address: request.body.shipping_address,
          eq_model: request.body.eq_model,
          eq_mfg: request.body.eq_mfg,
          eq_rotation: request.body.eq_rotation,
          eq_power: request.body.eq_power,
          file_list: !request.file ? null : request.file.path,
          noted: request.body.noted,
          status: request.body.status,
          job_operational: request.body.job_operational,
          work_scope_item: {
            create: newArrEdu,
          },
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
    const lastRes = await prisma.wor.findFirst({
      where: { id: id },
      orderBy: {
        updatedAt: "desc",
      },
    });

    const count = lastRes?.revision;

    const i: any = count;

    const autoIn: any = parseInt(i) + 1;

    const genarate: string = autoIn.toString();
    let updateWor;
    let result: any = [];
    if (request.body.cuspoId === null) {
      updateWor = await prisma.wor.update({
        where: {
          id: id,
        },
        data: {
          job_no: request.body.job_no,
          date_wor: new Date(request.body.date_wor),
          employee: { connect: { id: request.body.employeeId } },
          estimator: { connect: { id: request.body.estimatorId } },
          job_description: request.body.job_description,
          priority_status: request.body.priority_status,
          qty: parseInt(request.body.qty),
          no: request.body.no,
          date_of_order: new Date(request.body.date_of_order),
          delivery_date: new Date(request.body.delivery_date),
          shipping_address: request.body.shipping_address,
          eq_mfg: request.body.eeq_mfg,
          eq_model: request.body.eq_model,
          eq_rotation: request.body.eq_rotation,
          eq_power: request.body.eq_power,
          file_list: !request.file ? null : request.file.path,
          noted: request.body.noted,
          status: request.body.status,
          revision: genarate,
          revision_desc: request.body.refevision_desc,
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
          employee: { connect: { id: request.body.employeeId } },
          estimator: { connect: { id: request.body.estimatorId } },
          job_description: request.body.job_description,
          priority_status: request.body.priority_status,
          no: request.body.no,
          qty: parseInt(request.body.qty),
          date_of_order: new Date(request.body.date_of_order),
          delivery_date: new Date(request.body.delivery_date),
          shipping_address: request.body.shipping_address,
          eq_mfg: request.body.eeq_mfg,
          eq_model: request.body.eq_model,
          eq_rotation: request.body.eq_rotation,
          eq_power: request.body.eq_power,
          file_list: !request.file ? null : request.file.path,
          noted: request.body.noted,
          status: request.body.status,
          revision: genarate,
          revision_desc: request.body.refevision_desc,
        },
      });
    }
    const workScope = JSON.parse(request.body.work_scope_item);
    const updateVerify = workScope.map(
      (updateByveri: {
        worId: any;
        qty: any;
        item: any;
        unit: any;
        id: any;
      }) => {
        return {
          worId: updateByveri.worId,
          unit: updateByveri.unit,
          qty: updateByveri.qty,
          item: updateByveri.item,
          id: updateByveri.id,
        };
      }
    );
    const parsedDelete = JSON.parse(request.body.delete);
    const deleteWor = parsedDelete.map((deleteByveri: { id: any }) => {
      return {
        id: deleteByveri.id,
      };
    });
    if (updateVerify || updateWor) {
      for (let i = 0; i < updateVerify.length; i++) {
        const updateWorMany = await prisma.work_scope_item.upsert({
          where: {
            id: updateVerify[i].id,
          },
          create: {
            wor: { connect: { id: updateVerify[i].worId } },
            qty: updateVerify[i].qty,
            item: updateVerify[i].item,
            unit: updateVerify[i].unit,
          },
          update: {
            wor: { connect: { id: updateVerify[i].worId } },
            qty: updateVerify[i].qty,
            item: updateVerify[i].item,
            unit: updateVerify[i].unit,
          },
        });
        result = [...result, updateWorMany];
      }
    }
    if (deleteWor || !updateVerify) {
      for (let i = 0; i < deleteWor.length; i++) {
        await prisma.work_scope_item.delete({
          where: {
            id: deleteWor[i].id,
          },
        });
      }
    }
    if (updateWor || result || !updateVerify || deleteWor) {
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

const updateWorkscope = async (request: Request, response: Response) => {
  try {
    const updateVerify = request.body.map(
      (updateByveri: { worId: any; qty: any; item: any; id: any }) => {
        return {
          worId: updateByveri.worId,
          qty: updateByveri.qty,
          item: updateByveri.item,
          id: updateByveri.id,
        };
      }
    );
    let result: any = [];
    for (let i = 0; i < updateVerify.length; i++) {
      const updatePoDetail = await prisma.work_scope_item.upsert({
        where: {
          id: updateVerify[i].id,
        },
        create: {
          qty: updateVerify[i].qty,
          item: updateVerify[i].item,
          wor: { connect: { id: updateVerify[i].worId } },
        },
        update: {
          qty: updateVerify[i].qty,
          item: updateVerify[i].item,
          wor: { connect: { id: updateVerify[i].worId } },
        },
      });
      result = [...result, updatePoDetail];
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

const updateWorStatus = async (request: Request, response: Response) => {
  try {
    const id = request.params.id;
    // const setNum = (num: any) => {
    //   return "00" + num;
    // };
    let result;
    const lastResCount: any = await prisma.wor.findFirst({
      where: {
        id: id,
      },
    });
    if (
      lastResCount.status === "" ||
      lastResCount.status === null ||
      lastResCount.status === "unvalid"
    ) {
      // const statusPenc = await prisma.wor.findMany({
      //   where: {
      //     NOT: {
      //       job_no: "",
      //     },
      //   },
      //   take: 1,
      //   orderBy: [{ createdAt: "desc" }],
      // });
      // const d = new Date();
      // let year = d.getUTCFullYear().toString().substring(2);
      // const count: any = statusPenc[0]?.job_no;
      // let generate;
      // const i: any = count?.substring(4);
      // const autoIn: any = parseInt(i) + 1;
      // if (count) {
      //   generate = lastResCount.job_operational + year + setNum(0 + autoIn);
      // } else {
      //   generate = lastResCount.job_operational + year + setNum(0);
      // }

      result = await prisma.wor.update({
        where: { id: id },
        data: {
          status: "valid",
          // job_no: generate,
        },
      });
    } else {
      result = await prisma.wor.update({
        where: { id: id },
        data: {
          status: "unvalid",
          // status: lastResCount.status === "valid" ? "unvalid" : "valid",
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

const deleteWork = async (request: Request, response: Response) => {
  try {
    const id: string = request.params.id;
    const deleteWork = await prisma.work_scope_item.delete({
      where: {
        id: id,
      },
    });
    if (deleteWork) {
      response.status(201).json({
        success: true,
        massage: "Success Delete Data",
        results: deleteWork,
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
  getWorbyId,
  getJobStatus,
  getWorTimes,
  createWor,
  updateWor,
  updateWorkscope,
  updateWorStatus,
  deleteWor,
  deleteWork,
};
