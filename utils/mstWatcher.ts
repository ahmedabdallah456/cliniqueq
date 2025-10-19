// utils/mstWatcher.ts
import fs from 'fs';
import path from 'path';
import { debounce } from 'lodash'; // You may need to install lodash: npm install lodash @types/lodash

interface TopicStructure {
  [subject: string]: string[];
}

interface ModuleStructure {
  [module: string]: TopicStructure;
}

export class MSTWatcher {
  private modulesPath: string;
  private outputPath: string;
  private watcher: fs.FSWatcher | null = null;
  private generateDebounced: () => void;

  constructor() {
    this.modulesPath = path.join(process.cwd(), 'public', 'Modules');
    this.outputPath = path.join(process.cwd(), 'public', 'mst.json');
    
    // Debounce the generation to avoid multiple rapid executions
    this.generateDebounced = debounce(() => {
      this.generateMSTFile();
    }, 1000);
  }

  public generateMSTFile(): ModuleStructure | null {
    try {
      if (!fs.existsSync(this.modulesPath)) {
        console.error('Modules directory not found:', this.modulesPath);
        return null;
      }

      const structure: ModuleStructure = {};

      // Read all modules
      const modules = fs.readdirSync(this.modulesPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

      for (const module of modules) {
        const modulePath = path.join(this.modulesPath, module);
        structure[module] = {};

        // Check if module directory exists and is accessible
        if (!fs.existsSync(modulePath)) continue;

        // Read all subjects within the module
        const subjects = fs.readdirSync(modulePath, { withFileTypes: true })
          .filter(dirent => dirent.isDirectory())
          .map(dirent => dirent.name);

        for (const subject of subjects) {
          const subjectPath = path.join(modulePath, subject);
          
          // Check if subject directory exists and is accessible
          if (!fs.existsSync(subjectPath)) continue;
          
          // Read all topics within the subject
          const topics = fs.readdirSync(subjectPath, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);

          structure[module][subject] = topics;
        }
      }

      // Write the JSON file to public directory
      fs.writeFileSync(this.outputPath, JSON.stringify(structure, null, 2));
      console.log('mst.json generated successfully at:', this.outputPath);

      return structure;
    } catch (error) {
      console.error('Error generating mst.json:', error);
      return null;
    }
  }

  public startWatching(): void {
    if (!fs.existsSync(this.modulesPath)) {
      console.error('Cannot start watching: Modules directory not found');
      return;
    }

    // Generate initial file
    this.generateMSTFile();

    // Watch for changes in the Modules directory
    this.watcher = fs.watch(
      this.modulesPath,
      { recursive: true },
      (eventType, filename) => {
        if (filename) {
          console.log(`Directory change detected: ${eventType} ${filename}`);
          this.generateDebounced();
        }
      }
    );

    console.log('Started watching for changes in:', this.modulesPath);
  }

  public stopWatching(): void {
    if (this.watcher) {
      this.watcher.close();
      this.watcher = null;
      console.log('Stopped watching directory changes');
    }
  }

  public async getMSTData(): Promise<ModuleStructure | null> {
    try {
      if (fs.existsSync(this.outputPath)) {
        const data = fs.readFileSync(this.outputPath, 'utf8');
        return JSON.parse(data);
      }
      return null;
    } catch (error) {
      console.error('Error reading mst.json:', error);
      return null;
    }
  }
}

// Singleton instance
export const mstWatcher = new MSTWatcher();

// Development-only auto-watcher (add this to your next.config.js or a separate script)
export function initializeAutoWatcher() {
  if (process.env.NODE_ENV === 'development') {
    mstWatcher.startWatching();
    
    // Cleanup on process exit
    process.on('SIGINT', () => {
      mstWatcher.stopWatching();
      process.exit(0);
    });
  }
}

// Utility function to get fresh MST data
export async function getMSTStructure(): Promise<ModuleStructure | null> {
  return mstWatcher.getMSTData();
}

// Force regeneration utility
export function regenerateMST(): ModuleStructure | null {
  return mstWatcher.generateMSTFile();
}

// Alternative simpler version without lodash dependency
export class SimpleMSTWatcher {
  private modulesPath: string;
  private outputPath: string;
  private timeout: NodeJS.Timeout | null = null;

  constructor() {
    this.modulesPath = path.join(process.cwd(), 'public', 'Modules');
    this.outputPath = path.join(process.cwd(), 'public', 'mst.json');
  }

  private debounce(func: () => void, delay: number) {
    return () => {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.timeout = setTimeout(func, delay);
    };
  }

  public generateMSTFile(): ModuleStructure | null {
    try {
      if (!fs.existsSync(this.modulesPath)) {
        console.error('Modules directory not found:', this.modulesPath);
        return null;
      }

      const structure: ModuleStructure = {};

      const modules = fs.readdirSync(this.modulesPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

      for (const module of modules) {
        const modulePath = path.join(this.modulesPath, module);
        structure[module] = {};

        if (!fs.existsSync(modulePath)) continue;

        const subjects = fs.readdirSync(modulePath, { withFileTypes: true })
          .filter(dirent => dirent.isDirectory())
          .map(dirent => dirent.name);

        for (const subject of subjects) {
          const subjectPath = path.join(modulePath, subject);
          
          if (!fs.existsSync(subjectPath)) continue;
          
          const topics = fs.readdirSync(subjectPath, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);

          structure[module][subject] = topics;
        }
      }

      fs.writeFileSync(this.outputPath, JSON.stringify(structure, null, 2));
      console.log('mst.json generated successfully');

      return structure;
    } catch (error) {
      console.error('Error generating mst.json:', error);
      return null;
    }
  }
}

export const simpleMSTWatcher = new SimpleMSTWatcher();