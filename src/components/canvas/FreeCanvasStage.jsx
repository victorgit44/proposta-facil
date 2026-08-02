import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Text, Image as KonvaImage, Rect, Circle, Transformer, Group } from 'react-konva';

// Hook auxiliar para carregar imagens assincronamente no Konva Canvas
function useKonvaImage(url) {
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (!url) {
      setImage(null);
      return;
    }
    const img = new window.Image();
    img.crossOrigin = 'Anonymous';
    img.src = url;
    img.onload = () => setImage(img);
    img.onerror = () => setImage(null);
  }, [url]);

  return image;
}

// Elemento do tipo Imagem no Konva
function EditableImage({ element, isSelected, onSelect, onChange }) {
  const image = useKonvaImage(element.imageUrl);
  const shapeRef = useRef();

  return (
    <KonvaImage
      ref={shapeRef}
      id={element.id}
      x={element.x}
      y={element.y}
      width={element.width || 200}
      height={element.height || 150}
      rotation={element.rotation || 0}
      opacity={element.style?.opacity ?? 1}
      image={image}
      draggable
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={(e) => {
        onChange({
          ...element,
          x: Math.round(e.target.x()),
          y: Math.round(e.target.y())
        });
      }}
      onTransformEnd={() => {
        const node = shapeRef.current;
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();
        node.scaleX(1);
        node.scaleY(1);

        onChange({
          ...element,
          x: Math.round(node.x()),
          y: Math.round(node.y()),
          width: Math.max(20, Math.round(node.width() * scaleX)),
          height: Math.max(20, Math.round(node.height() * scaleY)),
          rotation: Math.round(node.rotation())
        });
      }}
    />
  );
}

