import React, { useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
import { io } from 'socket.io-client';
import axios from 'axios';
cytoscape.use(dagre);

export default function GraphView({ orgId, token }) {
  const containerRef = useRef(null);
  const cyRef = useRef(null);

  useEffect(() => {
    cyRef.current = cytoscape({
      container: containerRef.current,
      elements: [],
      style: [
        { selector: 'node', style: { label: 'data(label)', 'text-valign': 'center' } },
        { selector: 'edge', style: { 'curve-style': 'bezier', 'target-arrow-shape': 'triangle' } }
      ],
      layout: { name: 'dagre' }
    });

    // load initial assets
    axios.get(`/api/assets?orgId=${orgId}`, { headers: { Authorization: `Bearer ${token}` }})
      .then(resp => {
        const assets = resp.data.assets;
        const elements = [];
        const idMap = {};
        assets.forEach(a => {
          idMap[a._id] = true;
          elements.push({ data: { id: a._id, label: `${a.type}: ${a.identifier}` }});
        });
        assets.forEach(a => {
          if (a.relationships && a.relationships.length) {
            a.relationships.forEach(r => {
              if (r.targetAssetId) elements.push({ data: { id: `${a._id}_${r.targetAssetId}`, source: a._id, target: r.targetAssetId }});
            });
          }
        });
        cyRef.current.add(elements);
        cyRef.current.layout({ name: 'dagre' }).run();
      });

    // realtime socket
    const socket = io(process.env.REACT_APP_API_URL + '/realtime', { auth: { token }});
    socket.emit('subscribeOrg', orgId);
    socket.on('asset:update', (payload) => {
      if (payload.action === 'upsert') {
        const a = payload.asset;
        if (cyRef.current.getElementById(a._id).length === 0) {
          cyRef.current.add({ data: { id: a._id, label: `${a.type}: ${a.identifier}` }});
        } else {
          // update label/data
          cyRef.current.getElementById(a._id).data('label', `${a.type}: ${a.identifier}`);
        }
        // relationships handling omitted for brevity
        cyRef.current.layout({ name: 'dagre' }).run();
      }
    });

    return () => socket.disconnect();
  }, [orgId, token]);

  return <div ref={containerRef} style={{ width: '100%', height: '100vh' }} />;
}
