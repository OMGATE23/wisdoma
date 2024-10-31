import {
  DocumentList,
  NotesAndFolder,
  Folder,
  Note,
  PromiseResponse,
  Resp_Note,
  Resp_Folder,
  Resp_Connection,
} from '../types';
import { databases, storage } from './appwrite';
import { ID, Query } from 'appwrite';
import { commonErrorHandling, getCurrentDateISOString } from './helpers';
import { toast } from 'sonner';
import { defaultRootFolder } from './constants';

export async function createRootFolder(
  folder_data: Folder,
): Promise<PromiseResponse<Resp_Folder>> {
  try {
    const resp = await databases.createDocument(
      import.meta.env.VITE_DATABASE_ID,
      import.meta.env.VITE_FOLDER_COLLECTION_ID,
      ID.unique(),
      {
        title: folder_data.title,
        user_id: folder_data.user_id,
        children: folder_data.children,
        parent_id: folder_data.parent_id,
        is_root: folder_data.is_root,
        is_public: folder_data.is_public,
        created_at: folder_data.created_at,
      },
    );
    return { error: false, data: resp as unknown as Resp_Folder };
  } catch (error: unknown) {
    const err = commonErrorHandling(error);
    toast.error(err.message);
    return err;
  }
}

export async function createNote(
  file_data: Note,
): Promise<PromiseResponse<Resp_Note>> {
  try {
    const existingNotes = await getNotesByParentId(
      file_data.parent_id,
      file_data.user_id,
    );

    if (existingNotes.error)
      return {
        error: true,
        message: 'Error creating file, try again in a bit',
      };

    const resp = await databases.createDocument(
      import.meta.env.VITE_DATABASE_ID,
      import.meta.env.VITE_NOTES_COLLECTION_ID,
      ID.unique(),
      {
        title: file_data.title,
        user_id: file_data.user_id,
        parent_id: file_data.parent_id,
        is_public: file_data.is_public,
        created_at: file_data.created_at,
        updated_at: file_data.updated_at,
        note_content: file_data.note_content,
        parent_title: file_data.parent_title,
      },
    );
    return { error: false, data: resp as unknown as Resp_Note };
  } catch (error: unknown) {
    return commonErrorHandling(error);
  }
}

export async function checkForRootFolder(
  user_id: string,
): Promise<PromiseResponse<Resp_Folder>> {
  try {
    const folder = await databases.listDocuments(
      import.meta.env.VITE_DATABASE_ID,
      import.meta.env.VITE_FOLDER_COLLECTION_ID,
      [Query.equal('user_id', [user_id]), Query.equal('is_root', [true])],
    );

    if (folder.total === 0) {
      const root_folder = await createRootFolder({
        ...defaultRootFolder,
        user_id: user_id,
      });

      if (root_folder.error) {
        const err = commonErrorHandling(root_folder.error);
        toast.error(err.message);
        return err;
      }

      return {
        error: false,
        data: root_folder.data,
      };
    }

    return {
      error: false,
      data: folder.documents[0] as unknown as Resp_Folder,
    };
  } catch (error: unknown) {
    const err = commonErrorHandling(error);
    toast.error(err.message);
    return err;
  }
}

export async function createFolder(
  user_id: string,
  parent_id: string,
  title: string,
  parent_title: string,
): Promise<PromiseResponse<Resp_Folder>> {
  try {
    const existingFolders = await getFoldersByParentId(parent_id, user_id);

    if (existingFolders.error)
      return {
        error: true,
        message: 'Error creating folder, try again in a bit',
      };

    if (existingFolders.data.some(folder => folder.title === title)) {
      return {
        error: true,
        message: `Folder with the name "${title}" already exists in this folder.`,
      };
    }

    const resp = await databases.createDocument(
      import.meta.env.VITE_DATABASE_ID,
      import.meta.env.VITE_FOLDER_COLLECTION_ID,
      ID.unique(),
      {
        title: title,
        user_id: user_id,
        parent_id: parent_id,
        created_at: getCurrentDateISOString(),
        parent_title: parent_title,
      },
    );

    return { error: false, data: resp as unknown as Resp_Folder };
  } catch (error: unknown) {
    const err = commonErrorHandling(error);
    toast.error(err.message);
    return err;
  }
}

export async function getFoldersByParentId(
  parent_id: string | null,
  user_id: string,
): Promise<PromiseResponse<Resp_Folder[]>> {
  try {
    let queries: string[] = [];

    if (parent_id) {
      queries = [
        Query.equal('user_id', [user_id]),
        Query.equal('parent_id', [parent_id]),
      ];
    } else {
      queries = [
        Query.equal('user_id', [user_id]),
        Query.equal('is_root', [true]),
      ];
    }
    const resp = await databases.listDocuments(
      import.meta.env.VITE_DATABASE_ID,
      import.meta.env.VITE_FOLDER_COLLECTION_ID,
      queries,
    );
    const folder = resp as unknown as DocumentList<Resp_Folder>;
    return { error: false, data: folder.documents };
  } catch (error: unknown) {
    return commonErrorHandling(error);
  }
}

