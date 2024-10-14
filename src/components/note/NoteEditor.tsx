import { NotesAndFolder, Resp_Note } from "../../types"
import { debounce } from "../../utils/helpers";
import { saveNoteContent } from "../../utils/db";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { createReactInlineContentSpec, DefaultReactSuggestionItem, SuggestionMenuController, useCreateBlockNote } from "@blocknote/react"; 
import { BlockNoteSchema, defaultInlineContentSpecs, filterSuggestionItems } from "@blocknote/core";
import { Link } from "react-router-dom";
import FolderIcon from "../../icons/FolderIcon";
import DocumentIcon from "../../icons/DocumentIcon";
import { useEffect, useState } from "react";

interface Props {
  note: Resp_Note,
  editable: boolean,
  collection: NotesAndFolder
}


export default function NoteEditor(props: Props) {
  const [initialContent, setInitialContent] = useState(props.note.note_content);
  useEffect(() => {
    setInitialContent(props.note.note_content);
  } , [props.note.note_content])
  const NoteFolderTag = createReactInlineContentSpec(
    {
      type: "fileFolderTag",
      propSchema: {
        title: {
          default: "Unknown",
        },
        id: {
          default: "",
        },
        type: {
          default: "file"
        }
      },
      content: "none",
    } as const,
    {
      render: (props) => {
        const link = `/${props.inlineContent.props.type === 'folder' ? 'folder' : 'note'}/${props.inlineContent.props.id}`
        return (
        <span key={props.inlineContent.props.id} className="font-[500] text-emerald-700 hover:bg-emerald-100 rounded">
          <Link to={link}>
            {`[[${props.inlineContent.props.title}]]`}
          </Link>
        </span>
      )},
    }
  );
  
  const schema = BlockNoteSchema.create({
    inlineContentSpecs: {
      ...defaultInlineContentSpecs,
      fileFolderTag: NoteFolderTag,
    },
  });
  
  const getNoteFolderMenuItems = (
    editor: typeof schema.BlockNoteEditor,
    collection: NotesAndFolder
  ): DefaultReactSuggestionItem[] => {
    const items = [...collection.files, ...collection.folders.filter(fol => !fol.is_root)];
    return items.map((item, index) => ({
      title: index+1 + ". " + item.title,
      subtext: "folder: " + item.parent_title,
      icon: item.type === 'folder' ? <FolderIcon/> : <DocumentIcon/>,
      onItemClick: () => {
        editor.insertInlineContent([
          {
            type: "fileFolderTag",
            props: {
              title: item.title,
              id: item.$id,
              type: item.type
            },
          },
          " ", // add a space after the tag
        ]);
      },
    }));
  };

  const editor = useCreateBlockNote({
    schema,
    initialContent: initialContent && Array.isArray(JSON.parse(initialContent)) ? JSON.parse(props.note.note_content) : undefined
  });
  const debouncedSave = debounce(() => {
    console.log(editor.document)

    const arrayOfPropStrings: string[] = []

    editor.forEachBlock(block => {
      const { content } = block;
    
      if (!content) return true;
    
      console.log(content)
      if (Array.isArray(content)) {
        content.forEach(cont => {
          if (cont && cont.type === 'fileFolderTag') {
            console.log(">>. a file folder tag", { type: cont.type, props: cont.props });

            arrayOfPropStrings.push(JSON.stringify(cont.props));
          }
        });
      } else if (typeof content === 'object' && content.type === 'tableContent') {
        content.rows.forEach(row => {
          row.cells.forEach(cell => {
            cell.forEach(cont => {
              if (cont && cont.type === 'fileFolderTag') {
                console.log(">>> in table",{ type: cont.type, props: cont.props });
                arrayOfPropStrings.push(JSON.stringify(cont.props));
              }
            });
          });
        });
      }

      return true;
    });
     
    console.log(arrayOfPropStrings)
    saveNoteContent(props.note.$id, JSON.stringify(editor.document));
  }, 500);
  return (
    <div>
      <div className="flex flex-col justify-center items-center gap-8 w-[80vw]">
        <BlockNoteView 
          editable={props.editable} 
          onChange={() => {debouncedSave()}} 
          className="w-[80%]" 
          editor={editor} 
        >
          <SuggestionMenuController
            triggerCharacter={"["}
            getItems={async (query: string) => {
              console.log(query)
              return filterSuggestionItems(getNoteFolderMenuItems(editor, props.collection), query)
            }
            }
          />
        </BlockNoteView>
      </div>
    </div>
  )
}
