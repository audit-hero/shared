import { FindingEmbMeta } from "./types-finding.js"

export const ALL_PLATFORMS = ["c4", "sherlock"]
export type PlatformTuple = typeof ALL_PLATFORMS
export type Platform = PlatformTuple[number]

export const ALL_TAGS = ["none", "712", "721", "1967", "1155", "4626", "erc20", "nft", "bridge", "proxy", "l2", "domain_separator", "division", "initializ", "slippage", " amm ", "lend", "borrow", "swap", "stable", "curve", "token", "ecrecover", "foundry", "reentrancy", "flash loan", "weth", "fee on transfer"]
export type TagTuple = typeof ALL_TAGS
export type Tag = TagTuple[number]

export type Contest = {
  pk: string,
  sk: string,
  url: string,
  start_date: number,
  end_date: number,
  // = end_date > current_date (can be created but not running)
  active: number,
  status: Status
  prize: string, // could be eth or usd
  platform: Platform
  tags: Tag[]
  repo_urls?: string[];
  doc_urls?: string[];
  em_stored?: number
  analyze_result?: {
    total_nsloc: number
  }
}

export type Status = "created" | "active" | "judging" | "finished"

export type ContestEmbeddings = {
  pk: string,
  sk: string,
  emb_q: string,
  chat_q: string,
  k: number,
  emb_res: Document[], // string[]
  chat_res: string
}

export type ContestWithModules = Contest & {
  modules: ContestModule[]
  auditTime: number
  loc: number
}

// could be different contracts or combination of contracts. Also frontend/backend
export type ContestModule = {
  name: string
  contest: string
  active: number
  // approximate audit time in seconds
  auditTime: number
  link_in_md?: string
  url?: string
  path?: string
  loc?: number
}

export type Document = {
  pageContent: string;
  metadata: Metadata;
};

export type FindingDocument = Document & {
  metadata: FindingEmbMeta;
}

export type Metadata = {
  source: string;
  loc: {
      lines: {
          from: number;
          to: number;
      };
  };
};
