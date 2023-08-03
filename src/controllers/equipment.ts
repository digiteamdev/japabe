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
          eq_part: {
            select: {
              id: true,
              id_equipment: true,
              nama_part: true,
              part_img: true,
              equipment: {
                select: {
                  nama: true,
                },
              },
            },
          },
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
        eq_image: !request.file ? "" : request.file.path,
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

const createEquipmenMany = async (request: any, response: Response) => {
  try {
    const results = await prisma.equipment.createMany({
      data: [
        {
          id: "cli2x4t2x0008czg5u5bypmr8",
          id_equipment: null,
          nama: "Vertical Pump",
          keterangan_eq: "Vertical Pump",
          eq_image:
            "https://res.cloudinary.com/dotshxa6z/image/upload/v1685006111/workshop/weh4cahxitmhekhv3khj.jpg",
          createdAt: "2023-05-25T09:15:12.056Z",
          updatedAt: "2023-05-25T09:15:12.056Z",
          deleted: null,
        },
        {
          id: "clhuc2kgt000cczyawjnx66m2",
          id_equipment: null,
          nama: "Bearing  ( Sleeve Bearing / Journal Bearing )",
          keterangan_eq: "Rebabbit Sleeve Bearing / Journal\tBearing",
          eq_image:
            "https://res.cloudinary.com/dotshxa6z/image/upload/v1684487005/workshop/skwh4aelm1azw3e9iya2.png",
          createdAt: "2023-05-19T09:03:26.236Z",
          updatedAt: "2023-05-19T09:03:26.236Z",
          deleted: null,
        },
        {
          id: "clhubtvvm0004czya7gjx0p5g",
          id_equipment: null,
          nama: "Pump Vertical ( General )",
          keterangan_eq: "Recondition of Vertical Pump",
          eq_image:
            "https://res.cloudinary.com/dotshxa6z/image/upload/v1684486600/workshop/imcmswzo4nwngpwvuckk.png",
          createdAt: "2023-05-19T08:56:41.121Z",
          updatedAt: "2023-05-19T08:56:41.121Z",
          deleted: null,
        },
        {
          id: "clkt84lzq002jcz5m3hgsgztn",
          id_equipment: null,
          nama: "Steam Turbine",
          keterangan_eq: "Steam Turbine",
          eq_image:
            "https://res.cloudinary.com/dotshxa6z/image/upload/v1690950263/workshop/mtw1g7aife3rd8bpy2j2.jpg",
          createdAt: "2023-08-02T04:24:23.893Z",
          updatedAt: "2023-08-02T04:24:23.893Z",
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
    if (request.body.eq_part) {
      const arr = JSON.parse(request.body.eq_part);
      for (let i = 0; i < arr.length; i++) {
        newArrPart.push({
          id_equipment: arr[i].id_equipment,
          nama_part: arr[i].nama_part,
          keterangan_part: arr[i].keterangan_part,
          part_img: !request.files ? "" : request.files[i].path,
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

const createPartMany = async (request: Request, response: Response) => {
  try {
    const results = await prisma.eq_part.createMany({
      data: [
        {
          id: "cli2x5r2r000aczg5xxq9jrha",
          id_equipment: "cli2x4t2x0008czg5u5bypmr8",
          id_part: null,
          nama_part: "Shaft",
          keterangan_part: "Rotating",
          part_img:
            "https://res.cloudinary.com/dotshxa6z/image/upload/v1685006155/workshop/xepebeir4dfnwut8o1m2.jpg",
          createdAt: "2023-05-25T09:15:56.113Z",
          updatedAt: "2023-05-25T09:15:56.113Z",
          deleted: null,
        },
        {
          id: "cli2x5r2r000bczg593vaa8hx",
          id_equipment: "cli2x4t2x0008czg5u5bypmr8",
          id_part: null,
          nama_part: "Bearing DE`",
          keterangan_part: "Static",
          part_img:
            "https://res.cloudinary.com/dotshxa6z/image/upload/v1685006155/workshop/sckd0ztfq6helrh9iztd.png",
          createdAt: "2023-05-25T09:15:56.113Z",
          updatedAt: "2023-05-25T09:15:56.113Z",
          deleted: null,
        },
        {
          id: "clhuc4s8k000eczyaixdjbbu1",
          id_equipment: "clhuc2kgt000cczyawjnx66m2",
          id_part: null,
          nama_part: "Sleeve-Bearing-DE",
          keterangan_part: "Static",
          part_img:
            "https://res.cloudinary.com/dotshxa6z/image/upload/v1684487107/workshop/qg3xwnn9lmtyrnnthkwn.png",
          createdAt: "2023-05-19T09:05:09.620Z",
          updatedAt: "2023-05-19T09:05:09.620Z",
          deleted: null,
        },
        {
          id: "clhuc4s8l000fczyaggzr719f",
          id_equipment: "clhuc2kgt000cczyawjnx66m2",
          id_part: null,
          nama_part: "Sleeve-Bearing-NDE",
          keterangan_part: "Static",
          part_img:
            "https://res.cloudinary.com/dotshxa6z/image/upload/v1684487108/workshop/extoqpe4clnm9qfad3xo.png",
          createdAt: "2023-05-19T09:05:09.620Z",
          updatedAt: "2023-05-19T09:05:09.620Z",
          deleted: null,
        },
        {
          id: "clhuc4s8l000gczyav5kqdm31",
          id_equipment: "clhuc2kgt000cczyawjnx66m2",
          id_part: null,
          nama_part: "Dowel-Pin",
          keterangan_part: "Static",
          part_img:
            "https://res.cloudinary.com/dotshxa6z/image/upload/v1684487108/workshop/kecugpdgwhwtupzjhzcv.png",
          createdAt: "2023-05-19T09:05:09.620Z",
          updatedAt: "2023-05-19T09:05:09.620Z",
          deleted: null,
        },
        {
          id: "clhuc4s8l000hczyao3mg5e98",
          id_equipment: "clhuc2kgt000cczyawjnx66m2",
          id_part: null,
          nama_part: "L-Bolt",
          keterangan_part: "Static",
          part_img:
            "https://res.cloudinary.com/dotshxa6z/image/upload/v1684487109/workshop/fobrzkbpeznbchlc12d9.png",
          createdAt: "2023-05-19T09:05:09.620Z",
          updatedAt: "2023-05-19T09:05:09.620Z",
          deleted: null,
        },
        {
          id: "clhuc4s8l000iczyapbgaxlrh",
          id_equipment: "clhuc2kgt000cczyawjnx66m2",
          id_part: null,
          nama_part: "Hexa-Bolt",
          keterangan_part: "Static",
          part_img:
            "https://res.cloudinary.com/dotshxa6z/image/upload/v1684487108/workshop/mucnj6lybbxudooif1v8.png",
          createdAt: "2023-05-19T09:05:09.620Z",
          updatedAt: "2023-05-19T09:05:09.620Z",
          deleted: null,
        },
        {
          id: "clhubxqt10006czya33h8mfws",
          id_equipment: "clhubtvvm0004czya7gjx0p5g",
          id_part: null,
          nama_part: "Impeller",
          keterangan_part: "Rotating",
          part_img:
            "https://res.cloudinary.com/dotshxa6z/image/upload/v1684486780/workshop/wv8hhkdxqoctmyvkakii.png",
          createdAt: "2023-05-19T08:59:41.173Z",
          updatedAt: "2023-05-19T08:59:41.173Z",
          deleted: null,
        },
        {
          id: "clhubxqt10007czya0vx3n619",
          id_equipment: "clhubtvvm0004czya7gjx0p5g",
          id_part: null,
          nama_part: "Impeller-Wearring",
          keterangan_part: "Rotating",
          part_img:
            "https://res.cloudinary.com/dotshxa6z/image/upload/v1684486780/workshop/lp30hzv3tdkqxqpjdbyc.png",
          createdAt: "2023-05-19T08:59:41.173Z",
          updatedAt: "2023-05-19T08:59:41.173Z",
          deleted: null,
        },
        {
          id: "clhubxqt10008czya5jum1szh",
          id_equipment: "clhubtvvm0004czya7gjx0p5g",
          id_part: null,
          nama_part: "Shaft-Sleeve",
          keterangan_part: "Rotating",
          part_img:
            "https://res.cloudinary.com/dotshxa6z/image/upload/v1684486780/workshop/ydhn4fvet517hsjb9mbw.png",
          createdAt: "2023-05-19T08:59:41.173Z",
          updatedAt: "2023-05-19T08:59:41.173Z",
          deleted: null,
        },
        {
          id: "clhubxqt10009czya29j2dmmp",
          id_equipment: "clhubtvvm0004czya7gjx0p5g",
          id_part: null,
          nama_part: "Shaft-Sleeve-Collar",
          keterangan_part: "Rotating",
          part_img:
            "https://res.cloudinary.com/dotshxa6z/image/upload/v1684486780/workshop/emuqr3vswarxnre8cihz.png",
          createdAt: "2023-05-19T08:59:41.173Z",
          updatedAt: "2023-05-19T08:59:41.173Z",
          deleted: null,
        },
        {
          id: "clhubxqt1000aczya5vqwyk7i",
          id_equipment: "clhubtvvm0004czya7gjx0p5g",
          id_part: null,
          nama_part: "Joint-Coupling-Sleeve",
          keterangan_part: "Rotating",
          part_img:
            "https://res.cloudinary.com/dotshxa6z/image/upload/v1684486780/workshop/ek72hpzkxsvcepisfawh.png",
          createdAt: "2023-05-19T08:59:41.173Z",
          updatedAt: "2023-05-19T08:59:41.173Z",
          deleted: null,
        },
        {
          id: "clhubxqt1000bczyagdda8au6",
          id_equipment: "clhubtvvm0004czya7gjx0p5g",
          id_part: null,
          nama_part: "Split-Ring-Joint-Shaft",
          keterangan_part: "Rotating",
          part_img:
            "https://res.cloudinary.com/dotshxa6z/image/upload/v1684486780/workshop/sjfavssbq6noogqtbipa.png",
          createdAt: "2023-05-19T08:59:41.173Z",
          updatedAt: "2023-05-19T08:59:41.173Z",
          deleted: null,
        },
        {
          id: "clkt84vab002lcz5mh6ckvdww",
          id_equipment: "clkt84lzq002jcz5m3hgsgztn",
          id_part: null,
          nama_part: "Blade",
          keterangan_part: "Rotating",
          part_img:
            "https://res.cloudinary.com/dotshxa6z/image/upload/v1690950275/workshop/hz9hfd2ged06wctdb7kh.jpg",
          createdAt: "2023-08-02T04:24:35.940Z",
          updatedAt: "2023-08-02T04:25:20.433Z",
          deleted: null,
        },
        {
          id: "clkt85tmo002ocz5m4hlujfna",
          id_equipment: "clkt84lzq002jcz5m3hgsgztn",
          id_part: null,
          nama_part: "Shaft",
          keterangan_part: "Rotating",
          part_img:
            "https://res.cloudinary.com/dotshxa6z/image/upload/v1690950318/workshop/swvmqrqcjjxr6iwv8vp9.jpg",
          createdAt: "2023-08-02T04:25:20.449Z",
          updatedAt: "2023-08-02T04:25:20.449Z",
          deleted: null,
        },
        {
          id: "clkt85tmt002qcz5muladiiev",
          id_equipment: "clkt84lzq002jcz5m3hgsgztn",
          id_part: null,
          nama_part: "Bearing DE",
          keterangan_part: "Static",
          part_img:
            "https://res.cloudinary.com/dotshxa6z/image/upload/v1690950319/workshop/k2j7x9cedw2dtfk8pf8a.jpg",
          createdAt: "2023-08-02T04:25:20.454Z",
          updatedAt: "2023-08-02T04:25:20.454Z",
          deleted: null,
        },
        {
          id: "clkt85tn1002scz5m3c1focol",
          id_equipment: "clkt84lzq002jcz5m3hgsgztn",
          id_part: null,
          nama_part: "Bearing NDE",
          keterangan_part: "Static",
          part_img:
            "https://res.cloudinary.com/dotshxa6z/image/upload/v1690950319/workshop/gmzz1foygzpwg5zru0aw.jpg",
          createdAt: "2023-08-02T04:25:20.462Z",
          updatedAt: "2023-08-02T04:25:20.462Z",
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
      const updatePart = await prisma.eq_part.upsert({
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
      result = [...result, updatePart];
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
  createPartMany,
  createEquipment,
  createEquipmenMany,
  updateEquipment,
  deleteEquipment,
  createPart,
  updatePart,
  deleteDPart,
};
