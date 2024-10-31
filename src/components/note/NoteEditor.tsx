import { NoteFolderPropType, NotesAndFolder, Resp_Note } from '../../types';
import { debounce } from '../../utils/helpers';
import { createConnection, saveNoteContent, uploadFile } from '../../utils/db';
import '@blocknote/core/fonts/inter.css';
import { BlockNoteView } from '@blocknote/mantine';
import '@blocknote/mantine/style.css';
import {
  createReactInlineContentSpec,
  DefaultReactSuggestionItem,
  SuggestionMenuController,
  useCreateBlockNote,
} from '@blocknote/react';
import {
  BlockNoteSchema,
  defaultInlineContentSpecs,
  filterSuggestionItems,
} from '@blocknote/core';
import { Link } from 'react-router-dom';
import FolderIcon from '../../icons/FolderIcon';
import DocumentIcon from '../../icons/DocumentIcon';
import { useEffect, useState } from 'react';
import { useAuthContext } from '../../utils/hooks';

interface Props {
  note: Resp_Note;
  editable: boolean;
  collection: NotesAndFolder;
}

export default function NoteEditor(props: Props) {
  const [initialContent, setInitialContent] = useState(props.note.note_content);
  const { user } = useAuthContext();
  useEffect(() => {
    setInitialContent(props.note.note_content);
  }, [props.note.note_content]);
  const NoteFolderTag = createReactInlineContentSpec(
    {
      type: 'fileFolderTag',
      propSchema: {
        title: {
          default: 'Unknown',
        },
        id: {
          default: '',
        },
        type: {
          default: 'file',
        },
      },
      content: 'none',
    } as const,
    {
      render: props => {
        const link = `/${
          props.inlineContent.props.type === 'folder' ? 'folder' : 'note'
        }/${props.inlineContent.props.id}`;
        return (
          <span
            key={props.inlineContent.props.id}
            className="font-[500] text-emerald-700 hover:bg-emerald-100 rounded"
          >
            <Link to={link}>{`[[${props.inlineContent.props.title}]]`}</Link>
          </span>
        );
      },
    },
  );

  const schema = BlockNoteSchema.create({
    inlineContentSpecs: {
      ...defaultInlineContentSpecs,
      fileFolderTag: NoteFolderTag,
    },
  });

  const getNoteFolderMenuItems = (
    editor: typeof schema.BlockNoteEditor,
    collection: NotesAndFolder,
  ): DefaultReactSuggestionItem[] => {
    const items = [
      ...collection.files,
      ...collection.folders.filter(fol => !fol.is_root),
    ];
    return items.map((item, index) => ({
      title: index + 1 + '. ' + item.title,
      subtext: 'folder: ' + item.parent_title,
      icon: item.type === 'folder' ? <FolderIcon /> : <DocumentIcon />,
      onItemClick: () => {
        editor.insertInlineContent([
          {
            type: 'fileFolderTag',
            props: {
              title: item.title,
              id: item.$id,
              type: item.type,
            },
          },
          ' ',
        ]);
      },
    }));
  };

  const editor = useCreateBlockNote({
    schema,
    initialContent:
      initialContent && Array.isArray(JSON.parse(initialContent))
        ? JSON.parse(props.note.note_content)
        : undefined,
    uploadFile,
  });
  const debouncedSave = debounce(() => {
    const arrayOfPropStrings: NoteFolderPropType[] = [];

    editor.forEachBlock(block => {
      const { content } = block;

      if (!content) return true;

      if (Array.isArray(content)) {
        content.forEach(cont => {
          if (cont && cont.type === 'fileFolderTag') {
            const existingProp = arrayOfPropStrings.find(
              prop =>
                prop.id === cont.props.id && prop.type === cont.props.type,
            );
            if (existingProp === undefined) {
              arrayOfPropStrings.push(cont.props);
            }
          }
        });
      } else if (
        typeof content === 'object' &&
        content.type === 'tableContent'
      ) {
        content.rows.forEach(row => {
          row.cells.forEach(cell => {
            cell.forEach(cont => {
              if (cont && cont.type === 'fileFolderTag') {
                const existingProp = arrayOfPropStrings.find(
                  prop =>
                    prop.id === cont.props.id && prop.type === cont.props.type,
                );
                if (existingProp === undefined) {
                  arrayOfPropStrings.push(cont.props);
                }
              }
            });
          });
        });
      }

      return true;
    });

    createConnection(
      user?.id || '',
      props.note.$id,
      arrayOfPropStrings.map(prop => JSON.stringify(prop)),
    );

    saveNoteContent(props.note.$id, JSON.stringify(editor.document));
  }, 500);
  return (
    <div className="w-full mt-4 md:mt-0">
      <div className="">
        <BlockNoteView
          editable={props.editable}
          onChange={() => {
            debouncedSave();
          }}
          className="w-full"
          editor={editor}
        >
          <SuggestionMenuController
            triggerCharacter={'['}
            getItems={async (query: string) => {
              return filterSuggestionItems(
                getNoteFolderMenuItems(editor, props.collection),
                query,
              );
            }}
          />
        </BlockNoteView>
      </div>
    </div>
  );
}
