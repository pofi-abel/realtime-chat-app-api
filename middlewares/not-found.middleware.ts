import { Request, Response } from "express";
import httpStatus from "http-status";

const NotFoundMiddleware = (req: Request, res: Response) => res.status(httpStatus.NOT_FOUND).send(`[Route does not exist]: ${req.url} `);
export default NotFoundMiddleware;