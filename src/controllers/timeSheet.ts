import { Request, Response } from "express";
import prisma from "../middleware/timeSheet";
import pagging from "../utils/paggination";
import url from "url";

const getTimeSheet = async (request: any, response: Response) => {
  try {
    const pencarian: any = request.query.search || "";
    const type: any = request.query.type || "";
    const hostname: any = request.headers.host;
    const pathname = url.parse(request.url).pathname;
    const page: any = request.query.page;
    const perPage: any = request.query.perPage;
    const pagination: any = new pagging(page, perPage, hostname, pathname);
    const timeSheetCount = await prisma.time_sheet.count({
      where: {
        user: {
          username: request.session.userId,
        },
        deleted: null,
      },
    });
    let results: any;
    if (!type) {
      results = await prisma.time_sheet.findMany({
        where: {
          user: {
            username: request.session.userId,
          },
          OR: [
            {
              user: {
                employee: {
                  employee_name: {
                    contains: pencarian,
                    mode: "insensitive",
                  },
                },
              },
            },
          ],
        },
        include: {
          time_sheet_add: true,
          user: {
            include: {
              employee: {
                include: {
                  sub_depart: {
                    include: {
                      departement: true,
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
    } else {
      const userLogin = await prisma.user.findFirst({
        where: {
          username: request.session.userId,
        },
        include: {
          employee: {
            select: {
              id: true,
              employee_name: true,
              position: true,
              sub_depart: {
                select: {
                  id: true,
                  name: true,
                  departement: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
      const a: any = userLogin?.employeeId;
      const emplo = await prisma.employee.findFirst({
        where: {
          id: a,
        },
      });
      if (
        emplo?.position === "Supervisor" ||
        emplo?.position === "Manager" ||
        emplo?.position === "Director"
      ){
        results = await prisma.time_sheet.findMany({
          where: {
            user: {
              username: request.session.userId,
              employee: {
                sub_depart: { id: userLogin?.employee?.sub_depart?.id },
              },
            },
            OR: [
              {
                user: {
                  employee: {
                    employee_name: {
                      contains: pencarian,
                      mode: "insensitive",
                    },
                  },
                },
              },
            ],
            type_timesheet: type,
          },
          include: {
            time_sheet_add: true,
            user: {
              include: {
                employee: {
                  include: {
                    sub_depart: {
                      include: {
                        departement: true,
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
    }
    if (results.length > 0) {
      return response.status(200).json({
        success: true,
        massage: "Get All TimeSheet",
        result: results,
        page: pagination.page,
        limit: pagination.perPage,
        totalData: timeSheetCount,
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

const createTimeSheet = async (request: Request, response: Response) => {
  try {
    const results = await prisma.time_sheet.create({
      data: {
        date: new Date(request.body.date),
        user: { connect: { id: request.body.userId } },
        type_timesheet: request.body.type_timesheet,
        time_sheet_add: {
          create: request.body.time_sheet_add,
        },
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

const updateTimeSheet = async (request: Request, response: Response) => {
  try {
    const id: string = request.params.id;
    let result: any = [];
    const updateOne = await prisma.time_sheet.update({
      data: {
        date: new Date(request.body.date),
        user: { connect: { id: request.body.userId } },
        type_timesheet: request.body.type_timesheet,
      },
      where: {
        id: id,
      },
    });
    const timesAdd = request.body.time_sheet_add;
    const updateVerify = timesAdd.map(
      (updateByveri: {
        job: any;
        job_description: any;
        part_name: any;
        actual_start: any;
        actual_finish: any;
        timesheetId: any;
        total_hours: any;
        id: any;
      }) => {
        return {
          job: updateByveri.job,
          job_description: updateByveri.job_description,
          part_name: updateByveri.part_name,
          actual_start: updateByveri.actual_start,
          actual_finish: updateByveri.actual_finish,
          timesheetId: updateByveri.timesheetId,
          total_hours: updateByveri.total_hours,
          id: updateByveri.id,
        };
      }
    );
    const timeDelete = request.body.delete;
    const deleteQu = timeDelete.map((deleteByveri: { id: any }) => {
      return {
        id: deleteByveri.id,
      };
    });
    if (updateVerify) {
      for (let i = 0; i < updateVerify.length; i++) {
        const updateTimes = await prisma.time_sheet_add.upsert({
          where: {
            id: updateVerify[i].id,
          },
          create: {
            job: updateVerify[i].job,
            time_sheet: { connect: { id: updateVerify[i].timesheetId } },
            job_description: updateVerify[i].job_description,
            part_name: updateVerify[i].part_name,
            actual_start: new Date(updateVerify[i].actual_start),
            actual_finish: new Date(updateVerify[i].actual_finish),
            total_hours: updateVerify[i].total_hours,
          },
          update: {
            job: updateVerify[i].job,
            time_sheet: { connect: { id: updateVerify[i].timesheetId } },
            job_description: updateVerify[i].job_description,
            part_name: updateVerify[i].part_name,
            actual_start: new Date(updateVerify[i].actual_start),
            actual_finish: new Date(updateVerify[i].actual_finish),
            total_hours: updateVerify[i].total_hours,
          },
        });
        result = [...result, updateTimes];
      }
    }
    if (deleteQu) {
      for (let i = 0; i < deleteQu.length; i++) {
        await prisma.time_sheet_add.delete({
          where: {
            id: deleteQu[i].id,
          },
        });
      }
    }
    if (result || updateOne || !updateVerify || deleteQu) {
      response.status(201).json({
        success: true,
        massage: "Success Delete Data",
        results: result,
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

const deletetime_sheet = async (request: Request, response: Response) => {
  try {
    const id: string = request.params.id;
    const deletetime_sheet = await prisma.time_sheet.delete({
      where: {
        id: id,
      },
    });
    if (deletetime_sheet) {
      response.status(201).json({
        success: true,
        massage: "Success Delete Data",
        results: deletetime_sheet,
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
  getTimeSheet,
  createTimeSheet,
  updateTimeSheet,
  deletetime_sheet,
};
