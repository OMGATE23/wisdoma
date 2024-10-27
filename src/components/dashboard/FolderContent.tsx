import { Link } from "react-router-dom";
import { PromiseResponse, Resp_Folder, Resp_Note } from "../../types";
import DocumentIcon from "../../icons/DocumentIcon";
import FolderIcon from "../../icons/FolderIcon";
import EditIcon from "../../icons/EditIcon";
import TrashIcon from "../../icons/TrashIcon";
import { useState } from "react";
import InputModal from "../InputModal";
import DeleteModal from "../DeleteModal";
import { formatCreatedAt } from "../../utils/helpers";

interface Props {
  content: Resp_Note | Resp_Folder;
  handleRename: (id: string, val: string) => Promise<PromiseResponse<null>>;
  handleDelete: (id: string) => Promise<PromiseResponse<null>>;
}
export default function FolderContent(props: Props) {
  const [showDelete, setShowDelete] = useState(false);
  const [showRename, setShowRename] = useState(false);

  const handleIdRename = (val: string): Promise<PromiseResponse<null>> => {
    return props.handleRename(props.content.$id, val);
  };

  const handleIdDelete = (): Promise<PromiseResponse<null>> => {
    return props.handleDelete(props.content.$id);
  };
  return (
    <div
      key={props.content.$id}
      className="flex items-center justify-between p-4 rounded outline outline-1 outline-neutral-200 text-center gap-2 transition-colors duration-200"
    >
      <Link
        key={props.content.$id}
        to={
          props.content.type === "file"
            ? `/note/${props.content.$id}`
            : `/folder/${props.content.$id}`
        }
        className="flex items-center gap-4"
      >
        <div className="bg-neutral-100 p-2 rounded">
          {props.content.type === "file" ? (
            <DocumentIcon strokeWidth={1} size={24} />
          ) : (
            <FolderIcon strokeWidth={1} size={24} />
          )}
        </div>
        <div className="text-left">
          <p>{props.content.title}</p>
          <p className="text-[0.75rem] text-neutral-700">
            Created on: {formatCreatedAt(props.content.$updatedAt)}
          </p>
        </div>
      </Link>

      <div className="flex items-center gap-2">
        <button title="rename note/folder" onClick={() => setShowRename(true)}>
          <EditIcon size={20} />
        </button>
        <button
          className="hover:text-red-500"
          title="delete note/folder"
          onClick={() => setShowDelete(true)}
        >
          <TrashIcon size={20} />
        </button>
      </div>
      <InputModal
        isOpen={showRename}
        onClose={() => {
          setShowRename(false);
        }}
        title={`Rename ${props.content.type}`}
        placeholder="Untitled"
        defaultValue={props.content.title}
        onSubmit={handleIdRename}
      />
      <DeleteModal
        isOpen={showDelete}
        onClose={() => {
          setShowDelete(false);
        }}
        title={props.content.title}
        onDelete={handleIdDelete}
      />
    </div>
  );
}
