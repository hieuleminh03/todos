import React from 'react';

interface ContextMenuProps {
    x: number;
    y: number;
    onComplete: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, onComplete, onEdit, onDelete }) => {
    return (
        <ul
            className="absolute bg-white shadow-md rounded-md"
            style={{ top: y, left: x }}
        >
            <li onClick={onComplete} className="p-2 hover:bg-gray-200 cursor-pointer">Complete</li>
            <li onClick={onEdit} className="p-2 hover:bg-gray-200 cursor-pointer">Edit</li>
            <li onClick={onDelete} className="p-2 hover:bg-gray-200 cursor-pointer">Delete</li>
        </ul>
    );
};

export default ContextMenu;