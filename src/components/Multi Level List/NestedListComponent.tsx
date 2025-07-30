import React from 'react';
import { closestCenter, DndContext } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import NestedListItem from './NestedListItem';
import useFlattenItems from './utils';
import getUpdatedListItems from './getNewItems';

interface NestedListComponentProps {
  listItems: any[];
  setListItems: React.Dispatch<React.SetStateAction<any[]>>;
}

const NestedListComponent: React.FC<NestedListComponentProps> = ({ listItems, setListItems }) => {
  const flattenedItems = useFlattenItems(listItems);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }

    const { ancestorIDs } = (over.data.current || {}) as { ancestorIDs?: string[] };
    if (ancestorIDs && ancestorIDs.includes(active.id as string)) {
      alert('Cannot drop item into descendant');
      return;
    }

    const newItems = getUpdatedListItems(
      listItems,
      flattenedItems,
      active.id as string,
      over.id as string
    );
    if (newItems) {
      setListItems(newItems);
    }
  };

  if (flattenedItems.length === 0) return null;

  return (
    <DndContext
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis]}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={flattenedItems} strategy={verticalListSortingStrategy}>
        {flattenedItems.map(item => (
          <NestedListItem key={item.id} listItem={item} />
        ))}
      </SortableContext>
    </DndContext>
  );
};

export default NestedListComponent;
