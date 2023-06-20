import { Request, Response } from "express";
import prisma from "../middleware/depart";
import pagging from "../utils/paggination";
import url from "url";

const getWorkCenter = async (request: Request, response: Response) => {
  try {
    const pencarian: any = request.query.search || "";
    const hostname: any = request.headers.host;
    const pathname = url.parse(request.url).pathname;
    const page: any = request.query.page;
    const perPage: any = request.query.perPage;
    const pagination: any = new pagging(page, perPage, hostname, pathname);
    const workCenterCount = await prisma.workCenter.count({
      where: {
        deleted: null,
      },
    });
    let results;
    if (request.query.page === undefined) {
      results = await prisma.workCenter.findMany({
        where: {
          name: {
            contains: "",
          },
        },
        orderBy: {
          name: "asc",
        },
      });
    } else {
      results = await prisma.workCenter.findMany({
        where: {
          name: {
            contains: pencarian,
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
        massage: "Get All WorkCenter",
        result: results,
        page: pagination.page,
        limit: pagination.perPage,
        totalData: workCenterCount,
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

const createWorkCenter = async (request: Request, response: Response) => {
  try {
    const results = await prisma.workCenter.create({
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

const createWorkCenterMany = async (request: Request, response: Response) => {
  try {
  } catch (error) {
    response.status(500).json({ massage: error.message, code: error }); // this will log any error that prisma throws + typesafety. both code and message are a string
  }
};

const updatecreateWorkCenter = async (request: Request, response: Response) => {
  try {
    const id: string = request.params.id;
    const updatecreateWorkCenter = await prisma.workCenter.delete({
      where: {
        id: id,
      },
    });
    if (updatecreateWorkCenter) {
      response.status(201).json({
        success: true,
        massage: "Success Delete Data",
        results: updatecreateWorkCenter,
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

const deleteworkCenter = async (request: Request, response: Response) => {
  try {
    const id: string = request.params.id;
    const deleteworkCenter = await prisma.workCenter.delete({
      where: {
        id: id,
      },
    });
    if (deleteworkCenter) {
      response.status(201).json({
        success: true,
        massage: "Success Delete Data",
        results: deleteworkCenter,
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
  getWorkCenter,
  createWorkCenter,
  createWorkCenterMany,
  updatecreateWorkCenter,
  deleteworkCenter,
};
