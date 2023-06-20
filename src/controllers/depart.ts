import { Request, Response } from "express";
import prisma from "../middleware/depart";
import pagging from "../utils/paggination";
import url from "url";

const getDepart = async (request: Request, response: Response) => {
  try {
    const pencarian: any = request.query.search || "";
    const hostname: any = request.headers.host;
    const pathname = url.parse(request.url).pathname;
    const page: any = request.query.page;
    const perPage: any = request.query.perPage;
    const pagination: any = new pagging(page, perPage, hostname, pathname);
    const departCount = await prisma.departement.count({
      where: {
        deleted: null,
      },
    });
    let results;
    if (request.query.page === undefined) {
      results = await prisma.sub_depart.findMany({
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
      results = await prisma.departement.findMany({
        where: {
          name: {
            contains: pencarian,
          },
        },
        include: {
          sub_depart: true,
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
        massage: "Get All Depart",
        result: results,
        page: pagination.page,
        limit: pagination.perPage,
        totalData: departCount,
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

const getsubDepart = async (request: Request, response: Response) => {
  try {
    const results = await prisma.sub_depart.findMany({});
    if (results.length > 0) {
      return response.status(200).json({
        success: true,
        massage: "Get All Sub Depart",
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

const createDepart = async (request: Request, response: Response) => {
  try {
    const results = await prisma.departement.create({
      data: {
        name: request.body.name,
        sub_depart: {
          create: request.body.sub_depart,
        },
      },
      include: {
        sub_depart: true,
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

const createDepartMany = async (request: Request, response: Response) => {
  try {
    const results = await prisma.departement.createMany({
      data: [
        {
          id: "cli8dpelx0001rsb80sts1951",
          name: "BOD",
          createdAt: "2023-05-29T04:57:57.813Z",
          updatedAt: "2023-05-29T05:46:11.387Z",
          deleted: null,
        },
        {
          id: "cli8dpelx0001rsb80sts1960",
          name: "Commercial & Development",
          createdAt: "2023-05-29T04:57:57.813Z",
          updatedAt: "2023-05-29T05:52:35.237Z",
          deleted: null,
        },
        {
          id: "cli8dpelx0001rsb80sts1956",
          name: "Engineering",
          createdAt: "2023-05-29T04:57:57.813Z",
          updatedAt: "2023-05-29T05:49:41.421Z",
          deleted: null,
        },
        {
          id: "cli8dpelx0001rsb80sts1952",
          name: "Field Service",
          createdAt: "2023-05-29T04:57:57.813Z",
          updatedAt: "2023-05-29T04:57:57.813Z",
          deleted: null,
        },
        {
          id: "cli8dpelx0001rsb80sts1959",
          name: "Finance & Accounting",
          createdAt: "2023-05-29T04:57:57.813Z",
          updatedAt: "2023-05-29T05:52:16.218Z",
          deleted: null,
        },
        {
          id: "cli8dpelx0001rsb80sts1958",
          name: "General Affair",
          createdAt: "2023-05-29T04:57:57.813Z",
          updatedAt: "2023-05-29T05:51:32.792Z",
          deleted: null,
        },
        {
          id: "cli8dpelx0001rsb80sts1954",
          name: "Production",
          createdAt: "2023-05-29T04:57:57.813Z",
          updatedAt: "2023-05-29T05:48:37.362Z",
          deleted: null,
        },
        {
          id: "cli8dpelx0001rsb80sts1957",
          name: "Purchasing & Logistic",
          createdAt: "2023-05-29T04:57:57.813Z",
          updatedAt: "2023-05-29T05:50:07.817Z",
          deleted: null,
        },
        {
          id: "cli8dpelx0001rsb80sts1953",
          name: "QA & HSE",
          createdAt: "2023-05-29T04:57:57.813Z",
          updatedAt: "2023-05-29T05:46:56.159Z",
          deleted: null,
        },
        {
          id: "cli8dpelx0001rsb80sts1955",
          name: "Sales Marketing",
          createdAt: "2023-05-29T04:57:57.813Z",
          updatedAt: "2023-05-29T05:48:54.952Z",
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

const createSubMany = async (request: Request, response: Response) => {
  try {
    const results = await prisma.sub_depart.createMany({
      data: [
        {
          id: "cli8fn8m90024rswmjy8fwe5w",
          deptId: "cli8dpelx0001rsb80sts1959",
          name: "ACCOUNTING",
          createdAt: "2023-05-29T05:52:15.959Z",
          updatedAt: "2023-05-29T05:52:15.959Z",
          deleted: null,
        },
        {
          id: "cli8fcom0000irswmnkb5cim0",
          deptId: "cli8dpelx0001rsb80sts1954",
          name: "BALANCING & INSPECTION",
          createdAt: "2023-05-29T05:44:03.440Z",
          updatedAt: "2023-05-29T05:48:36.896Z",
          deleted: null,
        },
        {
          id: "cli8fa5050000rswmhh4qkn6w",
          deptId: "cli8dpelx0001rsb80sts1951",
          name: "BOD",
          createdAt: "2023-05-29T05:42:04.706Z",
          updatedAt: "2023-05-29T05:46:11.266Z",
          deleted: null,
        },
        {
          id: "cli8fn8o40026rswmo7mkfccz",
          deptId: "cli8dpelx0001rsb80sts1959",
          name: "COLLECTION",
          createdAt: "2023-05-29T05:52:16.037Z",
          updatedAt: "2023-05-29T05:52:16.037Z",
          deleted: null,
        },
        {
          id: "cli8fnnfp002crswm7ppte043",
          deptId: "cli8dpelx0001rsb80sts1960",
          name: "COMMERCIAL & DEVELOPMENT",
          createdAt: "2023-05-29T05:52:35.165Z",
          updatedAt: "2023-05-29T05:52:35.165Z",
          deleted: null,
        },
        {
          id: "cli8fjx6i001erswmhqapf2wm",
          deptId: "cli8dpelx0001rsb80sts1956",
          name: "DRAFTER",
          createdAt: "2023-05-29T05:49:41.178Z",
          updatedAt: "2023-05-29T05:49:41.178Z",
          deleted: null,
        },
        {
          id: "cli8fmb0d001srswm7ko98a99",
          deptId: "cli8dpelx0001rsb80sts1958",
          name: "DRIVER",
          createdAt: "2023-05-29T05:51:32.404Z",
          updatedAt: "2023-05-29T05:51:32.404Z",
          deleted: null,
        },
        {
          id: "cli8fijmw000yrswmpvrydefv",
          deptId: "cli8dpelx0001rsb80sts1954",
          name: "FIELD SERVICE",
          createdAt: "2023-05-29T05:48:36.968Z",
          updatedAt: "2023-05-29T05:48:36.968Z",
          deleted: null,
        },
        {
          id: "cli8fn8ps0028rswmaqqlika8",
          deptId: "cli8dpelx0001rsb80sts1959",
          name: "FINANCE",
          createdAt: "2023-05-29T05:52:16.096Z",
          updatedAt: "2023-05-29T05:52:16.096Z",
          deleted: null,
        },
        {
          id: "cli8fn8rf002arswm72hltl3y",
          deptId: "cli8dpelx0001rsb80sts1959",
          name: "FINANCE & ACCOUNTING",
          createdAt: "2023-05-29T05:52:16.155Z",
          updatedAt: "2023-05-29T05:52:16.155Z",
          deleted: null,
        },
        {
          id: "cli8fmb2g001urswmi5rhwmai",
          deptId: "cli8dpelx0001rsb80sts1958",
          name: "GENERAL AFFAIR",
          createdAt: "2023-05-29T05:51:32.489Z",
          updatedAt: "2023-05-29T05:51:32.489Z",
          deleted: null,
        },
        {
          id: "cli8fmb45001wrswmo7u5ttas",
          deptId: "cli8dpelx0001rsb80sts1958",
          name: "GENERAL AFFAIR & HRD",
          createdAt: "2023-05-29T05:51:32.550Z",
          updatedAt: "2023-05-29T05:51:32.550Z",
          deleted: null,
        },
        {
          id: "cli8fmb61001yrswml2cuxyde",
          deptId: "cli8dpelx0001rsb80sts1958",
          name: "HUMAN RESOURCE D",
          createdAt: "2023-05-29T05:51:32.617Z",
          updatedAt: "2023-05-29T05:51:32.617Z",
          deleted: null,
        },
        {
          id: "cli8fjx4s001crswmzctk3m41",
          deptId: "cli8dpelx0001rsb80sts1956",
          name: "IT",
          createdAt: "2023-05-29T05:49:41.106Z",
          updatedAt: "2023-05-29T05:49:41.106Z",
          deleted: null,
        },
        {
          id: "cli8fkhld001mrswmygssddxt",
          deptId: "cli8dpelx0001rsb80sts1957",
          name: "LOGISTIC",
          createdAt: "2023-05-29T05:50:07.624Z",
          updatedAt: "2023-05-29T05:50:07.624Z",
          deleted: null,
        },
        {
          id: "cli8fijp50010rswm7il5niiw",
          deptId: "cli8dpelx0001rsb80sts1954",
          name: "MACHINIST AND WELDER",
          createdAt: "2023-05-29T05:48:37.049Z",
          updatedAt: "2023-05-29T05:48:37.049Z",
          deleted: null,
        },
        {
          id: "cli8fijqz0012rswm8b2kuyrp",
          deptId: "cli8dpelx0001rsb80sts1954",
          name: "MAINTENANCE & FACILITY TECHNIST",
          createdAt: "2023-05-29T05:48:37.115Z",
          updatedAt: "2023-05-29T05:48:37.115Z",
          deleted: null,
        },
        {
          id: "cli8fijso0014rswmsrgb95ql",
          deptId: "cli8dpelx0001rsb80sts1954",
          name: "MECHANIC",
          createdAt: "2023-05-29T05:48:37.176Z",
          updatedAt: "2023-05-29T05:48:37.176Z",
          deleted: null,
        },
        {
          id: "cli8fjx88001grswm7iaou1tu",
          deptId: "cli8dpelx0001rsb80sts1956",
          name: "NDT INSPECTOR",
          createdAt: "2023-05-29T05:49:41.240Z",
          updatedAt: "2023-05-29T05:49:41.240Z",
          deleted: null,
        },
        {
          id: "cli8fmb7p0020rswmec8ylpy2",
          deptId: "cli8dpelx0001rsb80sts1958",
          name: "OFFICE BOY",
          createdAt: "2023-05-29T05:51:32.677Z",
          updatedAt: "2023-05-29T05:51:32.677Z",
          deleted: null,
        },
        {
          id: "cli8fijud0016rswmi9wd1j34",
          deptId: "cli8dpelx0001rsb80sts1954",
          name: "PPIC",
          createdAt: "2023-05-29T05:48:37.238Z",
          updatedAt: "2023-05-29T05:48:37.238Z",
          deleted: null,
        },
        {
          id: "cli8fijw10018rswm1ywwkn5i",
          deptId: "cli8dpelx0001rsb80sts1954",
          name: "PRODUCTION",
          createdAt: "2023-05-29T05:48:37.298Z",
          updatedAt: "2023-05-29T05:48:37.298Z",
          deleted: null,
        },
        {
          id: "cli8fkhn4001orswmj0y479d7",
          deptId: "cli8dpelx0001rsb80sts1957",
          name: "PURCHASING",
          createdAt: "2023-05-29T05:50:07.696Z",
          updatedAt: "2023-05-29T05:50:07.696Z",
          deleted: null,
        },
        {
          id: "cli8fgdks000urswm0ouptqfp",
          deptId: "cli8dpelx0001rsb80sts1953",
          name: "QA & HSE",
          createdAt: "2023-05-29T05:46:55.563Z",
          updatedAt: "2023-05-29T05:46:55.563Z",
          deleted: null,
        },
        {
          id: "cli8fjx9u001irswmaclnkxlf",
          deptId: "cli8dpelx0001rsb80sts1956",
          name: "QC ADMINISTRATOR",
          createdAt: "2023-05-29T05:49:41.299Z",
          updatedAt: "2023-05-29T05:49:41.299Z",
          deleted: null,
        },
        {
          id: "cli8fjxbk001krswmp3btnhpf",
          deptId: "cli8dpelx0001rsb80sts1956",
          name: "QC INSPECTOR",
          createdAt: "2023-05-29T05:49:41.360Z",
          updatedAt: "2023-05-29T05:49:41.360Z",
          deleted: null,
        },
        {
          id: "cli8fmb9a0022rswmqnjhmx0n",
          deptId: "cli8dpelx0001rsb80sts1958",
          name: "RECEPTIONIST",
          createdAt: "2023-05-29T05:51:32.735Z",
          updatedAt: "2023-05-29T05:51:32.735Z",
          deleted: null,
        },
        {
          id: "cli8fixgo001arswmdytcvlwz",
          deptId: "cli8dpelx0001rsb80sts1955",
          name: "SALES & MKT",
          createdAt: "2023-05-29T05:48:54.879Z",
          updatedAt: "2023-05-29T05:48:54.879Z",
          deleted: null,
        },
        {
          id: "cli8fkhot001qrswm019nr3ak",
          deptId: "cli8dpelx0001rsb80sts1957",
          name: "TOOL KEEPER",
          createdAt: "2023-05-29T05:50:07.757Z",
          updatedAt: "2023-05-29T05:50:07.757Z",
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

const updateDepart = async (request: Request, response: Response) => {
  try {
    const updateVerify = request.body.sub_depart.map(
      (updateByveri: { name: any; deptId: any; id: any }) => {
        return {
          name: updateByveri.name,
          deptId: updateByveri.deptId,
          id: updateByveri.id,
        };
      }
    );
    let result: any = [];
    for (let i = 0; i < updateVerify.length; i++) {
      const updateDepart = await prisma.sub_depart.upsert({
        where: {
          id: updateVerify[i].id,
        },
        create: {
          name: updateVerify[i].name,
          departement: { connect: { id: updateVerify[i].deptId } },
        },
        update: {
          name: updateVerify[i].name,
        },
      });
      result = [...result, updateDepart];
    }
    const dept = await prisma.departement.update({
      where: { id: request.body.id },
      data: {
        name: request.body.name,
      },
    });
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

const deleteDepart = async (request: Request, response: Response) => {
  try {
    const id: string = request.params.id;
    const deleteDepart = await prisma.departement.delete({
      where: {
        id: id,
      },
    });
    if (deleteDepart) {
      response.status(201).json({
        success: true,
        massage: "Success Delete Data",
        results: deleteDepart,
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

const deleteSubDepart = async (request: Request, response: Response) => {
  try {
    const id: string = request.params.id;
    const deleteDepart = await prisma.sub_depart.delete({
      where: {
        id: id,
      },
    });
    if (deleteDepart) {
      response.status(201).json({
        success: true,
        massage: "Success Delete Data",
        results: deleteDepart,
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
  getDepart,
  getsubDepart,
  createDepart,
  updateDepart,
  deleteDepart,
  createDepartMany,
  deleteSubDepart,
  createSubMany,
};
