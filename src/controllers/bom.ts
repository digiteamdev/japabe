import { Request, Response } from "express";
import prisma from "../middleware/bom";
import pagging from "../utils/paggination";
import url from "url";

const getBom = async (request: Request, response: Response) => {
  try {
    const pencarian: any = request.query.search || "";
    const hostname: any = request.headers.host;
    const pathname = url.parse(request.url).pathname;
    const page: any = request.query.page;
    const perPage: any = request.query.perPage;
    const pagination: any = new pagging(page, perPage, hostname, pathname);
    const bomCOunt = await prisma.bom.count({
      where: {
        deleted: null,
      },
    });
    let results;
    if (request.query.page === undefined) {
      results = await prisma.bom.findMany({
        orderBy: {
          id: "desc",
        },
      });
    } else {
      results = await prisma.bom.findMany({
        where: {
          srimg: {
            id_summary: {
              contains: pencarian,
            },
          },
        },
        include: {
          srimg: true,
        },
        orderBy: {
          id: "desc",
        },
        take: parseInt(pagination.perPage),
        skip: parseInt(pagination.page) * parseInt(pagination.perPage),
      });
    }
    if (results.length > 0) {
      return response.status(200).json({
        success: true,
        massage: "Get All Bom",
        result: results,
        page: pagination.page,
        limit: pagination.perPage,
        totalData: bomCOunt,
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
const CreateBom = async (request: Request, response: Response) => {
  try {
  } catch (error) {
    response.status(500).json({ massage: error.message, code: error }); // this will log any error that prisma throws + typesafety. both code and message are a string
  }
};
const UpdategetBom = async (request: Request, response: Response) => {
  try {
  } catch (error) {
    response.status(500).json({ massage: error.message, code: error }); // this will log any error that prisma throws + typesafety. both code and message are a string
  }
};
const DeletegetBom = async (request: Request, response: Response) => {
  try {
  } catch (error) {
    response.status(500).json({ massage: error.message, code: error }); // this will log any error that prisma throws + typesafety. both code and message are a string
  }
};

export default {
  getBom,
  CreateBom,
  UpdategetBom,
  DeletegetBom,
};
