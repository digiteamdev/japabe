import { Request, Response } from "express";
import prisma from "../middleware/mRequest";
import pagging from "../utils/paggination";
import url from "url";

const getMr = async (request: any, response: Response) => {
  try {
    const pencarian: any = request.query.search || "";
    const status: any = request.query.status || undefined;
    const hostname: any = request.headers.host;
    const pathname = url.parse(request.url).pathname;
    const page: any = request.query.page;
    const perPage: any = request.query.perPage;
    const pagination: any = new pagging(page, perPage, hostname, pathname);
    const MrCount = await prisma.mr.count({
      where: {
        deleted: null,
      },
    });
    let results;
    if (request.query.page === undefined && status != undefined) {
      results = await prisma.mr.findMany({
        where: {
          status_spv: status,
          status_manager: status,
        },
      });
    } else {
      const emplo = await prisma.employee.findFirst({
        where: {
          employee_name: request.session.userId,
        },
      });
      if (
        emplo?.position === "Supervisor" ||
        emplo?.position === "Manager" ||
        emplo?.position === "Director"
      ) {
        results = await prisma.mr.findMany({
          where: {
            no_mr: {
              contains: pencarian,
            },
          },
          include: {
            wor: true,
            bom: {
              include: {
                bom_detail: {
                  include: {
                    Material_master: {
                      include: {
                        Material_Stock: true,
                        grup_material: true,
                      },
                    },
                  },
                },
                srimg: {
                  include: {
                    srimgdetail: true,
                    timeschedule: {
                      include: {
                        wor: true,
                      },
                    },
                  },
                },
              },
            },
            detailMr: {
              include: {
                bom_detail: {
                  include: {
                    bom: {
                      include: {
                        srimg: {
                          include: {
                            srimgdetail: true,
                            timeschedule: {
                              include: {
                                wor: true,
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
                Material_Stock: {
                  include: {
                    Material_master: {
                      include: {
                        grup_material: true,
                      },
                    },
                  },
                },
              },
            },
            user: {
              select: {
                id: true,
                username: true,
                employee: {
                  select: {
                    id: true,
                    employee_name: true,
                    position: true,
                    sub_depart: {
                      select: {
                        id: true,
                        name: true,
                        departement: {
                          select: {
                            id: true,
                            name: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: parseInt(pagination.perPage),
          skip: parseInt(pagination.page) * parseInt(pagination.perPage),
        });
      } else {
        results = await prisma.mr.findMany({
          where: {
            user: {
              username: request.session.userId,
            },
            no_mr: {
              contains: pencarian,
            },
          },
          include: {
            wor: true,
            bom: {
              include: {
                bom_detail: {
                  include: {
                    Material_master: {
                      include: {
                        Material_Stock: true,
                        grup_material: true,
                      },
                    },
                  },
                },
                srimg: {
                  include: {
                    srimgdetail: true,
                    timeschedule: {
                      include: {
                        wor: true,
                      },
                    },
                  },
                },
              },
            },
            detailMr: {
              include: {
                bom_detail: {
                  include: {
                    bom: {
                      include: {
                        srimg: {
                          include: {
                            srimgdetail: true,
                            timeschedule: {
                              include: {
                                wor: true,
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
                Material_Stock: {
                  include: {
                    Material_master: {
                      include: {
                        grup_material: true,
                      },
                    },
                  },
                },
              },
            },
            user: {
              select: {
                id: true,
                username: true,
                employee: {
                  select: {
                    id: true,
                    employee_name: true,
                    position: true,
                    sub_depart: {
                      select: {
                        id: true,
                        name: true,
                        departement: {
                          select: {
                            id: true,
                            name: true,
                          },
                        },
                      },
                    },
                  },
                },
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
    }
    if (results.length > 0) {
      return response.status(200).json({
        success: true,
        massage: "Get All Material Request",
        result: results,
        page: pagination.page,
        limit: pagination.perPage,
        totalData: MrCount,
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

const createMr = async (request: Request, response: Response) => {
  try {
    const r = Math.floor(Math.random() * 1000) + 1;
    const genarate = "MR" + r;
    const bomNull = request.body.bomIdU;
    let results;
    if (bomNull === null)
      results = await prisma.mr.create({
        data: {
          no_mr: genarate,
          user: { connect: { id: request.body.userId } },
          wor: { connect: { id: request.body.worId } },
          date_mr: new Date(request.body.date_mr),
          detailMr: {
            create: request.body.detailMr,
          },
        },
        include: {
          detailMr: true,
        },
      });
    if (bomNull !== null)
      results = await prisma.mr.create({
        data: {
          no_mr: genarate,
          user: { connect: { id: request.body.userId } },
          wor: { connect: { id: request.body.worId } },
          bom: { connect: { id: request.body.bomIdU } },
          date_mr: new Date(request.body.date_mr),
          detailMr: {
            create: request.body.detailMr,
          },
        },
        include: {
          detailMr: true,
        },
      });
    // let obj: any = {};
    // let stok = request.body.detailMr;
    // stok.map((e: any) => {
    //   let jumlah = {
    //     idMaterialStok: e.materialStockId,
    //     qty: e.qty,
    //   };
    //   return Object.assign(obj, jumlah);
    // });
    // let cekStokMaterial: any = await prisma.material_Stock.findFirst({
    //   where: {
    //     id: obj.idMaterialStok,
    //   },
    // });
    // if (
    //   obj.qty > cekStokMaterial.jumlah_Stock ||
    //   cekStokMaterial.jumlah_Stock <= 0
    // ) {
    //   return response.status(400).json({
    //     msg: "stok abis",
    //   });
    // } else {
    //   request.body.detailMr.map(async (e: any) => {
    //     const getStock: any = await prisma.material_Stock.findFirst({
    //       where: {
    //         id: e.materialStockId,
    //       },
    //     });
    //     await prisma.material_Stock.update({
    //       where: {
    //         id: e.materialStockId,
    //       },
    //       data: {
    //         jumlah_Stock: getStock.jumlah_Stock - e.qty,
    //       },
    //     });
    //   });
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

const updateMr = async (request: Request, response: Response) => {
  try {
    const id: string = request.params.id;
    const updateMr = await prisma.mr.update({
      where: {
        id: id,
      },
      data: request.body,
    });
    if (updateMr) {
      response.status(201).json({
        success: true,
        massage: "Success Update Data",
        results: updateMr,
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

const upsertMr = async (request: Request, response: Response) => {
  try {
    const updateVerify = request.body.map(
      (updateByveri: {
        mrId: any;
        bomIdD: any;
        spesifikasi: any;
        materialStockId: any;
        note: any;
        qty: any;
        id: any;
      }) => {
        return {
          mrId: updateByveri.mrId,
          bomIdD: updateByveri.bomIdD,
          spesifikasi: updateByveri.spesifikasi,
          materialStockId: updateByveri.materialStockId,
          note: updateByveri.note,
          qty: updateByveri.qty,
          id: updateByveri.id,
        };
      }
    );
    let result: any = [];
    for (let i = 0; i < updateVerify.length; i++) {
      let upsertDetailMr;
      if (updateVerify[i].bomIdD === null)
        upsertDetailMr = await prisma.detailMr.upsert({
          where: {
            id: updateVerify[i].id,
          },
          create: {
            mr: { connect: { id: updateVerify[i].mrId } },
            spesifikasi: updateVerify[i].spesifikasi,
            Material_Stock: {
              connect: { id: updateVerify[i].materialStockId },
            },
            note: updateVerify[i].note,
            qty: updateVerify[i].qty,
          },
          update: {
            mr: { connect: { id: updateVerify[i].mrId } },
            spesifikasi: updateVerify[i].spesifikasi,
            Material_Stock: {
              connect: { id: updateVerify[i].materialStockId },
            },
            note: updateVerify[i].note,
            qty: updateVerify[i].qty,
          },
        });
      if (updateVerify[i].bomIdD !== null)
        upsertDetailMr = await prisma.detailMr.upsert({
          where: {
            id: updateVerify[i].id,
          },
          create: {
            mr: { connect: { id: updateVerify[i].mrId } },
            bom_detail: { connect: { id: updateVerify[i].bomIdD } },
            spesifikasi: updateVerify[i].spesifikasi,
            Material_Stock: {
              connect: { id: updateVerify[i].materialStockId },
            },
            note: updateVerify[i].note,
            qty: updateVerify[i].qty,
          },
          update: {
            mr: { connect: { id: updateVerify[i].mrId } },
            bom_detail: { connect: { id: updateVerify[i].bomIdD } },
            spesifikasi: updateVerify[i].spesifikasi,
            Material_Stock: {
              connect: { id: updateVerify[i].materialStockId },
            },
            note: updateVerify[i].note,
            qty: updateVerify[i].qty,
          },
        });
      result = [...result, upsertDetailMr];
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
    console.log(error);

    response.status(500).json({ massage: error.message, code: error }); // this will log any error that prisma throws + typesafety. both code and message are a string
  }
};

const updateMrStatus = async (request: Request, response: Response) => {
  try {
    const id = request.params.id;
    const statusPenc = await prisma.mr.findFirst({
      where: {
        id: id,
      },
    });

    let result;
    if (
      statusPenc?.status_spv === null ||
      statusPenc?.status_spv === "unvalid"
    ) {
      const id = request.params.id;
      result = await prisma.mr.update({
        where: { id: id },
        data: {
          status_spv: "valid",
        },
      });
    } else {
      result = await prisma.mr.update({
        where: { id: id },
        data: {
          status_spv: "unvalid",
        },
      });
    }
    if (result) {
      response.status(201).json({
        success: true,
        massage: "Success Update Data",
        results: result,
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

const updateMrStatusM = async (request: Request, response: Response) => {
  try {
    const id = request.params.id;
    const statusPenc = await prisma.mr.findFirst({
      where: {
        id: id,
      },
    });

    let result;
    if (
      statusPenc?.status_manager === null ||
      statusPenc?.status_manager === "unvalid"
    ) {
      const id = request.params.id;
      result = await prisma.mr.update({
        where: { id: id },
        data: {
          status_manager: "valid",
        },
      });
    } else {
      result = await prisma.mr.update({
        where: { id: id },
        data: {
          status_manager: "unvalid",
        },
      });
    }
    if (result) {
      response.status(201).json({
        success: true,
        massage: "Success Update Data",
        results: result,
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

const deleteMr = async (request: Request, response: Response) => {
  try {
    const id: string = request.params.id;
    const deleteMr = await prisma.mr.delete({
      where: {
        id: id,
      },
    });
    if (deleteMr) {
      response.status(201).json({
        success: true,
        massage: "Success Delete Data",
        results: deleteMr,
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

const deleteMrDetail = async (request: Request, response: Response) => {
  try {
    const id: string = request.params.id;
    const deleteMrdetail = await prisma.detailMr.delete({
      where: {
        id: id,
      },
    });
    if (deleteMrdetail) {
      response.status(201).json({
        success: true,
        massage: "Success Delete Data",
        results: deleteMrdetail,
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
  getMr,
  createMr,
  updateMr,
  upsertMr,
  updateMrStatus,
  updateMrStatusM,
  deleteMr,
  deleteMrDetail,
};
