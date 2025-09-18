import { useBooks } from '../hooks/useBooks';
import { Card, Table, Tag } from 'antd';
import { useMemo } from 'react';
import { AuroraText } from '../components/ui/aurora-text';

const TodaysBooks = () => {
  const { books } = useBooks();

  const todaysBooks = useMemo(() => {
    const today = new Date();
    return books.filter((book) => {
      const bookDate = new Date(book.createdAt);
      return (
        
        bookDate.getDate() === today.getDate()
      );
    });
  }, [books]);

  const columns = [
    {
      title: 'Sr No.',
      key: 'sr',
      width: 80,
      render: (_text: any, _record: any, index: number) => index + 1,
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
        const color = status.toLowerCase() === 'available' ? 'green' : 'red';
        return <Tag color={color}>{status}</Tag>;
      },
    },
  ];

  return (
    <div className="w-full overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4"><AuroraText className='text-4xl'>📚 Books Added Today </AuroraText></h2>
      <Card className="min-w-[350px]">
        <Table
          dataSource={todaysBooks}
          columns={columns}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} books today`
          }}
          scroll={{ x: 'max-content', y: 600 }}
          bordered
          size="middle"
        />
      </Card>
    </div>
  );
};

export default TodaysBooks;
