import { AnalyzeResult, Contest, Platform, Tag } from "./types-contest.js"
import { Metadata } from "text-splitter"

export enum Severity {
  NON_CRITICAL,
  LOW,
  MEDIUM,
  HIGH,
}

export type FindingSource = Platform

// first url is fractional
export type Finding = {
  pk: string
  name: string
  platform: FindingSource
  severity?: Severity
  tags: Tag[] // always include at least "none"
  url?: string
  content?: string // md
  c_name?: string
}

export type FindingEmbMeta = Metadata & {
  platform: Platform
  c_date: number
  c_name: string
  severity?: Severity
}

// latest findings
export type LatestFinding = Finding

export type LatestContest = {
  c_url: string
  c_name: string
  c_platform: Platform
  // it is possible that contest didn't parse, but findings were still found later
  details?: Pick<Contest, "em_stored" | "cl_stored" | "fl_stored" | "analyze_result">
}

export type LatestContestWithFindings = {
  contest: LatestContest
  findings: LatestFinding[]
}
