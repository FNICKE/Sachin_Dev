import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { slug } = params;
  const path = slug.join('/');
  const searchParams = request.nextUrl.searchParams.toString();
  const url = `${process.env.BACKEND_URL}/api/${path}${searchParams ? `?${searchParams}` : ''}`;

  try {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': request.headers.get('Authorization') || '',
      },
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Proxy Error' }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  const { slug } = params;
  const path = slug.join('/');
  const url = `${process.env.BACKEND_URL}/api/${path}`;
  const body = await request.json();

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': request.headers.get('Authorization') || '',
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Proxy Error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { slug } = params;
  const path = slug.join('/');
  const url = `${process.env.BACKEND_URL}/api/${path}`;
  const body = await request.json();

  try {
    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': request.headers.get('Authorization') || '',
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Proxy Error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { slug } = params;
  const path = slug.join('/');
  const url = `${process.env.BACKEND_URL}/api/${path}`;

  try {
    const res = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': request.headers.get('Authorization') || '',
      },
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Proxy Error' }, { status: 500 });
  }
}

