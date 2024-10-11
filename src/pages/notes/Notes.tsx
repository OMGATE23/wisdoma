import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Resp_File } from '../../types'
import { getFileById } from '../../utils/db'
import { useAuthContext } from '../../utils/hooks'
import { commonErrorHandling } from '../../utils/helpers'
import NoteEditor from '../../components/note/NoteEditor'

export default function Notes() {
  const [note, setNote] = useState<Resp_File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const {id} = useParams<{id: string}>()
  const {user} = useAuthContext()
  const navigate = useNavigate()

  useEffect(() => {
    async function getNote() {
      try {
        if(id) {
          const resp = await getFileById(id, user?.id || '');
          setLoading(false)
          if(resp.error) {
            setError(resp.message);
            return;
          }
          setNote(resp.data);
        }
      } catch(error: unknown) {
        const err = commonErrorHandling(error);
        setError(err.message);
      }
    }

    getNote()
  } , [user, id])

  if(!id) {
    navigate('/folder')
  }

  if(loading) {
    return <></>
  }
  return (
    <div>
      Notes: {id}
      {
        note && (
          <div className='flex flex-col gap-4 items-center'>
            <Link to={`/folder/${note.parent_id}`}>Parent Folder</Link>
            title: {note.title}
            <NoteEditor note={note} editable={note.user_id === user?.id} />
          </div>
        )
      }
      {error && <p>{error}</p>}
    </div>
  )
}
