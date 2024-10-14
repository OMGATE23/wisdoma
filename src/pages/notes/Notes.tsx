import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { NotesAndFolder, Resp_Note } from '../../types'
import { getAllNotesAndFolders, getNoteById } from '../../utils/db'
import { useAuthContext } from '../../utils/hooks'
import { commonErrorHandling } from '../../utils/helpers'
import NoteEditor from '../../components/note/NoteEditor'

export default function Notes() {
  const [note, setNote] = useState<Resp_Note | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [collection, setCollection] = useState<NotesAndFolder>({
    files: [],
    folders: []
  })
  const {id} = useParams<{id: string}>()
  const {user} = useAuthContext()
  const navigate = useNavigate()

  useEffect(() => {
    async function getNote() {
      try {
        if(id) {
          setLoading(true)
          const resp = await getNoteById(id, user?.id || '');
          const collectionResp = await getAllNotesAndFolders(user?.id || '');
          if(resp.error) {
            setError(resp.message);
            return;
          }
          setNote(resp.data);

          if(collectionResp.error) {
            setError(collectionResp.message);
            return;
          }

          setCollection(collectionResp.data);
          setLoading(false)
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
        note && !loading && (
          <div className='flex flex-col gap-4 items-center'>
            <Link to={`/folder/${note.parent_id}`}>Parent Folder</Link>
            title: {note.title}
            <NoteEditor note={note} editable={note.user_id === user?.id} collection={collection} />
          </div>
        )
      }
      {error && <p>{error}</p>}
    </div>
  )
}
