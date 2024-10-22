'use client';
import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search } from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { ThreeDot } from 'react-loading-indicators';

interface Book {
  id: number;
  title: string;
  author: string;
  sales_count: number;
}

type Params = {
  offset: number;
  limit: number;
  author?: string;
  title?: string;
};

const ITEMS_PER_PAGE = 10;

export default function BookStoreAdmin() {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [titleInput, setTitleInput] = useState('');
  const [authorInput, setAuthorInput] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchBooks = async (page = 1, title?: string, author?: string) => {
    setIsLoading(true);
    try {
      const offset = (page - 1) * ITEMS_PER_PAGE;
      const params: Params = { offset, limit: ITEMS_PER_PAGE };

      if (title?.trim()) params.title = title;
      if (author?.trim()) params.author = author;

      // const { data } = await axios.get('http://localhost:8080/api/books', {
      //   params,
      // });

      const { data } = await axios.get(
        'http://ec2-15-164-228-211.ap-northeast-2.compute.amazonaws.com:8080/api/books',
        {
          params,
        }
      );

      setBooks(data.books);
      setTotalBooks(data.total);
      setCurrentPage(page);
    } catch {
      alert('server side error');
    } finally {
      setIsLoading(false);
    }
  };

  // handlers
  const handleRowClick = (id: number) => {
    router.push(`/books/${id}`);
  };

  const handleSearch = () => {
    fetchBooks(1, titleInput, authorInput);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const goToPage = (page: number) => {
    fetchBooks(page, titleInput, authorInput);
  };

  useEffect(() => {
    fetchBooks(currentPage, titleInput, authorInput);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const renderPaginationButtons = () => {
    const totalPages = Math.ceil(totalBooks / ITEMS_PER_PAGE);
    return Array.from({ length: totalPages }, (_, i) => (
      <Button
        key={i + 1}
        onClick={() => goToPage(i + 1)}
        variant={currentPage === i + 1 ? 'default' : 'outline'}
        size="sm"
        className="mx-1 w-10"
      >
        {i + 1}
      </Button>
    ));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">책방</h1>

      <div className="flex gap-4 mb-4">
        <Input
          placeholder="제목"
          value={titleInput}
          onChange={(e) => setTitleInput(e.target.value)}
          className="max-w-sm"
          onKeyDown={handleKeyDown}
        />
        <Input
          placeholder="저자"
          value={authorInput}
          onChange={(e) => setAuthorInput(e.target.value)}
          className="max-w-sm"
          onKeyDown={handleKeyDown}
        />
        <Button onClick={handleSearch}>
          <Search className="mr-2 h-4 w-4" /> 검색
        </Button>
      </div>

      {/* TODO: fix isLoading state */}
      {isLoading ? (
        <div className="flex justify-center align-middle">
          <ThreeDot color="black" size="small" text="" textColor="" />
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>제목</TableHead>
              <TableHead>저자</TableHead>
              <TableHead>판매량</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {books.length > 0 ? (
              books.map((book) => (
                <TableRow
                  key={book.id}
                  onClick={() => handleRowClick(book.id)}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  <TableCell>{book.title}</TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell>{book.sales_count}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  해당 아이템을 찾을 수 없습니다
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}

      {books.length > 0 && (
        <div className="flex items-center justify-center mt-4">
          {renderPaginationButtons()}
        </div>
      )}
    </div>
  );
}
