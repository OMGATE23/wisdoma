import { NotesAndFolder, Resp_Folder, Resp_Note, TidyTreeData } from '../types';

export function getCurrentDateISOString(): string {
  return new Date().toISOString();
}

interface PromiseError {
  error: true;
  message: string;
}

export function commonErrorHandling(error: unknown): PromiseError {
  if (error instanceof Error) {
    return { error: true, message: error.message };
  }

  return { error: true, message: 'Unknown error occured' };
}

export function generateRandomString(length: number = 10): string {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export function debounce<T extends unknown[]>(
  fn: (...args: T) => void,
  delay: number,
) {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (...args: T): void => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

export function getTidyTreeDataFromCollection(
  collection: NotesAndFolder,
): TidyTreeData {
  const notes = collection.files;
  const folders = collection.folders;

  const rootFolder = folders.find(folder => folder.is_root)!;

  const tidyTree: TidyTreeData = {
    data: rootFolder,
    children: getTidyTreeChildren(rootFolder.$id, folders, notes),
  };

  return tidyTree;
}

export function getTidyTreeChildren(
  parentFolderId: string,
  folders: Resp_Folder[],
  notes: Resp_Note[],
): TidyTreeData[] | undefined {
  const childFolders = folders.filter(fol => fol.parent_id === parentFolderId);
  const childNotes = notes.filter(note => note.parent_id === parentFolderId);

  if (childFolders.length === 0 && childNotes.length === 0) {
    return [];
  }

  return [
    ...childFolders.map(fol => ({
      data: fol,
      children: getTidyTreeChildren(fol.$id, folders, notes),
    })),
    ...childNotes.map(note => ({ data: note })),
  ];
}

export function formatCreatedAt(createdAt: string): string {
  const date = new Date(createdAt);

  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();

  const suffix =
    day % 10 === 1 && day !== 11
      ? 'st'
      : day % 10 === 2 && day !== 12
        ? 'nd'
        : day % 10 === 3 && day !== 13
          ? 'rd'
          : 'th';

  return `${day}${suffix} ${month}, ${year}`;
}

export function hasValidParentId(
  itemId: string | null,
  folders: { $id: string; parent_id: string | null }[],
): boolean {
  if (itemId === null) return true;

  const item = folders.find(folder => folder.$id === itemId);
  if (!item) return false;

  return hasValidParentId(item.parent_id, folders);
}
