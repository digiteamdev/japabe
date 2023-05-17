import { format } from "date-fns";
import cuid from "cuid";

import fs from "fs";
import fsPromises from "fs/promises";
import path from "path";

export const logEvents = async (massage: string, logName: string) => {
  const datetime = `${format(new Date(), "yyyyMMdd\tHH:mm:ss")}`;
  const logItem = `${datetime}\t${cuid()}\t${massage}\n`;
  try {
    if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
      await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
    }

    await fsPromises.appendFile(
      path.join(__dirname, "..", "logs", logName),
      logItem
    );
  } catch (err) {
    console.log(err);
  }
};

export const logger = (req: any, res: any, next: any) => {
  logEvents(`${req.method}\t${req.headers.origin}\t${req.headers.host}\t${req.url}`, "reqLog.txt");
  next();
};

export default { logger, logEvents };
