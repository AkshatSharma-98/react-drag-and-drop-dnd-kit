export interface ListProps {
    id: string;
    text: string;
    children?: ListProps[];
}

export interface NestedListComponentProps {
    listItems: ListProps[];
    setListItems: React.Dispatch<React.SetStateAction<ListProps[]>>;
}

export interface NestedListItemProps {
    listItem: {
        id: string;
        text: string;
        ancestorIDs?: string[];
    };
}

export interface ListItem {
    id: string;
    text: string;
    children?: ListItem[];
    ancestorIDs?: string[];
}

export interface FlattenedItem {
    id: string;
    ancestorIDs?: string[];
}