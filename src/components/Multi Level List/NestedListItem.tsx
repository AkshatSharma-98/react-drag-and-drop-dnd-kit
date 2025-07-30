// File: NestedListItem.tsx
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDroppable } from '@dnd-kit/core';

interface NestedListItemProps {
  listItem: {
    id: string;
    text: string;
    ancestorIDs?: string[];
  };
}

const NestedListItem: React.FC<NestedListItemProps> = ({ listItem }) => {
  const { ancestorIDs, text, id } = listItem;
  const hasAncestors = !!ancestorIDs && ancestorIDs.length > 0;

  const {
    attributes,
    listeners,
    setNodeRef: setDraggableRef,
    transform,
    transition,
  } = useSortable({ id, data: { ancestorIDs }, animateLayoutChanges: () => false });

  const { isOver, setNodeRef: setDroppableRef } = useDroppable({ id });

  const setRefs = (node: HTMLElement | null) => {
    setDraggableRef(node);
    setDroppableRef(node);
  };

  const indent = hasAncestors ? 30 * (ancestorIDs!.length + 1) : 30;

  const listItemStyle: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    border: '1px solid #ccc',
    padding: '5px',
    background: isOver ? '#d2f8d2' : 'white',
    outline: isOver ? '1px solid #000' : '',
    boxShadow: '0 1px 1px rgba(0,0,0,0.1)',
    borderRadius: '8px',
    width: `calc(100% - ${indent}px)`,
    height: '30px',
    marginTop: '3px',
    marginLeft: `${indent}px`,
  };

  return (
    <div ref={setRefs} style={listItemStyle} {...attributes} {...listeners}>
      <p style={{ paddingLeft: '30px' }}>{text}</p>
    </div>
  );
};

export default NestedListItem;