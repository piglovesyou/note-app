import { DocumentNode, gql } from '@apollo/client'
import { expect } from '@jest/globals'
import { Notes } from '../__generated__/types'
import { client, restoreCache } from './client'
import { writeNote } from './write'

const NOTES_QUERY = gql`
  query {
    notes {
      items {
        title
        text
      }
    }
  }
`

const NOTES_QUERY_WITH_ID = gql`
  query {
    notes {
      items {
        id
        title
        text
      }
    }
  }
`

async function queryNotes(query: DocumentNode): Promise<Notes> {
  const result = await client.query({
    query,
  })
  const {
    data: { notes },
  } = result
  return notes!
}

// XXX: Run serially
describe('client.ts', () => {
  beforeEach(async () => {
    restoreCache(client.cache)
    // Need to stabilize somehow
    await timeout(100)
  })

  test('initial state', async () => {
    const { cache } = client
    expect(cache.extract()).toMatchInlineSnapshot(`
      Object {
        "ROOT_QUERY": Object {
          "__typename": "Query",
          "notes": Object {
            "__ref": "__Notes__",
          },
        },
        "__Notes__": Object {
          "__typename": "Notes",
          "items": Array [],
        },
      }
    `)
  })

  test('initial write', async () => {
    expect(await queryNotes(NOTES_QUERY)).toMatchInlineSnapshot(`
        Object {
          "__typename": "Notes",
          "items": Array [],
        }
      `)

    writeNote({
      title: 'title',
      text: 'text',
    })

    expect(await queryNotes(NOTES_QUERY)).toMatchInlineSnapshot(`
        Object {
          "__typename": "Notes",
          "items": Array [
            Object {
              "__typename": "Note",
              "text": "text",
              "title": "title",
            },
          ],
        }
      `)
  })

  test('write two', async () => {
    writeNote({
      title: 'title',
      text: 'text',
    })

    writeNote({
      title: 'title2',
      text: 'text2',
    })

    expect(await queryNotes(NOTES_QUERY)).toMatchInlineSnapshot(`
      Object {
        "__typename": "Notes",
        "items": Array [
          Object {
            "__typename": "Note",
            "text": "text2",
            "title": "title2",
          },
          Object {
            "__typename": "Note",
            "text": "text",
            "title": "title",
          },
        ],
      }
    `)
  })

  test('rewrite', async () => {
    writeNote({
      title: 'title',
      text: 'text',
    })

    // Hold the id of the created note
    const {
      items: [{ id: firstNoteId }],
    } = await queryNotes(NOTES_QUERY_WITH_ID)
    expect(firstNoteId).toHaveLength(11)

    writeNote({
      id: firstNoteId,
      title: 'title...',
      text: 'text...',
    })

    expect(await queryNotes(NOTES_QUERY)).toMatchInlineSnapshot(`
        Object {
          "__typename": "Notes",
          "items": Array [
            Object {
              "__typename": "Note",
              "text": "text...",
              "title": "title...",
            },
          ],
        }
      `)
  })
})

function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
