import {
  ApolloCache,
  ApolloClient,
  defaultDataIdFromObject,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client'
import { LocalStorageWrapper, persistCacheSync } from 'apollo3-cache-persist'
import typeDefs from './schema.graphqls'

const isProd = process.env.NODE_ENV === 'production'
const isServer = !global.localStorage

export type TClient = ApolloClient<NormalizedCacheObject>

export function restoreCache(cache: ApolloCache<any>) {
  cache.restore({
    __Notes__: {
      __typename: 'Notes',
      items: [],
    },
    ROOT_QUERY: {
      __typename: 'Query',
      notes: {
        __ref: '__Notes__',
      },
    },
  })
}

export function createApolloClient() {
  const cache = new InMemoryCache({
    dataIdFromObject(o) {
      switch (o.__typename) {
        case 'Notes':
          return '__Notes__'
      }
      return defaultDataIdFromObject(o)
    },
  })

  if (!isServer) {
    if (!localStorage.getItem('apollo-cache-persist')) restoreCache(cache)

    persistCacheSync({
      cache,
      storage: new LocalStorageWrapper(window.localStorage),
      debug: !isProd,
      trigger: 'write',
      debounce: 1000,
    })
  }

  return new ApolloClient({
    cache,
    typeDefs,
  })
}

export const client = createApolloClient()
