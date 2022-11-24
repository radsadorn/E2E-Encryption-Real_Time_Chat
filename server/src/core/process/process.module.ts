import { NextFunction, Request, Response } from 'express';
import httpContext from "express-http-context";

export const doRequest = (callback: (req: Request, res: Response) => Promise<void>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        console.log('Start ' + httpContext.get('fullPath') + ' header: ' + JSON.stringify(req.headers));
        try {
            await callback(req, res);
            next();
        } catch(err: any) {
            if(err && err.returnCode && err.returnMessage) {
                res.json(err);
                next();
            } else {
                next(err);
            }
        }
    }
}