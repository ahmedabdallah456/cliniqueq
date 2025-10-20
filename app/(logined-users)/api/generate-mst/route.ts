// (Make sure this is the active, uncommented code)
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface TopicStructure {
  [subject: string]: string[];
}

interface ModuleStructure {
  [module: string]: TopicStructure;
}

export async function GET() {
  try {
    const modulesPath = path.join(process.cwd(), 'public', 'Modules');
    
    if (!fs.existsSync(modulesPath)) {
      return NextResponse.json({ 
        error: 'Modules directory not found',
        path: modulesPath 
      }, { status: 404 });
    }

    const structure: ModuleStructure = {};

    const modules = fs.readdirSync(modulesPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    // --- FIX IS HERE ---
    for (const moduleName of modules) {
      const modulePath = path.join(modulesPath, moduleName);
      structure[moduleName] = {};
    // --- END FIX ---

      const subjects = fs.readdirSync(modulePath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

      for (const subject of subjects) {
        const subjectPath = path.join(modulePath, subject);
        
        const topics = fs.readdirSync(subjectPath, { withFileTypes: true })
          .filter(dirent => dirent.isDirectory())
          .map(dirent => dirent.name);

        // --- AND FIX IS HERE ---
        structure[moduleName][subject] = topics;
        // --- END FIX ---
      }
    }

    const outputPath = path.join(process.cwd(), 'public', 'mst.json');
    fs.writeFileSync(outputPath, JSON.stringify(structure, null, 2));

    return NextResponse.json({ 
      message: 'mst.json generated successfully',
      structure,
      outputPath: '/mst.json'
    });

  } catch (error) {
    console.error('Error generating mst.json:', error);
    return NextResponse.json({ 
      error: 'Failed to generate mst.json',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST() {
  return GET();
}