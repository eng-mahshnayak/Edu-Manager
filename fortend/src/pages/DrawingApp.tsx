// import React, { useState, useRef, useEffect, useCallback } from "react";
// import {
//   Stage,
//   Layer,
//   Image as KonvaImage,
//   Rect,
//   Line,
//   Circle,
// } from "react-konva";
// import Konva from "konva";
// import axios from "axios";
// import toast from "react-hot-toast";

// // ============ Types ============
// type Tool =
//   | "pencil"
//   | "brush"
//   | "eraser"
//   | "fill"
//   | "move"
//   | "line"
//   | "rectangle"
//   | "circle"
//   | "square";

// // ============ Main Component ============
// const DrawingApp: React.FC = () => {
//   // ----- Refs -----
//   const stageRef = useRef<Konva.Stage>(null);
//   const imageLayerRef = useRef<Konva.Layer>(null);
//   const drawingLayerRef = useRef<Konva.Layer>(null);
//   const previewLayerRef = useRef<Konva.Layer>(null);

//   // Offscreen canvas for persistent drawing
//   const offscreenCanvas = useRef<HTMLCanvasElement>(
//     document.createElement("canvas")
//   );
//   const offscreenCtx = useRef<CanvasRenderingContext2D | null>(null);

//   // ----- State -----
//   const [tool, setTool] = useState<Tool>("pencil");
//   const [color, setColor] = useState("#000000");
//   const [brushSize, setBrushSize] = useState(5);
//   const [fillShapes, setFillShapes] = useState(false); // for shapes

//   const [isDrawing, setIsDrawing] = useState(false);
//   const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
//   const [lastPos, setLastPos] = useState<{ x: number; y: number } | null>(null);
//   const [image, setImage] = useState<HTMLImageElement | null>(null);
//   const [drawingName, setDrawingName] = useState("My Drawing");
//   const [history, setHistory] = useState<string[]>([]);
//   const [historyIndex, setHistoryIndex] = useState(-1);
//   const [loading, setLoading] = useState(false);

//   // Stage transform for zoom/pan
//   const [stageScale, setStageScale] = useState(1);
//   const [stagePosition, setStagePosition] = useState({ x: 0, y: 0 });

//   // Temporary shape for preview
//   const [tempShape, setTempShape] = useState<Konva.Shape | null>(null);

//   // Palette colors
//   const presetColors = [
//     "#000000", "#FF0000", "#FFA500", "#FFFF00", "#008000", 
//     "#0000FF", "#4B0082", "#8B00FF", "#FF69B4", "#A52A2A",
//     "#00FFFF", "#808080", "#FFFFFF"
//   ];

//   // ----- Initialize offscreen canvas -----
//   useEffect(() => {
//     const canvas = offscreenCanvas.current;
//     canvas.width = 1200;
//     canvas.height = 800;
//     const ctx = canvas.getContext("2d");
//     if (ctx) {
//       ctx.fillStyle = "#ffffff";
//       ctx.fillRect(0, 0, canvas.width, canvas.height);
//       offscreenCtx.current = ctx;
//     }
//     saveHistory();
//   }, []);

//   // ----- Save state to history -----
//   const saveHistory = useCallback(() => {
//     const canvas = offscreenCanvas.current;
//     const data = canvas.toDataURL();
//     const newHistory = history.slice(0, historyIndex + 1);
//     newHistory.push(data);
//     setHistory(newHistory);
//     setHistoryIndex(newHistory.length - 1);
//   }, [history, historyIndex]);

//   // ----- Update Konva drawing layer -----
//   const updateDrawingLayer = useCallback(() => {
//     const layer = drawingLayerRef.current;
//     if (!layer) return;
//     const canvas = offscreenCanvas.current;
//     const imageObj = new window.Image();
//     imageObj.src = canvas.toDataURL();
//     imageObj.onload = () => {
//       layer.children.forEach((child) => child.destroy());
//       const konvaImage = new Konva.Image({
//         image: imageObj,
//         x: 0,
//         y: 0,
//         width: canvas.width,
//         height: canvas.height,
//       });
//       layer.add(konvaImage);
//       layer.draw();
//     };
//   }, []);

//   // ----- Clear preview layer -----
//   const clearPreview = () => {
//     const layer = previewLayerRef.current;
//     if (layer) {
//       layer.children.forEach((child) => child.destroy());
//       layer.draw();
//     }
//     setTempShape(null);
//   };

//   // ----- Get canvas coordinates from stage pointer -----
//   const getCanvasPos = (pos: { x: number; y: number }) => {
//     const stage = stageRef.current;
//     if (!stage) return pos;
//     const transform = stage.getAbsoluteTransform().copy().invert();
//     return transform.point(pos);
//   };

//   // ----- Drawing functions -----
//   const startDrawing = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
//     const pos = e.target.getStage()?.getPointerPosition();
//     if (!pos) return;

//     if (tool === "move") return;

//     if (tool === "fill") {
//       const canvasPos = getCanvasPos(pos);
//       floodFill(Math.round(canvasPos.x), Math.round(canvasPos.y), color);
//       saveHistory();
//       updateDrawingLayer();
//       return;
//     }

//     // Shape tools
//     if (["line", "rectangle", "circle", "square"].includes(tool)) {
//       const canvasPos = getCanvasPos(pos);
//       setStartPos(canvasPos);
//       setIsDrawing(true);
//       return;
//     }

//     // Freehand drawing
//     setIsDrawing(true);
//     const canvasPos = getCanvasPos(pos);
//     setLastPos(canvasPos);
//   };

//   const draw = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
//     const pos = e.target.getStage()?.getPointerPosition();
//     if (!pos) return;

//     if (tool === "move") return;

//     // Shape preview
//     if (["line", "rectangle", "circle", "square"].includes(tool) && isDrawing && startPos) {
//       const canvasPos = getCanvasPos(pos);
//       updateShapePreview(startPos, canvasPos);
//       return;
//     }

//     // Freehand drawing
//     if (!isDrawing || !lastPos || ["fill", "move", "line", "rectangle", "circle", "square"].includes(tool)) return;

//     const canvasPos = getCanvasPos(pos);
//     const ctx = offscreenCtx.current;
//     if (!ctx) return;

//     ctx.beginPath();
//     ctx.moveTo(lastPos.x, lastPos.y);
//     ctx.lineTo(canvasPos.x, canvasPos.y);
//     ctx.strokeStyle = tool === "eraser" ? "#ffffff" : color;
//     ctx.lineWidth = brushSize;
//     ctx.lineCap = "round";
//     ctx.lineJoin = "round";
//     if (tool === "eraser") {
//       ctx.globalCompositeOperation = "destination-out";
//     } else {
//       ctx.globalCompositeOperation = "source-over";
//     }
//     ctx.stroke();
//     ctx.closePath();

//     setLastPos(canvasPos);
//     updateDrawingLayer();
//   };

//   const endDrawing = () => {
//     if (["line", "rectangle", "circle", "square"].includes(tool) && isDrawing && startPos) {
//       // Finalize shape
//       const layer = previewLayerRef.current;
//       if (layer && tempShape) {
//         // Draw the shape on the offscreen canvas
//         const ctx = offscreenCtx.current;
//         if (!ctx) return;
//         const canvas = offscreenCanvas.current;

//         // Get the shape's bounding box and draw it
//         const shape = tempShape;
//         const attrs = shape.attrs;
//         ctx.save();
//         ctx.strokeStyle = color;
//         ctx.lineWidth = brushSize;
//         if (fillShapes) {
//           ctx.fillStyle = color;
//         } else {
//           ctx.fillStyle = "transparent";
//         }

//         if (tool === "line") {
//           ctx.beginPath();
//           ctx.moveTo(attrs.points[0], attrs.points[1]);
//           ctx.lineTo(attrs.points[2], attrs.points[3]);
//           ctx.stroke();
//         } else if (tool === "rectangle") {
//           ctx.rect(attrs.x, attrs.y, attrs.width, attrs.height);
//           if (fillShapes) ctx.fill();
//           ctx.stroke();
//         } else if (tool === "square") {
//           ctx.rect(attrs.x, attrs.y, attrs.width, attrs.height);
//           if (fillShapes) ctx.fill();
//           ctx.stroke();
//         } else if (tool === "circle") {
//           ctx.ellipse(attrs.x + attrs.radius, attrs.y + attrs.radius, attrs.radius, attrs.radius, 0, 0, Math.PI * 2);
//           if (fillShapes) ctx.fill();
//           ctx.stroke();
//         }

//         ctx.restore();
//         updateDrawingLayer();
//         saveHistory();
//       }
//       clearPreview();
//       setIsDrawing(false);
//       setStartPos(null);
//       return;
//     }

//     if (isDrawing) {
//       setIsDrawing(false);
//       setLastPos(null);
//       if (offscreenCtx.current) {
//         offscreenCtx.current.globalCompositeOperation = "source-over";
//       }
//       saveHistory();
//       updateDrawingLayer();
//     }
//   };

//   // ----- Shape preview (on mouse move) -----
//   const updateShapePreview = (start: { x: number; y: number }, end: { x: number; y: number }) => {
//     const layer = previewLayerRef.current;
//     if (!layer) return;

//     // Remove previous temp shape
//     layer.children.forEach((child) => child.destroy());

//     let shape: Konva.Shape | null = null;
//     const w = end.x - start.x;
//     const h = end.y - start.y;

//     if (tool === "line") {
//       shape = new Konva.Line({
//         points: [start.x, start.y, end.x, end.y],
//         stroke: color,
//         strokeWidth: brushSize,
//         lineCap: "round",
//         lineJoin: "round",
//       });
//     } else if (tool === "rectangle") {
//       shape = new Konva.Rect({
//         x: start.x,
//         y: start.y,
//         width: w,
//         height: h,
//         stroke: color,
//         strokeWidth: brushSize,
//         fill: fillShapes ? color : "transparent",
//       });
//     } else if (tool === "square") {
//       const size = Math.max(Math.abs(w), Math.abs(h)) * (w < 0 ? -1 : 1);
//       const side = Math.abs(size);
//       const x = w < 0 ? start.x - side : start.x;
//       const y = h < 0 ? start.y - side : start.y;
//       shape = new Konva.Rect({
//         x,
//         y,
//         width: side,
//         height: side,
//         stroke: color,
//         strokeWidth: brushSize,
//         fill: fillShapes ? color : "transparent",
//       });
//     } else if (tool === "circle") {
//       const radius = Math.sqrt(w * w + h * h) / 2;
//       const cx = start.x + w / 2;
//       const cy = start.y + h / 2;
//       shape = new Konva.Circle({
//         x: cx,
//         y: cy,
//         radius: radius,
//         stroke: color,
//         strokeWidth: brushSize,
//         fill: fillShapes ? color : "transparent",
//       });
//     }

//     if (shape) {
//       layer.add(shape);
//       layer.draw();
//       setTempShape(shape);
//     }
//   };

//   // ----- Flood Fill (same as before) -----
//   const floodFill = (startX: number, startY: number, fillColor: string) => {
//     const ctx = offscreenCtx.current;
//     if (!ctx) return;
//     const canvas = offscreenCanvas.current;
//     startX = Math.round(Math.max(0, Math.min(startX, canvas.width - 1)));
//     startY = Math.round(Math.max(0, Math.min(startY, canvas.height - 1)));

//     const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//     const data = imageData.data;
//     const targetColor = getPixelColor(data, startX, startY, canvas.width);
//     const fillColorRGB = hexToRgb(fillColor);

//     if (
//       targetColor[0] === fillColorRGB[0] &&
//       targetColor[1] === fillColorRGB[1] &&
//       targetColor[2] === fillColorRGB[2]
//     ) {
//       return;
//     }

//     const stack: [number, number][] = [[startX, startY]];
//     const visited = new Set<string>();
//     const width = canvas.width;
//     const height = canvas.height;

//     while (stack.length > 0) {
//       const [x, y] = stack.pop()!;
//       const key = `${x},${y}`;
//       if (visited.has(key)) continue;
//       visited.add(key);

