import { Request, Response } from "express";
import prisma from "../middleware/srimg";
import pagging from "../utils/paggination";
import url from "url";

const getSrimg = async (request: Request, response: Response) => {
  try {
    const pencarian: any = request.query.search || "";
    const status: any = request.query.status || undefined;
    const hostname: any = request.headers.host;
    const pathname = url.parse(request.url).pathname;
    const page: any = request.query.page;
    const perPage: any = request.query.perPagee;
    const pagination: any = new pagging(page, perPage, hostname, pathname);
    const srCount = await prisma.srimg.count({
      where: {
        deleted: null,
      },
    });
    let results;
    if (request.query.page === undefined && status != undefined) {
      results = await prisma.srimg.findMany({
        where: {
          status_spv: status,
          status_manager: status,
          OR: [
            {
              bom: {
                deleted: null,
              },
            },
            {
              bom: null,
            },
          ],
          NOT: {
            bom: {
              deleted: null,
            },
          },
        },
        include: {
          srimgdetail: {
            include: {
              imgSummary: true,
            },
          },
          timeschedule: {
            include: {
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
          createdAt: "desc",
        },
      });
    } else {
      results = await prisma.srimg.findMany({
        where: {
          OR: [
            {
              timeschedule: {
                wor: {
                  job_no: {
                    contains: pencarian,
                    mode: "insensitive",
                  },
                },
              },
            },
            {
              timeschedule: {
                wor: {
                  customerPo: {
                    quotations: {
                      Customer: {
                        name: {
                          contains: pencarian,
                          mode: "insensitive",
                        },
                      },
                    },
                  },
                },
              },
            },
          ],
        },
        include: {
          srimgdetail: {
            include: {
              imgSummary: true,
            },
          },
          timeschedule: {
            include: {
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
          createdAt: "desc",
        },
        take: parseInt(pagination.perPage),
        skip: parseInt(pagination.page) * parseInt(pagination.perPage),
      });
    }
    if (results.length > 0) {
      return response.status(200).json({
        success: true,
        massage: "Get All Summary Report img",
        result: results,
        page: pagination.page,
        limit: pagination.perPage,
        totalData: srCount,
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

const getSumaryTms = async (request: Request, response: Response) => {
  try {
    const result = await prisma.timeschedule.findMany({
      where: {
        OR: [
          {
            deleted: null,
          },
          {
            srimg: {
              deleted: null,
            },
          },
        ],
        NOT: {
          srimg: {
            deleted: null,
          },
        },
      },
      orderBy: {
        id: "desc",
      },
      include: {
        srimg: {
          include: {
            srimgdetail: true,
          },
        },
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
        aktivitas: {
          include: {
            masterAktivitas: true,
          },
        },
      },
    });
    if (result.length > 0) {
      return response.status(200).json({
        success: true,
        massage: "Get All Tms Summary",
        result: result,
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

const getSrimBom = async (request: Request, response: Response) => {
  try {
    const results = await prisma.srimg.findMany({
      where: {
        NOT: {
          bom: {
            deleted: null,
          },
        },
      },
      include: {
        bom: true,
        srimgdetail: {
          include: {
            imgSummary: true,
          },
        },
        timeschedule: {
          include: {
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
        createdAt: "desc",
      },
    });
    if (results.length > 0) {
      return response.status(200).json({
        success: true,
        massage: "Get All Summary Bill Of material",
        result: results,
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

const createSrimg = async (request: any, response: Response) => {
  try {
    const newArrDetail: any = [];
    const detailSum: any = JSON.parse(request.body.srimgdetail);
    for (let i = 0; i < detailSum.length; i++) {
      newArrDetail.push({
        name_part: detailSum[i].name_part,
        qty: detailSum[i].qty,
        input_finding: detailSum[i].input_finding,
        imgSummary: detailSum[i].imgSummary,
        choice: detailSum[i].choice,
        noted: detailSum[i].noted,
      });
    }
    const summary = await prisma.srimg.create({
      data: {
        date_of_summary: new Date(request.body.date_of_summary),
        id_summary: request.body.id_summary,
        timeschedule: { connect: { id: request.body.timeschId } },
        ioem: request.body.ioem,
        isr: request.body.isr,
        itn: request.body.itn,
        introduction: request.body.introduction,
        inimg: !request.file ? null : request.file.path,
      },
    });
    newArrDetail.map(async (e: any, i: number) => {
      await prisma.srimgdetail.create({
        data: {
          srId: summary.id,
          name_part: e.name_part,
          qty: e.qty,
          input_finding: e.input_finding,
          choice: e.choice,
          noted: e.noted,
          imgSummary: {
            create: e.imgSummary,
          },
        },
        include: {
          imgSummary: true,
        },
      });
    });
    if (summary) {
      response.status(201).json({
        success: true,
        massage: "Success Add Data",
      });
    } else {
      response.status(200).json({
        success: false,
        massage: "Unsuccess Add Data",
      });
    }
  } catch (error) {
    response.status(500).json({ massage: error.message, code: error }); // this will log any error that prisma throws + typesafety. both code and message are a string
  }
};

const createImgMany = async (request: any, response: Response) => {
  try {
    const imgArr: any = [];
    if (request.files) {
      const files = request.files;
      for (const file of files) {
        const newArr = {
          img: !files ? null : file.path,
        };

        imgArr.push(newArr);
      }
    }
    if (imgArr) {
      response.status(201).json({
        success: true,
        massage: "Success Add Data",
        img: imgArr,
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

const updateSrimg = async (request: any, response: Response) => {
  try {
    const id: string = request.params.id;
    const updateSrimg = await prisma.srimg.update({
      where: {
        id: id,
      },
      data: {
        date_of_summary: new Date(request.body.date_of_summary),
        ioem: request.body.ioem,
        isr: request.body.isr,
        itn: request.body.itn,
        introduction: request.body.introduction,
        inimg: !request.file ? request.body.inimg : request.file.path,
      },
    });
    if (updateSrimg) {
      response.status(201).json({
        success: true,
        massage: "Success Update Data",
        results: updateSrimg,
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

const updateSrimgDetail = async (request: any, response: Response) => {
  try {
    const updateVerify = request.body.map(
      (updateByveri: {
        name_part: any;
        srId: any;
        qty: any;
        input_finding: any;
        choice: any;
        noted: any;
        id: any;
      }) => {
        return {
          name_part: updateByveri.name_part,
          srId: updateByveri.srId,
          qty: parseInt(updateByveri.qty),
          input_finding: updateByveri.input_finding,
          choice: updateByveri.choice,
          noted: updateByveri.noted,
          id: updateByveri.id,
        };
      }
    );

    let result: any = [];
    for (let i = 0; i < updateVerify.length; i++) {
      const updateSrimgDetail = await prisma.srimgdetail.upsert({
        where: {
          id: updateVerify[i].id,
        },
        create: {
          name_part: updateVerify[i].name_part,
          srimg: { connect: { id: updateVerify[i].srId } },
          qty: parseInt(updateVerify[i].qty),
          input_finding: updateVerify[i].input_finding,
          choice: updateVerify[i].choice,
          noted: updateVerify[i].noted,
        },
        update: {
          name_part: updateVerify[i].name_part,
          srimg: { connect: { id: updateVerify[i].srId } },
          qty: parseInt(updateVerify[i].qty),
          input_finding: updateVerify[i].input_finding,
          choice: updateVerify[i].choice,
          noted: updateVerify[i].noted,
        },
      });
      result = [...result, updateSrimgDetail];
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

const updateImgSr = async (request: any, response: Response) => {
  try {
    const imgArr: any = [];
    if (request.files) {
      const files = request.files;
      for (const file of files) {
        const newArr = {
          img: file.path,
        };

        imgArr.push(newArr);
      }
    }
    const arrBody = request.body;
    let arr: any = [
      {
        id: arrBody.id,
        srimgdetailId: arrBody.srimgdetailId,
        img: imgArr,
      },
    ];
    arr[0].img.map(async (e: any, i: number) => {
      await prisma.imgSummary.upsert({
        where: {
          id: arr[0].id,
        },
        create: {
          srimgdetail: { connect: { id: arr[0].srimgdetailId } },
          img: e.img,
        },
        update: {
          img: e.img,
        },
      });
    });
    if (imgArr.length === arr[0].img.length) {
      response.status(201).json({
        success: true,
        massage: "Success Add Data",
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

const updateSumaryStatus = async (request: Request, response: Response) => {
  try {
    const id = request.params.id;
    const statusPenc = await prisma.srimg.findFirst({
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
      result = await prisma.srimg.update({
        where: { id: id },
        data: {
          status_spv: "valid",
        },
      });
    } else {
      result = await prisma.srimg.update({
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

const updateSumaryStatusM = async (request: Request, response: Response) => {
  try {
    const id = request.params.id;
    const statusPenc = await prisma.srimg.findFirst({
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
      result = await prisma.srimg.update({
        where: { id: id },
        data: {
          status_manager: "valid",
        },
      });
    } else {
      result = await prisma.srimg.update({
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

const deleteSrimg = async (request: any, response: Response) => {
  try {
    const id: string = request.params.id;
    const updateSrimg = await prisma.srimg.delete({
      where: {
        id: id,
      },
    });
    if (updateSrimg) {
      response.status(201).json({
        success: true,
        massage: "Success Update Data",
        results: updateSrimg,
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

const deleteSrimgDetail = async (request: any, response: Response) => {
  try {
    const id: string = request.params.id;
    const deleteSrimgDetail = await prisma.srimgdetail.delete({
      where: {
        id: id,
      },
    });
    if (deleteSrimgDetail) {
      response.status(201).json({
        success: true,
        massage: "Success Update Data",
        results: deleteSrimgDetail,
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

const deleteSrimgImg = async (request: any, response: Response) => {
  try {
    const id: string = request.params.id;
    const deleteSrimgImg = await prisma.imgSummary.delete({
      where: {
        id: id,
      },
    });
    if (deleteSrimgImg) {
      response.status(201).json({
        success: true,
        massage: "Success Update Data",
        results: deleteSrimgImg,
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
  getSrimg,
  getSrimBom,
  getSumaryTms,
  createSrimg,
  createImgMany,
  updateSrimg,
  deleteSrimg,
  updateSrimgDetail,
  updateImgSr,
  updateSumaryStatus,
  updateSumaryStatusM,
  deleteSrimgDetail,
  deleteSrimgImg,
};
