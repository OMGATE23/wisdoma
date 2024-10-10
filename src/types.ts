export interface User {
  id: string;
  email: string;
  name: string;
}

export type PromiseResponse<T> =  {
  error: false,
  data: T
} | {
  error: true,
  message: string
}

export interface AppwriteError {
  message: string
}

export interface Folder {
  title: string,
  user_id: string,
  children: string[],
  parent_id: string | null,
  is_root: boolean,
  is_public: boolean,
  created_at: string,
}

export interface Note {
  title: string, 
  note_content: string,
  parent_id: string,
  created_at: string,
  updated_at: string,
  user_id: string,
  is_public: boolean
}

export interface Resp_Folder extends Folder {
  $updatedAt: string,
  $createdAt: string,
  $id: string,
  type: 'folder'
}

export interface Resp_File extends File {
  $updatedAt: string,
  $createdAt: string,
  $id: string,
  type: 'file'
}

export interface DocumentList<T> {
  total: number,
  documents: T[]
}

export interface FilesAndFolder {
  files: Resp_File[],
  folders: Resp_Folder[]
}