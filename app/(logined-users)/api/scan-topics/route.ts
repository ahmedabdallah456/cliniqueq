// app/api/scan-topics/route.ts
import { NextResponse } from 'next/server';
import { readdir } from 'fs/promises';
import { join } from 'path';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const module = searchParams.get('module');
    const subject = searchParams.get('subject');
    
    if (!module || !subject) {
      return NextResponse.json({ error: 'Module and subject parameters are required' }, { status: 400 });
    }
    
    const topicsPath = join(process.cwd(), 'public', 'Modules', module, subject);
    const topics = await readdir(topicsPath, { withFileTypes: true });
    
    // Filter to only return directories
    const topicNames = topics
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
    
    return NextResponse.json(topicNames);
  } catch (error) {
    console.error('Error scanning topics:', error);
    return NextResponse.json({ error: 'Failed to scan topics' }, { status: 500 });
  }
}