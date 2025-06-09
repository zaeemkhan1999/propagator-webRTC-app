import { memo } from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: Function;
    title: string;
    children: React.ReactNode;
};

const Modal: React.FC<ModalProps> = memo(({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className='text-white fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 h-50% '>
            <div className="bg-[#272727] rounded-lg shadow-lg w-96 p-6 pt-2 relative">
                <div className="flex justify-between items-center mb-4">
                    <div></div>
                    <h2 className="text-xl font-semibold">{title}</h2>
                    <button
                        onClick={() => onClose()}
                        aria-label="Close"
                    >
                        &times;
                    </button>
                </div>

                <div className="max-h-80 overflow-y-auto mb-4">
                    {children}
                </div>
            </div>
        </div>
    );
});

export default Modal;