export function FreeCanvasStage({
  width = 800,
  height = 1130,
  elements = [],
  selectedId,
  onSelectElement,
  onChangeElement,
  backgroundColor = '#0a0a0f',
  zoomLevel = 100
}) {
  const stageRef = useRef();
  const transformerRef = useRef();

  // Re-ordenar elementos pelo zIndex antes de desenhar na camada
  const sortedElements = [...elements].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));

  useEffect(() => {
    if (selectedId && transformerRef.current && stageRef.current) {
      const selectedNode = stageRef.current.findOne(`#${selectedId}`);
      if (selectedNode) {
        transformerRef.current.nodes([selectedNode]);
        transformerRef.current.getLayer().batchDraw();
      } else {
        transformerRef.current.nodes([]);
      }
    } else if (transformerRef.current) {
      transformerRef.current.nodes([]);
    }
  }, [selectedId, elements]);

  const handleStageClick = (e) => {
    // Se clicou no fundo do palco ou na área vazia, desseleciona
    const clickedOnEmpty = e.target === e.target.getStage() || e.target.name() === 'background-rect';
    if (clickedOnEmpty) {
      onSelectElement(null);
    }
  };

  return (
    <div className="relative shadow-2xl rounded-lg overflow-hidden border border-[#1e1e2e]">
      <Stage
        ref={stageRef}
        width={width * (zoomLevel / 100)}
        height={height * (zoomLevel / 100)}
        scaleX={zoomLevel / 100}
        scaleY={zoomLevel / 100}
        onMouseDown={handleStageClick}
        onTouchStart={handleStageClick}
      >
        <Layer>
          {/* Fundo da Página A4 / Canvas */}
          <Rect
            name="background-rect"
            x={0}
            y={0}
            width={width}
            height={height}
            fill={backgroundColor}
          />

          {/* Grid de Linhas de Guia Sútil */}
          <Group name="background-rect" opacity={0.05}>
            {Array.from({ length: Math.ceil(height / 40) }).map((_, i) => (
              <Rect key={`h-${i}`} x={0} y={i * 40} width={width} height={1} fill="#ffffff" />
            ))}
            {Array.from({ length: Math.ceil(width / 40) }).map((_, i) => (
              <Rect key={`v-${i}`} x={i * 40} y={0} width={1} height={height} fill="#ffffff" />
            ))}
          </Group>

          {/* Elementos Soltos Posicionados por (x, y) */}
          {sortedElements.map((el) => {
            const isSelected = el.id === selectedId;

            // Elemento do tipo TEXTO
            if (el.type === 'text') {
              return (
                <Text
                  key={el.id}
                  id={el.id}
                  x={el.x}
                  y={el.y}
                  width={el.width}
                  text={el.content || 'Texto'}
                  fontSize={el.style?.fontSize || 18}
                  fontFamily={el.style?.fontFamily || 'Inter, sans-serif'}
                  fill={el.style?.fill || '#ffffff'}
                  fontStyle={el.style?.fontStyle || 'normal'}
                  align={el.style?.align || 'left'}
                  opacity={el.style?.opacity ?? 1}
                  rotation={el.rotation || 0}
                  draggable
                  onClick={() => onSelectElement(el.id)}
                  onTap={() => onSelectElement(el.id)}
                  onDragEnd={(e) => {
                    onChangeElement({
                      ...el,
                      x: Math.round(e.target.x()),
                      y: Math.round(e.target.y())
                    });
                  }}
                  onTransformEnd={(e) => {
                    const node = e.target;
                    const scaleX = node.scaleX();
                    node.scaleX(1);
                    node.scaleY(1);
                    onChangeElement({
                      ...el,
                      x: Math.round(node.x()),
                      y: Math.round(node.y()),
                      width: Math.max(50, Math.round(node.width() * scaleX)),
                      rotation: Math.round(node.rotation())
                    });
                  }}
                />
              );
            }

            // Elemento do tipo IMAGEM
            if (el.type === 'image') {
              return (
                <EditableImage
                  key={el.id}
                  element={el}
                  isSelected={isSelected}
                  onSelect={() => onSelectElement(el.id)}
                  onChange={onChangeElement}
                />
              );
            }

            // Elemento do tipo RETÂNGULO / FORMA / CARD
            if (el.type === 'rect') {
              return (
                <Rect
                  key={el.id}
                  id={el.id}
                  x={el.x}
                  y={el.y}
                  width={el.width || 200}
                  height={el.height || 100}
                  fill={el.style?.fill || '#111118'}
                  stroke={el.style?.stroke || '#1e1e2e'}
                  strokeWidth={el.style?.strokeWidth || 1}
                  cornerRadius={el.style?.cornerRadius || 8}
                  opacity={el.style?.opacity ?? 1}
                  rotation={el.rotation || 0}
                  draggable
                  onClick={() => onSelectElement(el.id)}
                  onTap={() => onSelectElement(el.id)}
                  onDragEnd={(e) => {
                    onChangeElement({
                      ...el,
                      x: Math.round(e.target.x()),
                      y: Math.round(e.target.y())
                    });
                  }}
                  onTransformEnd={(e) => {
                    const node = e.target;
                    const scaleX = node.scaleX();
                    const scaleY = node.scaleY();
                    node.scaleX(1);
                    node.scaleY(1);
                    onChangeElement({
                      ...el,
                      x: Math.round(node.x()),
                      y: Math.round(node.y()),
                      width: Math.max(20, Math.round(node.width() * scaleX)),
                      height: Math.max(20, Math.round(node.height() * scaleY)),
                      rotation: Math.round(node.rotation())
                    });
                  }}
                />
              );
            }

            // Elemento do tipo CÍRCULO
            if (el.type === 'circle') {
              return (
                <Circle
                  key={el.id}
                  id={el.id}
                  x={el.x}
                  y={el.y}
                  radius={(el.width || 100) / 2}
                  fill={el.style?.fill || '#2563eb'}
                  stroke={el.style?.stroke || 'transparent'}
                  strokeWidth={el.style?.strokeWidth || 0}
                  opacity={el.style?.opacity ?? 1}
                  rotation={el.rotation || 0}
                  draggable
                  onClick={() => onSelectElement(el.id)}
                  onTap={() => onSelectElement(el.id)}
                  onDragEnd={(e) => {
                    onChangeElement({
                      ...el,
                      x: Math.round(e.target.x()),
                      y: Math.round(e.target.y())
                    });
                  }}
                  onTransformEnd={(e) => {
                    const node = e.target;
                    const scaleX = node.scaleX();
                    node.scaleX(1);
                    node.scaleY(1);
                    onChangeElement({
                      ...el,
                      x: Math.round(node.x()),
                      y: Math.round(node.y()),
                      width: Math.max(20, Math.round(node.width() * scaleX)),
                      rotation: Math.round(node.rotation())
                    });
                  }}
                />
              );
            }

            return null;
          })}

          {/* Transformador Gráfico (Handles para Redimensionar e Rotacionar) */}
          <Transformer
            ref={transformerRef}
            boundBoxFunc={(oldBox, newBox) => {
              if (Math.abs(newBox.width) < 15 || Math.abs(newBox.height) < 15) {
                return oldBox;
              }
              return newBox;
            }}
            anchorSize={8}
            anchorCornerRadius={2}
            anchorFill="#2563eb"
            anchorStroke="#ffffff"
            anchorStrokeWidth={1.5}
            borderStroke="#2563eb"
            borderDash={[4, 4]}
          />
        </Layer>
      </Stage>
    </div>
  );
}
