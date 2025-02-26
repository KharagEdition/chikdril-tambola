import { Timestamp } from "firebase/firestore";

/* eslint-disable @typescript-eslint/no-explicit-any */
export class GameModel {
  id: string;
  hostId: string;
  name: string;
  description: string;
  status: GameStatus;
  calledNumbers: number[];
  players: string[];
  winners: string[];
  createdAt: Date;
  winnersByType: Record<WinType, string[]>;
  playerStrikes: Record<string, number>;
  playerTicketCount: Record<string, number>;
  ticketCount: number;
  ticketPrice: number;
  ticketCurrency: string;
  startTime: Date;
  ticketLimit: number;
  prizeDistribution: PrizeDistribution;

  constructor({
    id,
    hostId,
    name,
    description,
    status,
    calledNumbers,
    players,
    winners,
    createdAt,
    winnersByType,
    playerStrikes,
    playerTicketCount = {},
    ticketCount = 0,
    ticketPrice = 0.0,
    ticketCurrency = "$",
    startTime,
    ticketLimit,
    prizeDistribution,
  }: {
    id: string;
    hostId: string;
    name: string;
    description: string;
    status: GameStatus;
    calledNumbers: number[];
    players: string[];
    winners: string[];
    createdAt: Date;
    winnersByType: Record<WinType, string[]>;
    playerStrikes: Record<string, number>;
    playerTicketCount?: Record<string, number>;
    ticketCount?: number;
    ticketPrice?: number;
    ticketCurrency?: string;
    startTime: Date;
    ticketLimit: number;
    prizeDistribution: PrizeDistribution;
  }) {
    this.id = id;
    this.hostId = hostId;
    this.name = name;
    this.description = description;
    this.status = status;
    this.calledNumbers = calledNumbers;
    this.players = players;
    this.winners = winners;
    this.createdAt = createdAt;
    this.winnersByType = winnersByType;
    this.playerStrikes = playerStrikes;
    this.playerTicketCount = playerTicketCount;
    this.ticketCount = Number(ticketCount);
    this.ticketPrice = Number(ticketPrice);
    this.ticketCurrency = ticketCurrency;
    this.startTime = startTime;
    this.ticketLimit = ticketLimit;
    this.prizeDistribution = prizeDistribution;
  }

  toJson(): Record<string, any> {
    return {
      id: this.id,
      hostId: this.hostId,
      name: this.name,
      description: this.description,
      status: this.status,
      calledNumbers: this.calledNumbers,
      players: this.players,
      winners: this.winners,
      createdAt: Timestamp.fromDate(this.createdAt),
      winnersByType: this.winnersByType,
      playerStrikes: this.playerStrikes,
      playerTicketCount: this.playerTicketCount,
      ticketCount: this.ticketCount,
      ticketPrice: this.ticketPrice,
      ticketCurrency: this.ticketCurrency,
      startTime: Timestamp.fromDate(this.startTime),
      ticketLimit: this.ticketLimit,
      prizeDistribution: this.prizeDistribution.toJson(),
    };
  }

  static fromJson(json: Record<string, any>): GameModel {
    return new GameModel({
      id: json.id,
      hostId: json.hostId,
      name: json.name,
      description: json.description,
      status: json.status as GameStatus,
      calledNumbers: json.calledNumbers,
      players: json.players,
      winners: json.winners,
      createdAt: new Date(json.createdAt),
      winnersByType: json.winnersByType,
      playerStrikes: json.playerStrikes,
      playerTicketCount: json.playerTicketCount,
      ticketCount: json.ticketCount,
      ticketPrice: json.ticketPrice,
      ticketCurrency: json.ticketCurrency,
      startTime: new Date(json.startTime),
      ticketLimit: json.ticketLimit,
      prizeDistribution: PrizeDistribution.fromJson(json.prizeDistribution),
    });
  }
  static create(hostId: string): GameModel {
    return new GameModel({
      id: Date.now().toString(),
      hostId,
      name: "Tambola",
      description: "Play Tambola and win exciting prizes",
      status: GameStatus.waiting,
      calledNumbers: [],
      players: [hostId],
      winners: [],
      createdAt: new Date(),
      winnersByType: {
        [WinType.earlyFive]: [],
        [WinType.firstRow]: [],
        [WinType.secondRow]: [],
        [WinType.thirdRow]: [],
        [WinType.fourCorners]: [],
        [WinType.fullHouse]: [],
      },
      playerStrikes: {},
      playerTicketCount: {},
      ticketCount: 0,
      ticketPrice: 2.0,
      ticketCurrency: "$",
      startTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      ticketLimit: 10,
      prizeDistribution: new PrizeDistribution({
        platformChargePercentage: 20.0,
        fullHousePrizePercentage: 50.0,
        fourCornersPrizePercentage: 7.0,
        rowPrizePercentage: 36.0,
        earlyFivePrizePercentage: 7.0,
      }),
    });
  }
}

export enum GameStatus {
  waiting = "waiting",
  inProgress = "inProgress",
  completed = "completed",
  cancelled = "cancelled",
  hold = "hold",
}

enum WinType {
  earlyFive = "earlyFive",
  firstRow = "firstRow",
  secondRow = "secondRow",
  thirdRow = "thirdRow",
  fourCorners = "fourCorners",
  fullHouse = "fullHouse",
}

export class PrizeDistribution {
  platformChargePercentage: number;
  fullHousePrizePercentage: number;
  fourCornersPrizePercentage: number;
  rowPrizePercentage: number;
  earlyFivePrizePercentage: number;

  constructor({
    platformChargePercentage,
    fullHousePrizePercentage,
    fourCornersPrizePercentage,
    rowPrizePercentage,
    earlyFivePrizePercentage,
  }: {
    platformChargePercentage: number;
    fullHousePrizePercentage: number;
    fourCornersPrizePercentage: number;
    rowPrizePercentage: number;
    earlyFivePrizePercentage: number;
  }) {
    this.platformChargePercentage = platformChargePercentage;
    this.fullHousePrizePercentage = fullHousePrizePercentage;
    this.fourCornersPrizePercentage = fourCornersPrizePercentage;
    this.rowPrizePercentage = rowPrizePercentage;
    this.earlyFivePrizePercentage = earlyFivePrizePercentage;
  }

  static fromJson(json: Record<string, any>): PrizeDistribution {
    return new PrizeDistribution({
      platformChargePercentage: json.platformChargePercentage,
      fullHousePrizePercentage: json.fullHousePrizePercentage,
      fourCornersPrizePercentage: json.fourCornersPrizePercentage,
      rowPrizePercentage: json.rowPrizePercentage,
      earlyFivePrizePercentage: json.earlyFivePrizePercentage,
    });
  }

  toJson(): Record<string, any> {
    return {
      platformChargePercentage: this.platformChargePercentage,
      fullHousePrizePercentage: this.fullHousePrizePercentage,
      fourCornersPrizePercentage: this.fourCornersPrizePercentage,
      rowPrizePercentage: this.rowPrizePercentage,
      earlyFivePrizePercentage: this.earlyFivePrizePercentage,
    };
  }
}
