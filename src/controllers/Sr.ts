import { Request, Response } from "express";
import prisma from "../middleware/Sr";
import pagging from "../utils/paggination";
import url from "url";

const getSr = async (request: Request, response: Response) => {
  try {
    const pencarian: any = request.query.search || "";
    const hostname: any = request.headers.host;
    const pathname = url.parse(request.url).pathname;
    const page: any = request.query.page;
    const perPage: any = request.query.perPage;
    const pagination: any = new pagging(page, perPage, hostname, pathname);
    const SrCount = await prisma.sr.count({
      where: {
        deleted: null,
      },
    });
    let results;
    if (request.query.page === undefined) {
      results = await prisma.sr.findMany({
        where: {
          no_sr: {
            contains: "",
          },
        },
      });
    } else {
      results = await prisma.sr.findMany({
        where: {
          no_sr: {
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
        massage: "Get All Service Request",
        result: results,
        page: pagination.page,
        limit: pagination.perPage,
        totalData: SrCount,
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

const createSr = async (request: Request, response: Response) => {
  try {
    const r = Math.floor(Math.random() * 1000) + 1;
    const genarate = "SR" + r;
    const results = await prisma.sr.create({
      data: {
        no_sr: genarate,
        date_sr: new Date(request.body.date_sr),
        dispacth: { connect: { id: request.body.dispacthIDS } },
        SrDetail: {
          create: request.body.SrDetail,
        },
      },
      include: {
        SrDetail: true,
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

const updateSr = async (request: Request, response: Response) => {
  try {
    const id: string = request.params.id;
    const updateSr = await prisma.sr.update({
      where: {
        id: id,
      },
      data: request.body,
    });
    if (updateSr) {
      response.status(201).json({
        success: true,
        massage: "Success Update Data",
        results: updateSr,
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

const deleteSr = async (request: Request, response: Response) => {
  try {
    const id: string = request.params.id;
    const deleteSr = await prisma.sr.delete({
      where: {
        id: id,
      },
    });
    if (deleteSr) {
      response.status(201).json({
        success: true,
        massage: "Success Delete Data",
        results: deleteSr,
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
  getSr,
  createSr,
  updateSr,
  deleteSr,
};
