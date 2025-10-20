import { NextResponse } from 'next/server';
import { readdir } from 'fs/promises';
import { join } from 'path';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // --- FIX IS HERE ---
    const moduleName = searchParams.get('module');
    
    if (!moduleName) {
      return NextResponse.json({ error: 'Module parameter is required' }, { status: 400 });
    }
    
    const subjectsPath = join(process.cwd(), 'public', 'Modules', moduleName);
    // --- END FIX ---

    const subjects = await readdir(subjectsPath, { withFileTypes: true });
    
    const subjectNames = subjects
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
    
    return NextResponse.json(subjectNames);
  } catch (error) {
    console.error('Error scanning subjects:', error);
    return NextResponse.json({ error: 'Failed to scan subjects' }, { status: 500 });
  }
}