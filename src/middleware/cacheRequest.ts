import { NextFunction, Request, Response } from "express";
import { redisCache } from "../shared/redisCacheProvider";


export function cacheRequest(ttl = 60){
    return async (req: Request, res: Response, next: NextFunction) => {
        const key = `cache:${req.originalUrl}`;

        const cached = await redisCache.recover(key)

        if(cached){
            return res.json({
                cached: true,
                data: cached
            })
        }

        const originalJson = res.json.bind(res);

        res.json = (body: unknown) => {
            redisCache.save(key, body, ttl);
            return originalJson(body)
        }

        return next();
    }
}