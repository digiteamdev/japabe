import upload from "../utils/cloudinary";
import fs from "fs";
import { Request, Response, NextFunction } from "express";
import path from "path";
import csv from "csv-parser";
import xlsx from "node-xlsx";

function importXlsx(file: any) {
  const workSheetsFromFile = xlsx.parse(file.path);  
  const data = workSheetsFromFile[0].data;  

  let results = [];
  for (let index = 1; index < data.length; index++) {   
    // console.log('NAMA',data[1][0]);
    // console.log('email',data[1][1]);
     
    results.push({
      name: data[index][0],
      email: data[index][1],
    });
  }
  return results;
}

function importCsv(file: any) {
  const arr: any = [];
  const results = new Promise((res, rej) => {
    fs.createReadStream(file.path)
      .pipe(csv())
      .on("data", (data: any) => arr.push(data))
      .on("end", () => {
        res(arr);
      })
      .on("error", rej);
  });
  return results;
}

async function importData(req: any, res: Response, next: NextFunction) {
  upload.single("file")(req, res, async (err: any) => {
    console.log(req.file);
    if (err) {
      res.json({
        error: true,
        message: "File type tidak suport",
      });
    } else {
      const ext = path.extname(req.file.originalname);
      if (ext === ".xlsx") {
        const results = importXlsx(req.file);
        req.convData = results;
        next();
      }
      if (ext === ".csv") {
        const results = await importCsv(req.file);
        req.convData = results;
        next();
      }
    }
  });
}

export default {
  importData,
};
