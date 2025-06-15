import { useDroppable } from "@dnd-kit/core";
import type { ReactNode } from "react";

type Props = {
  id: string;
  children: ReactNode;
  className?: string;
};
const DroppableColumn = ({ id, children, className }: Props) => {
  const { setNodeRef } = useDroppable({ id });
  return (
    <div ref={setNodeRef} className={className}>
      {children}
    </div>
  );
};

export default DroppableColumn;
