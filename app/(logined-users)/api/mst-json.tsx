//app/(logined-users)/api/mst-json.tsx

// app/api/generate-mst/route.ts
import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

// Define interfaces for type safety
interface TopicStructure {
  // Key is the Subject name, Value is an array of Topic names (file names without extension)
  [subject: string]: string[]; 
}

interface ModuleStructure {
  module: string;
  subjects: {
    subject: string;
    topics: string[];
  }[];
}

// Define the root paths
const CONTENT_ROOT = path.join(process.cwd(), 'public', 'Modules');
const OUTPUT_FILE_PATH = path.join(process.cwd(), 'public', 'mst.json');


/**
 * Scans the public/Modules directory and structures the content data based on the Module/Subject/TopicFile hierarchy.
 * @returns A structured array of Modules, Subjects, and Topics.
 */
async function scanContentDirectory(): Promise<ModuleStructure[]> {
  try {
    // 1. Get all module directories (e.g., cardio)
    const moduleDirs = await fs.readdir(CONTENT_ROOT, { withFileTypes: true });
    const moduleNames = moduleDirs
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    const structuredData: ModuleStructure[] = [];

    for (const moduleName of moduleNames) {
      const modulePath = path.join(CONTENT_ROOT, moduleName);
      const moduleSubjects: ModuleStructure['subjects'] = [];

      // 2. Get all subject directories within the module (e.g., anatomy, Biochemistry)
      const subjectDirs = await fs.readdir(modulePath, { withFileTypes: true });
      
      for (const subjectDir of subjectDirs) {
        // Only process directories as subjects
        if (subjectDir.isDirectory()) {
          const subjectPath = path.join(modulePath, subjectDir.name);
          
          // 3. Get all topic files (e.g., topic1, topic2)
          const topicFiles = await fs.readdir(subjectPath);
          
          // Topics are the file names without extensions
          const topics = topicFiles
              .filter(name => !name.startsWith('.')) 
              .map(name => path.parse(name).name); 

          if (topics.length > 0) {
            moduleSubjects.push({
              subject: subjectDir.name,
              topics: topics,
            });
          }
        }
      }
      
      structuredData.push({
        module: moduleName,
        subjects: moduleSubjects,
      });
    }

    return structuredData;

  } catch (error) {
    console.error(`Error scanning content directory at ${CONTENT_ROOT}:`, error);
    // Return an empty array if the folder doesn't exist or on other errors.
    return [];
  }
}

/**
 * Next.js Route Handler (API Route) to generate and write the mst.json file.
 * Access this via a GET request to /api/generate-mst
 */
export async function GET() {
  const contentData = await scanContentDirectory();

  // 4. Format the data into the specific requested JSON structure:
  //    "Module 1": [ {"Subject 1": ["Topic 1", ...]}, ... ]
  const requestedFormat: { [module: string]: TopicStructure[] } = {};

  contentData.forEach(mod => {
    // Transform the array of {subject, topics} objects into an array of {subject: topics} objects
    const subjectsArray: TopicStructure[] = mod.subjects.map(sub => ({
      [sub.subject]: sub.topics,
    }));
    requestedFormat[mod.module] = subjectsArray;
  });

  const jsonString = JSON.stringify(requestedFormat, null, 2);

  try {
    // 5. Write the JSON string to public/mst.json
    await fs.writeFile(OUTPUT_FILE_PATH, jsonString);

    return NextResponse.json({ 
        message: 'Content structure generated successfully!', 
        file: 'public/mst.json', 
        data: requestedFormat 
    });
  } catch (error) {
    console.error('Error writing JSON file:', error);
    return NextResponse.json({ 
        message: 'Failed to write JSON file. Check server permissions.', 
        error: (error as Error).message 
    }, { status: 500 });
  }
}