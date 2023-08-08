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
        where: {
          kd_group: {
            contains: "",
          },
          material_name: {
            contains: "",
          },
        },
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
              },
              material_name: {
                contains: pencarian,
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

const createTypeMr = async (request: Request, response: Response) => {
  try {
    const results = await prisma.grup_material.create({
      data: {
        kd_group: request.body.kd_group,
        material_name: request.body.material_name,
        Material_master: {
          create: request.body.Material_master,
        },
      },
      include: {
        Material_master: true,
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
    const updateVerify = request.body.map(
      (updateByveri: {
        kd_material: any;
        kd_group: any;
        material_name: any;
        satuan: any;
        detail: any;
        id: any;
      }) => {
        return {
          kd_material: updateByveri.kd_material,
          kd_group: updateByveri.kd_group,
          material_name: updateByveri.material_name,
          satuan: updateByveri.satuan,
          detail: updateByveri.detail,
          id: updateByveri.id,
        };
      }
    );
    let result: any = [];
    for (let i = 0; i < updateVerify.length; i++) {
      const updateMaterialSpek = await prisma.material_master.upsert({
        where: {
          id: updateVerify[i].id,
        },
        create: {
          kd_material: updateVerify[i].kd_material,
          material_name: updateVerify[i].material_name,
          satuan: updateVerify[i].satuan,
          detail: updateVerify[i].detail,
          grup_material: { connect: { id: updateVerify[i].kd_group } },
        },
        update: {
          kd_material: updateVerify[i].kd_material,
          material_name: updateVerify[i].material_name,
          satuan: updateVerify[i].satuan,
          detail: updateVerify[i].detail,
          grup_material: { connect: { id: updateVerify[i].kd_group } },
        },
      });
      result = [...result, updateMaterialSpek];
    }
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

export default {
  getTypeMr,
  createTypeMr,
  updateMaterial,
  updateMaterialSpek,
  deleteMaterial,
  deleteMaterialSpek,
};
