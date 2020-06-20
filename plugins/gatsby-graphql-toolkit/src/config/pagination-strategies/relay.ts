import { DEFAULT_PAGE_SIZE } from "../../constants"
import { IPaginationStrategy } from "./types"

interface IRelayPage {
  edges: { cursor: string; node: object }[]
  pageInfo: { hasNextPage: boolean }
}

export const RelayForward: IPaginationStrategy<IRelayPage, object> = {
  name: "RelayForward",
  expectedVariableNames: [`first`, `after`],
  start() {
    return {
      variables: { first: DEFAULT_PAGE_SIZE, after: undefined },
      hasNextPage: true,
    }
  },
  next(state, page) {
    const tail = page.edges[page.edges.length - 1]
    const first = Number(state.variables.first) ?? DEFAULT_PAGE_SIZE
    const after = tail?.cursor
    return {
      variables: { first, after },
      hasNextPage: Boolean(page?.pageInfo?.hasNextPage && tail),
    }
  },
  concat(acc, page) {
    return {
      ...acc,
      edges: {
        ...acc.edges,
        ...page.edges
      },
      pageInfo: page.pageInfo
    }
  },
  getItems(pageOrResult) {
    return pageOrResult.edges.map(edge => edge.node)
  },
}