//       const idx = (y * width + x) * 4;
//       if (
//         data[idx] === targetColor[0] &&
//         data[idx + 1] === targetColor[1] &&
//         data[idx + 2] === targetColor[2] &&
//         data[idx + 3] === targetColor[3]
//       ) {
//         data[idx] = fillColorRGB[0];
//         data[idx + 1] = fillColorRGB[1];
//         data[idx + 2] = fillColorRGB[2];
//         data[idx + 3] = 255;

//         if (x > 0) stack.push([x - 1, y]);
//         if (x < width - 1) stack.push([x + 1, y]);
//         if (y > 0) stack.push([x, y - 1]);
//         if (y < height - 1) stack.push([x, y + 1]);
//       }
//     }

//     ctx.putImageData(imageData, 0, 0);
//     updateDrawingLayer();
//   };

//   const getPixelColor = (
//     data: Uint8ClampedArray,
//     x: number,
//     y: number,
//     width: number
//   ): [number, number, number, number] => {
//     const idx = (y * width + x) * 4;
//     return [data[idx], data[idx + 1], data[idx + 2], data[idx + 3]];
//   };

//   const hexToRgb = (hex: string): [number, number, number] => {
//     const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
//     return result
//       ? [
//           parseInt(result[1], 16),
//           parseInt(result[2], 16),
//           parseInt(result[3], 16),
//         ]
//       : [0, 0, 0];
//   };

//   // ----- Undo / Redo -----
//   const undo = () => {
//     if (historyIndex > 0) {
//       const newIndex = historyIndex - 1;
//       setHistoryIndex(newIndex);
//       restoreFromHistory(newIndex);
//     }
//   };

//   const redo = () => {
//     if (historyIndex < history.length - 1) {
//       const newIndex = historyIndex + 1;
//       setHistoryIndex(newIndex);
//       restoreFromHistory(newIndex);
//     }
//   };

//   const restoreFromHistory = (index: number) => {
//     const dataUrl = history[index];
//     const img = new window.Image();
//     img.src = dataUrl;
//     img.onload = () => {
//       const ctx = offscreenCtx.current;
//       if (!ctx) return;
//       ctx.clearRect(0, 0, offscreenCanvas.current.width, offscreenCanvas.current.height);
//       ctx.drawImage(img, 0, 0);
//       updateDrawingLayer();
//       clearPreview();
//     };
//   };

//   // ----- Load Image -----
//   const loadImage = (file: File | string) => {
//     const img = new window.Image();
//     const load = (src: string) => {
//       img.src = src;
//       img.onload = () => {
//         offscreenCanvas.current.width = img.width;
//         offscreenCanvas.current.height = img.height;
//         const ctx = offscreenCtx.current;
//         if (ctx) {
//           ctx.fillStyle = "#ffffff";
//           ctx.fillRect(0, 0, img.width, img.height);
//           ctx.drawImage(img, 0, 0);
//           updateDrawingLayer();
//           saveHistory();
//           resetView();
//         }
//         setImage(img);
//         toast.success("Image loaded!");
//       };
//     };
//     if (typeof file === "string") {
//       load(file);
//     } else {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         if (e.target?.result) load(e.target.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   // ----- Zoom / Pan -----
//   const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
//     e.evt.preventDefault();
//     const stage = stageRef.current;
//     if (!stage) return;

//     const oldScale = stageScale;
//     const delta = e.evt.deltaY > 0 ? -0.05 : 0.05;
//     const newScale = Math.min(Math.max(oldScale + delta, 0.1), 5);

//     const pointer = stage.getPointerPosition();
//     if (!pointer) return;

//     const mousePointTo = {
//       x: (pointer.x - stagePosition.x) / oldScale,
//       y: (pointer.y - stagePosition.y) / oldScale,
//     };

//     const newPos = {
//       x: pointer.x - mousePointTo.x * newScale,
//       y: pointer.y - mousePointTo.y * newScale,
//     };

//     setStageScale(newScale);
//     setStagePosition(newPos);
//   };

//   const resetView = () => {
//     setStageScale(1);
//     setStagePosition({ x: 0, y: 0 });
//   };

//   // ----- Save / Load -----
//   const saveDrawing = async () => {
//     const canvas = offscreenCanvas.current;
//     const dataUrl = canvas.toDataURL();
//     try {
//       await axios.post("http://localhost:5000/api/drawing/save", {
//         name: drawingName,
//         data: dataUrl,
//       });
//       toast.success("Drawing saved!");
//     } catch (error) {
//       toast.error("Failed to save drawing");
//     }
//   };

//   const loadSavedDrawings = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get("http://localhost:5000/api/drawing/list");
//       if (res.data.success) {
//         if (res.data.data.length > 0) {
//           const drawing = res.data.data[0];
//           setDrawingName(drawing.name);
//           loadImage(drawing.data);
//         }
//       }
//     } catch (error) {
//       toast.error("Failed to load drawings");
//     }
//     setLoading(false);
//   };

//   // ----- Download PNG -----
//   const downloadPNG = () => {
//     const canvas = offscreenCanvas.current;
//     const link = document.createElement("a");
//     link.download = `${drawingName}.png`;
//     link.href = canvas.toDataURL();
//     link.click();
//   };

//   // ----- Clear -----
//   const clearCanvas = () => {
//     const ctx = offscreenCtx.current;
//     if (!ctx) return;
//     ctx.fillStyle = "#ffffff";
//     ctx.fillRect(0, 0, offscreenCanvas.current.width, offscreenCanvas.current.height);
//     updateDrawingLayer();
//     saveHistory();
//     resetView();
//     clearPreview();
//   };

//   // ----- Render -----
//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
//         padding: "20px",
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         overflow: "auto",
//       }}
//     >
//       <h1 style={{ color: "white", marginBottom: 20 }}>🎨 Kids Painting Studio</h1>

//       {/* Toolbar */}
//       <div
//         style={{
//           display: "flex",
//           flexWrap: "wrap",
//           gap: 10,
//           alignItems: "center",
//           background: "rgba(255,255,255,0.1)",
//           padding: "10px 20px",
//           borderRadius: 12,
//           backdropFilter: "blur(10px)",
//           marginBottom: 20,
//           border: "1px solid rgba(255,255,255,0.1)",
//           width: "100%",
//           maxWidth: "1200px",
//         }}
//       >
//         {/* Drawing tools */}
//         <button
//           onClick={() => setTool("pencil")}
//           style={{
//             padding: "8px 16px",
//             background: tool === "pencil" ? "#3b82f6" : "rgba(255,255,255,0.1)",
//             color: "white",
//             border: "none",
//             borderRadius: 8,
//             cursor: "pointer",
//             fontWeight: "bold",
//           }}
//         >
//           ✏️ Pencil
//         </button>
//         <button
//           onClick={() => setTool("brush")}
//           style={{
//             padding: "8px 16px",
//             background: tool === "brush" ? "#3b82f6" : "rgba(255,255,255,0.1)",
//             color: "white",
//             border: "none",
//             borderRadius: 8,
//             cursor: "pointer",
//             fontWeight: "bold",
//           }}
//         >
//           🖌️ Brush
//         </button>
//         <button
//           onClick={() => setTool("eraser")}
//           style={{
//             padding: "8px 16px",
//             background: tool === "eraser" ? "#3b82f6" : "rgba(255,255,255,0.1)",
//             color: "white",
//             border: "none",
//             borderRadius: 8,
//             cursor: "pointer",
//             fontWeight: "bold",
//           }}
//         >
//           🧽 Eraser
//         </button>
//         <button
//           onClick={() => setTool("fill")}
//           style={{
//             padding: "8px 16px",
//             background: tool === "fill" ? "#3b82f6" : "rgba(255,255,255,0.1)",
//             color: "white",
//             border: "none",
//             borderRadius: 8,
//             cursor: "pointer",
//             fontWeight: "bold",
//           }}
//         >
//           🪣 Fill
//         </button>

//         {/* Shape tools */}
//         <button
//           onClick={() => setTool("line")}
//           style={{
//             padding: "8px 16px",
//             background: tool === "line" ? "#3b82f6" : "rgba(255,255,255,0.1)",
//             color: "white",
//             border: "none",
//             borderRadius: 8,
//             cursor: "pointer",
//             fontWeight: "bold",
//           }}
//         >
//           ➖ Line
//         </button>
//         <button
//           onClick={() => setTool("rectangle")}
//           style={{
//             padding: "8px 16px",
//             background: tool === "rectangle" ? "#3b82f6" : "rgba(255,255,255,0.1)",
//             color: "white",
//             border: "none",
//             borderRadius: 8,
//             cursor: "pointer",
//             fontWeight: "bold",
//           }}
//         >
//           ▭ Rect
//         </button>
//         <button
//           onClick={() => setTool("circle")}
//           style={{
//             padding: "8px 16px",
//             background: tool === "circle" ? "#3b82f6" : "rgba(255,255,255,0.1)",
//             color: "white",
//             border: "none",
//             borderRadius: 8,
//             cursor: "pointer",
//             fontWeight: "bold",
//           }}
//         >
//           ⭕ Circle
//         </button>
//         <button
//           onClick={() => setTool("square")}
//           style={{
//             padding: "8px 16px",
//             background: tool === "square" ? "#3b82f6" : "rgba(255,255,255,0.1)",
//             color: "white",
//             border: "none",
//             borderRadius: 8,
//             cursor: "pointer",
//             fontWeight: "bold",
//           }}
//         >
//           ◻ Square
//         </button>

//         <button
//           onClick={() => setTool("move")}
//           style={{
//             padding: "8px 16px",
//             background: tool === "move" ? "#3b82f6" : "rgba(255,255,255,0.1)",
//             color: "white",
//             border: "none",
//             borderRadius: 8,
//             cursor: "pointer",
//             fontWeight: "bold",
//           }}
//         >
//           ✋ Move
//         </button>

//         {/* Fill toggle for shapes */}
//         <label style={{ color: "white", fontSize: 14, display: "flex", alignItems: "center", gap: 4 }}>
//           <input
//             type="checkbox"
//             checked={fillShapes}
//             onChange={(e) => setFillShapes(e.target.checked)}
//           />
//           Fill Shapes
//         </label>

//         {/* Color picker */}
//         <input
//           type="color"
//           value={color}
//           onChange={(e) => setColor(e.target.value)}
//           style={{ width: 40, height: 40, border: "none", borderRadius: 8, cursor: "pointer" }}
//         />

//         {/* Palette */}
//         <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
//           {presetColors.map((c) => (
//             <div
//               key={c}
//               onClick={() => setColor(c)}
//               style={{
//                 width: 28,
//                 height: 28,
//                 backgroundColor: c,
//                 border: color === c ? "2px solid white" : "1px solid rgba(255,255,255,0.3)",
//                 borderRadius: 4,
//                 cursor: "pointer",
//                 transition: "transform 0.1s",
//               }}
//               onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.15)")}
//               onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
//             />
//           ))}
//         </div>

//         {/* Brush size */}
//         <label style={{ color: "white", fontSize: 14 }}>
//           Size:
//           <input
//             type="range"
//             min="1"
//             max="50"
//             value={brushSize}
//             onChange={(e) => setBrushSize(parseInt(e.target.value))}
//             style={{ width: 80, marginLeft: 8 }}
//           />
//         </label>

//         {/* Undo / Redo */}
//         <button
//           onClick={undo}
//           disabled={historyIndex <= 0}
//           style={{
//             padding: "8px 12px",
//             background: historyIndex > 0 ? "#3b82f6" : "rgba(255,255,255,0.1)",
//             color: "white",
//             border: "none",
//             borderRadius: 8,
//             cursor: historyIndex > 0 ? "pointer" : "not-allowed",
//             fontWeight: "bold",
//           }}
//         >
//           ↩️
//         </button>
//         <button
//           onClick={redo}
//           disabled={historyIndex >= history.length - 1}
//           style={{
//             padding: "8px 12px",
//             background: historyIndex < history.length - 1 ? "#3b82f6" : "rgba(255,255,255,0.1)",
//             color: "white",
//             border: "none",
//             borderRadius: 8,
//             cursor: historyIndex < history.length - 1 ? "pointer" : "not-allowed",
//             fontWeight: "bold",
//           }}
//         >
//           ↪️
//         </button>

