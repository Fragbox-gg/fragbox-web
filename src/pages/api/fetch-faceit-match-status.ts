import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData =
  | {
      statusCode: number;
      winnerCode: number;
    }
  | {
      error: string;
    };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { matchId } = req.query;

    if (!matchId || typeof matchId !== "string") {
      return res
        .status(400)
        .json({ error: "matchId are required query parameters" });
    }

    const faceitResponse = await fetch(
      `https://open.faceit.com/data/v4/matches/${matchId}`,
      {
        signal: AbortSignal.timeout(5000),
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_FACEIT_CLIENT_API_KEY}`,
        },
      },
    );

    if (!faceitResponse.ok) {
      const errorText = await faceitResponse
        .text()
        .catch(() => "Unknown error");
      throw new Error(
        `Faceit API error: ${faceitResponse.status} ${errorText}`,
      );
    }

    const data = await faceitResponse.json();

    const statusStr = data.status || "UNKNOWN";

    let statusCode = 0;
    if (statusStr === "VOTING") statusCode = 1;
    else if (statusStr === "READY") statusCode = 2;
    else if (statusStr === "ONGOING") statusCode = 3;
    else if (statusStr === "FINISHED") statusCode = 4;

    let winnerCode = 0; // 0 = unknown, 1 = faction1, 2 = faction2, 3 = draw
    if (statusCode === 4 && data.results?.winner) {
      let winner = data.results.winner;
      if (winner === "faction1") winnerCode = 1;
      else if (winner === "faction2") winnerCode = 2;
      else if (winner === "draw") winnerCode = 3;
    }

    return res.status(200).json({ statusCode, winnerCode });
  } catch (error: any) {
    console.error("Fetch match status error:", error);

    return res.status(500).json({
      error: error?.message || "Failed to fetch match status",
    });
  }
}
