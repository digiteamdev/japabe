const cloudinary = require("cloudinary").v2;
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import * as path from "path";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async () => {
    return {
      folder: "workshop",
      allowedFormats: ["jpg", "png", "jpeg", "pdf"],
    };
  },
});

// SET STORAGE

const uploadFilePath = path.resolve(__dirname, "../..", "public/uploads");

const storageFile: multer.StorageEngine = multer.diskStorage({
  destination: uploadFilePath,
  filename(
    req: Express.Request,
    file: Express.Multer.File,
    fn: (error: Error | null, filename: string) => void
  ): void {
    fn(
      null,
      `${new Date().getTime().toString()}-${file.fieldname}${path.extname(
        file.originalname
      )}`
    );
  },
});

const upload: any = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: function (req, file, cb) {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg" ||
      file.mimetype === "application/pdf"
    ) {
      cb(null, true);
    } else {
      //prevent the upload
      let newError: any = new Error(
        "File type is incorrect mush png or jpg and jpeg, pdf"
      );
      // newError.name = "MulterError";
      cb(newError, false);
    }
  },
});

export default upload;
