import { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import FolderIcon from "../../icons/FolderIcon";
import DocumentIcon from "../../icons/DocumentIcon";

interface Node {
  id: string;
  group: number;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
  type: "folder" | "file";
  title: string;
  is_root?: boolean;
}

interface Link {
  source: string | Node;
  target: string | Node;
}

interface ForceGraphProps {
  nodes: Node[];
  links: Link[];
  onClickNode: (node: Node) => void; // Add onClickNode prop here
}

export default function Graphe({ nodes, links, onClickNode }: ForceGraphProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [currentNode, setCurrentNode] = useState<Node | null>(null);
  const [hoverInfo, setHoverInfo] = useState<{ x: number; y: number } | null>(
    null
  );
  const [dragging, setDragging] = useState(false);
  useEffect(() => {
    if (!svgRef.current) return;

    const width = 928;
    const height = 600;

    const linksCopy = links.map((d) => ({ ...d }));
    const nodesCopy = nodes.map((d) => ({ ...d }));

    function handleMouseOver(event: MouseEvent, d: Node) {
      if (hoverInfo) return;

      setHoverInfo({
        x: event.clientX,
        y: event.clientY,
      });

      setCurrentNode(d);
    }

    function handleMouseOut() {
      setHoverInfo(null);
      setCurrentNode(null);
    }

    const simulation = d3
      .forceSimulation<Node>(nodesCopy)
      .force(
        "link",
        d3.forceLink<Node, Link>(linksCopy).id((d: Node) => d.id)
      )
      .force("charge", d3.forceManyBody())
      .force("x", d3.forceX())
      .force("y", d3.forceY())
      .on("tick", ticked);

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-width / 2, -height / 2, width, height].toString())
      .style("max-width", "100%")
      .style("height", "auto");

    svg.selectAll("*").remove();

    const link = svg
      .append("g")
      .attr("stroke", "rgba(0,0,0,0.8)")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(linksCopy)
      .join("line")
      .attr("stroke-width", "1");

    const node = svg
      .append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll<SVGCircleElement, Node>("circle") // Specify correct types here
      .data(nodesCopy)
      .join("circle")
      .attr("r", (d) => (d.type === "folder" ? 10 : 6))
      .attr("fill", (d) =>
        d.type === "folder" ? (d.is_root ? "black" : "#475569") : "#94a3b8"
      )
      .call(drag(simulation))
      .on("mouseover", handleMouseOver)
      .on("mouseout", handleMouseOut)
      .on("click", (_, d) => onClickNode(d));

    const titles = svg
      .append("g")
      .selectAll("text")
      .data(nodesCopy.filter((d) => d.type === "folder" && d.is_root !== true))
      .join("text")
      .attr("font-size", 12)
      .attr("dx", 15)
      .attr("dy", ".35em")
      .text((d) => d.title);

    node.append("title").text((d) => d.id);

    function ticked() {
      link
        .attr("x1", (d) => (d.source as Node).x!)
        .attr("y1", (d) => (d.source as Node).y!)
        .attr("x2", (d) => (d.target as Node).x!)
        .attr("y2", (d) => (d.target as Node).y!);

      node.attr("cx", (d) => d.x!).attr("cy", (d) => d.y!);
      titles.attr("x", (d) => d.x! + 5).attr("y", (d) => d.y!);
    }

    function drag(simulation: d3.Simulation<Node, Link>) {
      function dragstarted(
        event: d3.D3DragEvent<SVGCircleElement, Node, Node>
      ) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;

        setDragging(true);
      }

      function dragged(event: d3.D3DragEvent<SVGCircleElement, Node, Node>) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }

      function dragended(event: d3.D3DragEvent<SVGCircleElement, Node, Node>) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;

        setDragging(false);
      }

      return d3
        .drag<SVGCircleElement, Node>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    }

    return () => {
      simulation.stop();
    };
  }, [nodes, links]);

  return (
    <div className="h-[100vh] flex justify-center items-center">
      <svg
        className="outline outline-1 outline-neutral-200 rounded-md"
        ref={svgRef}
      ></svg>

      {currentNode && hoverInfo && !dragging && (
        <div
          style={{
            top: hoverInfo.y + 10 + "px",
            left: hoverInfo.x + 10 + "px",
          }}
          className={`outline outline-1 outline-neutral-200 rounded-md absolute bg-white shadow pop-in flex items-center gap-2 p-2 pr-6`}
        >
          {currentNode.type === "folder" ? (
            <div className="p-1 rounded outline outline-1 outline-neutral-200">
              <FolderIcon size={18} strokeWidth={1} />
            </div>
          ) : (
            <div className="p-1 rounded outline outline-1 outline-neutral-200">
              <DocumentIcon size={18} strokeWidth={1} />
            </div>
          )}
          <p
            className={`${
              currentNode.is_root
                ? "text-blue-900 font-[500]"
                : "text-neutral-800"
            }`}
          >
            {currentNode.is_root ? "Your Parent Folder" : currentNode.title}{" "}
          </p>
        </div>
      )}
    </div>
  );
}
