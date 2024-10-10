import React, { useEffect, useState } from 'react'
import { FilesAndFolder, Resp_File } from '../../types'
import Button from '../Button'
import DocumentIcon from '../../icons/DocumentIcon'
import FolderIcon from '../../icons/FolderIcon'

interface Props {
  collection: FilesAndFolder
}
export default function RootFolder(props: Props) {
  const [starredNotes, setStarredNotes] = useState<Resp_File[]>([])

  useEffect(() => {
    const starredNotes = props.collection.files.filter(note => note.is_starred);
    setStarredNotes(starredNotes);
  }, [props.collection.files])

  if (props.collection.files.length === 0 && props.collection.folders.length === 0) {
    return (
      <div className="flex flex-col gap-4 items-center justify-center w-full h-[80vh] border-r border-solid border-neutral-200 p-4 ">
        <p className='text-3xl font-[600] text-neutral-800'>Create notes and folders now!</p>
        <div
          className='flex items-center justify-between gap-4'
        >
          <Button
            intent='filled'
            text='Create Note'
            icon={<DocumentIcon/>}
          />
          <Button
            intent='outline'
            text='Create Folder'
            icon={<FolderIcon/>}
          />
        </div>
        {
          starredNotes.map(({$id}) => (
            <React.Fragment key={$id}></React.Fragment>
          ))
        }
      </div>
    )
  }
  return (
    <div>RootFolder</div>
  )
}
