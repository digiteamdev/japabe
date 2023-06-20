import { Request, Response } from "express";
import prisma from "../middleware/dispacth";
import pagging from "../utils/paggination";
import url from "url";

const getDispatch = async (request: Request, response: Response) => {
  try {
    const pencarian: any = request.query.search || "";
    const hostname: any = request.headers.host;
    const pathname = url.parse(request.url).pathname;
    const page: any = request.query.page;
    const perPage: any = request.query.perPagee;
    const pagination: any = new pagging(page, perPage, hostname, pathname);
    const dispactCount = await prisma.dispacth.count({
      where: {
        deleted: null,
      },
    });
    let results;
    if (request.query.page === undefined) {
      results = await prisma.dispacth.findMany({});
    } else {
      results = await prisma.dispacth.findMany({
        where: {
          id_dispatch: {
            contains: pencarian,
          },
        },
        take: parseInt(pagination.perPage),
        skip: parseInt(pagination.page) * parseInt(pagination.perPage),
      });
    }
    if (results.length > 0) {
      return response.status(200).json({
        success: true,
        massage: "Get All Dispacth",
        result: results,
        page: pagination.page,
        limit: pagination.perPage,
        totalData: dispactCount,
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

const createDispacth = async (request: Request, response: Response) => {
  try {
    const results = await prisma.dispacth.create({
      data: {
        srimg: { connect: { id: request.body.srId } },
        id_dispatch: request.body.id_dispatch,
        dispacth_date: new Date(request.body.dispacth_date),
        remark: request.body.remark,
        dispatchDetail: {
          create: request.body.dispatchDetail,
        },
      },
      include: {
        dispatchDetail: true,
      },
    });
  } catch (error) {
    response.status(500).json({ massage: error.message, code: error }); // this will log any error that prisma throws + typesafety. both code and message are a string
  }
};

export default {
  getDispatch,
  createDispacth,
};
