import { Folder } from '../types';
import { getCurrentDateISOString } from './helpers';

export const defaultRootFolder: Omit<Folder, 'user_id'> = {
  title: 'root_folder',
  created_at: getCurrentDateISOString(),
  parent_id: null,
  is_root: true,
  is_public: false,
  children: [],
  parent_title: null,
};
