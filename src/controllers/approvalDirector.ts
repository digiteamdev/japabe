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
        AND: [
          {
            status_manager_director: null,
          },
          {
            status_manager_director: "revision",
          },
          {
            detailMr: {
              some: {
                poandso: {
                  status_manager: true,
                },
              },
            },
          },
          {
            SrDetail: {
              some: {
                poandso: {
                  status_manager: true,
                },
              },
            },
          },
        ],
        NOT: {
          status_manager_director: "approve",
        },
      },
    });
    let result;
    result = await prisma.purchase.findMany({
      where: {
        OR: {
          idPurchase: {
            contains: pencarian,
            mode: "insensitive",
          },
        },
        AND: [
          {
            deleted: null,
          },
          {
            status_manager_pr: true,
          },
          {
            status_manager_director: null,
          },
          {
            status_manager_director: "revision",
          },
        ],
        NOT: [
          {
            status_manager_director: "approve",
          },
          {
            detailMr: {
              some: {
                purchase: {
                  status_manager_director: "approve",
                },
              },
            },
          },
          {
            SrDetail: {
              some: {
                purchase: {
                  status_manager_director: "approve",
                },
              },
            },
          },
        ],
      },
      include: {
        detailMr: {
          include: {
            supplier: true,
            approvedRequest: true,
            poandso: true,
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
            poandso: true,
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
    let poandsoData;
    poandsoData = await prisma.poandso.findMany({
      where: {
        AND: [
          {
            status_manager: true,
          },
          {
            deleted: null,
          },
          {
            status_manager_director: null,
          },
          {
            status_manager_director: "revision",
          },
        ],
        NOT: [
          {
            status_receive: false,
          },
          {
            detailMr: {
              some: {
                purchase: {
                  status_manager_director: "approve",
                },
              },
            },
          },
          {
            SrDetail: {
              some: {
                purchase: {
                  status_manager_director: "approve",
                },
              },
            },
          },
        ],
      },
      include: {
        detailMr: {
          include: {
            supplier: true,
            approvedRequest: true,
            poandso: true,
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
            poandso: true,
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
    });
    const results = [...result, ...poandsoData];
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

const updateStatusDpoandso = async (request: any, response: Response) => {
  try {
    const id = request.params.id;
    const userLogin = await prisma.user.findFirst({
      where: {
        username: request.session.userId,
      },
    });
    const a: any = userLogin?.employeeId;
    const emplo = await prisma.employee.findFirst({
      where: {
        id: a,
      },
    });
    let result;
    let error_position: boolean = false;
    if (
      emplo?.position === "Director" &&
      request.body.statusApprove.status_manager_director !== undefined
    ) {
      result = await prisma.poandso.update({
        where: { id: id },
        data: {
          status_manager_director: request.body.statusApprove.status,
        },
      });
      if (request.body.revision !== undefined) {
        const updateVerify = request.body.revision.map(
          (updateByveri: { note_revision: any; id: any }) => {
            return {
              note_revision: updateByveri.note_revision,
              id: updateByveri.id,
            };
          }
        );
        let result: any = [];
        for (let i = 0; i < updateVerify.length; i++) {
          result = await prisma.detailMr.update({
            where: { id: updateVerify[i].id },
            data: {
              note_revision: updateVerify[i].note_revision,
            },
          });
        }
      }
      if (request.body.revision_sr !== undefined) {
        const updateVerify = request.body.revision_sr.map(
          (updateByveri: { note_revision: any; id: any }) => {
            return {
              note_revision: updateByveri.note_revision,
              id: updateByveri.id,
            };
          }
        );
        let result: any = [];
        for (let i = 0; i < updateVerify.length; i++) {
          result = await prisma.srDetail.update({
            where: { id: updateVerify[i].id },
            data: {
              note_revision: updateVerify[i].note_revision,
            },
          });
        }
      }
    } else if (
      emplo?.position === "Manager" &&
      request.body.statusApprove.status_manager_director === undefined
    ) {
      false;
    } else {
      error_position = true;
    }
    if (result && !error_position) {
      response.status(201).json({
        success: true,
        massage: "Success Update Data",
        results: result,
      });
    } else if (error_position) {
      response.status(400).json({
        success: false,
        massage: `anda bukan ${
          emplo?.position === "Director" ? "Manager" : "Director"
        }`,
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
  getAllApprove,
  updateStatusDpoandso,
};
