import { Request, Response } from "express";
import prisma from "../middleware/Sr";
import pagging from "../utils/paggination";
import url from "url";

const getSr = async (request: any, response: Response) => {
  try {
    const pencarian: any = request.query.search || "";
    const status: any = request.query.status || undefined;
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
    let results;
    if (request.query.page === undefined && status != undefined) {
      results = await prisma.sr.findMany({
        where: {
          status_spv: status,
          status_manager: status,
          no_sr: {
            contains: "",
          },
        },
      });
    } else {
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
      if (
        emplo?.position === "Supervisor" ||
        emplo?.position === "Manager" ||
        emplo?.position === "Director"
      ) {
        results = await prisma.sr.findMany({
          where: {
            no_sr: {
              contains: pencarian,
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
            SrDetail: {
              include: {
                workCenter: true,
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
        results = await prisma.sr.findMany({
          where: {
            user: {
              username: request.session.userId,
            },
            no_sr: {
              contains: pencarian,
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
            SrDetail: {
              include: {
                workCenter: true,
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
        massage: "Get All Service Request",
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

const createSr = async (request: Request, response: Response) => {
  try {
    const r = Math.floor(Math.random() * 1000) + 1;
    const genarate = "SR" + r;
    const dispatchNull = request.body.dispacthIDS;
    let results;
    if (dispatchNull === null) {
      results = await prisma.sr.create({
        data: {
          no_sr: genarate,
          user: { connect: { id: request.body.userId } },
          date_sr: new Date(request.body.date_sr),
          wor: { connect: { id: request.body.worId } },
          SrDetail: {
            create: request.body.SrDetail,
          },
        },
        include: {
          SrDetail: true,
        },
      });
    } else {
      results = await prisma.sr.create({
        data: {
          no_sr: genarate,
          user: { connect: { id: request.body.userId } },
          dispacth: { connect: { id: request.body.dispacthIDS } },
          wor: { connect: { id: request.body.worId } },
          date_sr: new Date(request.body.date_sr),
          SrDetail: {
            create: request.body.SrDetail,
          },
        },
        include: {
          SrDetail: true,
        },
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

const updateSrStatus = async (request: any, response: Response) => {
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
    const statusPenc = await prisma.sr.findFirst({
      where: {
        id: id,
      },
    });
    let result;
    if (
      (emplo?.position === "Supervisor" && statusPenc?.status_spv === null) ||
      statusPenc?.status_spv === "unvalid"
    ) {
      const id = request.params.id;
      result = await prisma.sr.update({
        where: { id: id },
        data: {
          status_spv: "valid",
        },
      });
    } else {
      result = await prisma.sr.update({
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

const updateSrStatusM = async (request: any, response: Response) => {
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
    const statusPenc = await prisma.sr.findFirst({
      where: {
        id: id,
      },
    });

    let result;
    if (
      (emplo?.position === "Manager" && statusPenc?.status_manager === null) ||
      statusPenc?.status_manager === "unvalid"
    ) {
      const id = request.params.id;
      result = await prisma.sr.update({
        where: { id: id },
        data: {
          status_manager: "valid",
        },
      });
    } else {
      result = await prisma.sr.update({
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

const updateSr = async (request: Request, response: Response) => {
  try {
    const id: string = request.params.id;
    const updateSr = await prisma.sr.update({
      where: {
        id: id,
      },
      data: request.body,
    });
    if (updateSr) {
      response.status(201).json({
        success: true,
        massage: "Success Update Data",
        results: updateSr,
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

const upsertSr = async (request: Request, response: Response) => {
  try {
    const updateVerify = request.body.map(
      (updateByveri: {
        srId: any;
        dispacthdetailId: any;
        part: any;
        qty: any;
        unit: any;
        description: any;
        note: any;
        id: any;
      }) => {
        return {
          srId: updateByveri.srId,
          dispacthdetailId: updateByveri.dispacthdetailId,
          part: updateByveri.part,
          qty: updateByveri.qty,
          unit: updateByveri.unit,
          description: updateByveri.description,
          note: updateByveri.note,
          id: updateByveri.id,
        };
      }
    );
    let result: any = [];
    for (let i = 0; i < updateVerify.length; i++) {
      let updateSr;
      if (updateVerify[i].dispacthdetailId === null)
        updateSr = await prisma.srDetail.upsert({
          where: {
            id: updateVerify[i].id,
          },
          create: {
            sr: { connect: { id: updateVerify[i].srId } },
            part: updateVerify[i].part,
            qty: updateVerify[i].qty,
            unit: updateVerify[i].unit,
            workCenter: { connect: { id: updateVerify[i].description } },
            note: updateVerify[i].note,
          },
          update: {
            sr: { connect: { id: updateVerify[i].srId } },
            part: updateVerify[i].part,
            qty: updateVerify[i].qty,
            unit: updateVerify[i].unit,
            workCenter: { connect: { id: updateVerify[i].description } },
            note: updateVerify[i].note,
          },
        });
      if (updateVerify[i].dispacthdetailId !== null)
        updateSr = await prisma.srDetail.upsert({
          where: {
            id: updateVerify[i].id,
          },
          create: {
            sr: { connect: { id: updateVerify[i].srId } },
            dispatchDetail: {
              connect: { id: updateVerify[i].dispacthdetailId },
            },
            part: updateVerify[i].part,
            qty: updateVerify[i].qty,
            unit: updateVerify[i].unit,
            workCenter: { connect: { id: updateVerify[i].description } },
            note: updateVerify[i].note,
          },
          update: {
            sr: { connect: { id: updateVerify[i].srId } },
            dispatchDetail: {
              connect: { id: updateVerify[i].dispacthdetailId },
            },
            part: updateVerify[i].part,
            qty: updateVerify[i].qty,
            unit: updateVerify[i].unit,
            workCenter: { connect: { id: updateVerify[i].description } },
            note: updateVerify[i].note,
          },
        });
      result = [...result, updateSr];
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

const deleteSr = async (request: Request, response: Response) => {
  try {
    const id: string = request.params.id;
    const deleteSr = await prisma.sr.delete({
      where: {
        id: id,
      },
    });
    if (deleteSr) {
      response.status(201).json({
        success: true,
        massage: "Success Delete Data",
        results: deleteSr,
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

const deleteDetailSr = async (request: Request, response: Response) => {
  try {
    const id: string = request.params.id;
    const deleteSrDetail = await prisma.srDetail.delete({
      where: {
        id: id,
      },
    });
    if (deleteSrDetail) {
      response.status(201).json({
        success: true,
        massage: "Success Delete Data",
        results: deleteSr,
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

const getApprovalSr = async (request: Request, response: Response) => {
  try {
    const pencarian: any = request.query.search || "";
    const hostname: any = request.headers.host;
    const pathname = url.parse(request.url).pathname;
    const page: any = request.query.page;
    const perPage: any = request.query.perPage;
    const pagination: any = new pagging(page, perPage, hostname, pathname);
    const approvalCount = await prisma.approvedRequest.count({
      where: {
        deleted: null,
        idApprove: {
          startsWith: "SA",
        },
      },
    });
    let results;
    if (request.query.page === undefined) {
      results = await prisma.approvedRequest.findMany({
        where: {
          idApprove: {
            startsWith: "SA",
          },
        },
        include: {
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
          SrDetail: {
            include: {
              workCenter: true,
              sr: {
                include: {
                  wor: {
                    include: {
                      customerPo: {
                        include: {
                          quotations: {
                            include: {
                              Customer: true,
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
              supplier: true,
              dispatchDetail: {
                include: {
                  dispacth: {
                    include: {
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
      results = await prisma.approvedRequest.findMany({
        where: {
          AND: [
            {
              idApprove: {
                startsWith: "SA",
              },
            },
            {
              idApprove: {
                contains: pencarian,
              },
            },
          ],
        },
        include: {
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
          SrDetail: {
            include: {
              workCenter: true,
              sr: {
                include: {
                  wor: {
                    include: {
                      customerPo: {
                        include: {
                          quotations: {
                            include: {
                              Customer: true,
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
              supplier: true,
              dispatchDetail: {
                include: {
                  dispacth: {
                    include: {
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
        massage: "Get All SrApproval",
        result: results,
        page: pagination.page,
        limit: pagination.perPage,
        totalData: approvalCount,
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

const updateApprovalSr = async (request: Request, response: Response) => {
  try {
    let result: any = [];
    result = await prisma.approvedRequest.create({
      data: {
        idApprove: request.body.idApprove,
        dateApprove: new Date(request.body.dateApprove),
        user: { connect: { id: request.body.approveById } },
      },
    });
    const updateVerify = request.body.srDetail.map(
      (updateByveri: { srappr: any; supId: any; qtyAppr: any; id: any }) => {
        return {
          srappr: updateByveri.srappr,
          supId: updateByveri.supId,
          qtyAppr: updateByveri.qtyAppr,
          id: updateByveri.id,
        };
      }
    );
    if (result) {
      for (let i = 0; i < updateVerify.length; i++) {
        let upsertDetailSr;
        upsertDetailSr = await prisma.srDetail.update({
          where: {
            id: updateVerify[i].id,
          },
          data: {
            srappr: updateVerify[i].srappr,
            supplier: { connect: { id: updateVerify[i].supId } },
            approvedRequest: { connect: { id: result.id } },
            qtyAppr: parseInt(updateVerify[i].qtyAppr),
          },
        });
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
  } catch (error) {
    response.status(500).json({ massage: error.message, code: error }); // this will log any error that prisma throws + typesafety. both code and message are a string
  }
};

const getdetailSr = async (request: Request, response: Response) => {
  try {
    const pencarian: any = request.query.search || "";
    const hostname: any = request.headers.host;
    const pathname = url.parse(request.url).pathname;
    const page: any = request.query.page;
    const perPage: any = request.query.perPage;
    const pagination: any = new pagging(page, perPage, hostname, pathname);
    const pr = await prisma.srDetail.count({
      where: {
        deleted: null,
        NOT: {
          idPurchaseR: null,
        },
      },
    });
    let results;
    if (request.query.page === undefined) {
      results = await prisma.srDetail.findMany({
        where: {
          approvedRequestId: null,
        },
        include: {
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
          workCenter: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      results = await prisma.mr.findMany({
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
        massage: "Get All detail service request",
        result: results,
        page: pagination.page,
        limit: pagination.perPage,
        totalData: pr,
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

const updateApprovalOneSR = async (request: Request, response: Response) => {
  try {
    const id: string = request.body.id;
    let result: any = [];
    result = await prisma.approvedRequest.update({
      where: {
        id: id,
      },
      data: {
        user: { connect: { id: request.body.approveById } },
      },
    });
    const updateVerify = request.body.srDetail.map(
      (updateByveri: {
        srappr: any;
        supId: any;
        qtyAppr: any;
        approvedRequestId: any;
        id: any;
      }) => {
        return {
          approvedRequestId: updateByveri.approvedRequestId,
          srappr: updateByveri.srappr,
          supId: updateByveri.supId,
          qtyAppr: updateByveri.qtyAppr,
          id: updateByveri.id,
        };
      }
    );
    for (let i = 0; i < updateVerify.length; i++) {
      if (updateVerify.approvedRequestId === null) {
        let upsertDetailSr;
        upsertDetailSr = await prisma.srDetail.update({
          where: {
            id: updateVerify[i].id,
          },
          data: {
            srappr: updateVerify[i].srappr,
            supplier: { disconnect: true },
            approvedRequest: { disconnect: true },
            qtyAppr: parseInt(updateVerify[i].qtyAppr),
          },
        });
      } else {
        let upsertDetailSr;
        upsertDetailSr = await prisma.srDetail.update({
          where: {
            id: updateVerify[i].id,
          },
          data: {
            srappr: updateVerify[i].srappr,
            supplier: { connect: { id: updateVerify[i].supId } },
            approvedRequest: {
              connect: { id: updateVerify[i].approvedRequestId },
            },
            qtyAppr: parseInt(updateVerify[i].qtyAppr),
          },
        });
      }
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
  getSr,
  getdetailSr,
  createSr,
  updateSr,
  upsertSr,
  updateSrStatus,
  updateSrStatusM,
  deleteSr,
  deleteDetailSr,
  getApprovalSr,
  updateApprovalSr,
  updateApprovalOneSR,
};
