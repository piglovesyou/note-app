import { gql } from '@apollo/client'
import { debounce, throttle } from 'lodash'
import md5 from 'md5'
import { Note, Notes, WriteNoteInput } from '../../__generated__/types'
import { client } from '../client'

const { cache } = client

const NOTE_QUERY = gql`
  query Notes($id: String!) {
    note(id: $id) {
      __typename
      id
      text
      title
      updated_at
    }
  }
`

const NOTES_QUERY = gql`
  query Notes {
    notes {
      items {
        __typename
        id
      }
    }
  }
`

function generateId() {
  const hash = md5(String(Date.now())).slice(0, 6)
  return `note:${hash}`
}

function appendNoteIfNecessary(note: Note): void {
  const {
    notes: { items },
  } = cache.readQuery({
    query: NOTES_QUERY,
  }) as { notes: Notes }

  const lastId = items[0]?.id
  if (note.id === lastId) return

  const foundIndex = items.findIndex((e) => note.id === e.id)
  if (foundIndex >= 0) {
    // items returned by readQuery is immutable
    const mutableItems = Array.from(items)
    mutableItems.splice(foundIndex, 1)

    appendTo(mutableItems)
  } else {
    appendTo(items)
  }

  function appendTo(tailNotes: Note[]) {
    cache.writeQuery({
      query: NOTES_QUERY,
      data: {
        notes: {
          __typename: 'Notes',
          items: [note, ...tailNotes],
        } as Notes,
      },
    })
  }
}

// export function createNewNote(): Note {
//   return writeNote({ id: generateId() });
// }

export function writeNote(input: WriteNoteInput): Note {
  const id = input.id || generateId()

  const note: Note = {
    ...input,
    id,
    title: input.title || '',
    text: input.text || '',
    updated_at: String(new Date()),
    __typename: 'Note',
  }

  cache.writeQuery({
    query: NOTE_QUERY,
    variables: {
      id: id,
    },
    data: { note },
  })

  appendNoteIfNecessary(note)

  return note
}

export const writeNoteDebounced = debounce(writeNote, 100)
export const writeNoteThrottled = throttle(writeNote, 100)