//         {/* View controls */}
//         <button
//           onClick={resetView}
//           style={{
//             padding: "8px 12px",
//             background: "#8b5cf6",
//             color: "white",
//             border: "none",
//             borderRadius: 8,
//             cursor: "pointer",
//             fontWeight: "bold",
//           }}
//         >
//           🔄 Reset View
//         </button>

//         {/* Load image */}
//         <label
//           style={{
//             padding: "8px 16px",
//             background: "rgba(16, 185, 129, 0.8)",
//             color: "white",
//             borderRadius: 8,
//             cursor: "pointer",
//             fontWeight: "bold",
//           }}
//         >
//           📂 Load
//           <input
//             type="file"
//             accept="image/*"
//             style={{ display: "none" }}
//             onChange={(e) => {
//               const file = e.target.files?.[0];
//               if (file) loadImage(file);
//             }}
//           />
//         </label>

//         {/* Save / Download */}
//         <button
//           onClick={saveDrawing}
//           style={{
//             padding: "8px 16px",
//             background: "#8b5cf6",
//             color: "white",
//             border: "none",
//             borderRadius: 8,
//             cursor: "pointer",
//             fontWeight: "bold",
//           }}
//         >
//           💾 Save
//         </button>
//         <button
//           onClick={downloadPNG}
//           style={{
//             padding: "8px 16px",
//             background: "#f59e0b",
//             color: "white",
//             border: "none",
//             borderRadius: 8,
//             cursor: "pointer",
//             fontWeight: "bold",
//           }}
//         >
//           ⬇️ PNG
//         </button>
//         <button
//           onClick={clearCanvas}
//           style={{
//             padding: "8px 16px",
//             background: "#ef4444",
//             color: "white",
//             border: "none",
//             borderRadius: 8,
//             cursor: "pointer",
//             fontWeight: "bold",
//           }}
//         >
//           🗑️ Clear
//         </button>
//         <button
//           onClick={loadSavedDrawings}
//           disabled={loading}
//           style={{
//             padding: "8px 16px",
//             background: "#06b6d4",
//             color: "white",
//             border: "none",
//             borderRadius: 8,
//             cursor: "pointer",
//             fontWeight: "bold",
//           }}
//         >
//           {loading ? "Loading..." : "📂 Load Saved"}
//         </button>

//         {/* Drawing name input */}
//         <input
//           type="text"
//           value={drawingName}
//           onChange={(e) => setDrawingName(e.target.value)}
//           placeholder="Name"
//           style={{
//             padding: "8px 12px",
//             borderRadius: 8,
//             border: "1px solid rgba(255,255,255,0.3)",
//             background: "rgba(255,255,255,0.1)",
//             color: "white",
//             fontSize: 14,
//             width: 120,
//           }}
//         />
//       </div>

//       {/* Canvas */}
//       <div
//         style={{
//           background: "rgba(255,255,255,0.05)",
//           borderRadius: 16,
//           padding: 10,
//           border: "1px solid rgba(255,255,255,0.1)",
//           boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
//           overflow: "hidden",
//           width: "100%",
//           maxWidth: "1200px",
//         }}
//       >
//         <Stage
//           ref={stageRef}
//           width={1200}
//           height={800}
//           scaleX={stageScale}
//           scaleY={stageScale}
//           x={stagePosition.x}
//           y={stagePosition.y}
//           draggable={tool === "move"}
//           onWheel={handleWheel}
//           onMouseDown={startDrawing}
//           onMouseMove={draw}
//           onMouseUp={endDrawing}
//           onTouchStart={startDrawing}
//           onTouchMove={draw}
//           onTouchEnd={endDrawing}
//           style={{ background: "#ffffff", borderRadius: 8 }}
//         >
//           {/* Background Layer */}
//           <Layer>
//             <Rect x={0} y={0} width={1200} height={800} fill="#ffffff" />
//           </Layer>

//           {/* Image Layer (sketch) - locked */}
//           {image && (
//             <Layer ref={imageLayerRef}>
//               <KonvaImage
//                 image={image}
//                 x={0}
//                 y={0}
//                 width={1200}
//                 height={800}
//                 listening={false}
//               />
//             </Layer>
//           )}

//           {/* Drawing Layer */}
//           <Layer ref={drawingLayerRef} listening={true} />

//           {/* Preview Layer (for shapes) */}
//           <Layer ref={previewLayerRef} listening={false} />
//         </Stage>
//       </div>

//       <div style={{ display: "flex", gap: 20, marginTop: 16, color: "rgba(255,255,255,0.6)", fontSize: 14, flexWrap: "wrap", justifyContent: "center" }}>
//         <span>💡 Select a shape, click & drag to draw</span>
//         <span>🪣 Fill: click a closed area to fill with color</span>
//         <span>🖱️ Scroll to zoom, ✋ Move to pan</span>
//         <span>✅ Check "Fill Shapes" to fill drawn shapes</span>
//       </div>
//     </div>
//   );
// };

// export default DrawingApp;



import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Brush,
  Check,
  ChevronDown,
  Circle,
  Download,
  Eraser,
  Heart,
  Image as ImageIcon,
  PaintBucket,
  Palette,
  Redo2,
  RotateCcw,
  Save,
  Sparkles,
  Star,
  Trash2,
  Undo2,
  X,
} from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

type Tool = "fill" | "brush" | "eraser";

type ColoringPage = {
  id: string;
  name: string;
  emoji: string;
};

type Region = {
  id: string;
  label: string;
};

type Sticker = {
  id: number;
  emoji: string;
  x: number;
  y: number;
  size: number;
};

type HistoryState = {
  fills: Record<string, string>;
  brushPaths: string[];
  stickers: Sticker[];
};

/* =========================================================
   COLORS
========================================================= */

const COLORS = [
  "#FF3B30",
  "#FF9500",
  "#FFCC00",
  "#34C759",
  "#00C7BE",
  "#007AFF",
  "#5856D6",
  "#AF52DE",
  "#FF2D55",
  "#8E8E93",
  "#000000",
  "#FFFFFF",
];

const STICKERS = [
  "🌈",
  "☀️",
  "⭐",
  "❤️",
  "🌸",
  "🌳",
  "🦋",
  "🐱",
  "🐶",
  "🐰",
  "🦄",
  "🍎",
];

/* =========================================================
   30+ COLORING PAGES
========================================================= */

const COLORING_PAGES: ColoringPage[] = [
  { id: "house", name: "House", emoji: "🏠" },
  { id: "tree", name: "Tree", emoji: "🌳" },
  { id: "sun", name: "Sun", emoji: "☀️" },
  { id: "unicorn", name: "Unicorn", emoji: "🦄" },

  { id: "car", name: "Car", emoji: "🚗" },
  { id: "bus", name: "Bus", emoji: "🚌" },
  { id: "train", name: "Train", emoji: "🚂" },
  { id: "rocket", name: "Rocket", emoji: "🚀" },

  { id: "airplane", name: "Airplane", emoji: "✈️" },
  { id: "boat", name: "Boat", emoji: "⛵" },
  { id: "bicycle", name: "Bicycle", emoji: "🚲" },
  { id: "tractor", name: "Tractor", emoji: "🚜" },

  { id: "flower", name: "Flower", emoji: "🌸" },
  { id: "butterfly", name: "Butterfly", emoji: "🦋" },
  { id: "bee", name: "Bee", emoji: "🐝" },
  { id: "bird", name: "Bird", emoji: "🐦" },

  { id: "cat", name: "Cat", emoji: "🐱" },
  { id: "dog", name: "Dog", emoji: "🐶" },
  { id: "rabbit", name: "Rabbit", emoji: "🐰" },
  { id: "lion", name: "Lion", emoji: "🦁" },

  { id: "elephant", name: "Elephant", emoji: "🐘" },
  { id: "monkey", name: "Monkey", emoji: "🐵" },
  { id: "panda", name: "Panda", emoji: "🐼" },
  { id: "bear", name: "Bear", emoji: "🐻" },

  { id: "dinosaur", name: "Dinosaur", emoji: "🦖" },
  { id: "turtle", name: "Turtle", emoji: "🐢" },
  { id: "frog", name: "Frog", emoji: "🐸" },
  { id: "penguin", name: "Penguin", emoji: "🐧" },

  { id: "rainbow", name: "Rainbow", emoji: "🌈" },
  { id: "cloud", name: "Cloud", emoji: "☁️" },
  { id: "moon", name: "Moon", emoji: "🌙" },
  { id: "star", name: "Star", emoji: "⭐" },

  { id: "castle", name: "Castle", emoji: "🏰" },
  { id: "robot", name: "Robot", emoji: "🤖" },
  { id: "icecream", name: "Ice Cream", emoji: "🍦" },
  { id: "apple", name: "Apple", emoji: "🍎" },
];

/* =========================================================
   SVG HELPERS
========================================================= */

const outline = {
  stroke: "#172033",
  strokeWidth: 7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function FillPart({
  id,
  fill,
  onClick,
  children,
  className = "",
}: {
  id: string;
  fill: string;
  onClick: (id: string) => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <g
      id={id}
      className={`cursor-pointer ${className}`}
      onClick={(e) => {
        e.stopPropagation();
        onClick(id);
      }}
      style={{
        transition: "fill 0.2s",
      }}
    >
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;

        return React.cloneElement(child as React.ReactElement<any>, {
          fill,
        });
      })}
    </g>
  );
}

/* =========================================================
   SIMPLE COLORING SCENE
========================================================= */

