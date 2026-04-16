import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData =
  | {
      faction: number;
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
    const { matchId, playerId } = req.query;

    if (
      !matchId ||
      !playerId ||
      typeof matchId !== "string" ||
      typeof playerId !== "string"
    ) {
      return res
        .status(400)
        .json({ error: "matchId and playerId are required query parameters" });
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
    const f1Roster = (data.teams?.faction1?.roster || []).map(
      (p: any) => p.player_id,
    );
    const f2Roster = (data.teams?.faction2?.roster || []).map(
      (p: any) => p.player_id,
    );

    let faction = 0;
    if (f1Roster.includes(playerId)) faction = 1;
    else if (f2Roster.includes(playerId)) faction = 2;

    return res.status(200).json({ faction });
  } catch (error: any) {
    console.error("Fetch match roster error:", error);

    return res.status(500).json({
      error: error?.message || "Failed to fetch match roster",
    });
  }
}
