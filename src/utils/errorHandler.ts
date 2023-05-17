import { logEvents } from "./logEvent";
import { PrismaClient, Prisma } from '@prisma/client'

const client = new PrismaClient()

const errorHandler = (err: any, req: any, res: any, next: any) => {
  logEvents(`${err.name}: ${err.message}`, "errLog.txt");
  res.status(500).send(err.message);
  if (typeof err === "string") {
    return res.status(400).send({ msg: err });
  } else if (err === "ValidationErrors") {
    return res.status(400).send({ msg: err });
  } else if (err === "Unauthrorized") {
    return res.status(401).send({ msg: err });
  } else if (typeof err === "undefined") {
    return res.status(400).send({ msg: err });
  } else if (err === "Unknown arg"){
    return res.status(400).send({ msg: err });
  }
  
  return res.status(500).send({ msg: err });
};

export default errorHandler;
