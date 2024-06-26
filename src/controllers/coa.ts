import { Request, Response } from "express";
import prisma from "../middleware/coa";
import pagging from "../utils/paggination";
import url from "url";

const getCoa = async (request: Request, response: Response) => {
  try {
    const pencarian: any = request.query.search || "";
    const hostname: any = request.headers.host;
    const pathname = url.parse(request.url).pathname;
    const page: any = request.query.page;
    const perPage: any = request.query.perPage;
    const pagination: any = new pagging(page, perPage, hostname, pathname);
    const CoaCount = await prisma.coa.count({
      where: {
        deleted: null,
      },
    });
    let results;
    if (request.query.page === undefined) {
      results = await prisma.coa.findMany({
        orderBy: {
          createdAt: "asc",
        },
      });
    } else {
      results = await prisma.coa.findMany({
        where: {
          coa_name: {
            contains: pencarian,
            mode: "insensitive",
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
        massage: "Get All COA",
        result: results,
        page: pagination.page,
        limit: pagination.perPage,
        totalData: CoaCount,
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

const createCoa = async (request: Request, response: Response) => {
  try {
    const results = await prisma.coa.create({
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

const updateCoa = async (request: Request, response: Response) => {
  try {
    const id: string = request.params.id;
    const updateCoa = await prisma.coa.update({
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

const deleteCoa = async (request: Request, response: Response) => {
  try {
    const id: string = request.params.id;
    const deleteCoa = await prisma.coa.delete({
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
  getCoa,
  createCoa,
  updateCoa,
  deleteCoa,
};
