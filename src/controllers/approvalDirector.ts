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
    let totalCount: any = 0;
    totalCount = await prisma.purchase.count({
      where: {
        deleted: null,
        OR: [
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
            status_manager_director: "reject",
          },
          {
            status_manager_director: "approve",
          },
        ],
      },
    });
    let totalCuntPoandSo: any = 0;
    totalCuntPoandSo = await prisma.poandso.count({
      where: {
        deleted: null,
        OR: [
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
            status_manager_director: "reject",
          },
          {
            status_manager_director: "approve",
          },
        ],
      },
    });
    let totalCountCdv: any = 0;
    totalCountCdv = await prisma.cash_advance.count({
      where: {
        AND: [
          {
            status_valid_manager: true,
          },
          {
            OR: [
              {
                status_manager_director: null,
              },
              {
                status_manager_director: "revision",
              },
            ],
          },
        ],
      },
    });
    let totalCOuntSpj: any = 0;
    totalCOuntSpj = await prisma.cash_advance.findMany({
      where: {
        id_cash_advance: {
          contains: pencarian,
        },
        NOT: {
          id_spj: null,
        },
        grand_tot: {
          gte: 300000,
        },
      },
      include: {
        cdv_detail: true,
        employee: true,
        user: {
          select: {
            id: true,
            username: true,
            employee: {
              select: {
                id: true,
                employee_name: true,
                position: true,
              },
            },
          },
        },
        wor: {
          include: {
            customerPo: {
              include: {
                quotations: {
                  include: {
                    Customer: true,
                    CustomerContact: true,
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
    });
    let total: any =
      totalCount + totalCuntPoandSo + totalCountCdv + totalCOuntSpj;
    let result;
    result = await prisma.purchase.findMany({
      where: {
        idPurchase: {
          contains: pencarian,
          mode: "insensitive",
        },
        AND: [
          {
            status_manager_pr: true,
          },
          {
            OR: [
              {
                status_manager_director: null,
              },
              {
                status_manager_director: "revision",
              },
            ],
          },
        ],
      },
      include: {
        detailMr: {
          include: {
            supplier: true,
            approvedRequest: true,
            poandso: true,
            Material_Master: true,
            mr: {
              include: {
                wor: true,
                bom: {
                  include: {
                    bom_detail: {
                      include: {
                        Material_Master: true,
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
          },
        },
        SrDetail: {
          include: {
            supplier: true,
            approvedRequest: true,
            poandso: true,
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
        id_so: {
          contains: pencarian,
          mode: "insensitive",
        },
        AND: [
          {
            status_manager: true,
          },
          {
            OR: [
              {
                status_manager_director: null,
              },
              {
                status_manager_director: "revision",
              },
            ],
          },
        ],
      },
      include: {
        detailMr: {
          include: {
            supplier: true,
            approvedRequest: true,
            poandso: true,
            Material_Master: true,
            mr: {
              include: {
                wor: true,
                bom: {
                  include: {
                    bom_detail: {
                      include: {
                        Material_Master: true,
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
          },
        },
        SrDetail: {
          include: {
            supplier: true,
            approvedRequest: true,
            poandso: true,
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
    let cdv;
    cdv = await prisma.cash_advance.findMany({
      where: {
        id_cash_advance: {
          contains: pencarian,
          mode: "insensitive",
        },
        AND: [
          {
            status_valid_manager: true,
          },
          {
            OR: [
              {
                status_manager_director: null,
              },
              {
                status_manager_director: "revision",
              },
            ],
          },
        ],
      },
      include: {
        cdv_detail: true,
        employee: true,
        user: {
          select: {
            id: true,
            username: true,
            employee: {
              select: {
                id: true,
                employee_name: true,
                position: true,
              },
            },
          },
        },
        wor: {
          include: {
            customerPo: {
              include: {
                quotations: {
                  include: {
                    Customer: true,
                    CustomerContact: true,
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
    let spjCdv;
    spjCdv = await prisma.cash_advance.findMany({
      where: {
        id_cash_advance: {
          contains: pencarian,
        },
        NOT: {
          id_spj: null,
        },
        grand_tot: {
          gte: 300000,
        },
      },
      include: {
        cdv_detail: true,
        employee: true,
        user: {
          select: {
            id: true,
            username: true,
            employee: {
              select: {
                id: true,
                employee_name: true,
                position: true,
              },
            },
          },
        },
        wor: {
          include: {
            customerPo: {
              include: {
                quotations: {
                  include: {
                    Customer: true,
                    CustomerContact: true,
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
    });
    const results = [...result, ...poandsoData, ...cdv, ...spjCdv];
    if (results.length > 0) {
      return response.status(200).json({
        success: true,
        massage: "Get All Purchase services request",
        result: results,
        page: pagination.page,
        limit: pagination.perPage,
        totalData: total,
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
    const cdv = await prisma.cash_advance.findFirst({
      where: {
        id: id,
      },
    });
    if (
      (emplo?.position === "Director" &&
        request.body.statusApprove.status_manager_director !== undefined) ||
      cdv?.id === id
    ) {
      if (cdv?.id === id) {
        result = await prisma.cash_advance.update({
          where: { id: id },
          data: request.body.statusApprove,
        });
      } else {
        result = await prisma.poandso.update({
          where: { id: id },
          data: request.body.statusApprove,
        });
      }
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
      if (request.body.cdvRevision !== undefined) {
        const updateVerify = request.body.cdvRevision.map(
          (updateByveri: { note: any }) => {
            return {
              note: updateByveri.note,
            };
          }
        );
        let result: any = [];
        for (let i = 0; i < updateVerify.length; i++) {
          result = await prisma.cash_advance.update({
            where: { id: id },
            data: {
              note: updateVerify[i].note,
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

const getAllApproveMr = async (request: Request, response: Response) => {
  try {
    const pencarian: any = request.query.search || "";
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
    const results = await prisma.mr.findMany({
      where: {
        status_manager_director: null,
        no_mr: {
          contains: pencarian,
          mode: "insensitive",
        },
        job_no: {
          contains: pencarian,
          mode: "insensitive",
        },
        detailMr: {
          some: {
            Material_Master: {
              name: {
                contains: pencarian,
                mode: "insensitive",
              },
            },
          },
        },
      },
      include: {
        wor: true,
        bom: {
          include: {
            bom_detail: {
              include: {
                Material_Master: true,
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
            Material_Master: true,
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
    if (results.length > 0) {
      return response.status(200).json({
        success: true,
        massage: "Get All  mr request",
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

const getAllApproveSr = async (request: Request, response: Response) => {
  try {
    const pencarian: any = request.query.search || "";
    const filter: any = request.query.filter || "desc";
    const field: any = request.query.field || "id";
    const hostname: any = request.headers.host;
    const pathname = url.parse(request.url).pathname;
    const page: any = request.query.page;
    const perPage: any = request.query.perPage;
    const pagination: any = new pagging(page, perPage, hostname, pathname);
    const SrCount = await prisma.sr.count({
      where: {
        deleted: null,
      },
    });
    const results = await prisma.sr.findMany({
      where: {
        status_manager_director: null,
        no_sr: {
          contains: pencarian,
          mode: "insensitive",
        },
      },
      include: {
        wor: {
          include: {
            customerPo: {
              include: {
                quotations: {
                  include: {
                    Customer: true,
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
        SrDetail: true,
      },
      orderBy: [
        {
          _relevance: {
            fields: [field],
            search: "",
            sort: filter,
          },
        },
        {
          createdAt: "desc",
        },
      ],
      take: parseInt(pagination.perPage),
      skip: parseInt(pagination.page) * parseInt(pagination.perPage),
    });
    if (results.length > 0) {
      return response.status(200).json({
        success: true,
        massage: "Get All sr request",
        result: results,
        page: pagination.page,
        limit: pagination.perPage,
        totalData: SrCount,
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

const getAllApprovePo = async (request: Request, response: Response) => {
  try {
    const pencarian: any = request.query.search || "";
    const hostname: any = request.headers.host;
    const pathname = url.parse(request.url).pathname;
    const page: any = request.query.page;
    const perPage: any = request.query.perPage;
    const pagination: any = new pagging(page, perPage, hostname, pathname);
    const PoCount = await prisma.mr.count({
      where: {
        deleted: null,
      },
    });
    const results = await prisma.poandso.findMany({
      where: {
        id_so: {
          contains: pencarian,
          mode: "insensitive",
        },
        AND: [
          {
            status_manager: true,
          },
          {
            OR: [
              {
                status_manager_director: null,
              },
              {
                status_manager_director: "revision",
              },
            ],
          },
        ],
      },
      include: {
        detailMr: {
          include: {
            supplier: true,
            approvedRequest: true,
            poandso: true,
            Material_Master: true,
            mr: {
              include: {
                wor: true,
                bom: {
                  include: {
                    bom_detail: {
                      include: {
                        Material_Master: true,
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
          },
        },
        SrDetail: {
          include: {
            supplier: true,
            approvedRequest: true,
            poandso: true,
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
        massage: "Get All PO request",
        result: results,
        page: pagination.page,
        limit: pagination.perPage,
        totalData: PoCount,
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

const getAllApproveCdv = async (request: Request, response: Response) => {
  try {
    const pencarian: any = request.query.search || "";
    const hostname: any = request.headers.host;
    const pathname = url.parse(request.url).pathname;
    const page: any = request.query.page;
    const perPage: any = request.query.perPage;
    const pagination: any = new pagging(page, perPage, hostname, pathname);
    const CdvCount = await prisma.mr.count({
      where: {
        deleted: null,
      },
    });
    const results = await prisma.cash_advance.findMany({
      where: {
        id_cash_advance: {
          contains: pencarian,
          mode: "insensitive",
        },
        AND: [
          {
            status_valid_manager: true,
          },
          {
            OR: [
              {
                status_manager_director: null,
              },
              {
                status_manager_director: "revision",
              },
            ],
          },
        ],
      },
      include: {
        cdv_detail: true,
        employee: true,
        user: {
          select: {
            id: true,
            username: true,
            employee: {
              select: {
                id: true,
                employee_name: true,
                position: true,
              },
            },
          },
        },
        wor: {
          include: {
            customerPo: {
              include: {
                quotations: {
                  include: {
                    Customer: true,
                    CustomerContact: true,
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
        massage: "Get All cdv",
        result: results,
        page: pagination.page,
        limit: pagination.perPage,
        totalData: CdvCount,
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

const getAllApproveSpj = async (request: Request, response: Response) => {
  try {
    const pencarian: any = request.query.search || "";
    const hostname: any = request.headers.host;
    const pathname = url.parse(request.url).pathname;
    const page: any = request.query.page;
    const perPage: any = request.query.perPage;
    const pagination: any = new pagging(page, perPage, hostname, pathname);
    const SpjCount = await prisma.mr.count({
      where: {
        deleted: null,
      },
    });
    const results = await prisma.cash_advance.findMany({
      where: {
        id_cash_advance: {
          contains: pencarian,
        },
        NOT: {
          id_spj: null,
        },
        grand_tot: {
          gte: 300000,
        },
      },
      include: {
        cdv_detail: true,
        employee: true,
        user: {
          select: {
            id: true,
            username: true,
            employee: {
              select: {
                id: true,
                employee_name: true,
                position: true,
              },
            },
          },
        },
        wor: {
          include: {
            customerPo: {
              include: {
                quotations: {
                  include: {
                    Customer: true,
                    CustomerContact: true,
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
    });
    if (results.length > 0) {
      return response.status(200).json({
        success: true,
        massage: "Get All spj",
        result: results,
        page: pagination.page,
        limit: pagination.perPage,
        totalData: SpjCount,
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
  getAllApproveSr,
  getAllApprovePo,
  getAllApproveCdv,
  getAllApproveSpj,
  updateStatusDpoandso,
  getAllApproveMr,
};
