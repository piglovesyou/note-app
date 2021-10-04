import { makeVar, useReactiveVar } from '@apollo/client'

export const currIdVar = makeVar<string | null>(null)

export function useCurrId() {
  return useReactiveVar(currIdVar)
}
