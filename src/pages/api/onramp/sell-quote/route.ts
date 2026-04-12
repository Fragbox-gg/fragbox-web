import {
  type FetchSellQuote,
  type OnrampSellQuoteSnakeCaseResponse,
} from "@coinbase/cdp-react";
import { NextRequest, NextResponse } from "next/server";
import {
  generateCDPJWT,
  getCDPCredentials,
  ONRAMP_API_BASE_URL,
} from "@/lib/cdp-auth";
import { convertSnakeToCamelCase } from "@/lib/to-camel-case";

type OnrampSellQuoteRequest = Parameters<FetchSellQuote>[0];
type OnrampSellQuoteResponseRaw = OnrampSellQuoteSnakeCaseResponse;
type OnrampSellQuoteResponse = Awaited<ReturnType<FetchSellQuote>>;

/**
 * Creates a sell quote for offramp withdrawal
 * Not available on testnet
 *
 * @param request - Sell quote request parameters
 * @returns Sell quote with fees and offramp URL
 */
export async function POST(request: NextRequest) {
  try {
    const body: OnrampSellQuoteRequest = await request.json();

    // Validate CDP credentials are configured
    try {
      getCDPCredentials();
    } catch (_error) {
      return NextResponse.json(
        { error: "CDP API credentials not configured" },
        { status: 500 },
      );
    }

    // Validate required fields
    if (
      !body.sellCurrency ||
      !body.receiveAmount ||
      !body.receiveCurrency ||
      !body.paymentMethod ||
      !body.country
    ) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 },
      );
    }

    // Validate US subdivision requirement
    if (body.country === "US" && !body.subdivision) {
      return NextResponse.json(
        { error: "State/subdivision is required for US" },
        { status: 400 },
      );
    }

    const apiPath = "/onramp/v1/sell/quote";

    // Generate JWT for CDP API authentication
    const jwt = await generateCDPJWT({
      requestMethod: "POST",
      requestHost: new URL(ONRAMP_API_BASE_URL).hostname,
      requestPath: apiPath,
    });

    // Prepare request body for sell quote API
    const requestBody = {
      sellCurrency: body.sellCurrency,
      sellNetwork: body.sellNetwork,
      receiveAmount: body.receiveAmount,
      receiveCurrency: body.receiveCurrency,
      paymentMethod: body.paymentMethod,
      country: body.country,
      subdivision: body.subdivision,
      sourceAddress: body.sourceAddress,
    };

    // Call CDP Onramp API to get sell quote and URL
    const response = await fetch(`${ONRAMP_API_BASE_URL}${apiPath}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      console.error("CDP API error:", response.statusText);
      const errorText = await response.text();
      console.error("Error details:", errorText);

      try {
        const errorData = JSON.parse(errorText);
        return NextResponse.json(
          { error: errorData.message || "Failed to create sell quote" },
          { status: response.status },
        );
      } catch {
        return NextResponse.json(
          { error: "Failed to create sell quote" },
          { status: response.status },
        );
      }
    }

    // convert response data to camelCase until migration to API v2 which will return camelCase data
    const data: OnrampSellQuoteResponseRaw = await response.json();
    const dataCamelCase: OnrampSellQuoteResponse =
      convertSnakeToCamelCase(data);
    return NextResponse.json(dataCamelCase);
  } catch (error) {
    console.error("Error creating sell quote:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
