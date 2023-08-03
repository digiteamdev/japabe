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
    const results = await prisma.workCenter.createMany({
      data: [
        {
          id: "clkt705f8001qcz5mxrwhn9lv",
          name: "Babbit Purchase",
          createdAt: "2023-08-02T03:52:56.181Z",
          updatedAt: "2023-08-02T03:52:56.181Z",
          deleted: null,
        },
        {
          id: "clkt6zde1001ocz5mheat0zli",
          name: "Delivery",
          createdAt: "2023-08-02T03:52:19.850Z",
          updatedAt: "2023-08-02T03:52:19.850Z",
          deleted: null,
        },
        {
          id: "clkt6z87n001mcz5muc00znth",
          name: "Final Check QC",
          createdAt: "2023-08-02T03:52:13.139Z",
          updatedAt: "2023-08-02T03:52:13.139Z",
          deleted: null,
        },
        {
          id: "clkt6z1wa001kcz5m4h95sy1e",
          name: "UT NDT Process",
          createdAt: "2023-08-02T03:52:04.954Z",
          updatedAt: "2023-08-02T03:52:04.954Z",
          deleted: null,
        },
        {
          id: "clkt6ypg4001icz5mw2e6bqef",
          name: "Machining",
          createdAt: "2023-08-02T03:51:48.821Z",
          updatedAt: "2023-08-02T03:51:48.821Z",
          deleted: null,
        },
        {
          id: "clkt6xkbq001ccz5m6ph0cwk0",
          name: "Welding New Babbit",
          createdAt: "2023-08-02T03:50:55.526Z",
          updatedAt: "2023-08-02T03:50:55.526Z",
          deleted: null,
        },
        {
          id: "clkt6xee7001acz5m7lxapmu2",
          name: "Remove Babbit",
          createdAt: "2023-08-02T03:50:47.840Z",
          updatedAt: "2023-08-02T03:50:47.840Z",
          deleted: null,
        },
        {
          id: "clj8dks85000kczed5e7m6akz",
          name: "Balancing",
          createdAt: "2023-06-23T09:34:04.517Z",
          updatedAt: "2023-06-23T09:34:04.517Z",
          deleted: null,
        },
        {
          id: "clj887h5b000yczyvx27jk2c5",
          name: "Grooving",
          createdAt: "2023-06-23T07:03:45.551Z",
          updatedAt: "2023-06-23T07:03:45.551Z",
          deleted: null,
        },
        {
          id: "clj887cow000wczyvwzwb6yg8",
          name: "Tapping",
          createdAt: "2023-06-23T07:03:39.776Z",
          updatedAt: "2023-06-23T07:03:39.776Z",
          deleted: null,
        },
      ],
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

const updatecreateWorkCenter = async (request: Request, response: Response) => {
  try {
    const id: string = request.params.id;
    const updatecreateWorkCenter = await prisma.workCenter.update({
      data: request.body,
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