export async function getNotesByParentId(
  parent_id: string | null,
  user_id: string,
): Promise<PromiseResponse<Resp_Note[]>> {
  try {
    let queries: string[] = [];

    if (parent_id) {
      queries = [
        Query.equal('user_id', [user_id]),
        Query.equal('parent_id', [parent_id]),
      ];
    } else {
      queries = [
        Query.equal('user_id', [user_id]),
        Query.equal('is_root', [true]),
      ];
    }

    const resp = await databases.listDocuments(
      import.meta.env.VITE_DATABASE_ID,
      import.meta.env.VITE_NOTES_COLLECTION_ID,
      queries,
    );
    const folder = resp as unknown as DocumentList<Resp_Note>;
    return { error: false, data: folder.documents };
  } catch (error: unknown) {
    return commonErrorHandling(error);
  }
}

export async function getAllNotesAndFoldersFromParentID(
  parent_id: string,
  user_id: string,
): Promise<PromiseResponse<NotesAndFolder>> {
  try {
    const filesResp = await getNotesByParentId(parent_id, user_id);
    if (filesResp.error) return filesResp;

    const foldersResp = await getFoldersByParentId(parent_id, user_id);
    if (foldersResp.error) return foldersResp;

    return {
      error: false,
      data: {
        files: filesResp.data,
        folders: foldersResp.data,
      },
    };
  } catch (error: unknown) {
    return commonErrorHandling(error);
  }
}

export async function getNoteById(
  note_id: string,
  user_id: string,
): Promise<PromiseResponse<Resp_Note>> {
  try {
    const resp = await databases.getDocument(
      import.meta.env.VITE_DATABASE_ID,
      import.meta.env.VITE_NOTES_COLLECTION_ID,
      note_id,
    );
    const file = resp as unknown as Resp_Note;

    if (file.user_id === user_id || file.is_public) {
      return { error: false, data: file };
    } else {
      throw new Error("Couldn't find the note you were looking for");
    }
  } catch (error: unknown) {
    return commonErrorHandling(error);
  }
}

export async function getFolderById(
  folder_id: string,
  user_id: string,
): Promise<PromiseResponse<Resp_Folder>> {
  try {
    const resp = await databases.getDocument(
      import.meta.env.VITE_DATABASE_ID,
      import.meta.env.VITE_FOLDER_COLLECTION_ID,
      folder_id,
    );
    const folder = resp as unknown as Resp_Folder;

    if (folder.user_id === user_id || folder.is_public) {
      return { error: false, data: folder };
    } else {
      throw new Error("Couldn't find the folder you were looking for");
    }
  } catch (error: unknown) {
    return commonErrorHandling(error);
  }
}

export async function saveNoteContent(
  noteId: string,
  content: string,
): Promise<PromiseResponse<null>> {
  try {
    await databases.updateDocument(
      import.meta.env.VITE_DATABASE_ID,
      import.meta.env.VITE_NOTES_COLLECTION_ID,
      noteId,
      {
        note_content: content,
      },
    );

    return { error: false, data: null };
  } catch (error: unknown) {
    return commonErrorHandling(error);
  }
}

export async function getAllFolders(
  user_id: string,
): Promise<PromiseResponse<Resp_Folder[]>> {
  try {
    const resp = await databases.listDocuments(
      import.meta.env.VITE_DATABASE_ID,
      import.meta.env.VITE_FOLDER_COLLECTION_ID,
      [Query.equal('user_id', [user_id])],
    );
    const folder = resp as unknown as DocumentList<Resp_Folder>;
    return { error: false, data: folder.documents };
  } catch (error: unknown) {
    return commonErrorHandling(error);
  }
}

export async function getAllNotes(
  user_id: string,
): Promise<PromiseResponse<Resp_Note[]>> {
  try {
    const resp = await databases.listDocuments(
      import.meta.env.VITE_DATABASE_ID,
      import.meta.env.VITE_NOTES_COLLECTION_ID,
      [Query.equal('user_id', [user_id])],
    );
    const folder = resp as unknown as DocumentList<Resp_Note>;
    return { error: false, data: folder.documents };
  } catch (error: unknown) {
    return commonErrorHandling(error);
  }
}

export async function getAllNotesAndFolders(
  user_id: string,
): Promise<PromiseResponse<NotesAndFolder>> {
  try {
    const filesResp = await getAllNotes(user_id);
    if (filesResp.error) return filesResp;

    const foldersResp = await getAllFolders(user_id);
    if (foldersResp.error) return foldersResp;

    return {
      error: false,
      data: {
        files: filesResp.data,
        folders: foldersResp.data,
      },
    };
  } catch (error: unknown) {
    return commonErrorHandling(error);
  }
}

