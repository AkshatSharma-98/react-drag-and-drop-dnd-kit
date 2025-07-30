import type { FlattenedItem, ListItem } from "../../types";

/**
 * Reorders listItems based on drag events between activeId and overId.
 */
export default function getUpdatedListItems(
    listItems: ListItem[],
    flattenedItems: FlattenedItem[],
    activeId: string,
    overId: string
): ListItem[] {
    const activeObjIdx = flattenedItems.findIndex(item => item.id === activeId);
    const overObjIdx = flattenedItems.findIndex(item => item.id === overId);

    const activeObj = flattenedItems[activeObjIdx];
    const overObj = flattenedItems[overObjIdx];

    const isSameLevel = checkIfSameAncestor(activeObj, overObj);

    if (isSameLevel) {
        return updateListItems([...listItems], activeId, overId);
    } else {
        const updated = [...listItems];
        getMultiLevelUpdatedItems(updated, activeId, overId);
        return updated;
    }
}

/**
 * Swaps two items at the same nesting level.
 */
function updateListItems(
    items: ListItem[],
    activeId: string,
    overId: string
): ListItem[] {
    for (let i = 0; i < items.length; i++) {
        const children = items[i].children;

        const activeIndex = items.findIndex(item => item.id === activeId);
        const overIndex = items.findIndex(item => item.id === overId);

        if (activeIndex >= 0 && overIndex >= 0) {
            const tempA = JSON.parse(JSON.stringify(items[activeIndex]));
            const tempB = JSON.parse(JSON.stringify(items[overIndex]));
            items[activeIndex] = tempB;
            items[overIndex] = tempA;
            return items;
        }

        if (children && children.length) {
            items[i].children = updateListItems(children, activeId, overId);
        }
    }

    return items;
}

/**
 * Checks if two flattened items share the same ancestor lineage.
 */
function checkIfSameAncestor(
    activeObj: FlattenedItem,
    overObj: FlattenedItem
): boolean {
    const activeAnc = activeObj.ancestorIDs;
    const overAnc = overObj.ancestorIDs;

    if (!activeAnc || !overAnc) {
        return !activeAnc && !overAnc;
    }

    const ancestorMap: Record<string, boolean> = {};
    activeAnc.forEach(id => {
        ancestorMap[id] = true;
    });

    return overAnc.every(id => ancestorMap[id]);
}

function getMultiLevelUpdatedItems(
    items: ListItem[],
    activeId: string,
    overId: string
): void {
    const source: { activeElement?: Pick<ListItem, 'id' | 'text'> } = {};
    const dest: { overElement?: ListItem } = {};

    getMultiLevelUpdatedItemsRecursive(items, activeId, source, 'active');
    getMultiLevelUpdatedItemsRecursive(items, activeId, source, 'over', dest, overId);
}

function getMultiLevelUpdatedItemsRecursive(
    items: ListItem[] | undefined,
    targetId: string,
    holder: { activeElement?: Pick<ListItem, 'id' | 'text'> },
    mode: 'active' | 'over',
    dest?: { overElement?: ListItem },
    overId?: string
): void {
    if (!items || items.length === 0) return;

    for (let i = 0; i < items.length; i++) {
        const item = items[i];

        if (mode === 'active' && item.id === targetId) {
            holder.activeElement = { id: item.id, text: item.text };
            if (item.children && item.children.length) {
                items.splice(i, 1, ...item.children);
            } else {
                items.splice(i, 1);
            }
            return;
        }

        if (mode === 'over' && item.id === overId) {
            if (holder.activeElement && dest) {
                const insertionIndex = i > 0 ? i : 0;
                items.splice(insertionIndex, 0, { ...holder.activeElement });
                return;
            }
        }

        // Recurse into children
        if (item.children) {
            getMultiLevelUpdatedItemsRecursive(
                item.children,
                targetId,
                holder,
                mode,
                dest,
                overId
            );
        }
    }
}
