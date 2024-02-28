import { Request, Response } from "express";
import prisma from "../middleware/timeschedule";
import pagging from "../utils/paggination";
import url from "url";

const getTimeschedule = async (request: Request, response: Response) => {
  try {
    const pencarian: any = request.query.search || "";
    const status: any = request.query.status || undefined;
    const hostname: any = request.headers.host;
    const pathname = url.parse(request.url).pathname;
    const page: any = request.query.page;
    const perPage: any = request.query.perPage;
    const pagination: any = new pagging(page, perPage, hostname, pathname);
    const countTimeschedule = await prisma.timeschedule.count({
      where: {
        deleted: null,
      },
    });
    let results;
    if (request.query.page === undefined && status != undefined) {
      results = await prisma.timeschedule.findMany({
        where: {
          status_spv: status,
          status_manager: status,
          OR: [
            {
              srimg: {
                deleted: { not: null },
              },
            },
            {
              srimg: null,
            },
          ],
          NOT: {
            srimg: null,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          srimg: {
            include: {
              srimgdetail: true,
            },
          },
          wor: {
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
            },
          },
          aktivitas: {
            include: {
              work_scope_item: true,
              dispatchDetail: true,
            },
          },
        },
      });
    } else {
      results = await prisma.timeschedule.findMany({
        where: {
          wor: {
            job_no: {
              contains: pencarian,
              mode: "insensitive",
            },
          },
        },
        include: {
          srimg: {
            include: {
              srimgdetail: true,
            },
          },
          wor: {
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
            },
          },
          aktivitas: {
            include: {
              work_scope_item: true,
              dispatchDetail: true,
            },
          },
        },
        orderBy: {
          updatedAt: "asc",
        },
        take: parseInt(pagination.perPage),
        skip: parseInt(pagination.page) * parseInt(pagination.perPage),
      });
    }
    if (results.length > 0) {
      return response.status(200).json({
        success: true,
        massage: "Get All Time Schedule",
        result: results,
        page: pagination.page,
        limit: pagination.perPage,
        totalData: countTimeschedule,
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

const createTimeschedule = async (request: Request, response: Response) => {
  try {
    const results = await prisma.timeschedule.create({
      data: {
        idTs: request.body.idTs,
        wor: { connect: { id: request.body.worId } },
        timesch: new Date(request.body.timesch),
        job_priority: request.body.job_priority,
        holiday: request.body.holiday,
        aktivitas: {
          create: request.body.aktivitas,
        },
      },
      include: {
        aktivitas: true,
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

const updateTimeschedule = async (request: Request, response: Response) => {
  try {
    const id: string = request.params.id;
    const updateTimeschedule = await prisma.timeschedule.update({
      data: request.body,
      where: {
        id: id,
      },
    });
    if (updateTimeschedule) {
      response.status(201).json({
        success: true,
        massage: "Success Delete Data",
        results: updateTimeschedule,
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

const updateTimeAktivity = async (request: any, response: Response) => {
  try {
    const newArr = request.body.aktivitas;
    const updateVerify = newArr.map(
      (updateByveri: {
        timeId: any;
        workId: any;
        days: any;
        startday: any;
        endday: any;
        progress: any;
        holiday_count: any;
        id: any;
      }) => {
        return {
          timeId: updateByveri.timeId,
          workId: updateByveri.workId,
          days: updateByveri.days,
          startday: updateByveri.startday,
          endday: updateByveri.endday,
          progress: updateByveri.progress,
          holiday_count: updateByveri.holiday_count,
          id: updateByveri.id,
        };
      }
    );
    let result: any = [];
    for (let i = 0; i < updateVerify.length; i++) {
      const updateTimeAktivity = await prisma.aktivitas.upsert({
        where: {
          id: updateVerify[i].id,
        },
        create: {
          timeschedule: { connect: { id: updateVerify[i].timeId } },
          work_scope_item: { connect: { id: updateVerify[i].workId } },
          days: updateVerify[i].days,
          startday: new Date(updateVerify[i].startday),
          endday: new Date(updateVerify[i].endday),
          progress: updateVerify[i].progress,
          holiday_count: updateVerify[i].holiday_count,
        },
        update: {
          timeschedule: { connect: { id: updateVerify[i].timeId } },
          work_scope_item: { connect: { id: updateVerify[i].workId } },
          days: updateVerify[i].days,
          startday: new Date(updateVerify[i].startday),
          endday: new Date(updateVerify[i].endday),
          progress: updateVerify[i].progress,
          holiday_count: updateVerify[i].holiday_count,
        },
      });

      result = [...result, updateTimeAktivity];
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

const updateTimeSchStatus = async (request: Request, response: Response) => {
  try {
    const id = request.params.id;
    const statusPenc = await prisma.timeschedule.findFirst({
      where: {
        id: id,
      },
    });

    let result;
    if (
      statusPenc?.status_spv === null ||
      statusPenc?.status_spv === "unvalid"
    ) {
      const id = request.params.id;
      result = await prisma.timeschedule.update({
        where: { id: id },
        data: {
          status_spv: "valid",
        },
      });
    } else {
      result = await prisma.timeschedule.update({
        where: { id: id },
        data: {
          status_spv: "unvalid",
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

const updateTimeSchStatusM = async (request: Request, response: Response) => {
  try {
    const id = request.params.id;
    const statusPenc = await prisma.timeschedule.findFirst({
      where: {
        id: id,
      },
    });

    let result;
    if (
      statusPenc?.status_manager === null ||
      statusPenc?.status_manager === "unvalid"
    ) {
      const id = request.params.id;
      result = await prisma.timeschedule.update({
        where: { id: id },
        data: {
          status_manager: "valid",
          status_spv: "valid",
        },
      });
    } else {
      result = await prisma.timeschedule.update({
        where: { id: id },
        data: {
          status_manager: "unvalid",
          status_spv: "unvalid",
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

const deleteTimeschedule = async (request: Request, response: Response) => {
  try {
    const id: string = request.params.id;
    const deleteMasterAktivitas = await prisma.timeschedule.delete({
      where: {
        id: id,
      },
    });
    if (deleteMasterAktivitas) {
      response.status(201).json({
        success: true,
        massage: "Success Delete Data",
        results: deleteMasterAktivitas,
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

const deleTimeAktivty = async (request: Request, response: Response) => {
  try {
    const id: string = request.params.id;
    const deleTimeAktivty = await prisma.aktivitas.delete({
      where: {
        id: id,
      },
    });
    if (deleTimeAktivty) {
      response.status(201).json({
        success: true,
        massage: "Success Delete Data",
        results: deleTimeAktivty,
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
  getTimeschedule,
  createTimeschedule,
  updateTimeschedule,
  updateTimeAktivity,
  updateTimeSchStatus,
  updateTimeSchStatusM,
  deleteTimeschedule,
  deleTimeAktivty,
};
