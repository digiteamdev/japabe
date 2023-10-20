import { Request, Response } from "express";
import prisma from "../middleware/approveRequest";
import pagging from "../utils/paggination";
import url from "url";

const getAllApproveRequest = async (request: Request, response: Response) => {
  try {
    const pencarian: any = request.query.search || "";
    const type: any = request.query.type || ("SA" && "MA");
    const hostname: any = request.headers.host;
    const pathname = url.parse(request.url).pathname;
    const page: any = request.query.page;
    const perPage: any = request.query.perPage;
    const pagination: any = new pagging(page, perPage, hostname, pathname);
    const approvalCount = await prisma.approvedRequest.count({
      where: {
        deleted: null,
        idApprove: {
          startsWith: type,
        },
      },
    });
    let results: any;
    if (request.query.page === undefined) {
      results = await prisma.approvedRequest.findMany({
        where: {
          idApprove: {
            startsWith: type,
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
          detailMr: {
            include: {
              supplier: true,
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
              supplier: true,
              workCenter: true,
              sr: {
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
      });
    } else {
      results = await prisma.approvedRequest.findMany({
        where: {
          OR: [
            {
              idApprove: {
                startsWith: type,
              },
            },
            {
              idApprove: pencarian,
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
          detailMr: {
            include: {
              supplier: true,
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
              supplier: true,
              workCenter: true,
              sr: {
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
        massage: "Get All ApprovalRequest",
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

export default {
  getAllApproveRequest,
};