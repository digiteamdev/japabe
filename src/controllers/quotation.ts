import { Request, Response } from "express";
import prisma from "../middleware/quotation";
import pagging from "../utils/paggination";
import url from "url";
import { Prisma } from "@prisma/client";

const getQuotation = async (request: Request, response: Response) => {
  try {
    const pencarian: any = request.query.search || "";
    const divisi: any = request.query.divisi || "";
    const hostname: any = request.headers.host;
    const pathname = url.parse(request.url).pathname;
    const page: any = request.query.page;
    const perPage: any = request.query.perPage;
    const pagination: any = new pagging(page, perPage, hostname, pathname);
    const quotationtCount = await prisma.quotations.count({
      where: {
        deleted: null,
        job_operational: divisi,
      },
    });
    let results;
    if (request.query.page === undefined) {
      results = await prisma.quotations.findMany({
        where: {
          job_operational: divisi,
          deleted: null,
          OR: [
            {
              CustomerPo: null,
            },
            {
              NOT: {
                CustomerPo: {
                  deleted: null,
                },
              },
            },
          ],
        },
        include: {
          price_quotation: true,
          CustomerPo: true,
          Customer: {
            include: {
              address: true,
            },
          },
          CustomerContact: true,
        },
        orderBy: {
          quo_num: "asc",
        },
      });
    } else {
      results = await prisma.quotations.findMany({
        where: {
          job_operational: divisi,
          OR: [
            {
              Customer: {
                name: {
                  contains: pencarian,
                  mode: "insensitive",
                },
              },
            },
            {
              quo_num: {
                contains: pencarian,
                mode: "insensitive",
              },
            },
            {
              price_quotation: {
                some: {
                  description: {
                    contains: pencarian,
                    mode: "insensitive",
                  },
                },
              },
            },
          ],
        },
        include: {
          price_quotation: true,
          CustomerPo: true,
          Customer: {
            include: {
              address: true,
            },
          },
          CustomerContact: true,
        },
        orderBy: {
          quo_num: "asc",
        },
        take: parseInt(pagination.perPage),
        skip: parseInt(pagination.page) * parseInt(pagination.perPage),
      });
    }
    if (results.length > 0) {
      return response.status(200).json({
        success: true,
        massage: "Get All Quotation",
        result: results,
        page: pagination.page,
        limit: pagination.perPage,
        totalData: quotationtCount,
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

const getEditPoQuotation = async (request: Request, response: Response) => {
  try {
    const results = await prisma.quotations.findMany({
      where: {
        OR: [
          {
            CustomerPo: null,
          },
          { id: request.params.id },
        ],
      },
      include: {
        CustomerPo: true,
        Customer: {
          include: {
            address: true,
          },
        },
        CustomerContact: true,
      },
    });
    if (results.length > 0) {
      return response.status(200).json({
        success: true,
        massage: "Get All Quotation",
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

const createQuotation = async (request: any, response: Response) => {
  try {
    await prisma.$transaction(
      async (prisma) => {
        let results: any;
        results = await prisma.quotations.create({
          data: {
            quo_num: request.body.quo_num,
            quo_auto: request.body.quo_auto,
            job_operational: request.body.job_operational,
            Customer: { connect: { id: request.body.customerId } },
            CustomerContact: {
              connect: { id: request.body.customercontactId },
            },
            subject: request.body.subject,
            attention: request.body.attention,
            send_by: request.body.send_by,
            estimated_delivery: request.body.estimated_delivery,
            date: new Date(request.body.date),
            quo_img: !request.file ? request.body.quo_img : request.file.path,
            warranty: request.body.warranty,
            note_payment: request.body.note_payment,
            term_payment: request.body.term_payment,
            Quotations_Detail: request.body.Quotations_Detail,
            price_quotation: {
              create: JSON.parse(request.body.price_quotation),
            },
          },
          include: {
            price_quotation: true,
          },
        });
        // let details = JSON.parse(request.body.Quotations_Detail);
        // for (let i = 0; i < details.length; i++) {
        //   let detail = await prisma.quotations_Detail.create({
        //     data: {
        //       quotations: { connect: { id: results.id } },
        //       item_of_work: details[i].item_of_work,
        //     },
        //   });
        //   if (details[i].Child_QuDet.length > 0) {
        //     for (
        //       let index = 0;
        //       index < details[i].Child_QuDet.length;
        //       index++
        //     ) {
        //       await prisma.child_QuDet.create({
        //         data: {
        //           Quotations_Detail: { connect: { id: detail.id } },
        //           item_of_work: details[i].Child_QuDet[index].item_of_work,
        //         },
        //       });
        //     }
        //   }
        // }
        if (results) {
          return response.status(204).json({
            success: true,
            massage: "Success Add Data",
            result: results,
          });
        } else {
          return response.status(200).json({
            success: false,
            result: "Not Succes",
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

const updateQuotation = async (request: any, response: Response) => {
  try {
    const id: string = request.params.id;
    const lastRes = await prisma.quotations.findFirst({
      where: { id: id },
      orderBy: {
        updatedAt: "desc",
      },
    });

    const count = lastRes?.revision;

    const i: any = count;

    const autoIn: any = parseInt(i) + 1;

    const genarate: string = autoIn.toString();
    let result: any = [];
    const updateOne = await prisma.quotations.update({
      where: {
        id: id,
      },
      data: {
        quo_num: request.body.quo_num,
        quo_auto: request.body.quo_auto,
        job_operational: request.body.job_operational,
        revision: genarate,
        send_by: request.body.send_by,
        revision_desc: request.body.revision_desc,
        Customer: { connect: { id: request.body.customerId } },
        CustomerContact: { connect: { id: request.body.customercontactId } },
        subject: request.body.subject,
        attention: request.body.attention,
        estimated_delivery: request.body.estimated_delivery,
        date: new Date(request.body.date),
        quo_img: !request.file ? request.body.quo_img : request.file.path,
        warranty: request.body.warranty,
        Quotations_Detail: request.body.Quotations_Detail,
        note_payment: request.body.note_payment,
        term_payment: request.body.term_payment,
      },
    });
    const parsePrice = JSON.parse(request.body.price_quotation);
    const updateVerify = parsePrice.map(
      (updateByveri: {
        quo_id: any;
        qty: any;
        description: any;
        unit_price: any;
        total_price: any;
        unit: any;
        id: any;
      }) => {
        return {
          quo_id: updateByveri.quo_id,
          description: updateByveri.description,
          unit: updateByveri.unit,
          qty: updateByveri.qty,
          unit_price: updateByveri.unit_price,
          total_price: updateByveri.total_price,
          id: updateByveri.id,
        };
      }
    );
    const parsedDelete = JSON.parse(request.body.delete);
    const deleteQu = parsedDelete.map((deleteByveri: { id: any }) => {
      return {
        id: deleteByveri.id,
      };
    });
    if (updateVerify) {
      for (let i = 0; i < updateVerify.length; i++) {
        const updateQuotationEqPart = await prisma.price_quotation.upsert({
          where: {
            id: updateVerify[i].id,
          },
          create: {
            unit: updateVerify[i].unit,
            quotations: { connect: { id: updateVerify[i].quo_id } },
            description: updateVerify[i].description,
            unit_price: parseInt(updateVerify[i].unit_price),
            qty: parseInt(updateVerify[i].qty),
            total_price: parseInt(updateVerify[i].total_price),
          },
          update: {
            unit: updateVerify[i].unit,
            quotations: { connect: { id: updateVerify[i].quo_id } },
            description: updateVerify[i].description,
            unit_price: parseInt(updateVerify[i].unit_price),
            qty: parseInt(updateVerify[i].qty),
            total_price: parseInt(updateVerify[i].total_price),
          },
        });
        result = [...result, updateQuotationEqPart];
      }
    }
    if (deleteQu) {
      for (let i = 0; i < deleteQu.length; i++) {
        await prisma.price_quotation.delete({
          where: {
            id: deleteQu[i].id,
          },
        });
      }
    }
    if (result || updateOne || !updateVerify) {
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

const updateQuotationEqPart = async (request: Request, response: Response) => {
  try {
    const updateVerify = request.body.map(
      (updateByveri: {
        quo_id: any;
        qty: any;
        description: any;
        unit_price: any;
        total_price: any;
        id: any;
      }) => {
        return {
          quo_id: updateByveri.quo_id,
          description: updateByveri.description,
          qty: updateByveri.qty,
          unit_price: updateByveri.unit_price,
          total_price: updateByveri.total_price,
          id: updateByveri.id,
        };
      }
    );
    let result: any = [];
    for (let i = 0; i < updateVerify.length; i++) {
      const updateQuotationEqPart = await prisma.price_quotation.upsert({
        where: {
          id: updateVerify[i].id,
        },
        create: {
          unit: updateVerify[i].unit,
          quotations: { connect: { id: updateVerify[i].quo_id } },
          description: updateVerify[i].description,
          unit_price: updateVerify[i].unit_price,
          qty: updateVerify[i].qty,
          total_price: updateVerify[i].total_price,
        },
        update: {
          unit: updateVerify[i].unit,
          quotations: { connect: { id: updateVerify[i].quo_id } },
          description: updateVerify[i].description,
          unit_price: updateVerify[i].unit_price,
          qty: updateVerify[i].qty,
          total_price: updateVerify[i].total_price,
        },
      });
      result = [...result, updateQuotationEqPart];
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

// const updateQuotationDetail = async (request: Request, response: Response) => {
//   try {
//     const updateVerify = request.body.map(
//       (updateByveri: {
//         item_of_work: any;
//         quo_id: any;
//         qty: any;
//         unit: any;
//         price: any;
//         id: any;
//       }) => {
//         return {
//           item_of_work: updateByveri.item_of_work,
//           quo_id: updateByveri.quo_id,
//           qty: updateByveri.qty,
//           unit: updateByveri.unit,
//           price: updateByveri.price,
//           id: updateByveri.id,
//         };
//       }
//     );
//     let result: any = [];
//     for (let i = 0; i < updateVerify.length; i++) {
//       const updateQuotationDetail = await prisma.quotations_Detail.upsert({
//         where: {
//           id: updateVerify[i].id,
//         },
//         create: {
//           item_of_work: updateVerify[i].item_of_work,
//           quotations: { connect: { id: updateVerify[i].quo_id } },
//           qty: updateVerify[i].qty,
//           unit: updateVerify[i].unit,
//           price: updateVerify[i].price,
//         },
//         update: {
//           item_of_work: updateVerify[i].item_of_work,
//           quotations: { connect: { id: updateVerify[i].quo_id } },
//           qty: updateVerify[i].qty,
//           unit: updateVerify[i].unit,
//           price: updateVerify[i].price,
//         },
//       });
//       result = [...result, updateQuotationDetail];
//     }
//     if (result) {
//       response.status(201).json({
//         success: true,
//         massage: "Success Update Data",
//         result: result,
//       });
//     } else {
//       response.status(400).json({
//         success: false,
//         massage: "Unsuccess Update Data",
//       });
//     }
//   } catch (error) {
//     response.status(500).json({ massage: error.message, code: error }); // this will log any error that prisma throws + typesafety. both code and message are a string
//   }
// };

// const updateQuoDetChild = async (request: Request, response: Response) => {
//   try {
//     const updateVerify = request.body.map(
//       (updateByveri: { item_of_work: any; quoDetId: any; id: any }) => {
//         return {
//           item_of_work: updateByveri.item_of_work,
//           quoDetId: updateByveri.quoDetId,
//           id: updateByveri.id,
//         };
//       }
//     );
//     let result: any = [];
//     for (let i = 0; i < updateVerify.length; i++) {
//       const updateQuotationDetail = await prisma.child_QuDet.upsert({
//         where: {
//           id: updateVerify[i].id,
//         },
//         create: {
//           item_of_work: updateVerify[i].item_of_work,
//           Quotations_Detail: { connect: { id: updateVerify[i].quoDetId } },
//         },
//         update: {
//           item_of_work: updateVerify[i].item_of_work,
//           Quotations_Detail: { connect: { id: updateVerify[i].quoDetId } },
//         },
//       });
//       result = [...result, updateQuotationDetail];
//     }
//     if (result) {
//       response.status(201).json({
//         success: true,
//         massage: "Success Update Data",
//         result: result,
//       });
//     } else {
//       response.status(400).json({
//         success: false,
//         massage: "Unsuccess Update Data",
//       });
//     }
//   } catch (error) {
//     response.status(500).json({ massage: error.message, code: error }); // this will log any error that prisma throws + typesafety. both code and message are a string
//   }
// };

// const updateQuotationEqPart = async (request: Request, response: Response) => {
//   try {
//     const updateVerify = request.body.map(
//       (updateByveri: {
//         quo_id: any;
//         qty: any;
//         description: any;
//         unit_price: any;
//         total_price: any;
//         id: any;
//       }) => {
//         return {
//           quo_id: updateByveri.quo_id,
//           description: updateByveri.description,
//           qty: updateByveri.qty,
//           unit_price: updateByveri.unit_price,
//           total_price: updateByveri.total_price,
//           id: updateByveri.id,
//         };
//       }
//     );
//     let result: any = [];
//     for (let i = 0; i < updateVerify.length; i++) {
//       const updateQuotationEqPart = await prisma.price_quotation.upsert({
//         where: {
//           id: updateVerify[i].id,
//         },
//         create: {
//           unit: updateVerify[i].unit,
//           quotations: { connect: { id: updateVerify[i].quo_id } },
//           description: updateVerify[i].description,
//           unit_price: updateVerify[i].unit_price,
//           qty: updateVerify[i].qty,
//           total_price: updateVerify[i].total_price,
//         },
//         update: {
//           unit: updateVerify[i].unit,
//           quotations: { connect: { id: updateVerify[i].quo_id } },
//           description: updateVerify[i].description,
//           unit_price: updateVerify[i].unit_price,
//           qty: updateVerify[i].qty,
//           total_price: updateVerify[i].total_price,
//         },
//       });
//       result = [...result, updateQuotationEqPart];
//     }
//     if (result) {
//       response.status(201).json({
//         success: true,
//         massage: "Success Update Data",
//         result: result,
//       });
//     } else {
//       response.status(400).json({
//         success: false,
//         massage: "Unsuccess Update Data",
//       });
//     }
//   } catch (error) {
//     response.status(500).json({ massage: error.message, code: error }); // this will log any error that prisma throws + typesafety. both code and message are a string
//   }
// };

const deleteQuotation = async (request: Request, response: Response) => {
  try {
    const id: string = request.params.id;
    const deleteQuotation = await prisma.quotations.delete({
      where: {
        id: id,
      },
    });
    if (deleteQuotation) {
      response.status(201).json({
        success: true,
        massage: "Success Delete Data",
        results: deleteQuotation,
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

// const deleteQuotationDetail = async (request: Request, response: Response) => {
//   try {
//     const id: string = request.params.id;
//     const deleteQuotationDetail = await prisma.quotations_Detail.delete({
//       where: {
//         id: id,
//       },
//     });
//     if (deleteQuotationDetail) {
//       response.status(201).json({
//         success: true,
//         massage: "Success Delete Data",
//         results: deleteQuotationDetail,
//       });
//     } else {
//       response.status(400).json({
//         success: false,
//         massage: "Unsuccess Delete Data",
//       });
//     }
//   } catch (error) {
//     response.status(500).json({ massage: error.message, code: error }); // this will log any error that prisma throws + typesafety. both code and message are a string
//   }
// };

// const deleteQuotationDetailChild = async (
//   request: Request,
//   response: Response
// ) => {
//   try {
//     const id: string = request.params.id;
//     const deleteQuotationDetailChild = await prisma.child_QuDet.delete({
//       where: {
//         id: id,
//       },
//     });
//     if (deleteQuotationDetailChild) {
//       response.status(201).json({
//         success: true,
//         massage: "Success Delete Data",
//         results: deleteQuotationDetailChild,
//       });
//     } else {
//       response.status(400).json({
//         success: false,
//         massage: "Unsuccess Delete Data",
//       });
//     }
//   } catch (error) {
//     response.status(500).json({ massage: error.message, code: error }); // this will log any error that prisma throws + typesafety. both code and message are a string
//   }
// };

const deleteQuotationEqPart = async (request: Request, response: Response) => {
  try {
    const id: string = request.params.id;
    const deleteQuotationEqPart = await prisma.price_quotation.delete({
      where: {
        id: id,
      },
    });
    if (deleteQuotationEqPart) {
      response.status(201).json({
        success: true,
        massage: "Success Delete Data",
        results: deleteQuotationEqPart,
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
  getQuotation,
  createQuotation,
  updateQuotation,
  deleteQuotation,
  // updateQuotationDetail,
  updateQuotationEqPart,
  // deleteQuotationDetail,
  deleteQuotationEqPart,
  getEditPoQuotation,
  // deleteQuotationDetailChild,
  // updateQuoDetChild,
};
