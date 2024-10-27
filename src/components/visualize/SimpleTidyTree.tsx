import { useEffect, useRef, useState } from "react";
import {
  NotesAndFolder,
  PromiseResponse,
  Resp_Folder,
  Resp_Note,
  TidyTreeData,
} from "../../types";
import {
  commonErrorHandling,
  getCurrentDateISOString,
  getTidyTreeDataFromCollection,
} from "../../utils/helpers";
import * as d3 from "d3";
import { useNavigate } from "react-router-dom";
import { createFolder, createNote } from "../../utils/db";
import { useAuthContext } from "../../utils/hooks";
import FolderIcon from "../../icons/FolderIcon";
import DocumentIcon from "../../icons/DocumentIcon";
interface Props {
  collection: NotesAndFolder;
}

export default function SimpleTidyTree(props: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const navigate = useNavigate();
  const [hoverInfo, setHoverInfo] = useState<{ x: number; y: number } | null>(
    null
  );
  const [currentNode, setCurrentNode] = useState<
    Resp_Folder | Resp_Note | null
  >(null);
  const [focusedNodes, setFocusedNodes] = useState<string[] | null>(null);
  const [createType, setCreateType] = useState<"file" | "folder" | null>(null);
  const [inputText, setInputText] = useState("");
  const { user } = useAuthContext();
  async function createNoteForCurrentFolder(
    title: string
  ): Promise<PromiseResponse<null>> {
    try {
      if (!currentNode || currentNode.type !== "folder") {
        return {
          error: true,
          message: "Cannot create note here" + "->" + currentNode?.type,
        };
      }

      const resp = await createNote({
        title: title,
        note_content: "",
        parent_id: currentNode.$id,
        created_at: getCurrentDateISOString(),
        updated_at: getCurrentDateISOString(),
        user_id: user!.id,
        is_public: false,
        is_starred: false,
        parent_title: currentNode.title,
      });

      if (resp.error) {
        return resp;
      }

      const fileId = resp.data.$id;

      navigate(`/note/${fileId}`);

      return { error: false, data: null };
    } catch (error) {
      return commonErrorHandling(error);
    }
  }

  async function createFolderCurrentFolder(
    title: string
  ): Promise<PromiseResponse<null>> {
    try {
      if (!currentNode || currentNode.type !== "folder") {
        return {
          error: true,
          message: "Cannot create note here" + "->" + currentNode?.type,
        };
      }

      const resp = await createFolder(
        user!.id,
        currentNode.$id,
        title,
        currentNode.title
      );

      if (resp.error) {
        return resp;
      }
      const folderId = resp.data.$id;

      navigate(`/folder/${folderId}`);
      return { error: false, data: null };
    } catch (error) {
      return commonErrorHandling(error);
    }
  }

  const handleClickNode = (node: {
    type: string;
    $id: string;
    is_root?: boolean;
  }) => {
    if (node.type === "file") {
      navigate(`/note/${node.$id}`);
    } else if (node.type === "folder") {
      if (node.is_root) {
        navigate("/folder");
      } else {
        navigate(`/folder/${node.$id}`);
      }
    }
  };

  function filterFocusedNodes(node: Resp_Folder | Resp_Note) {
    const nodesInHierarchy = [node.$id];
    let curr = node;

    while (curr.parent_id !== null) {
      nodesInHierarchy.push(curr.parent_id);
      curr = props.collection.folders.find(
        (fol) => fol.$id === curr.parent_id
      )!;
    }

    setFocusedNodes(nodesInHierarchy);
  }

  useEffect(() => {
    if (!svgRef.current) return;

    d3.select(svgRef.current).selectAll("*").remove();

    const data = getTidyTreeDataFromCollection(props.collection);

    const width = window.innerWidth * 0.9;

    const root = d3.hierarchy(data);
    const dx = 20;
    const dy = width / (root.height + 1);

    const tree = d3.tree<TidyTreeData>().nodeSize([dx, dy]);

    root.sort((a, b) => d3.ascending(a.data.data.title, b.data.data.title));
    tree(root);

    let x0 = Infinity;
    let x1 = -x0;
    root.each((d) => {
      if (d.x! > x1) x1 = d.x!;
      if (d.x! < x0) x0 = d.x!;
    });

    const height = x1 - x0 + dx * 2;

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-dy / 3, x0 - dx, width, height]);

    svg
      .append("g")
      .attr("fill", "none")
      .attr("stroke", "#555")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.5)
      .selectAll("path")
      .data(root.links())
      .join("path")
      .attr(
        "d",
        d3
          .linkHorizontal<any, any>()
          .x((d) => d.y)
          .y((d) => d.x)
      )
      .attr("stroke", (d) => {
        if (focusedNodes === null) return "rgba(0,0,0,0.9)";

        if (focusedNodes.includes(d.target.data.data.$id)) {
          return "black";
        } else {
          return "rgba(0,0,0,0.1)";
        }
      })
      .attr("style", "transition: all 100ms");

    const node = svg
      .append("g")
      .attr("stroke-linejoin", "round")
      .attr("stroke-width", 3)
      .selectAll("g")
      .data(root.descendants())
      .join("g")
      .attr("transform", (d) => `translate(${d.y},${d.x})`);

    node
      .append("circle")
      .attr("fill", (d) => (d.children ? "#555" : "#999"))
      .attr("r", 2.5);

    node
      .append("text")
      .attr("dy", "0.31em")
      .attr("x", (d) => (d.children ? -6 : 6))
      .attr("text-anchor", (d) => (d.children ? "end" : "start"))
      .text((d) =>
        d.data.data.parent_id !== null ? d.data.data.title : "Your Workspace"
      )
      .attr("stroke", "white")
      .attr("paint-order", "stroke")
      .attr("font-size", "0.8rem")
      .attr("fill", (d) => {
        if (focusedNodes === null) return "black";
        return focusedNodes.includes(d.data.data.$id)
          ? "black"
          : "rgba(0,0,0,0.2)";
      })
      .on("mouseover", (e: MouseEvent, d) => {
        if (hoverInfo) return;
        setHoverInfo({
          x: e.clientX,
          y: e.clientY,
        });
        setCurrentNode(d.data.data);
        filterFocusedNodes(d.data.data);
      })
      .on("mouseleave", () => {
        setHoverInfo(null);
        setFocusedNodes(null);
        setCurrentNode(null);
      })
      .on("click", (_, d) => handleClickNode(d.data.data));
  }, [props.collection, focusedNodes]);

  return (
    <div className="flex items-center justify-center p-4">
      <svg
        className="outline outline-1 outline-neutral-200 rounded h-[400px]"
        ref={svgRef}
      />
      {hoverInfo && currentNode && (
        <div
          onMouseLeave={() => {
            console.log("mouse it out");
            setHoverInfo(null);
            setCurrentNode(null);
            setFocusedNodes(null);
            setCreateType(null);
          }}
          className="w-[300px] h-[150px] flex justify-center items-center absolute"
          style={{
            top: hoverInfo.y - 10 + "px",
            left: hoverInfo.x - 120 + "px",
          }}
        >
          <div className="outline outline-1 outline-neutral-300 shadow rounded-md p-4 bg-white">
            <div className="py-2 px-4 w-full rounded flex items-center gap-2 outline outline-1 outline-neutral-300">
              <div className="outline outline-1 outline-neutral-200 rounded shadow p-1 flex item">
                {currentNode.type === "folder" ? (
                  <FolderIcon size={20} />
                ) : (
                  <DocumentIcon size={20} />
                )}
              </div>
              {currentNode.parent_id ? currentNode.title : "Your Workspace"}
            </div>

            {currentNode.type === "folder" && (
              <div>
                {createType === null && (
                  <div className="flex justify-center items-center gap-2 py-2">
                    <button
                      className="font-[300] text-sm py-1 px-2 rounded text-white bg-blue-600"
                      onClick={() => setCreateType("folder")}
                    >
                      Create Folder
                    </button>
                    <button
                      className="font-[300] text-sm py-1 px-2 rounded text-white bg-green-500"
                      onClick={() => setCreateType("file")}
                    >
                      Create File
                    </button>
                  </div>
                )}

                {createType && (
                  <div className="w-full flex flex-col justify-center py-2 gap-2">
                    <input
                      value={inputText}
                      onChange={(e) => {
                        setInputText(e.target.value);
                      }}
                      className="py-1 px-2 rounded outline outline-1 outline-neutral-200"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          if (createType === "file") {
                            createNoteForCurrentFolder(inputText);
                          } else {
                            createFolderCurrentFolder(inputText);
                          }
                        }}
                        className="bg-blue-700 text-white py-1 px-2 rounded"
                      >
                        Create {createType}
                      </button>
                      <button
                        className=" py-1 px-2 rounded"
                        onClick={() => {
                          setInputText("");
                          setCreateType(null);
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
