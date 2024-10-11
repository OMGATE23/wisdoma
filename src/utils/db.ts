import { DocumentList, FilesAndFolder, Folder, File, PromiseResponse, Resp_File, Resp_Folder } from "../types";
import { databases } from "./appwrite";
import { ID, Query } from "appwrite";
import { commonErrorHandling, getCurrentDateISOString } from "./helpers";


export async function createRootFolder(folder_data: Folder): Promise<PromiseResponse<Resp_Folder>> {
  try {
    const resp = await databases.createDocument(
      import.meta.env.VITE_DATABASE_ID,
      import.meta.env.VITE_FOLDER_COLLECTION_ID,
      ID.unique(),
      {
        "title": folder_data.title,
        "user_id": folder_data.user_id,
        "children": folder_data.children,
        "parent_id": folder_data.parent_id,
        "is_root": folder_data.is_root,
        "is_public": folder_data.is_public,
        "created_at": folder_data.created_at
      }
    )
    console.log(">>> created root folder", resp);
    return {error: false, data: resp as unknown as Resp_Folder}
  } catch(error: unknown) {
    if(error instanceof Error) {
      console.log(">>> ERR: ", error.message)
      return {error: true, message: error.message}
    }

    return {error: true, message: "Unknown error occured"}
  }
}

export async function createFile(file_data: File): Promise<PromiseResponse<Resp_File>> {
  try {
    const resp = await databases.createDocument(
      import.meta.env.VITE_DATABASE_ID,
      import.meta.env.VITE_NOTES_COLLECTION_ID,
      ID.unique(),
      {
        "title": file_data.title,
        "user_id": file_data.user_id,
        "parent_id": file_data.parent_id,
        "is_public": file_data.is_public,
        "created_at": file_data.created_at,
        "updated_at": file_data.updated_at,
        "note_content": file_data.note_content
      }
    )
    return {error: false, data: resp as unknown as Resp_File}
  } catch (error: unknown) {
    return commonErrorHandling(error);
  }
}

export async function checkForRootFolder(user_id: string) : Promise<PromiseResponse<Resp_Folder>> {
  try {
    const folder = await databases.listDocuments(
      import.meta.env.VITE_DATABASE_ID,
      import.meta.env.VITE_FOLDER_COLLECTION_ID,
      [Query.equal('user_id', [user_id]), Query.equal('is_root', [true])]
    )

    return {error: false, data: (folder.documents[0] as unknown as Resp_Folder)}
  } catch(error: unknown) {
    return commonErrorHandling(error)
  }
}

export async function createFolder(user_id: string, parent_id: string, title: string): Promise<PromiseResponse<Resp_Folder>> {
  try {
    const resp = await databases.createDocument(
      import.meta.env.VITE_DATABASE_ID,
      import.meta.env.VITE_FOLDER_COLLECTION_ID,
      ID.unique(),
      {
        "title": title,
        "user_id": user_id,
        "parent_id": parent_id,
        "created_at": getCurrentDateISOString()
      }
    )

    return {error: false, data: resp as unknown as Resp_Folder}
  } catch(error: unknown) {
    if(error instanceof Error) {
      console.log(">>> ERR: ", error.message)
      return {error: true, message: error.message}
    }

    return {error: true, message: "Unknown error occured"}
  }
}

export async function getFoldersByParentId(parent_id: string, user_id: string): Promise<PromiseResponse<Resp_Folder[]>> {
  try {
    const resp = await databases.listDocuments(
      import.meta.env.VITE_DATABASE_ID,
      import.meta.env.VITE_FOLDER_COLLECTION_ID,
      [Query.equal('user_id', [user_id]), Query.equal('parent_id', [parent_id])]
    )
    const folder = resp as unknown as DocumentList<Resp_Folder>
    return {error: false, data: folder.documents}
  } catch(error: unknown) {
    return commonErrorHandling(error);
  }
}

export async function getFilesByParentId(parent_id: string, user_id: string): Promise<PromiseResponse<Resp_File[]>> {
  try {
    const resp = await databases.listDocuments(
      import.meta.env.VITE_DATABASE_ID,
      import.meta.env.VITE_NOTES_COLLECTION_ID,
      [Query.equal('user_id', [user_id]), Query.equal('parent_id', [parent_id])]
    )
    const folder = resp as unknown as DocumentList<Resp_File>
    return {error: false, data: folder.documents}
  } catch(error: unknown) {
    return commonErrorHandling(error);
  }
}


export async function getAllFilesAndFoldersFromParentID(parent_id: string, user_id: string): Promise<PromiseResponse<FilesAndFolder>> {
  try {
    const filesResp = await getFilesByParentId(parent_id, user_id)
    if(filesResp.error) return filesResp

    const foldersResp = await getFoldersByParentId(parent_id, user_id)
    if(foldersResp.error) return foldersResp

    return {
      error: false,
      data: {
        files: filesResp.data,
        folders: foldersResp.data
      }
    }
  } catch(error: unknown) {
    return commonErrorHandling(error);
  }
}


export async function getFileById(note_id: string, user_id: string): Promise<PromiseResponse<Resp_File>> {
  try {
    const resp = await databases.getDocument(
      import.meta.env.VITE_DATABASE_ID,
      import.meta.env.VITE_NOTES_COLLECTION_ID,
      note_id
    )
    const file = resp as unknown as Resp_File;

    if(file.user_id === user_id || file.is_public) {
      return {error: false, data: file}
    } else  {
      throw new Error("Couldn't find the note you were looking for")
    }
  } catch(error: unknown) {
    return commonErrorHandling(error);
  }
}

export async function getFolderById(folder_id: string, user_id: string): Promise<PromiseResponse<Resp_Folder>> {
  try {
    const resp = await databases.getDocument(
      import.meta.env.VITE_DATABASE_ID,
      import.meta.env.VITE_FOLDER_COLLECTION_ID,
      folder_id
    )
    const folder = resp as unknown as Resp_Folder;

    if(folder.user_id === user_id || folder.is_public) {
      return {error: false, data: folder}
    } else  {
      throw new Error("Couldn't find the folder you were looking for")
    }
  } catch(error: unknown) {
    return commonErrorHandling(error);
  }
}


export async function saveNoteContent(noteId: string, content: string): Promise<PromiseResponse<null>>  {
  try {
    const response = await databases.updateDocument(
      import.meta.env.VITE_DATABASE_ID,
      import.meta.env.VITE_NOTES_COLLECTION_ID,
      noteId,
      {
        note_content: content,
      }
    );

    if (response.error) throw new Error(response.message);

    return {error: false, data: null}
  } catch (error: unknown) {
    return commonErrorHandling(error)
  }
}