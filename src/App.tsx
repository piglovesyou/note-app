import { gql } from '@apollo/client'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'
import React, { FC, useCallback, useEffect, useRef } from 'react'
import TextArea from 'react-textarea-autosize'
import { writeNote, writeNoteDebounced } from './graphql/local-storage/write'
import { currIdVar, useCurrId } from './states/curr-id'
import { Note, useAllNotesQuery, useNoteQuery } from './__generated__/types'

TimeAgo.addDefaultLocale(en)
const timeAgo = new TimeAgo('en-US')

gql`
  query AllNotes {
    notes {
      items {
        id
        text
        title
        updated_at
      }
    }
  }
`

gql`
  query Note($id: String) {
    note(id: $id) {
      id
      text
      title
      updated_at
    }
  }
`

gql`
  query LastNote {
    lastNote {
      id
      text
      title
      updated_at
    }
  }
`

const Toolbar: FC = () => {
  const currId = useCurrId()
  const note = useNoteQuery({ variables: { id: currId } })?.data?.note
  const canCreate = Boolean(currId && note?.title)
  return (
    <div className="xtoolbar">
      <div className="font-bold mr">🖋 Memo</div>
      <span className="spacer" />
      <button
        className="py-1.5 px-4 rounded bg-pink-500 text-white"
        style={{ visibility: canCreate ? 'visible' : 'hidden' }}
        onClick={(e) => {
          e.preventDefault()
          // const { id } = createNewNote();
          currIdVar(null)
        }}
      >
        New note
      </button>
      <div className="rounded-full bg-white w-8 h-8" />
    </div>
  )
}

const INITIAL_TITLE = 'Untitled'

const Editor: FC<{}> = function ({}) {
  const currId = useCurrId()
  const note = useNoteQuery({ variables: { id: currId } })?.data?.note
  const titleRef = useRef<HTMLInputElement | null>(null)
  const textRef = useRef<HTMLTextAreaElement | null>(null)

  useEffect(() => {
    if (note) {
      titleRef.current!.value = note.title
      textRef.current!.value = note.text
    } else {
      titleRef.current!.value = INITIAL_TITLE
      textRef.current!.value = ''
      titleRef.current?.select()
    }
  }, [note?.id])

  const writeNoteBuffered = useCallback(() => {
    const input = {
      title: titleRef.current!.value,
      text: textRef.current!.value,
    }
    if (!currId) {
      const { id } = writeNote(input)
      currIdVar(id)
    } else {
      writeNoteDebounced({ id: currId, ...input })
    }
  }, [currId, titleRef.current?.value, textRef.current?.value])

  return (
    <div className="curr my-8 mx-8 flex flex-col">
      <div className="curr__toolbar flex mb-2">
        <input
          ref={titleRef}
          className="xtitle"
          type="text"
          defaultValue={note?.title || INITIAL_TITLE}
          onChange={writeNoteBuffered}
        />
        <span className="spacer" />
        <div className="curr_last-udpated text-faint">
          {note?.updated_at &&
            `Last update: ${timeAgo.format(new Date(note?.updated_at))}`}
        </div>
      </div>

      <TextArea
        minRows={4}
        maxRows={16}
        ref={textRef}
        className="xtextarea"
        defaultValue={note?.text || undefined}
        onChange={writeNoteBuffered}
      />
    </div>
  )
}

const Notes: FC<{}> = ({}) => {
  const currId = useCurrId()
  const { data } = useAllNotesQuery()

  return (
    <div className="xcontainer">
      <Toolbar />

      <Editor />

      <div className="xitem-container">
        {data?.notes?.items.map((n: Note, i: number) => {
          if (n.id === currId) return undefined
          return (
            <div
              className="xitem "
              key={i}
              onClick={() => {
                currIdVar(n.id)
              }}
            >
              <div className="ellipsis">{n.title}</div>
              <div className="text-faint multi-ellipsis">{n.text}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const App: FC = () => {
  const { data } = useAllNotesQuery()

  const lastId = data?.notes?.items[0]?.id
  useEffect(() => {
    // Need to set variable outside of the rendering context
    // https://github.com/apollographql/apollo-client/issues/6188#issuecomment-796382651
    currIdVar(lastId)
  }, [])

  return <Notes />
}

export default App
