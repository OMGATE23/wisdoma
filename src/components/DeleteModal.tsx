import { useState } from 'react';
import { PromiseResponse } from '../types';
import { toast } from 'sonner';

interface ModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  onDelete: () => Promise<PromiseResponse<null>>;
}

const DeleteModal = (props: ModalProps) => {
  const [error, setError] = useState<string | null>(null);
  const handleSubmit = async () => {
    setError(null);
    const resp = await props.onDelete();
    if (resp.error) {
      setError(resp.message);
    } else {
      props.onClose();
      toast.success('Deleted successfully');
    }
  };

  if (!props.isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[400px]">
        <p>Are you sure you want to delete "{props.title}"?</p>
        {error && <h2 className="text-sm text-red-500 mb-4">{error}</h2>}
        <div className="mt-4 flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-300 rounded"
            onClick={props.onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 text-red-500 outline outline-1 rounded hover:bg-red-500 hover:text-white"
            onClick={handleSubmit}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
