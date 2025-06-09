// FilePreview.tsx
import React from 'react';
import { truncateString } from '../../app/utility/misc.helpers';
import Trash from '@/assets/icons/IconTrash';

interface FilePreviewProps {
  file: any;
  onDelete: () => void;
  onShowFile?: () => void;
  className?: string;
}

const FilePreview: React.FC<FilePreviewProps> = ({ file, onDelete, onShowFile, className }) => {
  const fileUrl = URL.createObjectURL(file?.file); // Create URL for the file (useful for previews)

  return (
    <div className={`flex items-center justify-between border-dashed border border-gray-300 p-4 rounded-lg w-full ${className}`}>
      <div className='flex items-center gap-2'>
        <img
          src={fileUrl}
          alt={file?.file?.name}
          className="w-10 h-10 object-cover rounded-md"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'fallback.png'; // Fallback for non-image files
          }}
        />

        <span className="text-sm text-gray-800">{truncateString(file?.file?.name, 30)}</span>
      </div>

      <div className="ml-3 flex items-center justify-between">
        <button
          onClick={onShowFile}
          className="ml-3 bg-blue1 w-[90px] h-7 text-white py-1 px-3 rounded-md text-xs hover:bg-blue-500"
        >
          Show file
        </button>
        <Trash
          onClick={onDelete}
          className="text-red-600 cursor-pointer hover:text-red-800 ml-3 text-lg"
        />
      </div>


    </div>
  );
};

export default FilePreview;
