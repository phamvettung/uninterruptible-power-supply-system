import React, { useState, useRef, useEffect } from "react";

// Single-file React component that demonstrates draggable nodes with connectable "electrical wires"
// Uses SVG for wires and HTML for nodes. Tailwind classes used for quick styling.

export default function NodeWire() {
  // nodes: { id, x, y, title }
  const [nodes, setNodes] = useState([
    { id: "n1", x: 100, y: 100, title: "Source" },
    { id: "n2", x: 420, y: 220, title: "Load" },
  ]);

  // wires: { id, from: { nodeId, port: 'right'|'left'|'top'|'bottom' }, to: { ... } }
  const [wires, setWires] = useState([]);

  // tempWire while user is dragging to create a new connection
  const [tempWire, setTempWire] = useState(null);

  const svgRef = useRef(null);
  const containerRef = useRef(null);

  // drag state for nodes
  const draggingRef = useRef(null);

  useEffect(() => {
    const onMove = (e) => {
      if (!draggingRef.current) return;
      const { id, offsetX, offsetY } = draggingRef.current;
      const cx = e.clientX - offsetX;
      const cy = e.clientY - offsetY;
      setNodes((prev) => prev.map(n => n.id === id ? { ...n, x: cx, y: cy } : n));
    };
    const onUp = () => (draggingRef.current = null);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, []);

  const getPortPosition = (node, port) => {
    // node width/height assumed
    const w = 120, h = 60;
    switch (port) {
      case 'left': return { x: node.x - 8, y: node.y + h/2 };
      case 'right': return { x: node.x + w + 8, y: node.y + h/2 };
      case 'top': return { x: node.x + w/2, y: node.y - 8 };
      case 'bottom': return { x: node.x + w/2, y: node.y + h + 8 };
      default: return { x: node.x + w/2, y: node.y + h/2 };
    }
  };

  const startDragNode = (e, node) => {
    const rect = containerRef.current.getBoundingClientRect();
    draggingRef.current = { id: node.id, offsetX: e.clientX - node.x, offsetY: e.clientY - node.y };
  };

  const beginWire = (fromNodeId, fromPort, e) => {
    const svgRect = svgRef.current.getBoundingClientRect();
    const mouse = { x: e.clientX - svgRect.left, y: e.clientY - svgRect.top };
    setTempWire({ from: { nodeId: fromNodeId, port: fromPort }, to: { x: mouse.x, y: mouse.y } });
  };

  const moveTempWire = (e) => {
    if (!tempWire) return;
    const svgRect = svgRef.current.getBoundingClientRect();
    const mouse = { x: e.clientX - svgRect.left, y: e.clientY - svgRect.top };
    setTempWire(w => ({ ...w, to: { x: mouse.x, y: mouse.y } }));
  };

  const finishWire = (toNodeId, toPort) => {
    if (!tempWire) return;
    const newWire = {
      id: `w${Date.now()}`,
      from: tempWire.from,
      to: { nodeId: toNodeId, port: toPort }
    };
    setWires(prev => [...prev, newWire]);
    setTempWire(null);
  };

  const cancelTempWire = () => setTempWire(null);

  const removeWire = (id) => setWires(prev => prev.filter(w => w.id !== id));

  const portMouseDown = (e, nodeId, port) => {
    e.stopPropagation();
    beginWire(nodeId, port, e);
  };

  // Utility: generate a smooth cubic bezier path between two points
  const makePath = (p1, p2) => {
    const dx = Math.abs(p2.x - p1.x);
    const curvature = Math.min(200, dx * 0.6);
    const c1 = { x: p1.x + curvature, y: p1.y };
    const c2 = { x: p2.x - curvature, y: p2.y };
    return `M ${p1.x} ${p1.y} C ${c1.x} ${c1.y} ${c2.x} ${c2.y} ${p2.x} ${p2.y}`;
  };

  return (
    <div className="w-full h-[600px] border rounded-lg overflow-hidden relative" ref={containerRef}>
      {/* SVG layer for wires */}
      <svg
        ref={svgRef}
        className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-50 to-gray-100"
        onPointerMove={(e) => moveTempWire(e)}
        onPointerUp={() => cancelTempWire()}
      >
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
            </filter>
        </defs>
        {/* existing wires */}
        {wires.map(w => {
          const fromNode = nodes.find(n => n.id === w.from.nodeId);
          const toNode = nodes.find(n => n.id === w.to.nodeId);
          const p1 = getPortPosition(fromNode, w.from.port);
          const p2 = getPortPosition(toNode, w.to.port);
          return (
            <g key={w.id} className="cursor-pointer" onDoubleClick={() => removeWire(w.id)}>
              <path d={makePath(p1, p2)} strokeWidth={4} strokeOpacity={0.95} stroke="#1f2937" fill="none" filter="url(#glow)" />
              <path d={makePath(p1, p2)} strokeWidth={1.5} strokeOpacity={0.15} stroke="#fff" fill="none" />
            </g>
          );
        })}

        {/* temp wire while creating */}
        {tempWire && (() => {
          const fromNode = nodes.find(n => n.id === tempWire.from.nodeId);
          const p1 = getPortPosition(fromNode, tempWire.from.port);
          const p2 = tempWire.to;
          return <path d={makePath(p1, p2)} stroke="#ef4444" strokeWidth={3} fill="none" strokeDasharray="6 6" />;
        })()}
      </svg>

      {/* nodes layer */}
      <div className="absolute inset-0 pointer-events-none">
        {nodes.map(node => (
          <div
            key={node.id}
            className="absolute pointer-events-auto"
            style={{ left: node.x, top: node.y, width: 120 }}
            onPointerDown={(e) => startDragNode(e, node)}
          >
            <div className="bg-white shadow-lg rounded-lg p-3 w-full">
              <div className="flex items-center justify-between">
                <div className="font-medium text-sm">{node.title}</div>
                <div className="text-xs text-gray-400">{node.id}</div>
              </div>
              <div className="mt-2 text-xs text-gray-500">Drag to move. Double-click wire to delete.</div>
              {/* ports */}
              <div className="relative mt-2 h-6">
                {/* left port */}
                <div
                  onPointerDown={(e) => portMouseDown(e, node.id, 'left')}
                  onPointerUp={() => finishWire(node.id, 'left')}
                  className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border border-gray-300 bg-white flex items-center justify-center text-xs shadow-sm cursor-crosshair"
                >●</div>
                {/* right port */}
                <div
                  onPointerDown={(e) => portMouseDown(e, node.id, 'right')}
                  onPointerUp={() => finishWire(node.id, 'right')}
                  className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border border-gray-300 bg-white flex items-center justify-center text-xs shadow-sm cursor-crosshair"
                >●</div>
                {/* top port */}
                <div
                  onPointerDown={(e) => portMouseDown(e, node.id, 'top')}
                  onPointerUp={() => finishWire(node.id, 'top')}
                  className="absolute left-1/2 -top-3 -translate-x-1/2 w-6 h-6 rounded-full border border-gray-300 bg-white flex items-center justify-center text-xs shadow-sm cursor-crosshair"
                >●</div>
                {/* bottom port */}
                <div
                  onPointerDown={(e) => portMouseDown(e, node.id, 'bottom')}
                  onPointerUp={() => finishWire(node.id, 'bottom')}
                  className="absolute left-1/2 -bottom-3 -translate-x-1/2 w-6 h-6 rounded-full border border-gray-300 bg-white flex items-center justify-center text-xs shadow-sm cursor-crosshair"
                >●</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* small toolbar */}
      <div className="absolute top-3 left-3 bg-white/80 backdrop-blur rounded p-2 shadow-md text-xs">
        <button className="mr-2 px-2 py-1 rounded bg-blue-500 text-white" onClick={() => setNodes(prev => [...prev, { id: `n${Date.now()}`, x: 180, y: 80, title: 'Node' }])}>Add Node</button>
        <button className="px-2 py-1 rounded border" onClick={() => { setWires([]); setTempWire(null); }}>Clear Wires</button>
      </div>
    </div>
  );
}
