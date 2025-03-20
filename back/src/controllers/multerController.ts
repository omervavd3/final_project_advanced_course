import { Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const base = `${process.env.DOMAIN_BASE || "http://localhost"}:${
  process.env.PORT || 3000
}/`;

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/"),
  filename: (req, file, cb) => {
    const ext = file.originalname.split(".").filter(Boolean).slice(1).join(".");
    cb(null, Date.now() + "." + ext);
  },
});

const upload = multer({ storage });

export const uploadFile = (req: Request, res: Response) => {
  try {
    console.log(req.body);
    if (req.file == null) {
      res.status(400).send("No file uploaded");
      return;
    }
    const filePath = req.file.path.replace(/\\/g, "/").replace("public/", "");
    const fileUrl = `${base}${filePath}`;
    console.log("File uploaded: " + fileUrl);
    res.status(200).send({ url: fileUrl });
  } catch (error) {
    res.status(500).send(error);
  }
};

export const uploadMiddleware = upload.single("file");

export const deleteFile = (req: Request, res: Response) => {
  try {
    const fileName = req.params.fileName;

    let filePath = path.join(__dirname, "../public", fileName);

    filePath = filePath.replace("src\\", "").replace(/\\/g, "/");

    console.log("File path to delete:", filePath);

    fs.exists(filePath, (exists) => {
      if (!exists) {
        return res.status(404).send("File not found");
      }

      fs.unlink(filePath, (err) => {
        if (err) {
          console.log("Error deleting file:", err);
          return res.status(500).send("Error deleting file");
        }
        console.log("File deleted successfully")
        res.status(200).send("File deleted successfully");
      });
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

export const getFile = (req: Request, res: Response) => {
  try {
    const fileName = req.params.fileName;
    let filePath = path.join(__dirname, "../public", fileName);

    filePath = filePath.replace("src\\", "").replace(/\\/g, "/");
    console.log("File path to get:", filePath);
    fs.exists(filePath, (exists) => {
      if (!exists) {
        return res.status(404).send("File not found");
      }

      res.sendFile(filePath, (err) => {
        if (err) {
          console.log("Error sending file:", err);
          res.status(500).send("Error sending file");
        }
      });
    });
  } catch (error) {
    res.status(500).send(error);
  }
};
