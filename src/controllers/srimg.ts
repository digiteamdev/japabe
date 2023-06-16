import { Request, Response } from "express";
import prisma from "../middleware/srimg";
import pagging from "../utils/paggination";
import url from "url";

const getSrimg = async (request: Request, response: Response) => {
  try {
    const pencarian: any = request.query.search || "";
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
    if (request.query.page === undefined) {
      results = await prisma.srimg.findMany({
        include: {
          wor: true,
          srimgdetail: {
            include: {
              imgSummary: true,
            },
          },
        },
      });
    } else {
      results = await prisma.srimg.findMany({
        where: {
          worId: {
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
          srimgdetail: {
            include: {
              imgSummary: true,
            },
          },
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

const createSrimg = async (request: any, response: Response) => {
  try {
    const newArrDetail: any = [];
    const detailSum: any = JSON.parse(request.body.srimgdetail);
    for (let i = 0; i < detailSum.length; i++) {
      newArrDetail.push({
        name_part: detailSum[i].name_part,
        qty: detailSum[i].qty,
        input_finding: detailSum[i].input_finding,
        choice: detailSum[i].choice,
        noted: detailSum[i].noted,
      });
    }
    const summary = await prisma.srimg.create({
      data: {
        date_of_summary: new Date(request.body.date_of_summary),
        wor: { connect: { id: request.body.worId } },
        ioem: request.body.ioem,
        isr: request.body.isr,
        itn: request.body.itn,
        introduction: request.body.introduction,
        inimg: !request.file ? "" : request.file.path,
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
      if (i + 1 === newArrDetail.length) {
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
    });
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
          img: file.path,
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
        wor: { connect: { id: request.body.worId } },
        ioem: request.body.ioem,
        isr: request.body.isr,
        itn: request.body.itn,
        introduction: request.body.introduction,
        inimg: !request.file ? "" : request.file.path,
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
    const newArr = JSON.parse(request.body.srimgdetail);
    const updateVerify = newArr.map(
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
          qty: updateByveri.qty,
          input_finding: updateByveri.input_finding,
          choice: updateByveri.choice,
          noted: updateByveri.choice,
          id: updateByveri.choice,
        };
      }
    );
    console.log(updateVerify);
    
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
          noted: updateVerify[i].choice,
        },
        update: {
          name_part: updateVerify[i].name_part,
          qty: parseInt(updateVerify[i].qty),
          input_finding: updateVerify[i].input_finding,
          choice: updateVerify[i].choice,
          noted: updateVerify[i].choice,
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

export default {
  getSrimg,
  createSrimg,
  createImgMany,
  updateSrimg,
  deleteSrimg,
  updateSrimgDetail,
};
