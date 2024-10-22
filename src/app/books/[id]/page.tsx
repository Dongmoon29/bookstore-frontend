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
import { useParams } from 'next/navigation';
interface Book {
  id: number;
  title: string;
  author: string;
  sales_count: number;
  description?: string;
}

export default function BookDetail() {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const { data } = await axios.get(
          `http://ec2-15-164-228-211.ap-northeast-2.compute.amazonaws.com:8080/api/books/${id}`
        );
        setBook(data);
      } catch {
        alert('오류, 잠시 후 다시 시도해주세요');
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
            <Link href="/books">
              <ArrowLeft className="mr-2 h-4 w-4" /> 목록으로
            </Link>
          </Button>
          <Button>
            <Edit className="mr-2 h-4 w-4" /> 수정하기
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
