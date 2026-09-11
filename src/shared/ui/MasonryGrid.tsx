import { type ReactNode } from "react";

const columnClasses: Record<number, string> = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
};

type MasonryGridProps<T> = {
    items: T[];
    columns?: 2 | 3 | 4;
    getKey: (item: T) => string;
    renderItem: (item: T, index: number) => ReactNode;
    className?: string;
};

export default function MasonryGrid<T>({
    items,
    columns = 3,
    getKey,
    renderItem,
    className = "",
}: MasonryGridProps<T>) {
    return (
        <div className={`grid gap-4 ${columnClasses[columns]} ${className}`}>
            {items.map((item, index) => (
                <div key={getKey(item)} className="w-full">
                    {renderItem(item, index)}
                </div>
            ))}
        </div>
    );
}
