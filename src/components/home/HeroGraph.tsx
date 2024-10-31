import { useRef, useEffect } from "react";
import * as d3 from "d3";

interface Node {
  id: string;
  group: number;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

interface Link {
  source: string | Node;
  target: string | Node;
}

export default function Graphe() {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const nodes: Node[] = [
      { id: "Hub 1", group: 1 },
      { id: "Hub 2", group: 2 },
      { id: "Hub 3", group: 3 },
      ...Array.from({ length: 12 }, (_, i) => ({
        id: `Node ${i + 1}`,
        group: 1,
      })),
      ...Array.from({ length: 12 }, (_, i) => ({
        id: `Node ${i + 13}`,
        group: 2,
      })),
      ...Array.from({ length: 12 }, (_, i) => ({
        id: `Node ${i + 25}`,
        group: 3,
      })),
    ];

    const links: Link[] = [
      ...nodes
        .slice(1, 13)
        .map((node) => ({ source: "Hub 1", target: node.id })),
      ...nodes
        .slice(13, 25)
        .map((node) => ({ source: "Hub 2", target: node.id })),
      ...nodes
        .slice(25, 37)
        .map((node) => ({ source: "Hub 3", target: node.id })),
    ];

    const width = 720;
    const height = 720;

    const linksCopy = links.map((d) => ({ ...d }));
    const nodesCopy = nodes.map((d) => ({ ...d }));

    function ticked() {
      link
        .attr("x1", (d) => (d.source as Node).x!)
        .attr("y1", (d) => (d.source as Node).y!)
        .attr("x2", (d) => (d.target as Node).x!)
        .attr("y2", (d) => (d.target as Node).y!);

      node.attr("cx", (d) => d.x!).attr("cy", (d) => d.y!);
    }

    function drag(simulation: d3.Simulation<Node, Link>) {
      function dragstarted(
        event: d3.D3DragEvent<SVGCircleElement, Node, Node>
      ) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }

      function dragged(event: d3.D3DragEvent<SVGCircleElement, Node, Node>) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }

      function dragended(event: d3.D3DragEvent<SVGCircleElement, Node, Node>) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }

      return d3
        .drag<SVGCircleElement, Node>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    }

    const simulation = d3
      .forceSimulation<Node>(nodesCopy)
      .force(
        "link",
        d3
          .forceLink<Node, Link>(linksCopy)
          .id((d: Node) => d.id)
          .distance(150)
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
      .selectAll<SVGCircleElement, Node>("circle")
      .data(nodesCopy)
      .join("circle")
      .attr("r", 8)
      .attr("fill", "rgba(0,0,0,0.7)")
      .call(drag(simulation));

    node.append("title").text((d) => d.id);

    return () => {
      simulation.stop();
    };
  }, []);

  return (
    <svg
      className="outline outline-1 rounded outline-neutral-200"
      ref={svgRef}
    ></svg>
  );
}
