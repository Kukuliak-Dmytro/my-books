import { NextResponse } from 'next/server';

type ApiResponse<T> = {
  status: number;
  message: string;
  data: T;
  error: any;
};

export const formatAPIRESPONSE = <T>({
  data,
  error,
  message,
  status,
}: ApiResponse<T>) => {
  return NextResponse.json({ data, error, message }, { status });
};
