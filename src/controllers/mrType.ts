import { Request, Response } from "express";
import prisma from "../middleware/mrType";
import pagging from "../utils/paggination";
import url from "url";

const getTypeMr = async (request: Request, response: Response) => {
  try {
    const pencarian: any = request.query.search || "";
    const hostname: any = request.headers.host;
    const pathname = url.parse(request.url).pathname;
    const page: any = request.query.page;
    const perPage: any = request.query.perPage;
    const pagination: any = new pagging(page, perPage, hostname, pathname);
    const typeMrCount = await prisma.grup_material.count({
      where: {
        deleted: null,
      },
    });
    let results;
    if (request.query.page === undefined) {
      results = await prisma.grup_material.findMany({
        include: {
          Material_master: true,
        },
      });
    } else {
      results = await prisma.grup_material.findMany({
        where: {
          OR: [
            {
              kd_group: {
                contains: pencarian,
                mode: "insensitive",
              },
            },
            {
              material_name: {
                contains: pencarian,
                mode: "insensitive",
              },
            },
          ],
        },
        include: {
          Material_master: true,
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
        massage: "Get All GroupMr",
        result: results,
        page: pagination.page,
        limit: pagination.perPage,
        totalData: typeMrCount,
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

const getMasterM = async (request: Request, response: Response) => {
  try {
    const pencarian: any = request.query.search || "";
    const hostname: any = request.headers.host;
    const pathname = url.parse(request.url).pathname;
    const page: any = request.query.page;
    const perPage: any = request.query.perPage;
    const pagination: any = new pagging(page, perPage, hostname, pathname);
    const typeMrCount = await prisma.material_master.count({
      where: {
        deleted: null,
      },
    });
    let results;
    if (request.query.page === undefined) {
      results = await prisma.material_master.findMany({
        include: {
          Material_Stock: true,
          grup_material: true,
        },
      });
    } else {
      results = await prisma.material_master.findMany({
        where: {
          OR: [
            {
              kd_group: {
                contains: pencarian,
                mode: "insensitive",
              },
            },
            {
              material_name: {
                contains: pencarian,
                mode: "insensitive",
              },
            },
          ],
        },
        include: {
          Material_Stock: true,
          grup_material: true,
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
        massage: "Get All MrMaster",
        result: results,
        page: pagination.page,
        limit: pagination.perPage,
        totalData: typeMrCount,
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

const getStock = async (request: Request, response: Response) => {
  try {
    const pencarian: any = request.query.search || "";
    const hostname: any = request.headers.host;
    const pathname = url.parse(request.url).pathname;
    const page: any = request.query.page;
    const perPage: any = request.query.perPage;
    const pagination: any = new pagging(page, perPage, hostname, pathname);
    const materialStock = await prisma.material_Stock.count({
      where: {
        deleted: null,
      },
    });
    let results;
    if (request.query.page === undefined) {
      results = await prisma.material_Stock.findMany({
        include: {
          Material_master: {
            include: {
              grup_material: true,
            },
          },
        },
      });
    } else {
      results = await prisma.material_Stock.findMany({
        where: {
          OR: [
            {
              spesifikasi: {
                contains: pencarian,
                mode: "insensitive",
              },
            },
            {
              Material_master: {
                material_name: {
                  contains: pencarian,
                  mode: "insensitive",
                },
              },
            },
          ],
        },
        include: {
          Material_master: {
            include: {
              grup_material: true,
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
        massage: "Get All Material Stock",
        result: results,
        page: pagination.page,
        limit: pagination.perPage,
        totalData: materialStock,
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

const createTypeMr = async (request: Request, response: Response) => {
  try {
    const r = Math.floor(Math.random() * 1000) + 1;
    const genarate = "G" + r;
    const results = await prisma.grup_material.create({
      data: {
        kd_group: genarate,
        material_name: request.body.material_name,
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

const createMaster = async (request: Request, response: Response) => {
  try {
    const r = Math.floor(Math.random() * 1000) + 1;
    const genarate = "M" + r;
    const results = await prisma.material_master.create({
      data: {
        kd_material: genarate,
        grup_material: { connect: { id: request.body.kd_group } },
        material_name: request.body.material_name,
        satuan: request.body.satuan,
        detail: request.body.detail,
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

const createMasterSpesifikasi = async (
  request: Request,
  response: Response
) => {
  try {
    const results = await prisma.material_Stock.createMany({
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

const createMasterOne = async (request: Request, response: Response) => {
  try {
    const results = await prisma.material_Stock.create({
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

const updateMaterial = async (request: Request, response: Response) => {
  try {
    const id: string = request.params.id;
    const updateMaterial = await prisma.grup_material.update({
      where: {
        id: id,
      },
      data: request.body,
    });
    if (updateMaterial) {
      response.status(201).json({
        success: true,
        massage: "Success Update Data",
        results: updateMaterial,
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

const updateMaterialSpek = async (request: Request, response: Response) => {
  try {
    const id: string = request.params.id;
    const result = await prisma.material_master.update({
      where: {
        id: id,
      },
      data: request.body,
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

const updateStokMaterial = async (request: Request, response: Response) => {
  try {
    const id: string = request.params.id;
    const updateStokMaterial = await prisma.material_Stock.update({
      where: {
        id: id,
      },
      data: request.body,
    });
    if (updateStokMaterial) {
      response.status(201).json({
        success: true,
        massage: "Success Update Data",
        result: updateStokMaterial,
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

const deleteMaterial = async (request: Request, response: Response) => {
  try {
    const id: string = request.params.id;
    const deleteMaterial = await prisma.grup_material.delete({
      where: {
        id: id,
      },
    });
    if (deleteMaterial) {
      response.status(201).json({
        success: true,
        massage: "Success Delete Data",
        results: deleteMaterial,
      });
    } else {
      response.status(400).json({
        success: false,
        massage: "Unsuccess Delete Data",
      });
    }
  } catch (error) {
    response.status(500).json({ masagge: error.message });
  }
};

const deleteMaterialSpek = async (request: Request, response: Response) => {
  try {
    const id: string = request.params.id;
    const deleteMaterialSpek = await prisma.material_master.delete({
      where: {
        id: id,
      },
    });
    if (deleteMaterialSpek) {
      response.status(201).json({
        success: true,
        massage: "Success Delete Data",
        results: deleteMaterialSpek,
      });
    } else {
      response.status(400).json({
        success: false,
        massage: "Unsuccess Delete Data",
      });
    }
  } catch (error) {
    response.status(500).json({ masagge: error.message });
  }
};

const deleteStokMaterial = async (request: Request, response: Response) => {
  try {
    const id: string = request.params.id;
    const result = await prisma.material_Stock.delete({
      where: {
        id: id,
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

export default {
  getTypeMr,
  getMasterM,
  getStock,
  createTypeMr,
  createMaster,
  createMasterSpesifikasi,
  updateMaterial,
  updateMaterialSpek,
  updateStokMaterial,
  deleteMaterial,
  deleteMaterialSpek,
  deleteStokMaterial,
  createMasterOne,
};
