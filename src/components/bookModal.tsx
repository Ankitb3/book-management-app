import React, { useEffect, useState } from 'react';
import { Modal, Button, DatePicker } from 'antd';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { addBook, updateBook } from '../api/books';
import moment from 'moment';
import type { Moment } from 'moment';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { BookFormData } from '../models/BooksModel';

interface BookModalProps {
  isOpen: boolean;
  onClose: () => void;
  fetchBooks:()=>void;
  initialData?: {
    id?: string | number;
    title?: string;
    author?: string;
    genre?: string;
    publishedYear?: number;
    status?: string;
  };
  onSuccess?: () => void;
  onSubmit:() => void
}

const BookModal: React.FC<BookModalProps> = ({ isOpen, onClose, initialData, onSuccess,fetchBooks }) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<BookFormData>();
const queryClient = useQueryClient();
 const[loading,isLoading] = useState(false)
  useEffect(() => {
    reset(initialData || {});
  }, [initialData, reset]);


const addBookMutation = useMutation({
  mutationFn: addBook,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['notes'] });
    toast.success('Book added successfully!');
    fetchBooks()
    reset();
    onClose();
    onSuccess?.();
  },
  onError: () => {
    toast.error('Failed to add book');
  },
});

const updateBookMutation = useMutation({
  mutationFn: ({ id, data }: { id: string; data: BookFormData }) => updateBook(id, data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['notes'] });
    toast.success('Book updated successfully!');
        fetchBooks()
    reset();
    onClose();
    onSuccess?.();
  },
  onError: () => {
    toast.error('Failed to update book');
  },
});

const onSubmit = (data: BookFormData) => {
  isLoading(true)
  if (initialData?.id) {
    updateBookMutation.mutate({ id: String(initialData.id), data });
  } else {
    addBookMutation.mutate(data);
  } 
    isLoading(false)
};

  return (
    <Modal
      title={initialData ? 'Edit Book' : 'Add Book'}
      open={isOpen}
      onCancel={onClose}
      footer={null}
    >
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
  
  <div>
    <input
      {...register('title', { required: 'Title is required' })}
      placeholder="Title"
      className="border px-3 py-2 rounded w-full"
    />
    {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
  </div>

  <div>
    <input
      {...register('author', { required: 'Author is required' })}
      placeholder="Author"
      className="border px-3 py-2 rounded w-full"
    />
    {errors.author && <p className="text-red-500 text-sm">{errors.author.message}</p>}
  </div>

  {/* Genre Field */}
  <div>
    <input
      {...register('genre', { required: 'Genre is required' })}
      placeholder="Genre"
      className="border px-3 py-2 rounded w-full"
    />
    {errors.genre && <p className="text-red-500 text-sm">{errors.genre.message}</p>}
  </div>

<div>
  <Controller
    name="publishedYear"
    control={control}
    rules={{ required: 'Published year is required' }}
    render={({ field }) => (
      <DatePicker
        picker="year"
        format="YYYY"
        onChange={(date: Moment | null) => {
          field.onChange(date ? date.year() : null);
        }}
        value={field.value ? moment(field.value, 'YYYY') : null}
        style={{ width: '100%' }}
        placeholder="Select Published Year"
        disabledDate={(current) => {
          return current.year() > moment().year();
        }}
      />
    )}
  />
  {errors.publishedYear && (
    <p className="text-red-500 text-sm">{errors.publishedYear.message}</p>
  )}
</div>

  <div>
    <select
      {...register('status', { required: 'Status is required' })}
      className="border px-3 py-2 rounded w-full"
    >
      <option value="">Select Status</option>
      <option value="Available">Available</option>
      <option value="Issued">Issued</option>
    </select>
    {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
  </div>

  {/* Buttons */}
  <div className="text-right">
    <Button onClick={onClose} className="mr-2">
      Cancel
    </Button>
    <Button type="primary" htmlType="submit">
      {initialData ? 'Update' : 'Add'}
    </Button>
  </div>
</form>

    </Modal>
  );
};

export default BookModal;
