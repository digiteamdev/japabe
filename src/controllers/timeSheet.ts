import { Request, Response } from "express";
import prisma from "../middleware/timeSheet";
import pagging from "../utils/paggination";
import url from "url";

const getTimeSheet = async (request: Request, response: Response) => {
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
        deleted: null,
      },
    });
    let results;
    if (!type) {
      results = await prisma.time_sheet.findMany({
        where: {
          job: {
            contains: pencarian,
            mode: "insensitive",
          },
        },
        include: {
          user: {
            include: {
              employee: true,
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
      results = await prisma.time_sheet.findMany({
        where: {
          job: {
            contains: pencarian,
            mode: "insensitive",
          },
          type_timesheet: type,
        },
        include: {
          user: {
            include: {
              employee: true,
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
      data: request.body,
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
    const updateCoa = await prisma.time_sheet.update({
      data: request.body,
      where: {
        id: id,
      },
    });
    if (updateCoa) {
      response.status(201).json({
        success: true,
        massage: "Success Delete Data",
        results: updateCoa,
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
    const deleteCoa = await prisma.time_sheet.delete({
      where: {
        id: id,
      },
    });
    if (deleteCoa) {
      response.status(201).json({
        success: true,
        massage: "Success Delete Data",
        results: deleteCoa,
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
