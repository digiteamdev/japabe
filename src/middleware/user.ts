import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

prisma.$use(async (params, next) => {
  if (params.model === "User" && params.action === "delete") {
    return prisma.user.update({
      where: { id: String(params.args.where.id) },
      data: { deleted: new Date() },
    });
  }
  return next(params);
});

prisma.$use(async (params, next) => {
  if (params.model == "User") {
    if (params.action === "findUnique" || params.action === "findFirst") {
      // Change to findFirst - you cannot filter
      // by anything except ID / unique with findUnique
      params.action = "findFirst";
      // Add 'deleted' filter
      // ID filter maintained
      params.args.where["deleted"] = null;
    }
    if (params.action === "findMany") {
      // Find many queries
      if (params.args.where) {
        if (params.args.where.deleted == undefined) {
          // Exclude deleted records if they have not been explicitly requested
          params.args.where["deleted"] = null;
        }
      } else {
        params.args["where"] = { deleted: null };
      }
    }
  }
  return next(params);
});

prisma.$use(async (params, next) => {
  const before = Date.now();

  const result = await next(params);

  const after = Date.now();

  console.log(
    `Query ${params.model}.${params.action} took ${after - before}ms`
  );

  return result;
});

prisma.$use(async (error, next) => {
  return next(error);
});

export default prisma;
