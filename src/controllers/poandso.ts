import { Request, Response } from "express";
import prisma from "../middleware/podandso";
import pagging from "../utils/paggination";
import url from "url";
import { Prisma } from "@prisma/client";

const getPo = async (request: Request, response: Response) => {
  try {
    const type: any = request.query.type || "";
    const pencarian: any = request.query.search || "";
    const hostname: any = request.headers.host;
    const pathname = url.parse(request.url).pathname;
    const page: any = request.query.page;
    const perPage: any = request.query.perPage;
    const pagination: any = new pagging(page, perPage, hostname, pathname);
    const poandsoCount = await prisma.purchase.count({
      where: {
        deleted: null,
        OR: [
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
        NOT: [
          {
            detailMr: {
              some: {
                poandsoId: null,
              },
            },
          },
          {
            SrDetail: {
              some: {
                poandsoId: null,
              },
            },
          },
        ],
        idPurchase: {
          startsWith: type,
        },
      },
    });
    const results = await prisma.purchase.findMany({
      where: {
        deleted: null,
        idPurchase: {
          startsWith: type,
        },
        OR: [
          {
            status_manager_director: null,
          },
          {
            status_manager_director: "revision",
          },
          {
            detailMr: {
              some: {
                poandsoId: null,
              },
            },
          },
          {
            SrDetail: {
              some: {
                poandsoId: null,
              },
            },
          },
          {
            detailMr: {
              some: {
                poandso: {
                  id_so: {
                    contains: pencarian,
                    mode: "insensitive",
                  },
                },
              },
            },
          },
          {
            SrDetail: {
              some: {
                poandso: {
                  id_so: {
                    contains: pencarian,
                    mode: "insensitive",
                  },
                },
              },
            },
          },
          {
            SrDetail: {
              some: {
                supplier: {
                  supplier_name: {
                    contains: pencarian,
                    mode: "insensitive",
                  },
                },
              },
            },
          },
          {
            detailMr: {
              some: {
                supplier: {
                  supplier_name: {
                    contains: pencarian,
                    mode: "insensitive",
                  },
                },
              },
            },
          },
        ],
      },
      include: {
        detailMr: {
          include: {
            supplier: {
              include: {
                SupplierContact: true,
                SupplierBank: true,
              },
            },
            approvedRequest: true,
            coa: true,
            mr: {
              include: {
                wor: {
                  include: {
                    customerPo: {
                      include: {
                        quotations: {
                          include: {
                            Quotations_Detail: true,
                            CustomerContact: true,
                          },
                        },
                      },
                    },
                  },
                },
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
            supplier: {
              include: {
                SupplierContact: true,
                SupplierBank: true,
              },
            },
            approvedRequest: true,
            coa: true,
            sr: {
              include: {
                wor: {
                  include: {
                    Quotations: {
                      include: {
                        Quotations_Detail: true,
                        CustomerContact: true,
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
    });
    if (results.length > 0) {
      return response.status(200).json({
        success: true,
        massage: "Get All PO and SO",
        result: results,
        page: pagination.page,
        limit: pagination.perPage,
        totalData: poandsoCount,
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

const createPo = async (request: Request, response: Response) => {
  try {
    const results = await prisma.poandso.create({
      data: {
        id_so: request.body.id_so,
        date_prepared: new Date(request.body.date_prepared),
        supplier: { connect: { id: request.body.supplierId } },
        your_reff: request.body.your_reff,
        note: request.body.note,
        DP: request.body.DP,
        term_of_pay_po_so: {
          create: request.body.term_of_pay_po_so,
        },
      },
      include: {
        term_of_pay_po_so: true,
      },
    });
    if (request.body.detailMrID !== null) {
      request.body.detailMrID.map(async (dataId: any) => {
        console.log(results.id);
        await prisma.detailMr.update({
          where: {
            id: dataId.id,
          },
          data: {
            poandsoId: results.id,
          },
        });
      });
    }
    if (request.body.detailSrID !== null) {
      request.body.detailSrID.map(async (dataId: any) => {
        await prisma.srDetail.update({
          where: {
            id: dataId.id,
          },
          data: {
            poandsoId: results.id,
          },
        });
      });
    }
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

const getPoandSo = async (request: Request, response: Response) => {
  try {
    const pencarian: any = request.query.search || "";
    const type: any = request.query.type || "";
    const hostname: any = request.headers.host;
    const pathname = url.parse(request.url).pathname;
    const page: any = request.query.page;
    const perPage: any = request.query.perPage;
    const pagination: any = new pagging(page, perPage, hostname, pathname);
    const poandsoCount = await prisma.poandso.count({
      where: {
        deleted: null,
        id_so: {
          startsWith: type,
        },
      },
    });
    let results;
    if (request.query.page === undefined) {
      results = await prisma.poandso.findMany({
        where: {
          AND: [
            {
              status_receive: false,
            },
            {
              status_manager_director: "approve",
            },
            {
              id_so: {
                startsWith: type,
              },
            },
          ],
        },
        include: {
          term_of_pay_po_so: true,
          supplier: {
            include: {
              SupplierContact: true,
              SupplierBank: true,
            },
          },
          detailMr: {
            include: {
              supplier: {
                include: {
                  SupplierContact: true,
                  SupplierBank: true,
                },
              },
              approvedRequest: true,
              coa: true,
              mr: {
                include: {
                  wor: {
                    include: {
                      Quotations: {
                        include: {
                          Quotations_Detail: true,
                          CustomerContact: true,
                        },
                      },
                    },
                  },
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
              supplier: {
                include: {
                  SupplierContact: true,
                  SupplierBank: true,
                },
              },
              approvedRequest: true,
              coa: true,
              sr: {
                include: {
                  wor: {
                    include: {
                      Quotations: {
                        include: {
                          Quotations_Detail: true,
                          CustomerContact: true,
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
      });
    } else {
      results = await prisma.poandso.findMany({
        where: {
          id_so: {
            contains: pencarian,
            mode: "insensitive",
          },
          OR: [
            {
              id_so: {
                startsWith: type,
              },
            },
          ],
        },
        include: {
          term_of_pay_po_so: true,
          supplier: {
            include: {
              SupplierContact: true,
              SupplierBank: true,
            },
          },
          detailMr: {
            include: {
              supplier: {
                include: {
                  SupplierContact: true,
                  SupplierBank: true,
                },
              },
              approvedRequest: true,
              coa: true,
              mr: {
                include: {
                  wor: {
                    include: {
                      Quotations: {
                        include: {
                          Quotations_Detail: true,
                          CustomerContact: true,
                        },
                      },
                    },
                  },
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
              supplier: {
                include: {
                  SupplierContact: true,
                  SupplierBank: true,
                },
              },
              approvedRequest: true,
              coa: true,
              sr: {
                include: {
                  wor: {
                    include: {
                      Quotations: {
                        include: {
                          Quotations_Detail: true,
                          CustomerContact: true,
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
    }
    if (results.length > 0) {
      return response.status(200).json({
        success: true,
        massage: "Get All PO and SO",
        result: results,
        page: pagination.page,
        limit: pagination.perPage,
        totalData: poandsoCount,
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

const updateStatusMpoandso = async (request: any, response: Response) => {
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
    const statusPenc = await prisma.poandso.findFirst({
      where: {
        id: id,
      },
    });
    let result;
    if (
      (emplo?.position === "Manager" && statusPenc?.status_manager === null) ||
      statusPenc?.status_manager === false
    ) {
      const id = request.params.id;
      result = await prisma.poandso.update({
        where: { id: id },
        data: {
          status_manager: true,
        },
      });
    } else {
      result = await prisma.poandso.update({
        where: { id: id },
        data: {
          status_manager: false,
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

const getAllReceive = async (request: Request, response: Response) => {
  try {
    const type: any = request.query.type || "";
    const pencarian: any = request.query.search || "";
    const hostname: any = request.headers.host;
    const pathname = url.parse(request.url).pathname;
    const page: any = request.query.page;
    const perPage: any = request.query.perPage;
    const pagination: any = new pagging(page, perPage, hostname, pathname);
    const poandsoCount = await prisma.poandso.count({
      where: {
        deleted: null,
        AND: [
          {
            status_receive: true,
          },
          {
            status_manager_director: "approve",
          },
          {
            id_so: {
              startsWith: type,
            },
          },
        ],
      },
    });
    const results = await prisma.poandso.findMany({
      where: {
        AND: [
          {
            status_receive: true,
          },
          {
            status_manager_director: "approve",
          },
          {
            id_so: {
              startsWith: type,
            },
          },
        ],
        OR: [
          {
            id_receive: {
              contains: pencarian,
              mode: "insensitive",
            },
          },
          {
            id_so: {
              contains: pencarian,
              mode: "insensitive",
            },
          },
        ],
      },
      include: {
        term_of_pay_po_so: true,
        supplier: {
          include: {
            SupplierContact: true,
            SupplierBank: true,
          },
        },
        detailMr: {
          include: {
            supplier: {
              include: {
                SupplierContact: true,
                SupplierBank: true,
              },
            },
            approvedRequest: true,
            coa: true,
            mr: {
              include: {
                wor: {
                  include: {
                    Quotations: {
                      include: {
                        Quotations_Detail: true,
                        CustomerContact: true,
                      },
                    },
                  },
                },
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
            supplier: {
              include: {
                SupplierContact: true,
                SupplierBank: true,
              },
            },
            approvedRequest: true,
            coa: true,
            sr: {
              include: {
                wor: {
                  include: {
                    Quotations: {
                      include: {
                        Quotations_Detail: true,
                        CustomerContact: true,
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
        massage: "Get All Receive PO and SO",
        result: results,
        page: pagination.page,
        limit: pagination.perPage,
        totalData: poandsoCount,
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

const updatePoandSo = async (request: Request, response: Response) => {
  try {
    await prisma.$transaction(
      async (prisma) => {
        let result: any = [];
        result = await prisma.poandso.update({
          where: {
            id: request.body.id,
          },
          data: {
            id_receive: request.body.id_receive,
            date_receive: request.body.date_receive,
          },
        });
        const statusReceive: any = await prisma.detailMr.findFirst({
          where: {
            poandsoId: result.id,
          },
        });
        const updateVerify = request.body.detailMr.map(
          (updateByveri: { qty_receive: any; status_stock: any; id: any }) => {
            return {
              qty_receive: updateByveri.qty_receive,
              status_stock: updateByveri.status_stock,
              id: updateByveri.id,
            };
          }
        );
        const updateVerifySr = request.body.srDetail.map(
          (updateVerifySr: {
            qty_receive: any;
            id: any;
          }) => {
            return {
              qty_receive: updateVerifySr.qty_receive,
              id: updateVerifySr.id,
            };
          }
        );
        let upsertDetailMr: any = [];
        if (result && updateVerify) {
          for (let i = 0; i < updateVerify.length; i++) {
            upsertDetailMr = await prisma.detailMr.update({
              where: {
                id: updateVerify[i].id,
              },
              data: {
                qty_receive: updateVerify[i].qty_receive,
                status_stock: updateVerify[i].status_stock,
              },
            });
            if (
              (result &&
                statusReceive?.qtyAppr === upsertDetailMr.qty_receive) ||
              statusReceive?.qtyAppr < upsertDetailMr.qty_receive
            ) {
              result = await prisma.poandso.update({
                where: {
                  id: result.id,
                },
                data: {
                  status_receive: true,
                },
              });
            } else {
              result = await prisma.poandso.update({
                where: {
                  id: result.id,
                },
                data: {
                  status_receive: false,
                },
              });
            }
          }
          response.status(201).json({
            success: true,
            massage: "Success Update Data",
            results: result,
          });
        } else if (result && updateVerifySr) {
          for (let i = 0; i < updateVerify.length; i++) {
            upsertDetailMr = await prisma.srDetail.update({
              where: {
                id: updateVerify[i].id,
              },
              data: {
                qty_receive: updateVerify[i].qty_receive,
              },
            });
            if (
              (result &&
                statusReceive?.qtyAppr === upsertDetailMr.qty_receive) ||
              statusReceive?.qtyAppr < upsertDetailMr.qty_receive
            ) {
              result = await prisma.poandso.update({
                where: {
                  id: result.id,
                },
                data: {
                  status_receive: true,
                },
              });
            } else {
              result = await prisma.poandso.update({
                where: {
                  id: result.id,
                },
                data: {
                  status_receive: false,
                },
              });
            }
          }
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
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable, // optional, default defined by database configuration
        maxWait: 5000, // default: 2000
        timeout: 10000, // default: 5000
      }
    );
  } catch (error) {
    response.status(500).json({ massage: error.message, code: error }); // this will log any error that prisma throws + typesafety. both code and message are a string
  }
};

export default {
  getPo,
  getPoandSo,
  createPo,
  updateStatusMpoandso,
  updatePoandSo,
  getAllReceive,
};
