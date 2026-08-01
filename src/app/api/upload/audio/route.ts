import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Enforce 20MB limit
    const MAX_SIZE = 20 * 1024 * 1024; // 20 MB
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File size exceeds 20MB limit' }, { status: 400 });
    }

    // Only allow audio files
    if (!file.type.startsWith('audio/')) {
      return NextResponse.json({ error: 'Invalid file type. Only audio files are allowed.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure the uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'audio');
    await fs.mkdir(uploadsDir, { recursive: true });

    // Generate unique filename preserving extension
    const ext = path.extname(file.name) || '.mp3';
    const uniqueFilename = `${randomUUID()}${ext}`;
    const filePath = path.join(uploadsDir, uniqueFilename);

    await fs.writeFile(filePath, buffer);

    // Return the public URL
    const fileUrl = `/uploads/audio/${uniqueFilename}`;

    return NextResponse.json({ url: fileUrl });
  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: 'Failed to process audio upload' }, { status: 500 });
  }
}
