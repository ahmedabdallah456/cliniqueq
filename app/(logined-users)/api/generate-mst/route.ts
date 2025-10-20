// app/api/generate-mst/route.ts (for App Router)

import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

interface TopicStructure {
  [subject: string]: string[];
}

interface ModuleStructure {
  [mstModule: string]: TopicStructure;
}

// For Pages Router (pages/api/generate-mst.ts)
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const modulesPath = path.join(process.cwd(), 'public', 'Modules');
    
    // Check if the Modules directory exists
    if (!fs.existsSync(modulesPath)) {
      return res.status(404).json({ 
        error: 'Modules directory not found',
        path: modulesPath 
      });
    }

    const structure: ModuleStructure = {};

    // Read all modules
    const mstModules = fs.readdirSync(modulesPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    for (const mstModule of mstModules) {
      const modulePath = path.join(modulesPath, mstModule);
      structure[mstModule] = {};

      // Read all subjects within the module
      const subjects = fs.readdirSync(modulePath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

      for (const subject of subjects) {
        const subjectPath = path.join(modulePath, subject);
        
        // Read all topics within the subject
        const topics = fs.readdirSync(subjectPath, { withFileTypes: true })
          .filter(dirent => dirent.isDirectory())
          .map(dirent => dirent.name);

        structure[mstModule][subject] = topics;
      }
    }

    // Write the JSON file to public directory
    const outputPath = path.join(process.cwd(), 'public', 'mst.json');
    fs.writeFileSync(outputPath, JSON.stringify(structure, null, 2));

    res.status(200).json({ 
      message: 'mst.json generated successfully',
      structure,
      outputPath: '/mst.json' // Public URL path
    });

  } catch (error) {
    console.error('Error generating mst.json:', error);
    res.status(500).json({ 
      error: 'Failed to generate mst.json',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// For App Router (app/api/generate-mst/route.ts)
// Uncomment this section if you're using App Router instead

/*
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
    
    // Check if the Modules directory exists
    if (!fs.existsSync(modulesPath)) {
      return NextResponse.json({ 
        error: 'Modules directory not found',
        path: modulesPath 
      }, { status: 404 });
    }

    const structure: ModuleStructure = {};

    // Read all modules
    const modules = fs.readdirSync(modulesPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    for (const module of modules) {
      const modulePath = path.join(modulesPath, module);
      structure[module] = {};

      // Read all subjects within the module
      const subjects = fs.readdirSync(modulePath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

      for (const subject of subjects) {
        const subjectPath = path.join(modulePath, subject);
        
        // Read all topics within the subject
        const topics = fs.readdirSync(subjectPath, { withFileTypes: true })
          .filter(dirent => dirent.isDirectory())
          .map(dirent => dirent.name);

        structure[module][subject] = topics;
      }
    }

    // Write the JSON file to public directory
    const outputPath = path.join(process.cwd(), 'public', 'mst.json');
    fs.writeFileSync(outputPath, JSON.stringify(structure, null, 2));

    return NextResponse.json({ 
      message: 'mst.json generated successfully',
      structure,
      outputPath: '/mst.json' // Public URL path
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
  return GET(); // Allow both GET and POST requests
}
*/