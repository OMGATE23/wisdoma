import { useState } from 'react';
import { PromiseResponse } from '../types';
import { toast } from 'sonner';

interface ModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  onSubmit: (inputValue: string) => Promise<PromiseResponse<null>>;
  placeholder?: string;
  defaultValue?: string;
  successMessage?: string;
}

const InputModal = (props: ModalProps) => {
  const [inputValue, setInputValue] = useState<string>(
    props.defaultValue ? props.defaultValue : '',
  );
  const [error, setError] = useState<string | null>(null);
  const handleSubmit = async () => {
    if (inputValue.trim()) {
      setError(null);
      const resp = await props.onSubmit(inputValue);

      if (resp.error) {
        setError(resp.message);
      } else {
        setInputValue('');
        props.onClose();
        toast.success(
          props.successMessage ? props.successMessage : 'Created Successfully',
        );
      }
    }
  };

  if (!props.isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[400px]">
        <h2 className="text-xl font-semibold mb-4">{props.title}</h2>
        <input
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          placeholder={props.placeholder || `Enter ${props.title}`}
          className="w-full p-2 outline outline-1 outline-neutral-400 rounded"
        />
        {error && <h2 className="text-sm text-red-500 mb-4">{error}</h2>}
        <div className="mt-4 flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-neutral-100 rounded"
            onClick={props.onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-neutral-900 text-white rounded disabled:cursor-not-allowed"
            onClick={handleSubmit}
            disabled={inputValue.trim() === ''}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputModal;
