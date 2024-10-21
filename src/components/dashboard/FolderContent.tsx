import { Link } from "react-router-dom";
import { PromiseResponse, Resp_Folder, Resp_Note } from "../../types";
import DocumentIcon from "../../icons/DocumentIcon";
import FolderIcon from "../../icons/FolderIcon";
import EditIcon from "../../icons/EditIcon";
import TrashIcon from "../../icons/TrashIcon";
import { useState } from "react";
import InputModal from "../InputModal";
import DeleteModal from "../DeleteModal";

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
    <div className="flex items-center justify-between py-4 px-6 rounded outline outline-1 outline-neutral-200 text-center gap-2 transition-colors duration-200">
      <Link
        key={props.content.$id}
        to={
          props.content.type === "file"
            ? `/note/${props.content.$id}`
            : `/folder/${props.content.$id}`
        }
        className="flex items-center gap-4"
      >
        {props.content.type === "file" ? (
          <DocumentIcon strokeWidth={1} size={32} />
        ) : (
          <FolderIcon strokeWidth={1} size={32} />
        )}
        {props.content.title}
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
