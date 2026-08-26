import type { Request, Response } from "express";
export function healthController(_req: Request, res: Response) {
  res.status(200).json({ success:true, service:"luxewear-api", message:"LuxeWear API is running", timestamp:new Date().toISOString() });
}
