import { Request, Response } from "express";
import prisma from "../middleware/approvalDirector";
import pagging from "../utils/paggination";
import url from "url";

const getAllApprove = async (request: Request, response: Response) => {
  try {
    const pencarian: any = request.query.search || "";
    const hostname: any = request.headers.host;
    const pathname = url.parse(request.url).pathname;
    const page: any = request.query.page;
    const perPage: any = request.query.perPage;
    const pagination: any = new pagging(page, perPage, hostname, pathname);
    const purchaserCount = await prisma.purchase.count({
      where: {
        deleted: null,
        OR: [
          {
            status_manager_director: null,
          },
          {
            status_manager_director: "revision",
          },
        ]
      },
    });
    const results = await prisma.purchase.findMany({
      where: {
        AND: [
          {
            deleted: null,
          },
          {
            status_manager_pr: true,
          },
          {
            idPurchase: {
              contains: pencarian,
            },
          },
        ],
        OR: [
          {
            status_manager_director: null,
          },
          {
            status_manager_director: "revision",
          },
        ],
      },
      include: {
        detailMr: {
          include: {
            supplier: true,
            approvedRequest: true,
            coa: true,
            mr: {
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
        SrDetail: {
          include: {
            workCenter: true,
            supplier: true,
            approvedRequest: true,
            coa: true,
            sr: {
              include: {
                wor: true,
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
                dispacth: {
                  include: {
                    dispatchDetail: {
                      include: {
                        aktivitas: {
                          select: {
                            id: true,
                            aktivitasId: true,
                            masterAktivitas: {
                              select: {
                                id: true,
                                name: true,
                              },
                            },
                          },
                        },
                        approve: {
                          select: {
                            id: true,
                            employee_name: true,
                          },
                        },
                        Employee: {
                          select: {
                            id: true,
                            employee_name: true,
                          },
                        },
                        sub_depart: true,
                        workCenter: true,
                      },
                    },
                    srimg: {
                      include: {
                        srimgdetail: true,
                        timeschedule: {
                          include: {
                            aktivitas: {
                              include: {
                                masterAktivitas: true,
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
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: parseInt(pagination.perPage),
      skip: parseInt(pagination.page) * parseInt(pagination.perPage),
    });
    if (results.length > 0) {
      return response.status(200).json({
        success: true,
        massage: "Get All Purchase services request",
        result: results,
        page: pagination.page,
        limit: pagination.perPage,
        totalData: purchaserCount,
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

export default {
  getAllApprove,
};