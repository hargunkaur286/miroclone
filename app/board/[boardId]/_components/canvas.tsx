"use client"

import React, { useState, useCallback } from "react";
import { Camera, CanvasState, CanvasMode } from "@/types/canvas";

import { Info } from "./info";
import { Participants } from "./participants";
import { Toolbar } from "./toolbar";
import { useHistory, useCanUndo, useCanRedo, useMutation } from "@/liveblocks.config";
import { 
    // colorToCss,
    // connectionIdToColor, 
    // findIntersectingLayersWithRectangle, 
    // penPointsToPathLayer, 
    pointerEventToCanvasPoint, 
    // resizeBounds,
  } from "@/lib/utils";
import { CursorsPresence } from "./cursors-presence";


interface CanvasProps {
    boardId: string;
};

export const Canvas = ({
    boardId,
}: CanvasProps) => {

    const [canvasState, setCanvasState] = useState<CanvasState>({
        mode:CanvasMode.None,
    });

    const [camera, setCamera] = useState<Camera>({ x: 0, y: 0});

    const history = useHistory();
    const canUndo = useCanUndo();
    const canRedo = useCanRedo();

    const onWheel = useCallback((e: React.WheelEvent) => {
        setCamera((camera) => ({
          x: camera.x - e.deltaX,
          y: camera.y - e.deltaY,
        }));
      }, []);

    const onPointerMove = useMutation((
        { setMyPresence }, 
        e: React.PointerEvent
        ) => {
        e.preventDefault();

        const current = pointerEventToCanvasPoint(e, camera);

        setMyPresence({ cursor: current });
    }, []);

    const onPointerLeave = useMutation(({ setMyPresence }) => {
        setMyPresence({ cursor: null });
      }, []);

    return (
        <main
      className="h-full w-full relative bg-neutral-100 touch-none"
    >
      <Info boardId={boardId} />
      <Participants />
      <Toolbar
        canvasState={canvasState}
        setCanvasState={setCanvasState}
        canRedo={canRedo}
        canUndo={canUndo}
        undo={history.undo}
        redo={history.redo}
      />
      {/* <SelectionTools
        camera={camera}
        setLastUsedColor={setLastUsedColor}
      /> */}
      <svg
        className="h-[100vh] w-[100vw]"
        onWheel={onWheel}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        // onPointerDown={onPointerDown}
        // onPointerUp={onPointerUp}
      >
        <g
        //   style={{
        //     transform: `translate(${camera.x}px, ${camera.y}px)`
        //   }}
        >
          {/* {layerIds.map((layerId) => (
            <LayerPreview
              key={layerId}
              id={layerId}
              onLayerPointerDown={onLayerPointerDown}
              selectionColor={layerIdsToColorSelection[layerId]}
            />
          ))}
          <SelectionBox
            onResizeHandlePointerDown={onResizeHandlePointerDown}
          /> */}
          {canvasState.mode === CanvasMode.SelectionNet && canvasState.current != null && (
            <rect
              className="fill-blue-500/5 stroke-blue-500 stroke-1"
              x={Math.min(canvasState.origin.x, canvasState.current.x)}
              y={Math.min(canvasState.origin.y, canvasState.current.y)}
              width={Math.abs(canvasState.origin.x - canvasState.current.x)}
              height={Math.abs(canvasState.origin.y - canvasState.current.y)}
            />
          )}
          <CursorsPresence />
          {/* {pencilDraft != null && pencilDraft.length > 0 && (
            <Path
              points={pencilDraft}
              fill={colorToCss(lastUsedColor)}
              x={0}
              y={0}
            />
          )} */}
        </g>
      </svg>
    </main>
    )
}