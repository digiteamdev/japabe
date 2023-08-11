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
        include: {
          bom_detail: {
            include: {
              Material_master: true,
              srimgdetail: true,
            }
          },
          srimg: {
            include: {
              srimgdetail: true,
              wor: {
                include: {
                  customerPo: {
                    include: {
                      quotations: {
                        include: {
                          Quotations_Detail: true,
                          CustomerContact: true,
                          Customer: {
                            include: {
                              address: true,
                            },
                          },
                          eqandpart: {
                            include: {
                              equipment: true,
                              eq_part: true,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
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
          bom_detail: {
            include: {
              Material_master: true,
              srimgdetail: true,
            }
          },
          srimg: {
            include: {
              srimgdetail: true,
              wor: {
                include: {
                  customerPo: {
                    include: {
                      quotations: {
                        include: {
                          Quotations_Detail: true,
                          CustomerContact: true,
                          Customer: {
                            include: {
                              address: true,
                            },
                          },
                          eqandpart: {
                            include: {
                              equipment: true,
                              eq_part: true,
                            },
                          },
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
    const results = await prisma.bom.create({
      data: {
        srimg: { connect: { id: request.body.srId } },
        bom_detail: {
          create: request.body.bom_detail,
        },
      },
      include: {
        bom_detail: true,
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
    console.log(error);

    response.status(500).json({ massage: error.message, code: error }); // this will log any error that prisma throws + typesafety. both code and message are a string
  }
};

const UpdategetBom = async (request: Request, response: Response) => {
  try {
  } catch (error) {
    response.status(500).json({ massage: error.message, code: error }); // this will log any error that prisma throws + typesafety. both code and message are a string
  }
};

const DeleteBom = async (request: Request, response: Response) => {
  try {
    const id: string = request.params.id;
    const deleteBom = await prisma.bom.delete({
      where: {
        id: id,
      },
      include: {
        bom_detail: true,
      },
    });
    if (deleteBom) {
      response.status(201).json({
        success: true,
        massage: "Success Delete Data",
        results: deleteBom,
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
  getBom,
  CreateBom,
  UpdategetBom,
  DeleteBom,
};
