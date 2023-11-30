import { Request, Response } from "express";
import prisma from "../middleware/cashier";
import pagging from "../utils/paggination";
import url from "url";

const getCashier = async (request: Request, response: Response) => {
  try {
    const pencarian: any = request.query.search || "";
    const hostname: any = request.headers.host;
    const pathname = url.parse(request.url).pathname;
    const page: any = request.query.page;
    const perPage: any = request.query.perPage;
    const pagination: any = new pagging(page, perPage, hostname, pathname);
    const cashieCount = await prisma.cashier.count({
      where: {
        deleted: null,
      },
    });
    let results;
    if (request.query.page === undefined) {
      results = await prisma.kontrabon.findMany({
        where: {
          AND: [
            {
              status_valid: true,
            },
            {
              cashier: {
                every: {
                  kontrabonId: "null",
                },
              },
            },
          ],
        },
        include: {
          cashier: true,
          SupplierBank: {
            include: {
              supplier: {
                include: {
                  SupplierContact: true,
                },
              },
            },
          },
          purchase: {
            include: {
              supplier: {
                include: {
                  SupplierBank: true,
                  SupplierContact: true,
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
          },
          term_of_pay_po_so: {
            include: {
              poandso: {
                include: {
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
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      results = await prisma.cashier.findMany({
        where: {
          id_cashier: {
            contains: pencarian,
            mode: "insensitive",
          },
        },
        include: {
          journal_cashier: {
            include: {
              coa: true,
            },
          },
          kontrabon: {
            include: {
              purchase: {
                include: {
                  supplier: {
                    include: {
                      SupplierBank: true,
                      SupplierContact: true,
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
              },
              SupplierBank: true,
              term_of_pay_po_so: {
                include: {
                  poandso: {
                    include: {
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
        massage: "Get All Cashier",
        result: results,
        page: pagination.page,
        limit: pagination.perPage,
        totalData: cashieCount,
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

const createCashier = async (request: Request, response: Response) => {
  try {
    const results = await prisma.cashier.create({
      data: {
        id_cashier: request.body.id_cashier,
        status_payment: request.body.status_payment,
        kontrabon: { connect: { id: request.body.kontrabonId } },
        date_cashier: request.body.date_cashier,
        note: request.body.note,
        total: request.body.total,
        journal_cashier: {
          create: request.body.journal_cashier,
        },
      },
      include: {
        journal_cashier: true,
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

const updateCashier = async (request: Request, response: Response) => {
  try {
    const id: string = request.params.id;
    let result: any = [];
    result = await prisma.cashier.update({
      where: {
        id: id,
      },
      data: {
        status_payment: request.body.status_payment,
      },
    });
    const updateVerify = request.body.journal_cashier.map(
      (updateByveri: {
        coa_id: any;
        status_transaction: any;
        grandtotal: any;
        cashier_id: any;
        id: any;
      }) => {
        return {
          coa_id: updateByveri.coa_id,
          status_transaction: updateByveri.status_transaction,
          grandtotal: updateByveri.grandtotal,
          cashier_id: updateByveri.cashier_id,
          id: updateByveri.id,
        };
      }
    );
    for (let i = 0; i < updateVerify.length; i++) {
      const updateDetail = await prisma.journal_cashier.upsert({
        where: {
          id: updateVerify[i].id,
        },
        create: {
          cashier: { connect: { id: updateVerify[i].cashier_id } },
          coa: { connect: { id: updateVerify[i].coa_id } },
          status_transaction: updateVerify[i].status_transaction,
          grandtotal: updateVerify[i].grandtotal,
        },
        update: {
          coa: { connect: { id: updateVerify[i].coa_id } },
          status_transaction: updateVerify[i].status_transaction,
          grandtotal: updateVerify[i].grandtotal,
        },
      });
      result = [...result, updateDetail];
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

const deleteCashier = async (request: Request, response: Response) => {
  try {
    const id: string = request.params.id;
    const deleteCashier = await prisma.cashier.delete({
      where: {
        id: id,
      },
    });
    if (deleteCashier) {
      response.status(201).json({
        success: true,
        massage: "Success Delete Data",
        results: deleteCashier,
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

const deleteDetailCashier = async (request: Request, response: Response) => {
  try {
    const id: string = request.params.id;
    const deleteDetailCashier = await prisma.journal_cashier.delete({
      where: {
        id: id,
      },
    });
    if (deleteDetailCashier) {
      response.status(201).json({
        success: true,
        massage: "Success Delete Data",
        results: deleteDetailCashier,
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

const updateStatusM = async (request: any, response: Response) => {
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
    const statusPenc = await prisma.cashier.findFirst({
      where: {
        id: id,
      },
    });
    let result;
    if (
      (emplo?.position === "Manager" && statusPenc?.status_valid === null) ||
      statusPenc?.status_valid === false
    ) {
      result = await prisma.cashier.update({
        where: { id: id },
        data: {
          status_valid: true,
        },
      });
    } else {
      result = await prisma.cashier.update({
        where: { id: id },
        data: {
          status_valid: false,
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

export default {
  getCashier,
  createCashier,
  updateCashier,
  deleteCashier,
  deleteDetailCashier,
  updateStatusM,
};
