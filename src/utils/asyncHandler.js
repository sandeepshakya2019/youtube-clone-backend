export function asyncHandler(requestHandler) {
  return async function (req, res, next) {
    try {
      await requestHandler(req, res, next);
    } catch (error) {
      res.status(error.code || 500).json({
        success: false,
        message: error.message,
      });
      //   next(error);
    }
  };
}