export async function createConnection(
  user_id: string,
  source_id: string,
  destination_ids: string[],
): Promise<PromiseResponse<null>> {
  try {
    const allDocuments = await databases.listDocuments(
      import.meta.env.VITE_DATABASE_ID,
      import.meta.env.VITE_CONNECTIONS_COLLECTION_ID,
      [
        Query.equal('source_id', [source_id]),
        Query.equal('user_id', [user_id]),
      ],
    );

    if (allDocuments.total === 0) {
      await databases.createDocument(
        import.meta.env.VITE_DATABASE_ID,
        import.meta.env.VITE_CONNECTIONS_COLLECTION_ID,
        ID.unique(),
        {
          source_id: source_id,
          user_id: user_id,
          destination_ids: destination_ids,
        },
      );
    } else {
      const id = allDocuments.documents[0].$id;

      await databases.updateDocument(
        import.meta.env.VITE_DATABASE_ID,
        import.meta.env.VITE_CONNECTIONS_COLLECTION_ID,
        id,
        { destination_ids },
      );
    }

    return { error: false, data: null };
  } catch (error: unknown) {
    return commonErrorHandling(error);
  }
}

export async function getConnections(
  user_id: string,
): Promise<PromiseResponse<Resp_Connection[]>> {
  try {
    const allDocuments = await databases.listDocuments(
      import.meta.env.VITE_DATABASE_ID,
      import.meta.env.VITE_CONNECTIONS_COLLECTION_ID,
      [Query.equal('user_id', [user_id])],
    );

    return {
      error: false,
      data: allDocuments.documents as unknown as Resp_Connection[],
    };
  } catch (error) {
    return commonErrorHandling(error);
  }
}

export async function updateNoteTitle(
  noteId: string,
  title: string,
): Promise<PromiseResponse<{ title: string }>> {
  try {
    const proc_title = title.trim() !== '' ? title : 'Untitled';
    await databases.updateDocument(
      import.meta.env.VITE_DATABASE_ID,
      import.meta.env.VITE_NOTES_COLLECTION_ID,
      noteId,
      {
        title: proc_title,
      },
    );

    return { error: false, data: { title: proc_title } };
  } catch (error: unknown) {
    return commonErrorHandling(error);
  }
}

export async function updateFolderTitle(
  folderId: string,
  title: string,
): Promise<PromiseResponse<{ title: string }>> {
  try {
    const proc_title = title.trim() !== '' ? title : 'Untitled';
    await databases.updateDocument(
      import.meta.env.VITE_DATABASE_ID,
      import.meta.env.VITE_FOLDER_COLLECTION_ID,
      folderId,
      {
        title: proc_title,
      },
    );

    return { error: false, data: { title: proc_title } };
  } catch (error: unknown) {
    return commonErrorHandling(error);
  }
}

export async function deleteNote(
  noteId: string,
): Promise<PromiseResponse<null>> {
  try {
    await databases.deleteDocument(
      import.meta.env.VITE_DATABASE_ID,
      import.meta.env.VITE_NOTES_COLLECTION_ID,
      noteId,
    );

    const allConnections = await databases.listDocuments(
      import.meta.env.VITE_DATABASE_ID,
      import.meta.env.VITE_CONNECTIONS_COLLECTION_ID,
      [Query.equal('source_id', [noteId])],
    );

    const deletePromises = allConnections.documents.map(connection =>
      databases.deleteDocument(
        import.meta.env.VITE_DATABASE_ID,
        import.meta.env.VITE_CONNECTIONS_COLLECTION_ID,
        connection.$id,
      ),
    );

    await Promise.all(deletePromises);

    return { error: false, data: null };
  } catch (error) {
    return commonErrorHandling(error);
  }
}

export async function deleteFolder(
  noteId: string,
): Promise<PromiseResponse<null>> {
  try {
    await databases.deleteDocument(
      import.meta.env.VITE_DATABASE_ID,
      import.meta.env.VITE_FOLDER_COLLECTION_ID,
      noteId,
    );

    return { error: false, data: null };
  } catch (error) {
    return commonErrorHandling(error);
  }
}

export async function uploadFile(file: File): Promise<string> {
  try {
    const response = await storage.createFile(
      import.meta.env.VITE_NOTES_IMG_BUCKET_ID,
      'unique()',
      file,
    );

    const imageUrl =
      import.meta.env.VITE_PROJECT_ENDPOINT +
      `/storage/buckets/${import.meta.env.VITE_NOTES_IMG_BUCKET_ID}/files/${
        response.$id
      }/view?project=${import.meta.env.VITE_PROJECT_ID}`;
    return imageUrl;
  } catch (error) {
    const err = commonErrorHandling(error);
    toast.error(err.message);
    return '/ERROR.jpg';
  }
}
