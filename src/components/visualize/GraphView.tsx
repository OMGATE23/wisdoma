import { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import FolderIcon from '../../icons/FolderIcon';
import DocumentIcon from '../../icons/DocumentIcon';
import { NotesAndFolder, Resp_Connection } from '../../types';
import { useNavigate } from 'react-router-dom';
import { hasValidParentId } from '../../utils/helpers';

interface Node {
  id: string;
  group: number;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
  type: 'folder' | 'file';
  title: string;
  is_root?: boolean;
}

interface Link {
  source: string | Node;
  target: string | Node;
}

interface Props {
  collection: NotesAndFolder;
  connections: Resp_Connection[];
}

export default function Graphe(props: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [currentNode, setCurrentNode] = useState<Node | null>(null);
  const [hoverInfo, setHoverInfo] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [dragging, setDragging] = useState(false);
  const navigate = useNavigate();

  const handleClickNode = (node: {
    type: string;
    id: string;
    is_root?: boolean;
  }) => {
    if (node.type === 'file') {
      navigate(`/note/${node.id}`);
    } else if (node.type === 'folder') {
      if (node.is_root) {
        navigate('/folder');
      } else {
        navigate(`/folder/${node.id}`);
      }
    }
  };

  useEffect(() => {
    if (!svgRef.current) return;

    const folders = props.collection.folders;
    const files = props.collection.files;

    const nodes: Node[] = [
      ...folders
        .filter(
          folder =>
            hasValidParentId(folder.parent_id, folders) ||
            folder.parent_id === null,
        )
        .map(folder => ({
          id: folder.$id,
          title: folder.title,
          group: 1,
          type: folder.type,
          is_root: folder.is_root,
        })),
      ...files
        .filter(
          file =>
            hasValidParentId(file.parent_id, folders) ||
            file.parent_id === null,
        )
        .map(file => ({
          id: file.$id,
          title: file.title,
          group: 2,
          type: file.type,
        })),
    ];

    const links: Link[] = [
      ...files
        .filter(file => nodes.find(node => node.id === file.$id) !== undefined)
        .map(file => ({
          source: file.parent_id,
          target: file.$id,
        })),
      ...folders
        .filter(
          folder => nodes.find(node => node.id === folder.$id) !== undefined,
        )
        .filter(fol => fol.parent_id)
        .map(folder => ({
          source: folder.parent_id!,
          target: folder.$id,
        })),
      ...props.connections.flatMap(connection =>
        connection.destination_ids
          .filter(
            destination_id =>
              props.collection.files.find(
                note => note.$id === JSON.parse(destination_id).id,
              ) !== undefined &&
              props.collection.folders.find(
                fol => fol.$id === JSON.parse(destination_id).id,
              ),
          )
          .map(destination_id => ({
            source: connection.source_id,
            target: JSON.parse(destination_id).id,
          })),
      ),
    ];

    const width = window.innerWidth * 0.8;
    const height = 600;

    const linksCopy = links.map(d => ({ ...d }));
    const nodesCopy = nodes.map(d => ({ ...d }));

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
        'link',
        d3.forceLink<Node, Link>(linksCopy).id((d: Node) => d.id),
      )
      .force('charge', d3.forceManyBody())
      .force('x', d3.forceX())
      .force('y', d3.forceY())
      .on('tick', ticked);

    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [-width / 2, -height / 2, width, height].toString())
      .style('max-width', '100%')
      .style('height', 'auto');

    svg.selectAll('*').remove();

    const link = svg
      .append('g')
      .attr('stroke', 'rgba(0,0,0,0.8)')
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(linksCopy)
      .join('line')
      .attr('stroke-width', '1');

    const node = svg
      .append('g')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .selectAll<SVGCircleElement, Node>('circle')
      .data(nodesCopy)
      .join('circle')
      .attr('r', d => (d.type === 'folder' ? 10 : 6))
      .attr('fill', d =>
        d.type === 'folder' ? (d.is_root ? 'black' : '#475569') : '#94a3b8',
      )
      .call(drag(simulation))
      .on('mouseover', handleMouseOver)
      .on('mouseout', handleMouseOut)
      .on('click', (_, d) => handleClickNode(d));

    const titles = svg
      .append('g')
      .selectAll('text')
      .data(nodesCopy.filter(d => d.type === 'folder' && d.is_root !== true))
      .join('text')
      .attr('font-size', 12)
      .attr('dx', 15)
      .attr('dy', '.35em')
      .text(d => d.title);

    node.append('title').text(d => d.id);

    function ticked() {
      link
        .attr('x1', d => (d.source as Node).x!)
        .attr('y1', d => (d.source as Node).y!)
        .attr('x2', d => (d.target as Node).x!)
        .attr('y2', d => (d.target as Node).y!);

      node.attr('cx', d => d.x!).attr('cy', d => d.y!);
      titles.attr('x', d => d.x! + 5).attr('y', d => d.y!);
    }

    function drag(simulation: d3.Simulation<Node, Link>) {
      function dragstarted(
        event: d3.D3DragEvent<SVGCircleElement, Node, Node>,
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
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended);
    }

    return () => {
      simulation.stop();
    };
  }, [props.collection, props.connections]);

  return (
    <div className="mt-4 flex justify-center items-center">
      <svg
        className="outline outline-1 outline-neutral-200 rounded-md"
        ref={svgRef}
      ></svg>

      {currentNode && hoverInfo && !dragging && (
        <div
          style={{
            top: hoverInfo.y + 10 + 'px',
            left: hoverInfo.x + 10 + 'px',
          }}
          className={`outline outline-1 outline-neutral-200 rounded-md absolute bg-white shadow pop-in flex items-center gap-2 p-2 pr-6`}
        >
          {currentNode.type === 'folder' ? (
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
                ? 'text-blue-900 font-[500]'
                : 'text-neutral-800'
            }`}
          >
            {currentNode.is_root ? 'Your Parent Folder' : currentNode.title}{' '}
          </p>
        </div>
      )}
    </div>
  );
}
