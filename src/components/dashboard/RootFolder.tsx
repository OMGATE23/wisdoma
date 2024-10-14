import { NotesAndFolder, PromiseResponse, Resp_Folder } from "../../types";
import Button from "../Button";
import DocumentIcon from "../../icons/DocumentIcon";
import FolderIcon from "../../icons/FolderIcon";
import { createNote, createFolder } from "../../utils/db";
import {
  commonErrorHandling,
  getCurrentDateISOString,
} from "../../utils/helpers";
import { useAuthContext } from "../../utils/hooks";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import InputModal from "../InputModal";

interface Props {
  collection: NotesAndFolder;
  rootFolder: Resp_Folder;
  loading: boolean;
}
export default function RootFolder(props: Props) {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [isFolderModalOpen, setFolderModalOpen] = useState(false);
  const [isNoteModalOpen, setNoteModalOpen] = useState(false);

  async function createNoteInRoot(
    title: string
  ): Promise<PromiseResponse<null>> {
    try {
      const resp = await createNote({
        title: title,
        note_content: "",
        parent_id: props.rootFolder.$id,
        created_at: getCurrentDateISOString(),
        updated_at: getCurrentDateISOString(),
        user_id: user!.id,
        is_public: false,
        is_starred: false,
        parent_title: props.rootFolder.title,
      });

      if (resp.error) {
        return resp;
      }

      const fileId = resp.data.$id;

      console.log("redirecting", fileId);
      navigate(`/note/${fileId}`);

      return { error: false, data: null };
    } catch (error) {
      return commonErrorHandling(error);
    }
  }

  async function createFolderInRoot(
    title: string
  ): Promise<PromiseResponse<null>> {
    try {
      const resp = await createFolder(
        user!.id,
        props.rootFolder.$id,
        title,
        props.rootFolder.title
      );

      if (resp.error) {
        return resp;
      }
      const folderId = resp.data.$id;

      console.log("redirecting", folderId);
      navigate(`/folder/${folderId}`);
      return { error: false, data: null };
    } catch (error) {
      return commonErrorHandling(error);
    }
  }

  return (
    <div className="flex bg-white flex-col gap-4 items-center justify-center w-[80%] h-[80vh] outline outline-1 outline-neutral-200 rounded-md p-4 overflow-auto">
      {props.loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {props.rootFolder.parent_id && (
            <Link to={`/folder/${props.rootFolder.parent_id}`}>Go Back</Link>
          )}
          {props.collection.files.length === 0 &&
          props.collection.folders.length === 0 ? (
            <>
              <p className="text-3xl font-[600] text-neutral-800">
                Create notes and folders now!
              </p>
              <div className="flex items-center justify-between gap-4">
                <Button
                  intent="filled"
                  text="Create Note"
                  icon={<DocumentIcon />}
                  bgColor="bg-green-500"
                  textColor="text-white"
                  onClick={() => setNoteModalOpen(true)}
                />
                <Button
                  intent="outline"
                  text="Create Folder"
                  icon={<FolderIcon />}
                  bgColor="bg-blue-500"
                  textColor="text-white"
                  onClick={() => setFolderModalOpen(true)}
                />
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between gap-4">
                <Button
                  intent="filled"
                  text="Create Note"
                  icon={<DocumentIcon />}
                  bgColor="bg-green-500"
                  textColor="text-white"
                  onClick={() => setNoteModalOpen(true)}
                />
                <Button
                  intent="outline"
                  text="Create Folder"
                  icon={<FolderIcon />}
                  bgColor="bg-blue-500"
                  textColor="text-white"
                  onClick={() => setFolderModalOpen(true)}
                />
              </div>
              <div className="w-full grid grid-cols-6 gap-4">
                {props.collection.files.map((file) => (
                  <Link
                    key={file.$id}
                    to={`/note/${file.$id}`}
                    className="flex flex-col p-4 rounded"
                  >
                    <DocumentIcon size={32} />
                    {file.title}
                  </Link>
                ))}

                {props.collection.folders.map((folder) => (
                  <Link
                    key={folder.$id}
                    to={`/folder/${folder.$id}`}
                    className="flex flex-col p-4 rounded"
                  >
                    <FolderIcon size={32} />
                    {folder.title}
                  </Link>
                ))}
              </div>
            </>
          )}
          <InputModal
            isOpen={isFolderModalOpen}
            title="Folder Name"
            onClose={() => setFolderModalOpen(false)}
            onSubmit={createFolderInRoot}
          />

          {/* Note Creation Modal */}
          <InputModal
            isOpen={isNoteModalOpen}
            title="Note Name"
            onClose={() => setNoteModalOpen(false)}
            onSubmit={createNoteInRoot}
          />
        </>
      )}
    </div>
  );
}
