import { NotesAndFolder, PromiseResponse, Resp_Folder } from "../../types";
import DocumentIcon from "../../icons/DocumentIcon";
import FolderIcon from "../../icons/FolderIcon";
import {
  createNote,
  createFolder,
  updateNoteTitle,
  deleteNote,
  deleteFolder,
  updateFolderTitle,
} from "../../utils/db";
import {
  commonErrorHandling,
  getCurrentDateISOString,
} from "../../utils/helpers";
import { useAuthContext } from "../../utils/hooks";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import InputModal from "../InputModal";
import FolderContent from "./FolderContent";
import BreadCrumb from "../BreadCrumb";

interface Props {
  collection: NotesAndFolder;
  rootFolder: Resp_Folder | null;
  loading: boolean;
  resetRootAndCollection: () => Promise<void>;
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
        parent_id: props.rootFolder!.$id,
        created_at: getCurrentDateISOString(),
        updated_at: getCurrentDateISOString(),
        user_id: user!.id,
        is_public: false,
        is_starred: false,
        parent_title: props.rootFolder!.title,
      });

      if (resp.error) {
        return resp;
      }

      const fileId = resp.data.$id;
      props.resetRootAndCollection();
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
        props.rootFolder!.$id,
        title,
        props.rootFolder!.title
      );

      if (resp.error) {
        return resp;
      }
      const folderId = resp.data.$id;
      props.resetRootAndCollection();
      navigate(`/folder/${folderId}`);
      return { error: false, data: null };
    } catch (error) {
      return commonErrorHandling(error);
    }
  }

  async function handleRenameNote(
    noteId: string,
    val: string
  ): Promise<PromiseResponse<null>> {
    try {
      const resp = await updateNoteTitle(noteId, val);

      if (resp.error) return resp;

      props.resetRootAndCollection();
      return { error: false, data: null };
    } catch (error) {
      return commonErrorHandling(error);
    }
  }

  async function handleRenameFolder(
    folderId: string,
    val: string
  ): Promise<PromiseResponse<null>> {
    try {
      const resp = await updateFolderTitle(folderId, val);

      if (resp.error) return resp;

      props.resetRootAndCollection();
      return { error: false, data: null };
    } catch (error) {
      return commonErrorHandling(error);
    }
  }

  async function handleDeleteNote(
    noteId: string
  ): Promise<PromiseResponse<null>> {
    try {
      const resp = await deleteNote(noteId);

      if (resp.error) return resp;

      props.resetRootAndCollection();
      return { error: false, data: null };
    } catch (error) {
      return commonErrorHandling(error);
    }
  }

  async function handleDeleteFolder(
    noteId: string
  ): Promise<PromiseResponse<null>> {
    try {
      const resp = await deleteFolder(noteId);

      if (resp.error) return resp;

      props.resetRootAndCollection();

      return { error: false, data: null };
    } catch (error) {
      return commonErrorHandling(error);
    }
  }

  return (
    <div className="bg-white flex-col gap-4 h-full w-full rounded-md p-4 mr-8">
      {props.loading || props.rootFolder === null ? (
        <div className="font-lora flex justify-center items-center h-[100vh]">
        Good things come to those who wait...
      </div>
      ) : (
        <>
          <div className="flex flex-col gap-2 mb-4 ml-4">
            {props.rootFolder.parent_id && (
              <BreadCrumb currentNode={props.rootFolder} />
            )}
            <p className="text-2xl font-[600]">
              {props.rootFolder.is_root
                ? "Your Workspace"
                : props.rootFolder.title}
            </p>
          </div>
          {props.collection.folders.length === 0 ? (
            <div className="flex flex-col gap-4 h-[50%] justify-center items-center">
              <p className="text-3xl font-[600] text-neutral-800 text-center ">
                Create notes and folders now!
              </p>
              <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                <button
                  className="flex items-center gap-2 bg-neutral-800 py-1.5 px-4 rounded-md text-white shadow"
                  onClick={() => setNoteModalOpen(true)}
                >
                  <DocumentIcon size={16} strokeWidth={1} />
                  Create Note
                </button>
                <button
                  className="flex items-center gap-2 bg-neutral-100 py-1.5 px-4 rounded-md text-neutral-900 shadow-sm"
                  onClick={() => setFolderModalOpen(true)}
                >
                  <FolderIcon size={16} strokeWidth={1} />
                  Create Folder
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-4">
                <button
                  className="flex items-center gap-2 text-sm md:text-base bg-neutral-800 py-1.5 px-4 rounded-md text-white shadow"
                  onClick={() => setNoteModalOpen(true)}
                >
                  <DocumentIcon size={16} strokeWidth={1} />
                  Create Note
                </button>
                <button
                  className="flex items-center gap-2 text-sm md:text-base bg-neutral-100 py-1.5 px-4 rounded-md text-neutral-900 shadow-sm"
                  onClick={() => setFolderModalOpen(true)}
                >
                  <FolderIcon size={16} strokeWidth={1} />
                  Create Folder
                </button>
              </div>
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 mr-8">
                {props.collection.files.map((file) => (
                  <React.Fragment key={file.$id}>
                    <FolderContent
                      content={file}
                      handleDelete={handleDeleteNote}
                      handleRename={handleRenameNote}
                    />
                  </React.Fragment>
                ))}

                {props.collection.folders.map((folder) => (
                  <React.Fragment key={folder.$id}>
                    <FolderContent
                      content={folder}
                      handleDelete={handleDeleteFolder}
                      handleRename={handleRenameFolder}
                    />
                  </React.Fragment>
                ))}
              </div>
            </>
          )}
          {props.rootFolder && (
            <InputModal
              isOpen={isFolderModalOpen}
              title="Folder Name"
              onClose={() => setFolderModalOpen(false)}
              onSubmit={createFolderInRoot}
            />
          )}

          {props.rootFolder && (
            <InputModal
              isOpen={isNoteModalOpen}
              title="Note Name"
              onClose={() => setNoteModalOpen(false)}
              onSubmit={createNoteInRoot}
            />
          )}
        </>
      )}
    </div>
  );
}
