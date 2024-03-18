import { NextFunction, Request, Response } from "express";

function asyncHandler(
  handler: (req: Request, res: Response, next: NextFunction) => Promise<any> | any
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}

export default asyncHandler;