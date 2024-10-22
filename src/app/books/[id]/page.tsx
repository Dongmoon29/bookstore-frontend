'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { API_URL } from '@/app/utils/const';

interface Book {
  id: number;
  title: string;
  author: string;
  sales_count: number;
  description?: string;
}

export default function BookDetail() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 추가
  const [updatedBook, setUpdatedBook] = useState<Book | null>(null); // 수정할 책 정보

  const handleDeleteBook = async (id: number) => {
    try {
      await axios.delete(`${API_URL}/books/${id}`);
      router.push('/');
    } catch {
      alert('TODO: handling error');
    }
  };

  const handleUpdateBook = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${API_URL}/books/${id}`, updatedBook);
      setBook(response.data);
      setIsModalOpen(false);
    } catch {
      alert('TODO: handling error');
    }
  };

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/books/${id}`);
        setBook(data);
        setUpdatedBook(data);
      } catch {
        alert('TODO: handling error');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchBook();
    }
  }, [id]);

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (!book) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              해당 아이템을 찾을 수 없습니다
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button asChild>
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" /> 목록으로
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{book.title}</CardTitle>
              <CardDescription className="text-lg">
                {book.author}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            {book.description || 'No description available'}
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong>판매량:</strong> {book.sales_count}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> 목록으로
            </Link>
          </Button>
          <div className="flex gap-2">
            <Button
              className="bg-red-600"
              onClick={() => {
                handleDeleteBook(book.id);
              }}
            >
              <Edit className="mr-2 h-4 w-4" /> 삭제하기
            </Button>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Edit className="mr-2 h-4 w-4" /> 수정하기
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>책 정보 수정</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleUpdateBook} className="space-y-4">
                  <div>
                    <Label htmlFor="title">제목</Label>
                    <Input
                      id="title"
                      value={updatedBook?.title || ''}
                      onChange={(e) =>
                        setUpdatedBook({
                          ...updatedBook,
                          title: e.target.value,
                        } as Book)
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="author">저자</Label>
                    <Input
                      id="author"
                      value={updatedBook?.author || ''}
                      onChange={(e) =>
                        setUpdatedBook({
                          ...updatedBook,
                          author: e.target.value,
                        } as Book)
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="sales_count">판매량</Label>
                    <Input
                      id="sales_count"
                      type="number"
                      value={updatedBook?.sales_count || 0}
                      onChange={(e) =>
                        setUpdatedBook({
                          ...updatedBook,
                          sales_count: parseInt(e.target.value),
                        } as Book)
                      }
                      required
                    />
                  </div>
                  <Button type="submit">수정</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
