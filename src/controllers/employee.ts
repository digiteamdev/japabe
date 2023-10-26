import { Request, Response } from "express";
import prisma from "../middleware/employee";
import pagging from "../utils/paggination";
import url from "url";

const getEmployee = async (request: Request, response: Response) => {
  try {
    const pencarian: any = request.query.search || "";
    const hostname: any = request.headers.host;
    const pathname = url.parse(request.url).pathname;
    const page: any = request.query.page;
    const perPage: any = request.query.perPagee;
    const pagination: any = new pagging(page, perPage, hostname, pathname);
    const employeeCount = await prisma.employee.count({
      where: {
        deleted: null,
      },
    });
    let results;
    if (request.query.page === undefined) {
      results = await prisma.employee.findMany({
        where: {
          status_user: false,
        },
        include: {
          sub_depart: {
            include: {
              departement: true,
            },
          },
        },
      });
    } else {
      results = await prisma.employee.findMany({
        where: {
          OR: [
            {
              NIK: {
                contains: pencarian,
                mode: "insensitive"
              },
            },
            {
              employee_name: {
                contains: pencarian,
                mode: "insensitive"
              },
            },
            {
              phone_number: {
                contains: pencarian,
                mode: "insensitive"
              },
            },
            {
              sub_depart: {
                name: {
                  contains: pencarian,
                  mode: "insensitive"
                },
              },
            },
          ],
        },
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          NIK: true,
          id_card: true,
          NIP: true,
          NPWP: true,
          nick_name: true,
          employee_name: true,
          address: true,
          phone_number: true,
          email: true,
          position: true,
          province: true,
          city: true,
          districts: true,
          sub_districts: true,
          ec_postalcode: true,
          gender: true,
          start_join: true,
          remaining_days_of: true,
          marital_status: true,
          employee_status: true,
          spouse_name: true,
          spouse_birth_date: true,
          spouse_birth_place: true,
          gender_spouse: true,
          birth_place: true,
          birth_date: true,
          createdAt: true,
          updatedAt: true,
          deleted: true,
          Employee_Child: {
            select: {
              id: true,
              name: true,
              gender_child: true,
              child_birth_place: true,
              child_birth_date: true,
              createdAt: true,
              updatedAt: true,
              deleted: true,
            },
            orderBy: {
              createdAt: "desc",
            },
          },
          sub_depart: {
            select: {
              id: true,
              name: true,
              createdAt: true,
              updatedAt: true,
              deleted: true,
              departement: {
                select: {
                  id: true,
                  name: true,
                  createdAt: true,
                  updatedAt: true,
                  deleted: true,
                },
              },
            },
          },
          Educational_Employee: {
            select: {
              id: true,
              school_name: true,
              graduation: true,
              last_edu: true,
              ijazah: true,
              createdAt: true,
              updatedAt: true,
              deleted: true,
            },
          },
          Certificate_Employee: {
            select: {
              id: true,
              certificate_name: true,
              certificate_img: true,
              end_date: true,
              createdAt: true,
              updatedAt: true,
              deleted: true,
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
        massage: "Get All Employee",
        result: results,
        page: pagination.page,
        limit: pagination.perPage,
        totalData: employeeCount,
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
    response.status(500).json({ masagge: error });
  }
};

const getEmployeeAll = async (request: Request, response: Response) => {
  try {
    const results = await prisma.employee.findMany({
      include: {
        Employee_Child: true,
        Certificate_Employee: true,
        Educational_Employee: true,
        sub_depart: {
          include: {
            departement: true,
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
        massage: "Get All Employee",
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
    response.status(500).json({ masagge: error });
  }
};

const getEmployeeSales = async (request: Request, response: Response) => {
  try {
    const sub: any = request.query.sub || "";
    const dep: any = request.query.dep || "";
    const results = await prisma.employee.findMany({
      where: {
        sub_depart: {
          name: sub,
          departement: {
            name: dep,
          },
        },
      },
      include: {
        sub_depart: {
          include: {
            departement: true,
          },
        },
      },
    });
    if (results.length > 0) {
      return response.status(200).json({
        success: true,
        massage: "Get All Employee Sales wor",
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

const createEmployee = async (request: Request, response: Response) => {
  try {
    const results = await prisma.employee.create({
      data: {
        NIP: request.body.NIP,
        NIK: request.body.NIK,
        NPWP: request.body.NPWP,
        id_card: request.body.id_card,
        employee_name: request.body.employee_name,
        nick_name: request.body.nick_name,
        email: request.body.email,
        birth_place: request.body.birth_place,
        birth_date: new Date(request.body.birth_date),
        address: request.body.address,
        province: request.body.province,
        city: request.body.city,
        districts: request.body.districts,
        sub_districts: request.body.sub_districts,
        ec_postalcode: request.body.ec_postalcode,
        phone_number: request.body.phone_number,
        start_join: new Date(request.body.start_join),
        remaining_days_of: request.body.remaining_days_of,
        gender: request.body.gender,
        marital_status: request.body.marital_status,
        position: request.body.position,
        sub_depart: { connect: { id: request.body.subdepartId } },
        employee_status: request.body.employee_status,
        spouse_name: request.body.spouse_name,
        gender_spouse: request.body.gender_spouse,
        spouse_birth_place: request.body.spouse_birth_place,
        spouse_birth_date: new Date(),
        Employee_Child: {
          create: request.body.Employee_Child,
        },
      },
      include: {
        Employee_Child: true,
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

const updateEmployee = async (request: Request, response: Response) => {
  try {
    const id: string = request.params.id;
    const updateDivision = await prisma.employee.update({
      where: {
        id: id,
      },
      data: request.body,
    });
    if (updateDivision) {
      response.status(201).json({
        success: true,
        massage: "Success Update Data",
        results: updateDivision,
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

const updateEmployeeChild = async (request: Request, response: Response) => {
  try {
    const updateVerify = request.body.map(
      (updateByveri: {
        name: any;
        gender_child: any;
        child_birth_place: any;
        child_birth_date: any;
        employeeId: any;
        id: any;
      }) => {
        return {
          name: updateByveri.name,
          gender_child: updateByveri.gender_child,
          child_birth_place: updateByveri.child_birth_place,
          child_birth_date: updateByveri.child_birth_date,
          employeeId: updateByveri.employeeId,
          id: updateByveri.id,
        };
      }
    );
    let result: any = [];
    for (let i = 0; i < updateVerify.length; i++) {
      const updateEmployeeChild = await prisma.employee_Child.upsert({
        where: {
          id: updateVerify[i].id,
        },
        create: {
          name: updateVerify[i].name,
          gender_child: updateVerify[i].gender_child,
          child_birth_place: updateVerify[i].child_birth_place,
          child_birth_date: updateVerify[i].child_birth_date,
          employee: { connect: { id: updateVerify[i].employeeId } },
        },
        update: {
          name: updateVerify[i].name,
          gender_child: updateVerify[i].gender_child,
          child_birth_place: updateVerify[i].child_birth_place,
          child_birth_date: updateVerify[i].child_birth_date,
          employee: { connect: { id: updateVerify[i].employeeId } },
        },
      });
      result = [...result, updateEmployeeChild];
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

const deleteEmployee = async (request: Request, response: Response) => {
  try {
    const id: string = request.params.id;
    const deleteEmployee = await prisma.employee.delete({
      where: {
        id: id,
      },
    });
    if (deleteEmployee) {
      response.status(201).json({
        success: true,
        massage: "Success Delete Data",
        results: deleteEmployee,
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

const deleteEmployeeChild = async (request: Request, response: Response) => {
  try {
    const id: string = request.params.id;
    const deleteEmployeeChild = await prisma.employee_Child.deleteMany({
      where: {
        id: id,
      },
    });
    if (deleteEmployeeChild) {
      response.status(201).json({
        success: true,
        massage: "Success Delete Data",
        results: deleteEmployeeChild,
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

const createEmployeEdu = async (request: any, response: Response) => {
  try {
    const newArrEdu = [];
    if (request.body.Educational_Employee) {
      const arr = JSON.parse(request.body.Educational_Employee);
      for (let i = 0; i < arr.length; i++) {
        newArrEdu.push({
          employeeId: arr[i].employeeId,
          school_name: arr[i].school_name,
          last_edu: arr[i].last_edu,
          graduation: arr[i].graduation,
          ijazah: !request.file ? null : request.files[i].path,
        });
      }
    }
    const results = await prisma.educational_Employee.createMany({
      data: newArrEdu,
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

const createEmployeCertificate = async (request: any, response: Response) => {
  try {
    const newArrCertificate = [];
    if (request.body.Certificate_Employee) {
      const arr = JSON.parse(request.body.Certificate_Employee);
      for (let i = 0; i < arr.length; i++) {
        newArrCertificate.push({
          employeeId: arr[i].employeeId,
          certificate_name: arr[i].certificate_name,
          certificate_img: !request.file ? null : request.files[i].path,
          end_date: arr[i].end_date,
        });
      }
    }
    const results = await prisma.certificate_Employee.createMany({
      data: newArrCertificate,
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

const updateEmployeeCertificate = async (request: any, response: Response) => {
  try {
    const newArr = JSON.parse(request.body.Certificate_Employee);
    const updateVerify = newArr.map(
      (updateByveri: {
        certificate_name: any;
        certificate_img: any;
        end_date: any;
        employeeId: any;
        id: any;
        action: any;
      }) => {
        return {
          certificate_name: updateByveri.certificate_name,
          certificate_img: updateByveri.certificate_img,
          end_date: updateByveri.end_date,
          employeeId: updateByveri.employeeId,
          id: updateByveri.id,
          action: updateByveri.action,
        };
      }
    );
    let result: any = [];
    for (let i = 0; i < updateVerify.length; i++) {
      let img;
      if (updateVerify[i].action !== "not upload") {
        let indexUpload = updateVerify[i].action.split(".");
        for (let j = 0; j < request.files.length; j++) {
          if (j === parseInt(indexUpload[1])) {
            img = request.files[j].path;
          }
        }
      } else {
        img = updateVerify[i].certificate_img;
      }

      const updateEmployeeCertificate =
        await prisma.certificate_Employee.upsert({
          where: {
            id: updateVerify[i].id,
          },
          create: {
            certificate_name: updateVerify[i].certificate_name,
            certificate_img: img,
            end_date: updateVerify[i].end_date,
            employee: { connect: { id: updateVerify[i].employeeId } },
          },
          update: {
            certificate_name: updateVerify[i].certificate_name,
            certificate_img: img,
            end_date: updateVerify[i].end_date,
            employee: { connect: { id: updateVerify[i].employeeId } },
          },
        });
      result = [...result, updateEmployeeCertificate];
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

const updateEmployeeEdu = async (request: any, response: Response) => {
  try {
    const newArr = JSON.parse(request.body.educational_Employee);
    const updateVerify = newArr.map(
      (updateByveri: {
        school_name: any;
        last_edu: any;
        graduation: any;
        ijazah: any;
        employeeId: any;
        id: any;
        action: any;
      }) => {
        return {
          school_name: updateByveri.school_name,
          ijazah: updateByveri.ijazah,
          last_edu: updateByveri.last_edu,
          graduation: updateByveri.graduation,
          employeeId: updateByveri.employeeId,
          id: updateByveri.id,
          action: updateByveri.action,
        };
      }
    );
    let result: any = [];
    for (let i = 0; i < updateVerify.length; i++) {
      let img;
      if (updateVerify[i].action !== "not upload") {
        let indexUpload = updateVerify[i].action.split(".");
        for (let j = 0; j < request.files.length; j++) {
          if (j === parseInt(indexUpload[1])) {
            img = request.files[j].path;
          }
        }
      } else {
        img = updateVerify[i].ijazah;
      }
      const updateEmployeeEdu = await prisma.educational_Employee.upsert({
        where: {
          id: updateVerify[i].id,
        },
        create: {
          school_name: updateVerify[i].school_name,
          ijazah: img,
          last_edu: updateVerify[i].last_edu,
          graduation: updateVerify[i].graduation,
          employee: { connect: { id: updateVerify[i].employeeId } },
        },
        update: {
          school_name: updateVerify[i].school_name,
          ijazah: img,
          graduation: updateVerify[i].graduation,
          last_edu: updateVerify[i].last_edu,
          employee: { connect: { id: updateVerify[i].employeeId } },
        },
      });
      result = [...result, updateEmployeeEdu];
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

const deleteEmployeeEdu = async (request: Request, response: Response) => {
  try {
    const id: string = request.params.id;
    const deleteEmployeeChild = await prisma.educational_Employee.delete({
      where: {
        id: id,
      },
    });
    if (deleteEmployeeChild) {
      response.status(201).json({
        success: true,
        massage: "Success Delete Data",
        results: deleteEmployeeChild,
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

const deleteEmployeeCertificate = async (
  request: Request,
  response: Response
) => {
  try {
    const id: string = request.params.id;
    const deleteEmployeeCertificate = await prisma.certificate_Employee.delete({
      where: {
        id: id,
      },
    });
    if (deleteEmployeeCertificate) {
      response.status(201).json({
        success: true,
        massage: "Success Delete Data",
        results: deleteEmployeeCertificate,
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
  getEmployeeAll,
  getEmployee,
  getEmployeeSales,
  createEmployee,
  createEmployeCertificate,
  updateEmployee,
  updateEmployeeChild,
  deleteEmployee,
  deleteEmployeeChild,
  createEmployeEdu,
  updateEmployeeEdu,
  deleteEmployeeEdu,
  updateEmployeeCertificate,
  deleteEmployeeCertificate,
};
