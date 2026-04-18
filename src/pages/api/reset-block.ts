// src/pages/api/reset-block.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { kv } from "@vercel/kv";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (
    process.env.CRON_SECRET &&
    req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { block } = req.query;

  if (block === "delete" || block === "0") {
    await kv.del("lastProcessedBlock");
    return res.status(200).json({
      success: true,
      message: "lastProcessedBlock deleted -> will auto-recover on next run",
    });
  }

  if (block) {
    await kv.set("lastProcessedBlock", block.toString());
    return res
      .status(200)
      .json({ success: true, message: `lastProcessedBlock set to ${block}` });
  }

  return res
    .status(400)
    .json({ error: "Missing ?block=XXXXX or ?block=delete" });
}
