import { gql } from '@apollo/client'
import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import TextArea from 'react-textarea-autosize'
import ReactTooltip from 'react-tooltip'
import { formatAgo } from './date'
import { writeNote, writeNoteDebounced } from './graphql/local-storage/write'
import { currIdVar, useCurrId } from './states/curr-id'
import { subscribeTick, unsubscribeTick } from './timer'
import { Note, useAllNotesQuery, useNoteQuery } from './__generated__/types'

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

const Toolbar: FC = () => {
  const currId = useCurrId()
  const note = useNoteQuery({ variables: { id: currId } })?.data?.note
  const canCreate = Boolean(currId && note?.title)
  return (
    <div className="xtoolbar">
      <div className="font-bold mr">🖋 My Note</div>
      <span className="spacer" />
      <button
        data-tip={`Save "${note?.title}" and create a new note`}
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

function parseDateSafe(dateStr: string | null | undefined): null | Date {
  return dateStr ? new Date(dateStr) : null
}

const LastSavedIndicator: FC<{
  dateStr: string | null | undefined
}> = ({ dateStr }) => {
  // Prevent to parse date string everytime to render
  const dateObj = useMemo(() => parseDateSafe(dateStr), [dateStr])

  // Hold date to update later
  const [d, setD] = useState(dateObj)

  const handleTick = useCallback(() => {
    dateStr && setD(parseDateSafe(dateStr))
  }, [dateStr])

  useEffect(() => {
    subscribeTick(handleTick)
    return () => {
      unsubscribeTick(handleTick)
    }
  }, [handleTick])

  return (
    <span data-tip={dateStr} data-place="bottom">
      {d && `${formatAgo(d)}`}
    </span>
  )
}

const Editor: FC = function () {
  const currId = useCurrId()
  const note = useNoteQuery({ variables: { id: currId } })?.data?.note
  const titleRef = useRef<HTMLInputElement | null>(null)
  const textRef = useRef<HTMLTextAreaElement | null>(null)
  const textValue = textRef.current?.value

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
  }, [currId, titleRef.current?.value, textValue])

  return (
    <div className="curr my-8 mx-8 flex flex-col">
      <div className="curr__toolbar flex mb-2 items-center">
        <input
          ref={titleRef}
          className="xtitle"
          type="text"
          defaultValue={note?.title || INITIAL_TITLE}
          onChange={writeNoteBuffered}
        />
        <span className="spacer" />
        <div className="text-faint">
          {note?.updated_at && (
            <span>
              Last update:{' '}
              <LastSavedIndicator key={note?.id} dateStr={note?.updated_at} />
            </span>
          )}
        </div>
      </div>

      <TextArea
        minRows={8}
        maxRows={16}
        maxLength={2000}
        ref={textRef}
        className="xtextarea"
        defaultValue={note?.text || undefined}
        onChange={writeNoteBuffered}
      />

      <div className="text-right text-faint-faint h-4 mt-1">
        {textValue ? `${textValue.length} / 2000` : ''}
      </div>
    </div>
  )
}

const Notes: FC = () => {
  const currId = useCurrId()
  const { data } = useAllNotesQuery()

  useEffect(() => {
    ReactTooltip.rebuild()
  }, [currId])

  return (
    <div className="xcontainer">
      <Toolbar />

      <Editor />

      <div className="xitem-container">
        {data?.notes?.items.map((n: Note) => {
          if (n.id === currId) return undefined
          return (
            <div key={n.id}>
              <div
                data-tip={`Open "${n.title}"`}
                className="xitem mb-1"
                onClick={() => currIdVar(n.id)}
              >
                <div className="ellipsis">{n.title}</div>
                <div className="text-faint multi-ellipsis">{n.text}</div>
              </div>
              <div className="text-right text-faint-faint">
                <LastSavedIndicator key={n.id} dateStr={n.updated_at} />
              </div>
            </div>
          )
        })}
      </div>

      <ReactTooltip effect="solid" />
    </div>
  )
}

const App: FC = () => {
  const { data } = useAllNotesQuery()

  // Load last note to edit
  const lastId = data?.notes?.items[0]?.id
  useEffect(() => {
    // Need to set variable outside of the rendering context
    // https://github.com/apollographql/apollo-client/issues/6188#issuecomment-796382651
    currIdVar(lastId)
  }, [])

  return <Notes />
}

export default App
