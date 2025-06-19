import multer from "multer";

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, "./public/temps");
  },
  filename: function (_req, file, cb) {
    cb(null, file.originalname);
  },
});

export const upload = multer({ storage: storage });
