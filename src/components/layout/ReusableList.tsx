import React from "react";

interface ReusableListProps<T extends object> {
    items: T[];
    error: unknown;
    isLoading: boolean;
    CardComponent: React.ComponentType<T>;
    getKey: (item: T) => React.Key;
}

export default function ReusableList<T extends object>({ items, CardComponent, getKey, error, isLoading }: ReusableListProps<T>) {
    const renderItem = (item: T) => (
        <div key={getKey(item)}>
            <CardComponent {...item} />
        </div>
    );

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error loading items: {JSON.stringify(error)}</div>;
    }

    return (
        <div className="flex flex-col gap-4">
            {items.map(renderItem)}
        </div>
    );
}