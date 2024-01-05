import fs from "fs";

export function asyncHandler(requestHandler) {
  return async function (req, res, next) {
    try {
      await requestHandler(req, res, next);
    } catch (error) {
      const fileList = fs.readdirSync("./public/temp");
      fileList.forEach(function (item, index) {
        if (index !== 0) {
          fs.unlinkSync(`./public/temp/${item}`);
        }
      });
      console.log("async", error.message);
      res.status(error.code || 500).json({
        success: false,
        message: error.message,
      });
      // next(error);
    }
  };
}