function ColoringSVG({
  page,
  fills,
  onFill,
}: {
  page: string;
  fills: Record<string, string>;
  onFill: (id: string) => void;
}) {
  const getFill = (id: string) => fills[id] || "#FFFFFF";

  const common = {
    ...outline,
    fill: "#FFFFFF",
  };

  /* ================= HOUSE ================= */

  if (page === "house") {
    return (
      <>
        <FillPart
          id="house-wall"
          fill={getFill("house-wall")}
          onClick={onFill}
        >
          <rect x="190" y="300" width="420" height="280" {...common} />
        </FillPart>

        <FillPart
          id="house-roof"
          fill={getFill("house-roof")}
          onClick={onFill}
        >
          <path d="M140 310 L400 100 L660 310 Z" {...common} />
        </FillPart>

        <FillPart
          id="house-door"
          fill={getFill("house-door")}
          onClick={onFill}
        >
          <rect x="350" y="410" width="100" height="170" {...common} />
        </FillPart>

        <FillPart
          id="house-window-left"
          fill={getFill("house-window-left")}
          onClick={onFill}
        >
          <rect x="225" y="370" width="90" height="90" {...common} />
        </FillPart>

        <FillPart
          id="house-window-right"
          fill={getFill("house-window-right")}
          onClick={onFill}
        >
          <rect x="485" y="370" width="90" height="90" {...common} />
        </FillPart>

        <circle cx="400" cy="485" r="8" fill="#172033" />

        <path
          d="M120 580 H680"
          stroke="#172033"
          strokeWidth="7"
          strokeLinecap="round"
        />
      </>
    );
  }

  /* ================= TREE ================= */

  if (page === "tree") {
    return (
      <>
        <FillPart
          id="tree-trunk"
          fill={getFill("tree-trunk")}
          onClick={onFill}
        >
          <rect x="350" y="420" width="100" height="190" rx="15" {...common} />
        </FillPart>

        <FillPart
          id="tree-top"
          fill={getFill("tree-top")}
          onClick={onFill}
        >
          <circle cx="400" cy="300" r="180" {...common} />
        </FillPart>

        <FillPart
          id="tree-left"
          fill={getFill("tree-left")}
          onClick={onFill}
        >
          <circle cx="270" cy="380" r="110" {...common} />
        </FillPart>

        <FillPart
          id="tree-right"
          fill={getFill("tree-right")}
          onClick={onFill}
        >
          <circle cx="530" cy="380" r="110" {...common} />
        </FillPart>

        <path
          d="M150 610 H650"
          stroke="#172033"
          strokeWidth="7"
          strokeLinecap="round"
        />
      </>
    );
  }

  /* ================= SUN ================= */

  if (page === "sun") {
    const rays = [
      "M400 70V130",
      "M400 670V610",
      "M70 370H130",
      "M670 370H610",
      "M165 135L210 180",
      "M635 135L590 180",
      "M165 605L210 560",
      "M635 605L590 560",
    ];

    return (
      <>
        {rays.map((d, i) => (
          <path
            key={i}
            d={d}
            stroke="#172033"
            strokeWidth="10"
            strokeLinecap="round"
          />
        ))}

        <FillPart
          id="sun-body"
          fill={getFill("sun-body")}
          onClick={onFill}
        >
          <circle cx="400" cy="370" r="210" {...common} />
        </FillPart>

        <circle cx="330" cy="340" r="15" fill="#172033" />
        <circle cx="470" cy="340" r="15" fill="#172033" />

        <path
          d="M320 430 Q400 500 480 430"
          fill="none"
          stroke="#172033"
          strokeWidth="7"
          strokeLinecap="round"
        />
      </>
    );
  }

  /* ================= UNICORN ================= */

  if (page === "unicorn") {
    return (
      <>
        <FillPart
          id="unicorn-body"
          fill={getFill("unicorn-body")}
          onClick={onFill}
        >
          <ellipse cx="400" cy="400" rx="220" ry="140" {...common} />
        </FillPart>

        <FillPart
          id="unicorn-head"
          fill={getFill("unicorn-head")}
          onClick={onFill}
        >
          <circle cx="590" cy="280" r="115" {...common} />
        </FillPart>

        <FillPart
          id="unicorn-horn"
          fill={getFill("unicorn-horn")}
          onClick={onFill}
        >
          <path d="M600 175 L650 50 L680 190 Z" {...common} />
        </FillPart>

        <FillPart
          id="unicorn-wing"
          fill={getFill("unicorn-wing")}
          onClick={onFill}
        >
          <path d="M390 330 Q300 170 210 300 Q280 360 390 390 Z" {...common} />
        </FillPart>

        <FillPart
          id="unicorn-leg1"
          fill={getFill("unicorn-leg1")}
          onClick={onFill}
        >
          <rect x="300" y="500" width="55" height="140" rx="25" {...common} />
        </FillPart>

        <FillPart
          id="unicorn-leg2"
          fill={getFill("unicorn-leg2")}
          onClick={onFill}
        >
          <rect x="440" y="500" width="55" height="140" rx="25" {...common} />
        </FillPart>

        <circle cx="625" cy="270" r="10" fill="#172033" />

        <path
          d="M680 300 Q750 330 700 380"
          fill="none"
          stroke="#172033"
          strokeWidth="7"
        />
      </>
    );
  }

  /* ================= CAR ================= */

  if (page === "car") {
    return (
      <>
        <FillPart
          id="car-body"
          fill={getFill("car-body")}
          onClick={onFill}
        >
          <path
            d="M150 450 L210 320 L300 320 L350 250 L530 250 L610 320 L670 450 V510 H150 Z"
            {...common}
          />
        </FillPart>

        <FillPart
          id="car-window"
          fill={getFill("car-window")}
          onClick={onFill}
        >
          <path d="M325 315 L360 270 H500 L555 315 Z" {...common} />
        </FillPart>

        <FillPart
          id="car-wheel-left"
          fill={getFill("car-wheel-left")}
          onClick={onFill}
        >
          <circle cx="260" cy="500" r="65" {...common} />
        </FillPart>

        <FillPart
          id="car-wheel-right"
          fill={getFill("car-wheel-right")}
          onClick={onFill}
        >
          <circle cx="560" cy="500" r="65" {...common} />
        </FillPart>

        <circle cx="260" cy="500" r="25" fill="#172033" />
        <circle cx="560" cy="500" r="25" fill="#172033" />
      </>
    );
  }

  /* ================= BUS ================= */

  if (page === "bus") {
    return (
      <>
        <FillPart
          id="bus-body"
          fill={getFill("bus-body")}
          onClick={onFill}
        >
          <rect x="130" y="220" width="540" height="330" rx="35" {...common} />
        </FillPart>

        {[190, 300, 410, 520].map((x, i) => (
          <FillPart
            key={i}
            id={`bus-window-${i}`}
            fill={getFill(`bus-window-${i}`)}
            onClick={onFill}
          >
            <rect x={x} y="270" width="75" height="80" rx="8" {...common} />
          </FillPart>
        ))}

        <FillPart
          id="bus-wheel-left"
          fill={getFill("bus-wheel-left")}
          onClick={onFill}
        >
          <circle cx="250" cy="560" r="60" {...common} />
        </FillPart>

        <FillPart
          id="bus-wheel-right"
          fill={getFill("bus-wheel-right")}
          onClick={onFill}
        >
          <circle cx="550" cy="560" r="60" {...common} />
        </FillPart>
      </>
    );
  }

  /* ================= TRAIN ================= */

  if (page === "train") {
    return (
      <>
        <FillPart
          id="train-engine"
          fill={getFill("train-engine")}
          onClick={onFill}
        >
          <rect x="100" y="280" width="240" height="230" rx="15" {...common} />
        </FillPart>

        <FillPart
          id="train-coach"
          fill={getFill("train-coach")}
          onClick={onFill}
        >
          <rect x="350" y="300" width="250" height="210" rx="10" {...common} />
        </FillPart>

        {[140, 400, 500].map((x, i) => (
          <FillPart
            key={i}
            id={`train-window-${i}`}
            fill={getFill(`train-window-${i}`)}
            onClick={onFill}
          >
            <rect x={x} y="335" width="70" height="65" {...common} />
          </FillPart>
        ))}

        <circle cx="170" cy="550" r="55" {...common} />
        <circle cx="470" cy="550" r="55" {...common} />
        <circle cx="570" cy="550" r="55" {...common} />
      </>
    );
  }

  /* ================= ROCKET ================= */

  if (page === "rocket") {
    return (
      <>
        <FillPart
          id="rocket-body"
          fill={getFill("rocket-body")}
          onClick={onFill}
        >
          <path
            d="M400 80 Q520 180 510 390 L470 500 H330 L290 390 Q280 180 400 80 Z"
            {...common}
          />
        </FillPart>

        <FillPart
          id="rocket-window"
          fill={getFill("rocket-window")}
          onClick={onFill}
        >
          <circle cx="400" cy="280" r="55" {...common} />
        </FillPart>

        <FillPart
          id="rocket-left-wing"
          fill={getFill("rocket-left-wing")}
          onClick={onFill}
        >
          <path d="M300 390 L190 520 L330 470 Z" {...common} />
        </FillPart>

        <FillPart
          id="rocket-right-wing"
          fill={getFill("rocket-right-wing")}
          onClick={onFill}
        >
          <path d="M500 390 L610 520 L470 470 Z" {...common} />
        </FillPart>

        <FillPart
          id="rocket-fire"
          fill={getFill("rocket-fire")}
          onClick={onFill}
        >
          <path d="M340 500 Q400 700 460 500 Z" {...common} />
        </FillPart>
      </>
    );
  }

  /* ================= AIRPLANE ================= */

  if (page === "airplane") {
    return (
      <>
        <FillPart
          id="plane-body"
          fill={getFill("plane-body")}
          onClick={onFill}
        >
          <path
            d="M100 380 H300 L380 250 H430 L410 380 H650 Q700 380 700 420 Q700 460 650 460 H410 L430 550 H380 L300 460 H100 Z"
            {...common}
          />
        </FillPart>

        <FillPart
          id="plane-window"
          fill={getFill("plane-window")}
          onClick={onFill}
        >
          <circle cx="520" cy="420" r="25" {...common} />
        </FillPart>
      </>
    );
  }

  /* ================= BOAT ================= */

  if (page === "boat") {
    return (
      <>
        <FillPart
          id="boat-body"
          fill={getFill("boat-body")}
          onClick={onFill}
        >
          <path d="M120 440 H680 L590 570 H210 Z" {...common} />
        </FillPart>

        <FillPart
          id="boat-sail"
          fill={getFill("boat-sail")}
          onClick={onFill}
        >
          <path d="M400 120 V440 H200 Z" {...common} />
        </FillPart>

        <path d="M400 120 V500" stroke="#172033" strokeWidth="8" />

        <path
          d="M100 590 Q200 550 300 590 T500 590 T700 590"
          fill="none"
          stroke="#172033"
          strokeWidth="7"
        />
      </>
    );
  }

  /* ================= BICYCLE ================= */

  if (page === "bicycle") {
    return (
      <>
        <circle cx="220" cy="500" r="100" {...common} />
        <circle cx="580" cy="500" r="100" {...common} />

        <FillPart
          id="bike-frame"
          fill={getFill("bike-frame")}
          onClick={onFill}
        >
          <path
            d="M220 500 L340 300 L450 500 L580 500 L400 380 L340 300 L300 500"
            fill="none"
            {...outline}
          />
        </FillPart>

        <path d="M340 300 H450" stroke="#172033" strokeWidth="8" />
        <path d="M450 300 L480 260" stroke="#172033" strokeWidth="8" />
      </>
    );
  }

  /* ================= TRACTOR ================= */

  if (page === "tractor") {
    return (
      <>
        <FillPart
          id="tractor-body"
          fill={getFill("tractor-body")}
          onClick={onFill}
        >
          <rect x="220" y="330" width="300" height="170" rx="20" {...common} />
        </FillPart>

        <FillPart
          id="tractor-cabin"
          fill={getFill("tractor-cabin")}
          onClick={onFill}
        >
          <path d="M280 330 V190 H470 L520 330 Z" {...common} />
        </FillPart>

        <circle cx="280" cy="520" r="100" {...common} />
        <circle cx="560" cy="540" r="65" {...common} />
      </>
    );
  }

  /* ================= FLOWER ================= */

  if (page === "flower") {
    return (
      <>
        <FillPart
          id="flower-petal1"
          fill={getFill("flower-petal1")}
          onClick={onFill}
        >
          <circle cx="400" cy="220" r="90" {...common} />
        </FillPart>

        <FillPart
          id="flower-petal2"
          fill={getFill("flower-petal2")}
          onClick={onFill}
        >
          <circle cx="270" cy="320" r="90" {...common} />
        </FillPart>

        <FillPart
          id="flower-petal3"
          fill={getFill("flower-petal3")}
          onClick={onFill}
        >
          <circle cx="530" cy="320" r="90" {...common} />
        </FillPart>

        <FillPart
          id="flower-petal4"
          fill={getFill("flower-petal4")}
          onClick={onFill}
        >
          <circle cx="330" cy="440" r="90" {...common} />
        </FillPart>

        <FillPart
          id="flower-petal5"
          fill={getFill("flower-petal5")}
          onClick={onFill}
        >
          <circle cx="470" cy="440" r="90" {...common} />
        </FillPart>

        <FillPart
          id="flower-center"
          fill={getFill("flower-center")}
          onClick={onFill}
        >
          <circle cx="400" cy="335" r="75" {...common} />
        </FillPart>

        <FillPart
          id="flower-stem"
          fill={getFill("flower-stem")}
          onClick={onFill}
        >
          <path d="M400 410 V650" stroke="#172033" strokeWidth="30" />
        </FillPart>
      </>
    );
  }

  /* ================= BUTTERFLY ================= */

  if (page === "butterfly") {
    return (
      <>
        <FillPart
          id="butterfly-left"
          fill={getFill("butterfly-left")}
          onClick={onFill}
        >
          <ellipse cx="280" cy="340" rx="150" ry="190" {...common} />
        </FillPart>

        <FillPart
          id="butterfly-right"
          fill={getFill("butterfly-right")}
          onClick={onFill}
        >
          <ellipse cx="520" cy="340" rx="150" ry="190" {...common} />
        </FillPart>

        <FillPart
          id="butterfly-body"
          fill={getFill("butterfly-body")}
          onClick={onFill}
        >
          <ellipse cx="400" cy="370" rx="45" ry="180" {...common} />
        </FillPart>

        <circle cx="400" cy="190" r="45" {...common} />

        <path
          d="M380 160 Q320 100 280 130"
          fill="none"
          stroke="#172033"
          strokeWidth="7"
        />

        <path
          d="M420 160 Q480 100 520 130"
          fill="none"
          stroke="#172033"
          strokeWidth="7"
        />
      </>
    );
  }

  /* ================= BEE ================= */

  if (page === "bee") {
    return (
      <>
        <FillPart
          id="bee-body"
          fill={getFill("bee-body")}
          onClick={onFill}
        >
          <ellipse cx="400" cy="390" rx="170" ry="120" {...common} />
        </FillPart>

        <FillPart
          id="bee-wing-left"
          fill={getFill("bee-wing-left")}
          onClick={onFill}
        >
          <ellipse cx="280" cy="260" rx="100" ry="70" {...common} />
        </FillPart>

        <FillPart
          id="bee-wing-right"
          fill={getFill("bee-wing-right")}
          onClick={onFill}
        >
          <ellipse cx="520" cy="260" rx="100" ry="70" {...common} />
        </FillPart>

        <path d="M330 300 V480" stroke="#172033" strokeWidth="8" />
        <path d="M400 280 V500" stroke="#172033" strokeWidth="8" />
        <path d="M470 300 V480" stroke="#172033" strokeWidth="8" />

        <circle cx="350" cy="370" r="10" fill="#172033" />
        <circle cx="450" cy="370" r="10" fill="#172033" />
      </>
    );
  }

  /* ================= BIRD ================= */

  if (page === "bird") {
    return (
      <>
        <FillPart
          id="bird-body"
          fill={getFill("bird-body")}
          onClick={onFill}
        >
          <ellipse cx="400" cy="390" rx="180" ry="140" {...common} />
        </FillPart>

        <FillPart
          id="bird-wing"
          fill={getFill("bird-wing")}
          onClick={onFill}
        >
          <ellipse cx="330" cy="390" rx="110" ry="75" {...common} />
        </FillPart>

        <FillPart
          id="bird-head"
          fill={getFill("bird-head")}
          onClick={onFill}
        >
          <circle cx="540" cy="280" r="100" {...common} />
        </FillPart>

        <FillPart
          id="bird-beak"
          fill={getFill("bird-beak")}
          onClick={onFill}
        >
          <path d="M620 290 L700 330 L620 360 Z" {...common} />
        </FillPart>

        <circle cx="565" cy="270" r="12" fill="#172033" />
      </>
    );
  }

  /* ================= CAT ================= */

  if (page === "cat") {
    return (
      <>
        <FillPart
          id="cat-head"
          fill={getFill("cat-head")}
          onClick={onFill}
        >
          <path d="M260 300 L280 130 L390 210 L510 130 L540 300 Q540 480 400 500 Q260 480 260 300 Z" {...common} />
        </FillPart>

        <FillPart
          id="cat-body"
          fill={getFill("cat-body")}
          onClick={onFill}
        >
          <ellipse cx="400" cy="560" rx="150" ry="110" {...common} />
        </FillPart>

        <circle cx="340" cy="320" r="12" fill="#172033" />
        <circle cx="460" cy="320" r="12" fill="#172033" />

        <path
          d="M370 390 Q400 410 430 390"
          fill="none"
          stroke="#172033"
          strokeWidth="7"
        />

        <path d="M260 390 H160" stroke="#172033" strokeWidth="6" />
        <path d="M260 420 H160" stroke="#172033" strokeWidth="6" />
        <path d="M540 390 H640" stroke="#172033" strokeWidth="6" />
        <path d="M540 420 H640" stroke="#172033" strokeWidth="6" />
      </>
    );
  }

  /* ================= DOG ================= */

  if (page === "dog") {
    return (
      <>
        <FillPart
          id="dog-head"
          fill={getFill("dog-head")}
          onClick={onFill}
        >
          <circle cx="400" cy="300" r="170" {...common} />
        </FillPart>

        <FillPart
          id="dog-body"
          fill={getFill("dog-body")}
          onClick={onFill}
        >
          <ellipse cx="400" cy="550" rx="170" ry="120" {...common} />
        </FillPart>

        <FillPart
          id="dog-ear-left"
          fill={getFill("dog-ear-left")}
          onClick={onFill}
        >
          <ellipse cx="250" cy="300" rx="80" ry="150" {...common} />
        </FillPart>

        <FillPart
          id="dog-ear-right"
          fill={getFill("dog-ear-right")}
          onClick={onFill}
        >
          <ellipse cx="550" cy="300" rx="80" ry="150" {...common} />
        </FillPart>

        <circle cx="345" cy="290" r="12" fill="#172033" />
        <circle cx="455" cy="290" r="12" fill="#172033" />

        <ellipse cx="400" cy="370" rx="45" ry="35" fill="#172033" />
      </>
    );
  }

  /* ================= RABBIT ================= */

  if (page === "rabbit") {
    return (
      <>
        <FillPart
          id="rabbit-head"
          fill={getFill("rabbit-head")}
          onClick={onFill}
        >
          <circle cx="400" cy="400" r="150" {...common} />
        </FillPart>

        <FillPart
          id="rabbit-ear-left"
          fill={getFill("rabbit-ear-left")}
          onClick={onFill}
        >
          <ellipse cx="320" cy="180" rx="55" ry="160" {...common} />
        </FillPart>

        <FillPart
          id="rabbit-ear-right"
          fill={getFill("rabbit-ear-right")}
          onClick={onFill}
        >
          <ellipse cx="480" cy="180" rx="55" ry="160" {...common} />
        </FillPart>

        <FillPart
          id="rabbit-body"
          fill={getFill("rabbit-body")}
          onClick={onFill}
        >
          <ellipse cx="400" cy="590" rx="130" ry="100" {...common} />
        </FillPart>

        <circle cx="350" cy="390" r="12" fill="#172033" />
        <circle cx="450" cy="390" r="12" fill="#172033" />
      </>
    );
  }

  /* ================= LION ================= */

  if (page === "lion") {
    return (
      <>
        <FillPart
          id="lion-mane"
          fill={getFill("lion-mane")}
          onClick={onFill}
        >
          <circle cx="400" cy="380" r="220" {...common} />
        </FillPart>

        <FillPart
          id="lion-face"
          fill={getFill("lion-face")}
          onClick={onFill}
        >
          <circle cx="400" cy="380" r="140" {...common} />
        </FillPart>

        <circle cx="350" cy="350" r="12" fill="#172033" />
        <circle cx="450" cy="350" r="12" fill="#172033" />

        <ellipse cx="400" cy="420" rx="40" ry="30" fill="#172033" />

        <path
          d="M350 460 Q400 500 450 460"
          fill="none"
          stroke="#172033"
          strokeWidth="7"
        />
      </>
    );
  }

  /* ================= ELEPHANT ================= */

  if (page === "elephant") {
    return (
      <>
        <FillPart
          id="elephant-body"
          fill={getFill("elephant-body")}
          onClick={onFill}
        >
          <ellipse cx="400" cy="420" rx="220" ry="150" {...common} />
        </FillPart>

        <FillPart
          id="elephant-head"
          fill={getFill("elephant-head")}
          onClick={onFill}
        >
          <circle cx="560" cy="300" r="120" {...common} />
        </FillPart>

        <FillPart
          id="elephant-ear"
          fill={getFill("elephant-ear")}
          onClick={onFill}
        >
          <ellipse cx="500" cy="320" rx="100" ry="130" {...common} />
        </FillPart>

        <FillPart
          id="elephant-trunk"
          fill={getFill("elephant-trunk")}
          onClick={onFill}
        >
          <path
            d="M640 350 Q720 400 650 520 Q620 550 590 520"
            fill="none"
            {...outline}
          />
        </FillPart>

        <circle cx="590" cy="280" r="12" fill="#172033" />
      </>
    );
  }

  /* ================= MONKEY ================= */

  if (page === "monkey") {
    return (
      <>
        <FillPart
          id="monkey-head"
          fill={getFill("monkey-head")}
          onClick={onFill}
        >
          <circle cx="400" cy="330" r="160" {...common} />
        </FillPart>

        <FillPart
          id="monkey-face"
          fill={getFill("monkey-face")}
          onClick={onFill}
        >
          <ellipse cx="400" cy="360" rx="100" ry="80" {...common} />
        </FillPart>

        <circle cx="250" cy="330" r="65" {...common} />
        <circle cx="550" cy="330" r="65" {...common} />

        <FillPart
          id="monkey-body"
          fill={getFill("monkey-body")}
          onClick={onFill}
        >
          <ellipse cx="400" cy="570" rx="140" ry="110" {...common} />
        </FillPart>

        <circle cx="350" cy="300" r="12" fill="#172033" />
        <circle cx="450" cy="300" r="12" fill="#172033" />
      </>
    );
  }

  /* ================= PANDA ================= */

  if (page === "panda") {
    return (
      <>
        <FillPart
          id="panda-head"
          fill={getFill("panda-head")}
          onClick={onFill}
        >
          <circle cx="400" cy="320" r="170" {...common} />
        </FillPart>

        <FillPart
          id="panda-body"
          fill={getFill("panda-body")}
          onClick={onFill}
        >
          <ellipse cx="400" cy="560" rx="150" ry="120" {...common} />
        </FillPart>

        <circle cx="300" cy="210" r="60" {...common} />
        <circle cx="500" cy="210" r="60" {...common} />

        <ellipse
          cx="345"
          cy="320"
          rx="45"
          ry="65"
          fill="#FFFFFF"
          stroke="#172033"
          strokeWidth="7"
          transform="rotate(-25 345 320)"
        />

        <ellipse
          cx="455"
          cy="320"
          rx="45"
          ry="65"
          fill="#FFFFFF"
          stroke="#172033"
          strokeWidth="7"
          transform="rotate(25 455 320)"
        />

        <circle cx="350" cy="320" r="10" fill="#172033" />
        <circle cx="450" cy="320" r="10" fill="#172033" />
      </>
    );
  }

  /* ================= BEAR ================= */

  if (page === "bear") {
    return (
      <>
        <FillPart
          id="bear-head"
          fill={getFill("bear-head")}
          onClick={onFill}
        >
          <circle cx="400" cy="320" r="170" {...common} />
        </FillPart>

        <FillPart
          id="bear-body"
          fill={getFill("bear-body")}
          onClick={onFill}
        >
          <ellipse cx="400" cy="570" rx="150" ry="120" {...common} />
        </FillPart>

        <circle cx="270" cy="200" r="70" {...common} />
        <circle cx="530" cy="200" r="70" {...common} />

        <circle cx="350" cy="320" r="12" fill="#172033" />
        <circle cx="450" cy="320" r="12" fill="#172033" />
        <ellipse cx="400" cy="390" rx="45" ry="30" fill="#172033" />
      </>
    );
  }

  /* ================= DINOSAUR ================= */

  if (page === "dinosaur") {
    return (
      <>
        <FillPart
          id="dino-body"
          fill={getFill("dino-body")}
          onClick={onFill}
        >
          <ellipse cx="390" cy="420" rx="220" ry="130" {...common} />
        </FillPart>

        <FillPart
          id="dino-head"
          fill={getFill("dino-head")}
          onClick={onFill}
        >
          <circle cx="590" cy="300" r="120" {...common} />
        </FillPart>

        <FillPart
          id="dino-tail"
          fill={getFill("dino-tail")}
          onClick={onFill}
        >
          <path d="M220 390 L60 250 L250 470 Z" {...common} />
        </FillPart>

        <FillPart
          id="dino-leg1"
          fill={getFill("dino-leg1")}
          onClick={onFill}
        >
          <rect x="300" y="500" width="60" height="150" rx="20" {...common} />
        </FillPart>

        <FillPart
          id="dino-leg2"
          fill={getFill("dino-leg2")}
          onClick={onFill}
        >
          <rect x="450" y="500" width="60" height="150" rx="20" {...common} />
        </FillPart>

        <circle cx="620" cy="275" r="12" fill="#172033" />
      </>
    );
  }

  /* ================= TURTLE ================= */

  if (page === "turtle") {
    return (
      <>
        <FillPart
          id="turtle-shell"
          fill={getFill("turtle-shell")}
          onClick={onFill}
        >
          <ellipse cx="400" cy="400" rx="220" ry="150" {...common} />
        </FillPart>

        <FillPart
          id="turtle-head"
          fill={getFill("turtle-head")}
          onClick={onFill}
        >
          <circle cx="640" cy="390" r="80" {...common} />
        </FillPart>

        {[
          [240, 300],
          [240, 500],
          [500, 300],
          [500, 500],
        ].map(([cx, cy], i) => (
          <FillPart
            key={i}
            id={`turtle-leg-${i}`}
            fill={getFill(`turtle-leg-${i}`)}
            onClick={onFill}
          >
            <ellipse cx={cx} cy={cy} rx="70" ry="45" {...common} />
          </FillPart>
        ))}

        <circle cx="665" cy="375" r="10" fill="#172033" />

        <path
          d="M250 400 H550 M330 290 V510 M470 290 V510"
          fill="none"
          stroke="#172033"
          strokeWidth="6"
        />
      </>
    );
  }

  /* ================= FROG ================= */

  if (page === "frog") {
    return (
      <>
        <FillPart
          id="frog-body"
          fill={getFill("frog-body")}
          onClick={onFill}
        >
          <ellipse cx="400" cy="450" rx="200" ry="150" {...common} />
        </FillPart>

        <FillPart
          id="frog-eye-left"
          fill={getFill("frog-eye-left")}
          onClick={onFill}
        >
          <circle cx="300" cy="260" r="70" {...common} />
        </FillPart>

        <FillPart
          id="frog-eye-right"
          fill={getFill("frog-eye-right")}
          onClick={onFill}
        >
          <circle cx="500" cy="260" r="70" {...common} />
        </FillPart>

        <circle cx="300" cy="260" r="12" fill="#172033" />
        <circle cx="500" cy="260" r="12" fill="#172033" />

        <path
          d="M280 460 Q400 550 520 460"
          fill="none"
          stroke="#172033"
          strokeWidth="8"
        />
      </>
    );
  }

  /* ================= PENGUIN ================= */

  if (page === "penguin") {
    return (
      <>
        <FillPart
          id="penguin-body"
          fill={getFill("penguin-body")}
          onClick={onFill}
        >
          <ellipse cx="400" cy="420" rx="180" ry="250" {...common} />
        </FillPart>

        <FillPart
          id="penguin-belly"
          fill={getFill("penguin-belly")}
          onClick={onFill}
        >
          <ellipse cx="400" cy="470" rx="110" ry="170" {...common} />
        </FillPart>

        <FillPart
          id="penguin-beak"
          fill={getFill("penguin-beak")}
          onClick={onFill}
        >
          <path d="M360 310 L400 350 L440 310 L400 390 Z" {...common} />
        </FillPart>

        <circle cx="350" cy="280" r="12" fill="#172033" />
        <circle cx="450" cy="280" r="12" fill="#172033" />
      </>
    );
  }

  /* ================= RAINBOW ================= */

  if (page === "rainbow") {
    const colors = [
      ["rainbow-red", "#FFFFFF", "M120 520 A280 280 0 0 1 680 520"],
      ["rainbow-orange", "#FFFFFF", "M160 520 A240 240 0 0 1 640 520"],
      ["rainbow-yellow", "#FFFFFF", "M200 520 A200 200 0 0 1 600 520"],
      ["rainbow-green", "#FFFFFF", "M240 520 A160 160 0 0 1 560 520"],
      ["rainbow-blue", "#FFFFFF", "M280 520 A120 120 0 0 1 520 520"],
    ];

    return (
      <>
        {colors.map(([id, defaultColor, d]) => (
          <FillPart
            key={id}
            id={id}
            fill={getFill(id) || defaultColor}
            onClick={onFill}
          >
            <path
              d={d}
              fill="none"
              stroke={getFill(id) || defaultColor}
              strokeWidth="45"
            />
          </FillPart>
        ))}

        <FillPart
          id="rainbow-cloud-left"
          fill={getFill("rainbow-cloud-left")}
          onClick={onFill}
        >
          <circle cx="130" cy="540" r="70" {...common} />
        </FillPart>

        <FillPart
          id="rainbow-cloud-right"
          fill={getFill("rainbow-cloud-right")}
          onClick={onFill}
        >
          <circle cx="670" cy="540" r="70" {...common} />
        </FillPart>
      </>
    );
  }

  /* ================= CLOUD ================= */

  if (page === "cloud") {
    return (
      <>
        <FillPart
          id="cloud-main"
          fill={getFill("cloud-main")}
          onClick={onFill}
        >
          <path
            d="M180 480 Q150 350 280 330 Q330 180 450 270 Q560 220 590 350 Q700 350 680 480 Z"
            {...common}
          />
        </FillPart>
      </>
    );
  }

  /* ================= MOON ================= */

  if (page === "moon") {
    return (
      <>
        <FillPart
          id="moon-body"
          fill={getFill("moon-body")}
          onClick={onFill}
        >
          <path
            d="M500 130 Q300 180 300 390 Q300 570 500 620 Q360 520 400 360 Q430 220 500 130 Z"
            {...common}
          />
        </FillPart>

        <circle cx="380" cy="300" r="15" fill="#172033" />
        <circle cx="350" cy="430" r="12" fill="#172033" />
      </>
    );
  }

  /* ================= STAR ================= */

  if (page === "star") {
    return (
      <>
        <FillPart
          id="star-body"
          fill={getFill("star-body")}
          onClick={onFill}
        >
          <path
            d="M400 80 L470 290 L690 290 L510 420 L580 640 L400 510 L220 640 L290 420 L110 290 L330 290 Z"
            {...common}
          />
        </FillPart>
      </>
    );
  }

  /* ================= CASTLE ================= */

  if (page === "castle") {
    return (
      <>
        <FillPart
          id="castle-main"
          fill={getFill("castle-main")}
          onClick={onFill}
        >
          <rect x="230" y="300" width="340" height="300" {...common} />
        </FillPart>

        <FillPart
          id="castle-left"
          fill={getFill("castle-left")}
          onClick={onFill}
        >
          <rect x="120" y="240" width="120" height="360" {...common} />
        </FillPart>

        <FillPart
          id="castle-right"
          fill={getFill("castle-right")}
          onClick={onFill}
        >
          <rect x="560" y="240" width="120" height="360" {...common} />
        </FillPart>

        <path d="M120 240 L180 150 L240 240 Z" {...common} />
        <path d="M560 240 L620 150 L680 240 Z" {...common} />

        <FillPart
          id="castle-door"
          fill={getFill("castle-door")}
          onClick={onFill}
        >
          <path d="M350 600 V470 Q400 400 450 470 V600 Z" {...common} />
        </FillPart>

        <circle cx="400" cy="230" r="12" fill="#172033" />
        <path d="M400 150 V80" stroke="#172033" strokeWidth="7" />
      </>
    );
  }

  /* ================= ROBOT ================= */

  if (page === "robot") {
    return (
      <>
        <FillPart
          id="robot-head"
          fill={getFill("robot-head")}
          onClick={onFill}
        >
          <rect x="260" y="150" width="280" height="220" rx="30" {...common} />
        </FillPart>

        <FillPart
          id="robot-body"
          fill={getFill("robot-body")}
          onClick={onFill}
        >
          <rect x="240" y="400" width="320" height="220" rx="25" {...common} />
        </FillPart>

        <FillPart
          id="robot-eye-left"
          fill={getFill("robot-eye-left")}
          onClick={onFill}
        >
          <circle cx="340" cy="250" r="35" {...common} />
        </FillPart>

        <FillPart
          id="robot-eye-right"
          fill={getFill("robot-eye-right")}
          onClick={onFill}
        >
          <circle cx="460" cy="250" r="35" {...common} />
        </FillPart>

        <path d="M400 150 V90" stroke="#172033" strokeWidth="8" />
        <circle cx="400" cy="70" r="20" {...common} />

        <path d="M240 450 L130 400" stroke="#172033" strokeWidth="15" />
        <path d="M560 450 L670 400" stroke="#172033" strokeWidth="15" />
      </>
    );
  }

  /* ================= ICE CREAM ================= */

  if (page === "icecream") {
    return (
      <>
        <FillPart
          id="icecream-scoop"
          fill={getFill("icecream-scoop")}
          onClick={onFill}
        >
          <circle cx="400" cy="250" r="130" {...common} />
        </FillPart>

        <FillPart
          id="icecream-cone"
          fill={getFill("icecream-cone")}
          onClick={onFill}
        >
          <path d="M290 330 L510 330 L400 650 Z" {...common} />
        </FillPart>

        <path
          d="M330 420 L470 540 M470 420 L330 540"
          stroke="#172033"
          strokeWidth="5"
        />
      </>
    );
  }

  /* ================= APPLE ================= */

  if (page === "apple") {
    return (
      <>
        <FillPart
          id="apple-body"
          fill={getFill("apple-body")}
          onClick={onFill}
        >
          <path
            d="M400 220 Q280 150 190 280 Q120 500 300 600 Q400 650 400 650 Q400 650 500 600 Q680 500 610 280 Q520 150 400 220 Z"
            {...common}
          />
        </FillPart>

        <FillPart
          id="apple-leaf"
          fill={getFill("apple-leaf")}
          onClick={onFill}
        >
          <path d="M410 190 Q500 90 590 150 Q500 230 410 210 Z" {...common} />
        </FillPart>

        <path d="M400 220 V130" stroke="#172033" strokeWidth="10" />
      </>
    );
  }

  /* Default */
  return (
    <text
      x="400"
      y="400"
      textAnchor="middle"
      fontSize="80"
      fill="#172033"
    >
      🎨
    </text>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

const DrawingStudio: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const [selectedPage, setSelectedPage] = useState("house");

  const [tool, setTool] = useState<Tool>("fill");

  const [selectedColor, setSelectedColor] = useState("#FF3B30");

  const [customColor, setCustomColor] = useState("#FF9500");

  const [brushSize, setBrushSize] = useState(12);

  const [showAllPages, setShowAllPages] = useState(false);

  const [fills, setFills] = useState<Record<string, string>>({});

  const [brushPaths, setBrushPaths] = useState<string[]>([]);

  const [stickers, setStickers] = useState<Sticker[]>([]);

  const [activeSticker, setActiveSticker] = useState<number | null>(null);

  const [history, setHistory] = useState<HistoryState[]>([]);

  const [future, setFuture] = useState<HistoryState[]>([]);

  const [isDrawing, setIsDrawing] = useState(false);

  const [currentPath, setCurrentPath] = useState("");

  const [draggingSticker, setDraggingSticker] = useState<number | null>(null);

  const [message, setMessage] = useState("");

  /* =========================================================
     CURRENT STATE SNAPSHOT
  ========================================================= */

  const snapshot = useCallback((): HistoryState => {
    return {
      fills: { ...fills },
      brushPaths: [...brushPaths],
      stickers: [...stickers],
    };
  }, [fills, brushPaths, stickers]);

  /* =========================================================
     PUSH HISTORY
  ========================================================= */

  const pushHistory = useCallback(() => {
    setHistory((prev) => [...prev.slice(-30), snapshot()]);
    setFuture([]);
  }, [snapshot]);

  /* =========================================================
     RESET PAGE
  ========================================================= */

  const resetPage = useCallback(() => {
    setFills({});
    setBrushPaths([]);
    setStickers([]);
    setHistory([]);
    setFuture([]);
    setCurrentPath("");
  }, []);

  /* =========================================================
     CHANGE COLORING PAGE
  ========================================================= */

  const changePage = (id: string) => {
    setSelectedPage(id);
    resetPage();
    setTool("fill");

    showMessage(
      `${COLORING_PAGES.find((p) => p.id === id)?.name || "Page"} ready! 🎨`
    );
  };

  /* =========================================================
     FILL
  ========================================================= */

  const handleFill = (id: string) => {
    if (tool !== "fill") return;

    pushHistory();

    setFills((prev) => ({
      ...prev,
      [id]: selectedColor,
    }));

    showMessage("Great coloring! 🎨");
  };

  /* =========================================================
     SVG POINTER POSITION
  ========================================================= */

  const getSvgPoint = (
    event: React.PointerEvent<SVGSVGElement>
  ): { x: number; y: number } => {
    const svg = svgRef.current;

    if (!svg) {
      return { x: 0, y: 0 };
    }

    const rect = svg.getBoundingClientRect();

    return {
      x: ((event.clientX - rect.left) / rect.width) * 800,
      y: ((event.clientY - rect.top) / rect.height) * 700,
    };
  };

  /* =========================================================
     BRUSH START
  ========================================================= */

  const handlePointerDown = (
    event: React.PointerEvent<SVGSVGElement>
  ) => {
    if (tool !== "brush" && tool !== "eraser") return;

    event.currentTarget.setPointerCapture(event.pointerId);

    const point = getSvgPoint(event);

    pushHistory();

    setIsDrawing(true);

    setCurrentPath(`M ${point.x} ${point.y}`);
  };

  /* =========================================================
     BRUSH MOVE
  ========================================================= */

  const handlePointerMove = (
    event: React.PointerEvent<SVGSVGElement>
  ) => {
    if (!isDrawing) return;

    if (tool !== "brush" && tool !== "eraser") return;

    const point = getSvgPoint(event);

    setCurrentPath(
      (prev) => `${prev} L ${point.x} ${point.y}`
    );
  };

  /* =========================================================
     BRUSH END
  ========================================================= */

  const handlePointerUp = () => {
    if (!isDrawing) return;

    if (currentPath) {
      setBrushPaths((prev) => [...prev, currentPath]);
    }

    setCurrentPath("");

    setIsDrawing(false);
  };

  /* =========================================================
     UNDO
  ========================================================= */

  const undo = () => {
    if (history.length === 0) return;

    const previous = history[history.length - 1];

    setFuture((prev) => [
      ...prev,
      snapshot(),
    ]);

    setFills(previous.fills);
    setBrushPaths(previous.brushPaths);
    setStickers(previous.stickers);

    setHistory((prev) => prev.slice(0, -1));
  };

  /* =========================================================
     REDO
  ========================================================= */

  const redo = () => {
    if (future.length === 0) return;

    const next = future[future.length - 1];

    setHistory((prev) => [
      ...prev,
      snapshot(),
    ]);

    setFills(next.fills);
    setBrushPaths(next.brushPaths);
    setStickers(next.stickers);

    setFuture((prev) => prev.slice(0, -1));
  };

  /* =========================================================
     ADD STICKER
  ========================================================= */

  const addSticker = (emoji: string) => {
    pushHistory();

    const newSticker: Sticker = {
      id: Date.now(),
      emoji,
      x: 400,
      y: 150,
      size: 55,
    };

    setStickers((prev) => [
      ...prev,
      newSticker,
    ]);

    setActiveSticker(newSticker.id);

    showMessage("Sticker added! ⭐ Drag it anywhere.");
  };

  /* =========================================================
     DELETE STICKER
  ========================================================= */

  const deleteSticker = () => {
    if (activeSticker === null) return;

    pushHistory();

    setStickers((prev) =>
      prev.filter((s) => s.id !== activeSticker)
    );

    setActiveSticker(null);
  };

  /* =========================================================
     STICKER DRAG
  ========================================================= */

  const handleStickerPointerDown = (
    event: React.PointerEvent,
    id: number
  ) => {
    event.stopPropagation();

    setDraggingSticker(id);
    setActiveSticker(id);

    (event.currentTarget as SVGElement).setPointerCapture(
      event.pointerId
    );
  };

  const handleStickerPointerMove = (
    event: React.PointerEvent
  ) => {
    if (draggingSticker === null) return;

    const svg = svgRef.current;

    if (!svg) return;

    const rect = svg.getBoundingClientRect();

    const x =
      ((event.clientX - rect.left) / rect.width) *
      800;

    const y =
      ((event.clientY - rect.top) / rect.height) *
      700;

    setStickers((prev) =>
      prev.map((sticker) =>
        sticker.id === draggingSticker
          ? {
              ...sticker,
              x: Math.max(
                30,
                Math.min(770, x)
              ),
              y: Math.max(
                30,
                Math.min(670, y)
              ),
            }
          : sticker
      )
    );
  };

  const handleStickerPointerUp = () => {
    setDraggingSticker(null);
  };

  /* =========================================================
     SAVE LOCAL
  ========================================================= */

  const saveDrawing = () => {
    const data = {
      page: selectedPage,
      fills,
      brushPaths,
      stickers,
      savedAt: new Date().toISOString(),
    };

    localStorage.setItem(
      "kids-drawing-studio",
      JSON.stringify(data)
    );

    showMessage("Drawing saved successfully! 💾");
  };

  /* =========================================================
     LOAD LOCAL
  ========================================================= */

  const loadDrawing = () => {
    const saved = localStorage.getItem(
      "kids-drawing-studio"
    );

    if (!saved) {
      showMessage("No saved drawing found.");
      return;
    }

    try {
      const data = JSON.parse(saved);

      setSelectedPage(data.page || "house");
      setFills(data.fills || {});
      setBrushPaths(data.brushPaths || []);
      setStickers(data.stickers || []);

      showMessage("Saved drawing loaded! 🎨");
    } catch {
      showMessage("Could not load drawing.");
    }
  };

  /* =========================================================
     DOWNLOAD SVG / PNG
  ========================================================= */

  const downloadPNG = async () => {
    const svg = svgRef.current;

    if (!svg) return;

    const clonedSvg = svg.cloneNode(true) as SVGSVGElement;

    clonedSvg.setAttribute(
      "xmlns",
      "http://www.w3.org/2000/svg"
    );

    clonedSvg.setAttribute(
      "width",
      "800"
    );

    clonedSvg.setAttribute(
      "height",
      "700"
    );

    clonedSvg.style.background = "#ffffff";

    const serializer = new XMLSerializer();

    const svgString =
      serializer.serializeToString(clonedSvg);

    const blob = new Blob(
      [svgString],
      {
        type: "image/svg+xml;charset=utf-8",
      }
    );

    const url = URL.createObjectURL(blob);

    const img = new Image();

    img.onload = () => {
      const canvas =
        document.createElement("canvas");

      canvas.width = 1600;
      canvas.height = 1400;

      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      ctx.fillStyle = "#ffffff";

      ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
      );

      ctx.drawImage(
        img,
        0,
        0,
        canvas.width,
        canvas.height
      );

      URL.revokeObjectURL(url);

      const pngUrl =
        canvas.toDataURL("image/png");

      const link =
        document.createElement("a");

      link.href = pngUrl;

      link.download =
        `kids-coloring-${selectedPage}.png`;

      link.click();

      showMessage(
        "PNG downloaded! 📥"
      );
    };

    img.src = url;
  };

  /* =========================================================
     CLEAR
  ========================================================= */

  const clearDrawing = () => {
    pushHistory();

    setFills({});
    setBrushPaths([]);
    setStickers([]);
    setActiveSticker(null);

    showMessage("Canvas cleared! 🧹");
  };

  /* =========================================================
     MESSAGE
  ========================================================= */

  const showMessage = (text: string) => {
    setMessage(text);

    window.setTimeout(() => {
      setMessage("");
    }, 2200);
  };

  /* =========================================================
     CURRENT PAGE
  ========================================================= */

  const currentPage = useMemo(
    () =>
      COLORING_PAGES.find(
        (p) => p.id === selectedPage
      ),
    [selectedPage]
  );

  /* =========================================================
     KEYBOARD SHORTCUTS
  ========================================================= */

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "z"
      ) {
        event.preventDefault();

        if (event.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
    };

    window.addEventListener(
      "keydown",
      handler
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handler
      );
  });

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="min-h-screen bg-slate-100 p-3 md:p-6">
      <div className="max-w-[1500px] mx-auto">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="
          bg-white
          rounded-3xl
          shadow-sm
          border
          border-slate-200
          p-4
          md:p-6
          mb-5
        ">
          <div className="
            flex
            flex-col
            md:flex-row
            md:items-center
            md:justify-between
            gap-4
          ">

            <div>
              <div className="
                flex
                items-center
                gap-3
              ">
                <div className="
                  w-12
                  h-12
                  rounded-2xl
                  bg-gradient-to-br
                  from-violet-500
                  to-blue-500
                  flex
                  items-center
                  justify-center
                  text-white
                ">
                  <Palette size={26} />
                </div>

                <div>
                  <h1 className="
                    text-xl
                    md:text-2xl
                    font-extrabold
                    text-slate-800
                  ">
                    Kids Drawing Studio
                  </h1>

                  <p className="
                    text-sm
                    text-slate-500
                  ">
                    Color • Draw • Decorate • Have Fun 🎨
                  </p>
                </div>
              </div>
            </div>

            <div className="
              flex
              flex-wrap
              gap-2
            ">

              <button
                onClick={undo}
                disabled={history.length === 0}
                className="
                  flex
                  items-center
                  gap-2
                  px-4
                  py-2.5
                  rounded-xl
                  bg-slate-100
                  text-slate-700
                  font-semibold
                  disabled:opacity-40
                "
              >
                <Undo2 size={18} />
                Undo
              </button>

              <button
                onClick={redo}
                disabled={future.length === 0}
                className="
                  flex
                  items-center
                  gap-2
                  px-4
                  py-2.5
                  rounded-xl
                  bg-slate-100
                  text-slate-700
                  font-semibold
                  disabled:opacity-40
                "
              >
                <Redo2 size={18} />
                Redo
              </button>

              <button
                onClick={saveDrawing}
                className="
                  flex
                  items-center
                  gap-2
                  px-4
                  py-2.5
                  rounded-xl
                  bg-green-500
                  text-white
                  font-semibold
                  hover:bg-green-600
                "
              >
                <Save size={18} />
                Save
              </button>

              <button
                onClick={downloadPNG}
                className="
                  flex
                  items-center
                  gap-2
                  px-4
                  py-2.5
                  rounded-xl
                  bg-blue-500
                  text-white
                  font-semibold
                  hover:bg-blue-600
                "
              >
                <Download size={18} />
                PNG
              </button>

            </div>
          </div>
        </div>

        {/* =================================================
            MAIN
        ================================================= */}

        <div className="
          grid
          xl:grid-cols-[320px_1fr]
          gap-5
        ">

          {/* =================================================
              LEFT PANEL
          ================================================= */}

          <aside className="
            bg-white
            rounded-3xl
            shadow-sm
            border
            border-slate-200
            p-4
            h-fit
          ">

            {/* TOOL */}
            <div className="mb-6">

              <h2 className="
                font-bold
                text-lg
                text-slate-800
                mb-3
              ">
                🛠️ Tools
              </h2>

              <div className="
                grid
                grid-cols-3
                gap-2
              ">

                <button
                  onClick={() => setTool("fill")}
                  className={`
                    p-3
                    rounded-xl
                    flex
                    flex-col
                    items-center
                    gap-1
                    text-xs
                    font-bold
                    ${
                      tool === "fill"
                        ? "bg-blue-500 text-white"
                        : "bg-slate-100 text-slate-700"
                    }
                  `}
                >
                  <PaintBucket size={21} />
                  Fill
                </button>

                <button
                  onClick={() => setTool("brush")}
                  className={`
                    p-3
                    rounded-xl
                    flex
                    flex-col
                    items-center
                    gap-1
                    text-xs
                    font-bold
                    ${
                      tool === "brush"
                        ? "bg-blue-500 text-white"
                        : "bg-slate-100 text-slate-700"
                    }
                  `}
                >
                  <Brush size={21} />
                  Brush
                </button>

                <button
                  onClick={() => setTool("eraser")}
                  className={`
                    p-3
                    rounded-xl
                    flex
                    flex-col
                    items-center
                    gap-1
                    text-xs
                    font-bold
                    ${
                      tool === "eraser"
                        ? "bg-pink-500 text-white"
                        : "bg-slate-100 text-slate-700"
                    }
                  `}
                >
                  <Eraser size={21} />
                  Eraser
                </button>

              </div>
            </div>

            {/* COLORS */}

            <div className="mb-6">

              <h2 className="
                font-bold
                text-lg
                text-slate-800
                mb-3
              ">
                🎨 Colors
              </h2>

              <div className="
                grid
                grid-cols-6
                gap-2
              ">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() =>
                      setSelectedColor(color)
                    }
                    className={`
                      w-9
                      h-9
                      rounded-full
                      border-2
                      ${
                        selectedColor === color
                          ? "border-slate-900 scale-110"
                          : "border-white"
                      }
                      shadow
                      transition
                    `}
                    style={{
                      backgroundColor: color,
                    }}
                    aria-label={`Color ${color}`}
                  />
                ))}
              </div>

              <div className="mt-4">

                <label className="
                  block
                  text-sm
                  font-semibold
                  text-slate-700
                  mb-2
                ">
                  Custom Color
                </label>

                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => {
                    setCustomColor(
                      e.target.value
                    );
                    setSelectedColor(
                      e.target.value
                    );
                  }}
                  className="
                    w-full
                    h-10
                    rounded-xl
                    cursor-pointer
                  "
                />

              </div>
            </div>

            {/* BRUSH SIZE */}

            <div className="mb-6">

              <div className="
                flex
                justify-between
                mb-2
              ">
                <span className="
                  font-semibold
                  text-slate-700
                ">
                  Brush Size
                </span>

                <span className="
                  font-bold
                  text-blue-600
                ">
                  {brushSize}px
                </span>
              </div>

              <input
                type="range"
                min="3"
                max="35"
                value={brushSize}
                onChange={(e) =>
                  setBrushSize(
                    Number(e.target.value)
                  )
                }
                className="w-full"
              />

            </div>

            {/* COLORING PAGES */}

            <div>

              <div className="
                flex
                items-center
                justify-between
                mb-3
              ">
                <h2 className="
                  font-bold
                  text-lg
                  text-slate-800
                ">
                  🖼️ Coloring Pages
                </h2>

                <button
                  onClick={() =>
                    setShowAllPages(
                      !showAllPages
                    )
                  }
                  className="
                    text-sm
                    font-bold
                    text-blue-600
                  "
                >
                  {showAllPages
                    ? "Less"
                    : "More"}
                </button>
              </div>

              <div className="
                grid
                grid-cols-2
                gap-2
              ">

                {(showAllPages
                  ? COLORING_PAGES
                  : COLORING_PAGES.slice(
                      0,
                      8
                    )
                ).map((page) => (
                  <button
                    key={page.id}
                    onClick={() =>
                      changePage(
                        page.id
                      )
                    }
                    className={`
                      relative
                      p-3
                      rounded-2xl
                      transition
                      border-2
                      ${
                        selectedPage ===
                        page.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-transparent bg-slate-50 hover:border-blue-200"
                      }
                    `}
                  >

                    <div className="
                      text-4xl
                      mb-1
                    ">
                      {page.emoji}
                    </div>

                    <div className="
                      text-xs
                      font-bold
                      text-slate-700
                    ">
                      {page.name}
                    </div>

                    {selectedPage ===
                      page.id && (
                      <div className="
                        absolute
                        right-1
                        top-1
                        w-5
                        h-5
                        rounded-full
                        bg-blue-500
                        text-white
                        flex
                        items-center
                        justify-center
                      ">
                        <Check
                          size={13}
                        />
                      </div>
                    )}

                  </button>
                ))}

              </div>

              {!showAllPages && (
                <button
                  onClick={() =>
                    setShowAllPages(
                      true
                    )
                  }
                  className="
                    w-full
                    mt-3
                    py-3
                    rounded-xl
                    bg-blue-50
                    text-blue-600
                    font-bold
                    hover:bg-blue-100
                  "
                >
                  ➕ Show 30+ Pages
                </button>
              )}

            </div>

            {/* STICKERS */}

            <div className="mt-7">

              <h2 className="
                font-bold
                text-lg
                text-slate-800
                mb-3
              ">
                ⭐ Stickers
              </h2>

              <div className="
                grid
                grid-cols-4
                gap-2
              ">

                {STICKERS.map(
                  (emoji) => (
                    <button
                      key={emoji}
                      onClick={() =>
                        addSticker(
                          emoji
                        )
                      }
                      className="
                        h-12
                        rounded-xl
                        bg-slate-50
                        hover:bg-blue-50
                        text-2xl
                        transition
                        hover:scale-110
                      "
                    >
                      {emoji}
                    </button>
                  )
                )}

              </div>

              {activeSticker !==
                null && (
                <button
                  onClick={
                    deleteSticker
                  }
                  className="
                    w-full
                    mt-3
                    py-2.5
                    rounded-xl
                    bg-red-50
                    text-red-600
                    font-bold
                    flex
                    items-center
                    justify-center
                    gap-2
                  "
                >
                  <Trash2
                    size={17}
                  />
                  Delete Sticker
                </button>
              )}

            </div>

            {/* CLEAR */}

            <button
              onClick={clearDrawing}
              className="
                w-full
                mt-6
                py-3
                rounded-xl
                bg-red-500
                text-white
                font-bold
                flex
                items-center
                justify-center
                gap-2
                hover:bg-red-600
              "
            >
              <Trash2 size={18} />
              Clear Drawing
            </button>

          </aside>

          {/* =================================================
              CANVAS AREA
          ================================================= */}

          <main className="
            bg-slate-200
            rounded-3xl
            p-3
            md:p-6
            min-w-0
          ">

            <div className="
              flex
              items-center
              justify-between
              mb-4
            ">

              <div>
                <h2 className="
                  text-xl
                  md:text-2xl
                  font-extrabold
                  text-slate-800
                ">
                  {currentPage?.emoji}{" "}
                  {currentPage?.name}
                </h2>

                <p className="
                  text-sm
                  text-slate-500
                  mt-1
                ">
                  {tool === "fill"
                    ? "🪣 Color ke liye kisi part par click karo"
                    : tool === "brush"
                    ? "🖍️ Draw karne ke liye drag karo"
                    : "🧽 Erase karne ke liye drag karo"}
                </p>
              </div>

              <button
                onClick={loadDrawing}
                className="
                  px-4
                  py-2
                  rounded-xl
                  bg-white
                  text-slate-700
                  font-bold
                  shadow-sm
                "
              >
                Load
              </button>

            </div>

            {/* CANVAS */}

            <div className="
              bg-white
              rounded-3xl
              shadow-inner
              border-4
              border-blue-100
              overflow-hidden
              w-full
              flex
              justify-center
              items-center
            ">

              <svg
                ref={svgRef}
                viewBox="0 0 800 700"
                className={`
                  w-full
                  h-auto
                  max-h-[75vh]
                  touch-none
                  select-none
                  ${
                    tool ===
                    "fill"
                      ? "cursor-pointer"
                      : "cursor-crosshair"
                  }
                `}
                onPointerDown={
                  handlePointerDown
                }
                onPointerMove={
                  handlePointerMove
                }
                onPointerUp={
                  handlePointerUp
                }
                onPointerCancel={
                  handlePointerUp
                }
              >

                {/* WHITE BACKGROUND */}

                <rect
                  x="0"
                  y="0"
                  width="800"
                  height="700"
                  fill="white"
                />

                {/* COLORING PAGE */}

                <g
                  style={{
                    pointerEvents:
                      tool === "fill"
                        ? "auto"
                        : "none",
                  }}
                >
                  <ColoringSVG
                    page={
                      selectedPage
                    }
                    fills={fills}
                    onFill={
                      handleFill
                    }
                  />
                </g>

                {/* BRUSH PATHS */}

                {brushPaths.map(
                  (path, index) => (
                    <path
                      key={index}
                      d={path}
                      fill="none"
                      stroke={
                        tool ===
                        "eraser"
                          ? "#FFFFFF"
                          : selectedColor
                      }
                      strokeWidth={
                        tool ===
                        "eraser"
                          ? brushSize * 2
                          : brushSize
                      }
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )
                )}

                {/* CURRENT BRUSH */}

                {currentPath && (
                  <path
                    d={currentPath}
                    fill="none"
                    stroke={
                      tool ===
                      "eraser"
                        ? "#FFFFFF"
                        : selectedColor
                    }
                    strokeWidth={
                      tool === "eraser"
                        ? brushSize * 2
                        : brushSize
                    }
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {/* STICKERS */}

                {stickers.map(
                  (sticker) => (
                    <g
                      key={sticker.id}
                      transform={`
                        translate(
                          ${sticker.x}
                          ${sticker.y}
                        )
                      `}
                      onPointerDown={(
                        event
                      ) =>
                        handleStickerPointerDown(
                          event,
                          sticker.id
                        )
                      }
                      onPointerMove={
                        handleStickerPointerMove
                      }
                      onPointerUp={
                        handleStickerPointerUp
                      }
                      style={{
                        cursor:
                          "grab",
                      }}
                    >

                      {activeSticker ===
                        sticker.id && (
                        <circle
                          cx="0"
                          cy="0"
                          r={
                            sticker.size /
                              1.4
                          }
                          fill="none"
                          stroke="#3B82F6"
                          strokeWidth="3"
                          strokeDasharray="8 6"
                        />
                      )}

                      <text
                        x="0"
                        y="0"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize={
                          sticker.size
                        }
                        style={{
                          userSelect:
                            "none",
                        }}
                      >
                        {
                          sticker.emoji
                        }
                      </text>

                    </g>
                  )
                )}

              </svg>

            </div>

            {/* =================================================
                TIP
            ================================================= */}

            <div className="
              mt-4
              bg-yellow-50
              border
              border-yellow-200
              rounded-2xl
              p-4
            ">

              <div className="
                flex
                gap-3
                items-start
              ">

                <Sparkles
                  className="
                    text-yellow-500
                    flex-shrink-0
                  "
                  size={22}
                />

                <div>

                  <p className="
                    font-bold
                    text-yellow-800
                  ">
                    How to play 🎮
                  </p>

                  <p className="
                    text-sm
                    text-yellow-700
                    mt-1
                    leading-relaxed
                  ">
                    Coloring page select karo →
                    🪣 Fill Tool choose karo →
                    color select karo →
                    picture ke kisi part par
                    click karo.
                  </p>

                  <p className="
                    text-sm
                    text-yellow-700
                    mt-1
                  ">
                    ⭐ Sticker add karo aur
                    canvas par drag karke
                    kahin bhi rakho.
                  </p>

                </div>

              </div>

            </div>

          </main>

        </div>

      </div>

      {/* =================================================
          TOAST
      ================================================= */}

      {message && (
        <div className="
          fixed
          bottom-6
          left-1/2
          -translate-x-1/2
          z-50
          bg-slate-900
          text-white
          px-5
          py-3
          rounded-full
          shadow-xl
          font-semibold
          text-sm
          flex
          items-center
          gap-2
        ">
          <Sparkles
            size={17}
            className="text-yellow-400"
          />
          {message}
        </div>
      )}

    </div>
  );
};

export default DrawingStudio;