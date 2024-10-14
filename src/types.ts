export interface User {
  id: string;
  email: string;
  name: string;
}

export type PromiseResponse<T> =
  | {
      error: false;
      data: T;
    }
  | {
      error: true;
      message: string;
    };

export interface AppwriteError {
  message: string;
}

export interface Folder {
  title: string;
  user_id: string;
  children: string[];
  parent_id: string | null;
  is_root: boolean;
  is_public: boolean;
  created_at: string;
  parent_title: string | null;
}

export interface Note {
  title: string;
  note_content: string;
  parent_id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  is_public: boolean;
  is_starred: boolean;
  parent_title: string | null;
}

export interface Resp_Folder extends Folder {
  $updatedAt: string;
  $createdAt: string;
  $id: string;
  type: "folder";
}

export interface Resp_Note extends Note {
  $updatedAt: string;
  $createdAt: string;
  $id: string;
  type: "file";
}

export interface DocumentList<T> {
  total: number;
  documents: T[];
}

export interface NotesAndFolder {
  files: Resp_Note[];
  folders: Resp_Folder[];
}

export interface Connection {
  user_id: string;
  source_id: string;
  destination_ids: string[];
}

export interface Resp_Connection extends Connection {
  $updatedAt: string;
  $createdAt: string;
  $id: string;
}
