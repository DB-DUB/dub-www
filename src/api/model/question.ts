export enum Claim {
  None = 0,
  /** unaccalimed*/
  Unclaimed = 1,
  /** Received*/
  Received = 2,
  /** Can be claimed again */
  ReceivedAgain = 3
}

/*
 * Tricky-view
 */

export interface PrankQuestion {
  /** Receive award*/
  open: Open
  // Answer
  answer: Answer
}

/**
 * Receive award
 */
export interface Open {
  id: string
  // Amount
  amount?: string
  // Critical hit amount
  ctit_amount?: string
  // 1. Not received 2. Already received
  status: Claim
  // Datetime (time of answering question)
  created_at: string
}

// Answer
export interface Answer {
  // Custom answer
  answers: string[]
  // Serial number, which set of questions
  order: string
  // username
  nickname: string
  // avatar
  avatar: string
}

// Tricky information
export interface PrankInfo {
  total: number
  // Uncollected quantity
  total_unclaimed: number
  // list
  list: PrankList[]
}

// prank list
export interface PrankList {
  id: string
  // Open (receive rewards)
  open: PrankOpen
}

// Receive award
export interface PrankOpen {
  id: string
  // Amount
  amount?: string
  // Critical hit amount
  ctit_amount?: string
  // Historical amount
  amount_all?: string
  // 1. Not received 2. Already received
  status: Claim
  // Datetime
  created_at: string
  nickname: string
  avatar: string
  // Question number
  order: string
}

export enum PrankEnum {
  // none
  None,
  // equipment
  Equip,
  // topic
  Question
}

export enum RefreshEnum {
  // Get data for the first time
  FirstLoad = 1,
  // pull up
  FooterRefresh = 2,
  // no more
  NoMore = 3
}
