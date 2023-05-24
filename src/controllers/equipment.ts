import { Request, Response, request } from "express";
import prisma from "../middleware/equipment";
import pagging from "../utils/paggination";
import url from "url";

const getEquipment = async (request: Request, response: Response) => {
  try {
    const pencarian: any = request.query.search || "";
    const hostname: any = request.headers.host;
    const pathname = url.parse(request.url).pathname;
    const page: any = request.query.page;
    const perPage: any = request.query.perPage;
    const pagination: any = new pagging(page, perPage, hostname, pathname);
    const equipmentCount = await prisma.equipment.count({
      where: {
        deleted: null,
      },
    });
    let results;
    if (request.query.page === undefined) {
      results = await prisma.equipment.findMany({
        where: {
          nama: {
            contains: "",
          },
        },
        include: {
          eq_part: true,
        },
      });
    } else {
      results = await prisma.equipment.findMany({
        where: {
          nama: {
            contains: pencarian,
          },
        },
        include: {
          eq_part: true,
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
        massage: "Get All Equipment",
        result: results,
        page: pagination.page,
        limit: pagination.perPage,
        totalData: equipmentCount,
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

const createEquipment = async (request: any, response: Response) => {
  try {
    const results = await prisma.equipment.create({
      data: {
        id_equipment: request.body.id_equipment,
        nama: request.body.nama,
        keterangan_eq: request.body.keterangan_eq,
        eq_image: request.file.path,
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

const updateEquipment = async (request: any, response: Response) => {
  try {
    const id: string = request.params.id;
    const updateEquipment = await prisma.equipment.update({
      where: {
        id: id,
      },
      data: {
        id_equipment: request.body.id_equipment,
        nama: request.body.nama,
        keterangan_eq: request.body.keterangan_eq,
        eq_image: !request.file ? request.body.eq_image : request.file.path,
      },
    });
    if (updateEquipment) {
      response.status(201).json({
        success: true,
        massage: "Success Update Data",
        results: updateEquipment,
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

const deleteEquipment = async (request: Request, response: Response) => {
  try {
    const id: string = request.params.id;
    const deleteEquipment = await prisma.equipment.delete({
      where: {
        id: id,
      },
    });
    if (deleteEquipment) {
      response.status(201).json({
        success: true,
        massage: "Success Delete Data",
        results: deleteEquipment,
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

const createPart = async (request: any, response: Response) => {
  try {
    const newArrPart = [];
    if (!request.files) {
      response.status(204).json({ msg: "img not found" });
    }
    if (request.body.eq_part) {
      const arr = JSON.parse(request.body.eq_part);
      for (let i = 0; i < arr.length; i++) {
        newArrPart.push({
          id_equipment: arr[i].id_equipment,
          nama_part: arr[i].nama_part,
          keterangan_part: arr[i].keterangan_part,
          part_img: request.files[i].path,
        });
      }
    }
    const results = await prisma.eq_part.createMany({
      data: newArrPart,
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

const updatePart = async (request: any, response: Response) => {
  try {
    const newArr = JSON.parse(request.body.eq_part);
    const updateVerify = newArr.map(
      (updateByveri: {
        id_equipment: any;
        nama_part: any;
        keterangan_part: any;
        part_img: any;
        id: any;
        action: any;
      }) => {
        return {
          id_equipment: updateByveri.id_equipment,
          nama_part: updateByveri.nama_part,
          keterangan_part: updateByveri.keterangan_part,
          part_img: updateByveri.part_img,
          id: updateByveri.id,
          action: updateByveri.action,
        };
      }
    );
    let result: any = [];
    for (let i = 0; i < updateVerify.length; i++) {
      let img;
      if (updateVerify[i].action !== "not upload") {
        let indexUpload = updateVerify[i].action.split(".");
        for (let j = 0; j < request.files.length; j++) {
          if (j === parseInt(indexUpload[1])) {
            img = request.files[j].path;
          }
        }
      } else {
        img = updateVerify[i].part_img;
      }
      const updateEmployeeCertificate = await prisma.eq_part.upsert({
        where: {
          id: updateVerify[i].id,
        },
        create: {
          nama_part: updateVerify[i].nama_part,
          part_img: img,
          keterangan_part: updateVerify[i].keterangan_part,
          equipment: { connect: { id: updateVerify[i].id_equipment } },
        },
        update: {
          nama_part: updateVerify[i].nama_part,
          part_img: img,
          keterangan_part: updateVerify[i].keterangan_part,
        },
      });
      result = [...result, updateEmployeeCertificate];
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

const deleteDPart = async (request: Request, response: Response) => {
  try {
    const id: string = request.params.id;
    const deleteDPart = await prisma.eq_part.delete({
      where: {
        id: id,
      },
    });
    if (deleteDPart) {
      response.status(201).json({
        success: true,
        massage: "Success Delete Data",
        results: deleteDPart,
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
  getEquipment,
  createEquipment,
  updateEquipment,
  deleteEquipment,
  createPart,
  updatePart,
  deleteDPart
};
