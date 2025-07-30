// File: useFlattenItems.ts
import { useMemo } from "react";
import type { ListItem } from "../types";

function flattenItemsFn(items: ListItem[]): ListItem[] {
  return items.reduce<ListItem[]>((accumulator, item) => {

    accumulator.push(item);
    if (item.children) {
      const childrenWithAncestors: ListItem[] = item.children.map(child => ({
        ...child,
        ancestorIDs: [...(item.ancestorIDs ?? []), item.id],
      }));
      accumulator.push(...flattenItemsFn(childrenWithAncestors));
    }

    return accumulator;
  }, []);
}

/**
 * Custom React hook to memoize flattened list items.
 * @param items - The nested list items to flatten.
 * @returns A memoized flat array of ListItem, including ancestorIDs.
 */
export default function useFlattenItems(items: ListItem[]): ListItem[] {
  return useMemo(() => flattenItemsFn(items), [items]);
}
