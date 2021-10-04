import { DocumentNode, gql } from '@apollo/client'
import { expect } from '@jest/globals'
import { debounce, throttle } from 'lodash'
import { Notes } from '../__generated__/types'
import { client, restoreCache } from './apollo-client'
import { writeNote } from './local-storage/write'

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
describe('apollo-client.test.ts', () => {
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

  // test("create new", async () => {
  //   writeNote({
  //     title: "title",
  //     text: "text",
  //   });
  //
  //   const { id } = createNewNote();
  //
  //   expect(await queryNotes(NOTES_QUERY)).toMatchInlineSnapshot(`
  //     Object {
  //       "__typename": "Notes",
  //       "items": Array [
  //         Object {
  //           "__typename": "Note",
  //           "text": "",
  //           "title": "",
  //         },
  //         Object {
  //           "__typename": "Note",
  //           "text": "text",
  //           "title": "title",
  //         },
  //       ],
  //     }
  //   `);
  //
  //   writeNote({
  //     id,
  //     title: "title...",
  //     text: "text...",
  //   });
  //
  //   expect(await queryNotes(NOTES_QUERY)).toMatchInlineSnapshot(`
  //     Object {
  //       "__typename": "Notes",
  //       "items": Array [
  //         Object {
  //           "__typename": "Note",
  //           "text": "text...",
  //           "title": "title...",
  //         },
  //         Object {
  //           "__typename": "Note",
  //           "text": "text",
  //           "title": "title",
  //         },
  //       ],
  //     }
  //   `);
  // });

  test('debounce', async () => {
    function yeah(s: string) {
      console.log(`yeah ${s}`)
    }
    const yeahD = debounce(yeah, 1000)

    for (const t of Array.from(Array(50)).map((_, i) => i)) {
      await timeout(10)
      yeahD(String(t))
    }

    const yeahT = throttle()

    await timeout(2000)
  }, 100000)
})

function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
