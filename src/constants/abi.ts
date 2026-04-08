//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// FragBoxBetting
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const fragBoxBettingAbi = [
  {
    type: 'constructor',
    inputs: [{ name: 'usdcAddress', internalType: 'address', type: 'address' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'depositAmount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'calculateDepositFee',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'matchIdStr', internalType: 'string', type: 'string' },
      { name: 'playerIdStr', internalType: 'string', type: 'string' },
    ],
    name: 'claim',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'matchIdStr', internalType: 'string', type: 'string' },
      { name: 'playerIdStr', internalType: 'string', type: 'string' },
      { name: 'rawBetAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'tierId', internalType: 'uint8', type: 'uint8' },
    ],
    name: 'deposit',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'matchIdStr', internalType: 'string', type: 'string' },
      { name: 'playerIdStr', internalType: 'string', type: 'string' },
    ],
    name: 'emergencyRefund',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'matchId', internalType: 'string', type: 'string' },
      { name: 'playerId', internalType: 'string', type: 'string' },
    ],
    name: 'getBetAmountsInRosterValidationFlight',
    outputs: [
      {
        name: '',
        internalType: 'struct FragBoxBetting.InFlightBet',
        type: 'tuple',
        components: [
          { name: 'betAmount', internalType: 'uint256', type: 'uint256' },
          { name: 'lastDepositTime', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getHouseFeePercentage',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'matchIdStr', internalType: 'string', type: 'string' }],
    name: 'getKey',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: 'matchKey', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getMatchBet',
    outputs: [
      {
        name: '',
        internalType: 'struct FragBoxBetting.MatchBetView',
        type: 'tuple',
        components: [
          {
            name: 'winnerFaction',
            internalType: 'enum FragBoxBetting.Faction',
            type: 'uint8',
          },
          {
            name: 'matchStatus',
            internalType: 'enum FragBoxBetting.MatchStatus',
            type: 'uint8',
          },
          {
            name: 'factionTotals',
            internalType: 'uint256[4]',
            type: 'uint256[4]',
          },
          {
            name: 'matchStartTimestamp',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'tierId', internalType: 'uint8', type: 'uint8' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getOwnerFeesCollected',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'matchKey', internalType: 'bytes32', type: 'bytes32' },
      { name: 'playerKey', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'getPlayerFaction',
    outputs: [
      { name: '', internalType: 'enum FragBoxBetting.Faction', type: 'uint8' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'playerIdStr', internalType: 'string', type: 'string' }],
    name: 'getRegisteredWallet',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'tierId', internalType: 'uint8', type: 'uint8' }],
    name: 'getTier',
    outputs: [
      {
        name: '',
        internalType: 'struct FragBoxBetting.Tier',
        type: 'tuple',
        components: [
          { name: 'minBetAmount', internalType: 'uint256', type: 'uint256' },
          { name: 'maxBetAmount', internalType: 'uint256', type: 'uint256' },
          { name: 'active', internalType: 'bool', type: 'bool' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getUsdc',
    outputs: [
      { name: '', internalType: 'contract IERC20Metadata', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getUsdcDecimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'playerKey', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getWinnings',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'pause',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'paused',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'playerIdStr', internalType: 'string', type: 'string' },
      { name: 'wallet', internalType: 'address', type: 'address' },
    ],
    name: 'registerPlayerWallet',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'newEmergencyRefundTimeout',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    name: 'setEmergencyRefundTimeout',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'newHouseFeePercentage',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    name: 'setHouseFeePercentage',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'newInFlightWithdrawalTimeout',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    name: 'setInFlightWithdrawalTimeout',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'matchIdStr', internalType: 'string', type: 'string' },
      { name: 'tierId', internalType: 'uint8', type: 'uint8' },
    ],
    name: 'setMatchTier',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'tierId', internalType: 'uint8', type: 'uint8' },
      { name: 'minBetAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'maxBetAmount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setTier',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'value', internalType: 'uint256', type: 'uint256' }],
    name: 'toUsdc',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'tierId', internalType: 'uint8', type: 'uint8' },
      { name: 'active', internalType: 'bool', type: 'bool' },
    ],
    name: 'toggleTier',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'unpause',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'matchIdStr', internalType: 'string', type: 'string' },
      { name: 'playerId', internalType: 'string', type: 'string' },
      { name: 'bettor', internalType: 'address', type: 'address' },
      {
        name: 'playerFaction',
        internalType: 'enum FragBoxBetting.Faction',
        type: 'uint8',
      },
    ],
    name: 'updateMatchRoster',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'matchIdStr', internalType: 'string', type: 'string' },
      {
        name: 'newMatchStatus',
        internalType: 'enum FragBoxBetting.MatchStatus',
        type: 'uint8',
      },
    ],
    name: 'updateMatchStatus',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'matchIdStr', internalType: 'string', type: 'string' },
      {
        name: 'newMatchStatus',
        internalType: 'enum FragBoxBetting.MatchStatus',
        type: 'uint8',
      },
      {
        name: 'winnerFaction',
        internalType: 'enum FragBoxBetting.Faction',
        type: 'uint8',
      },
    ],
    name: 'updateMatchStatus',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'playerId', internalType: 'string', type: 'string' }],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'matchId', internalType: 'string', type: 'string' },
      { name: 'playerId', internalType: 'string', type: 'string' },
    ],
    name: 'withdrawBetAmountsInRosterValidationFlight',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'matchId', internalType: 'string', type: 'string' },
      { name: 'playerId', internalType: 'string', type: 'string' },
      { name: 'withdrawalAddress', internalType: 'address', type: 'address' },
    ],
    name: 'withdrawBetAmountsInRosterValidationFlight',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'withdrawOwnerFees',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'matchKey',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'matchId',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      {
        name: 'bettor',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'playerId',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      { name: 'tierId', internalType: 'uint8', type: 'uint8', indexed: false },
    ],
    name: 'BetPlaced',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'matchKey',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'matchId',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      {
        name: 'claimer',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'playerId',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      {
        name: 'amountRefunded',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'EmergencyRefund',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oldTimeout',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'newTimeout',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'EmergencyRefundTimeoutUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oldPercentage',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'newPercentage',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'HouseFeePercentageUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'matchKey',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'matchId',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      {
        name: 'playerKey',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'playerId',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      {
        name: 'wallet',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amountWithdrawn',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'InFlightFundsWithdrawn',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oldTimeout',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'newTimeout',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'InFlightWithdrawalTimeoutUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'matchKey',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'matchId',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      {
        name: 'claimer',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'playerId',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      {
        name: 'amountClaimed',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      { name: 'isRefund', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'MatchClaimed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'matchKey',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'matchId',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      { name: 'tierId', internalType: 'uint8', type: 'uint8', indexed: false },
    ],
    name: 'MatchTierSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oldFee',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'newFee',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'MinStatusUpdateFeeUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'wallet',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amountWithdrawn',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'OwnerFeesWithdrawn',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'Paused',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'playerId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'wallet',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'playerIdStr',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
    ],
    name: 'PlayerRegistered',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oldCooldown',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'newCooldown',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'RosterUpdateCooldownUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'matchKey',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'matchId',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      {
        name: 'playerKey',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'playerId',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      {
        name: 'bettor',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'playerFaction',
        internalType: 'enum FragBoxBetting.Faction',
        type: 'uint8',
        indexed: false,
      },
    ],
    name: 'RosterUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oldCooldown',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'newCooldown',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'StatusUpdateCooldownUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'matchKey',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'matchId',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      {
        name: 'status',
        internalType: 'enum FragBoxBetting.MatchStatus',
        type: 'uint8',
        indexed: false,
      },
      {
        name: 'winnerFaction',
        internalType: 'enum FragBoxBetting.Faction',
        type: 'uint8',
        indexed: false,
      },
    ],
    name: 'StatusUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'tierId', internalType: 'uint8', type: 'uint8', indexed: true },
      {
        name: 'minBetAmount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'maxBetAmount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'TierUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'Unpaused',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'playerKey',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'playerId',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      {
        name: 'wallet',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'WinningsWithdrawn',
  },
  { type: 'error', inputs: [], name: 'EnforcedPause' },
  { type: 'error', inputs: [], name: 'ExpectedPause' },
  {
    type: 'error',
    inputs: [
      { name: 'matchKey', internalType: 'bytes32', type: 'bytes32' },
      { name: 'sentAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'maxAmount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'FragBoxBetting__BetTooLarge',
  },
  {
    type: 'error',
    inputs: [
      { name: 'matchKey', internalType: 'bytes32', type: 'bytes32' },
      { name: 'sentAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'minAmount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'FragBoxBetting__BetTooSmall',
  },
  {
    type: 'error',
    inputs: [],
    name: 'FragBoxBetting__EmergencyRefundTimeoutNotReached',
  },
  {
    type: 'error',
    inputs: [
      { name: 'matchKey', internalType: 'bytes32', type: 'bytes32' },
      {
        name: 'currentStatus',
        internalType: 'enum FragBoxBetting.MatchStatus',
        type: 'uint8',
      },
      {
        name: 'newStatus',
        internalType: 'enum FragBoxBetting.MatchStatus',
        type: 'uint8',
      },
      {
        name: 'winnerFaction',
        internalType: 'enum FragBoxBetting.Faction',
        type: 'uint8',
      },
    ],
    name: 'FragBoxBetting__FinishedStatusMustHaveAWinner',
  },
  {
    type: 'error',
    inputs: [],
    name: 'FragBoxBetting__InFlightTimeoutNotReached',
  },
  {
    type: 'error',
    inputs: [],
    name: 'FragBoxBetting__InsufficientFundsForWithdrawal',
  },
  {
    type: 'error',
    inputs: [
      { name: 'matchKey', internalType: 'bytes32', type: 'bytes32' },
      {
        name: 'currentStatus',
        internalType: 'enum FragBoxBetting.MatchStatus',
        type: 'uint8',
      },
      {
        name: 'newStatus',
        internalType: 'enum FragBoxBetting.MatchStatus',
        type: 'uint8',
      },
    ],
    name: 'FragBoxBetting__InvalidMatchStatus',
  },
  {
    type: 'error',
    inputs: [{ name: 'matchKey', internalType: 'bytes32', type: 'bytes32' }],
    name: 'FragBoxBetting__InvalidWallet',
  },
  {
    type: 'error',
    inputs: [
      { name: 'matchKey', internalType: 'bytes32', type: 'bytes32' },
      { name: 'playerKey', internalType: 'bytes32', type: 'bytes32' },
      {
        name: 'faction',
        internalType: 'enum FragBoxBetting.Faction',
        type: 'uint8',
      },
    ],
    name: 'FragBoxBetting__LosingFactionCannotClaim',
  },
  { type: 'error', inputs: [], name: 'FragBoxBetting__MatchAlreadyFinished' },
  {
    type: 'error',
    inputs: [{ name: 'matchKey', internalType: 'bytes32', type: 'bytes32' }],
    name: 'FragBoxBetting__MatchNotFinished',
  },
  {
    type: 'error',
    inputs: [],
    name: 'FragBoxBetting__MatchStatusDoesNotAllowBets',
  },
  { type: 'error', inputs: [], name: 'FragBoxBetting__MatchStatusIsInvalid' },
  {
    type: 'error',
    inputs: [
      { name: 'minAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'maxAmount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'FragBoxBetting__MinBetMustBeGreaterThanMaxBet',
  },
  {
    type: 'error',
    inputs: [
      { name: 'matchKey', internalType: 'bytes32', type: 'bytes32' },
      { name: 'playerKey', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'FragBoxBetting__NoBetForPlayer',
  },
  { type: 'error', inputs: [], name: 'FragBoxBetting__PlayerFactionInvalid' },
  { type: 'error', inputs: [], name: 'FragBoxBetting__RosterAlreadyRequested' },
  {
    type: 'error',
    inputs: [{ name: 'matchKey', internalType: 'bytes32', type: 'bytes32' }],
    name: 'FragBoxBetting__TierAlreadySet',
  },
  {
    type: 'error',
    inputs: [{ name: 'tierId', internalType: 'uint8', type: 'uint8' }],
    name: 'FragBoxBetting__TierIdMustBeGreaterThanZero',
  },
  {
    type: 'error',
    inputs: [
      { name: 'matchKey', internalType: 'bytes32', type: 'bytes32' },
      { name: 'expectedTier', internalType: 'uint8', type: 'uint8' },
      { name: 'providedTier', internalType: 'uint8', type: 'uint8' },
    ],
    name: 'FragBoxBetting__TierMismatch',
  },
  {
    type: 'error',
    inputs: [{ name: 'tierId', internalType: 'uint8', type: 'uint8' }],
    name: 'FragBoxBetting__TierNotActive',
  },
  {
    type: 'error',
    inputs: [{ name: 'matchKey', internalType: 'bytes32', type: 'bytes32' }],
    name: 'FragBoxBetting__WinnerUnknown',
  },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'OwnableInvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
  { type: 'error', inputs: [], name: 'ReentrancyGuardReentrantCall' },
  {
    type: 'error',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'SafeERC20FailedOperation',
  },
] as const
