// app/api/scan-modules/route.ts
import { NextResponse } from 'next/server';
import { readdir } from 'fs/promises';
import { join } from 'path';

export async function GET() {
  try {
    const modulesPath = join(process.cwd(), 'public', 'Modules');
    const modules = await readdir(modulesPath, { withFileTypes: true });
    
    // Filter to only return directories
    const moduleNames = modules.filter(dirent => dirent.isDirectory()).map(dirent => dirent.name);
    
    return NextResponse.json(moduleNames);
  } catch (error) {
    console.error('Error scanning modules:', error);
    return NextResponse.json({ error: 'Failed to scan modules' }, { status: 500 });
  }
}