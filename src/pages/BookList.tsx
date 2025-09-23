import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Button, message, Popconfirm, Table, Input, Select, Space, Card, Row, Col, Tag } from 'antd';
import { SearchOutlined, FilterOutlined, ReloadOutlined } from '@ant-design/icons';
import { addBook, deleteBook, getBooks, updateBook } from '../api/books';
import BookModal from '../components/bookModal';
import { ShinyButton } from '../components/ui/shiny-button';
import type { Book } from '../models/BooksModel';
import { useBooks } from '../hooks/useBooks';
import { AuroraText } from '../components/ui/aurora-text';

const { Search } = Input;
const { Option } = Select;



export interface BookModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Book;
  onSave: (bookData: Partial<Book>) => Promise<void>;
  fetchBooks: () => void;
}

const BookList = () => {
  const { books, setBooks } = useBooks();
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [searchText, setSearchText] = useState<string>('');
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  const fetchBooks = async () => {
    try {
      const data = await getBooks();
      setBooks(data);
      setFilteredBooks(data);
    } catch {
      toast.error('Failed to fetch books');
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchBooks().then(() => {
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    let filtered = books;

    if (searchText) {
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(searchText.toLowerCase()) ||
        book.author.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (selectedGenre) {
      filtered = filtered.filter(book => book.genre === selectedGenre);
    }

    if (selectedStatus) {
      filtered = filtered.filter(book => book.status === selectedStatus);
    }

    setFilteredBooks(filtered);
  }, [books, searchText, selectedGenre, selectedStatus]);

  const uniqueGenres = [...new Set(books.map(book => book.genre))].sort();
  const uniqueStatuses = [...new Set(books.map(book => book.status))].sort();

  const handleDelete = async (id: string) => {
    try {
      await deleteBook(id);
      toast.success('Book deleted');
      fetchBooks();
    } catch (error) {
      toast.error('Delete failed');
      console.error(error);
    }
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditingBook(null);
    setModalOpen(true);
  };

  const handleSubmit = async (bookData: Partial<Book>) => {
    try {
      if (editingBook) {
        await updateBook(editingBook.id, { ...editingBook, ...bookData } as Book);
        toast.success('Book updated');
      } else {
        if (
          bookData.title &&
          bookData.author &&
          bookData.genre &&
          typeof bookData.publishedYear === 'number' &&
          bookData.status
        ) {
          const newBook: Book = {
            id: '',
            title: bookData.title,
            author: bookData.author,
            genre: bookData.genre,
            publishedYear: bookData.publishedYear,
            status: bookData.status,
            createdAt:bookData.createdAt
          };
          await addBook(newBook);
          toast.success('Book added');
        } else {
          toast.error('Please fill all required fields');
          return;
        }
      }
      setModalOpen(false);
      fetchBooks();
    } catch {
      toast.error('Operation failed');
    }
  };

  const handleClearFilters = () => {
    setSearchText('');
    setSelectedGenre('');
    setSelectedStatus('');
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const activeFiltersCount = [searchText, selectedGenre, selectedStatus].filter(Boolean).length;

  return (
    <div className="p-1">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold"><AuroraText className='text-4xl'>📚Book List</AuroraText></h1>
        <ShinyButton onClick={handleAdd}>Add Book</ShinyButton>
      </div>

    <Card className="mb-4" bodyStyle={{ padding: '16px' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={24} md={8} lg={8}>
            <Search
              placeholder="Search by title or author..."
              allowClear
              enterButton={<SearchOutlined />}
              size="middle"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onSearch={handleSearch}
            />
          </Col>

          <Col xs={12} sm={12} md={6} lg={5}>
            <Select
              placeholder="Filter by Genre"
              style={{ width: '100%' }}
              allowClear
              value={selectedGenre || undefined}
              onChange={setSelectedGenre}
              suffixIcon={<FilterOutlined />}
            >
              {uniqueGenres.map(genre => (
                <Option key={genre} value={genre}>{genre}</Option>
              ))}
            </Select>
          </Col>

          <Col xs={12} sm={12} md={6} lg={5}>
            <Select
              placeholder="Filter by Status"
              style={{ width: '100%' }}
              allowClear
              value={selectedStatus || undefined}
              onChange={setSelectedStatus}
              suffixIcon={<FilterOutlined />}
            >
              {uniqueStatuses.map(status => (
                <Option key={status} value={status}>{status}</Option>
              ))}
            </Select>
          </Col>

          <Col xs={24} sm={24} md={4} lg={6}>
            <Space>
              {activeFiltersCount > 0 && (
                <Button
                  type="default"
                  icon={<ReloadOutlined />}
                  onClick={handleClearFilters}
                >
                  Clear ({activeFiltersCount})
                </Button>
              )}
              <span className="text-gray-500">
                {filteredBooks.length} of {books.length} books
              </span>
            </Space>
          </Col>
        </Row>
      </Card>

      {(searchText || selectedGenre || selectedStatus) && (
        <div className="mb-3 p-2 bg-blue-50 rounded-lg border-l-4 border-blue-400">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-700">
              {filteredBooks.length === books.length
                ? `Showing all ${books.length} books`
                : `Showing ${filteredBooks.length} of ${books.length} books`}
              {searchText && ` matching "${searchText}"`}
              {selectedGenre && ` in ${selectedGenre}`}
              {selectedStatus && ` with status ${selectedStatus}`}
            </span>
          </div>
        </div>
      )}

      {isLoading ? (
        <Card>
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                {Array.from({ length: 7 }).map((_, i) => (
                  <th key={i} className="px-4 py-2 text-left text-sm font-semibold text-gray-500">
                    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {Array.from({ length: 5 }).map((_, rowIdx) => (
                <tr key={rowIdx}>
                  {Array.from({ length: 7 }).map((_, colIdx) => (
                    <td key={colIdx} className="px-4 py-3">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      ) : (
        <div className="w-full overflow-x-auto">
          <Card className="min-w-[350px]">
            <Table
              dataSource={filteredBooks}
              columns={[
                {
                  title: 'Sr No.',
                  key: 'sr',
                  width: 80,
                  render: (_text, _record, index) => index + 1, 
                },
                {
                  title: 'Title',
                  dataIndex: 'title',
                  key: 'title',
                  width: 200,
                },
                {
                  title: 'Author',
                  dataIndex: 'author',
                  key: 'author',
                  width: 150,
                },
                {
                  title: 'Published Year',
                  dataIndex: 'publishedYear',
                  key: 'publishedYear',
                  width: 120,
                },
                {
                  title: 'Status',
                  dataIndex: 'status',
                  key: 'status',
                  width: 150,
                  render: (status: string) => {
                    let color = 'red';
                    let text = status;

                    if (status?.toLowerCase() === 'available') {
                      color = 'green';
                    } else if (status?.toLowerCase() === 'issued') {
                      color = 'red';
                    } else {
                      color = 'default';
                    }

                    return <Tag color={color}>{text}</Tag>;
                  }
                },

                {
                  title: 'Actions',
                  key: 'actions',
                  width: 180,
                  render: (_, record) => (
                    <div className="flex gap-2">
                      <Button type='primary' className="text-blue-500 hover:underline" onClick={() => handleEdit(record)}>Edit</Button>
                      <Popconfirm
            title="Are you sure to delete this book?"
            description={`Book: ${record.title}`}
            onConfirm={() => handleDelete(record.id)}
            onCancel={() => message.info('Delete cancelled')}
            okText="Yes"
            cancelText="No"
          >
            <Button danger size="small">Delete</Button>
          </Popconfirm>
                    </div>
                  ),
                },
              ]}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} books`
              }}
              scroll={{ x: 'max-content', y: 600 }}
              bordered
              size="middle"
            />
          </Card>
        </div>


      )}
      <BookModal
        isOpen={modalOpen}
        fetchBooks={fetchBooks}
        onClose={() => setModalOpen(false)}
        onSubmit={()=>handleSubmit}
        initialData={editingBook ?? undefined}
      />
    </div>
  );
};

export default BookList;