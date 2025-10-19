// app/api/scan-subjects/route.ts
import { NextResponse } from 'next/server';
import { readdir } from 'fs/promises';
import { join } from 'path';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const module = searchParams.get('module');
    
    if (!module) {
      return NextResponse.json({ error: 'Module parameter is required' }, { status: 400 });
    }
    
    const subjectsPath = join(process.cwd(), 'public', 'Modules', module);
    const subjects = await readdir(subjectsPath, { withFileTypes: true });
    
    // Filter to only return directories
    const subjectNames = subjects
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
    
    return NextResponse.json(subjectNames);
  } catch (error) {
    console.error('Error scanning subjects:', error);
    return NextResponse.json({ error: 'Failed to scan subjects' }, { status: 500 });
  }
}