import { useDraggable } from "@dnd-kit/core";
import React from "react";

type Props = {
  id: string;
  children: React.ReactNode;
};

export const DraggableTodo = ({ id, children }: Props) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative">
      <div
        className="absolute top-1/2 left-2 -translate-y-1/2 cursor-grab text-gray-400"
        {...listeners}
        {...attributes}
      >
        ☰
      </div>
      <div className="pl-8">{children}</div>
    </div>
  );
};
