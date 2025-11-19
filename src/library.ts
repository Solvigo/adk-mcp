import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory equivalent to __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface Chunk {
  id: number;
  text: string;
  header_path: string;
  metadata: {
    page: number | null;
    origin: string;
  };
}

export interface SearchResult {
  topic: string;
  snippet: string;
}

export class ADKLibrary {
  private chunks: Chunk[] = [];
  private headerMap: Map<string, Chunk[]> = new Map();
  private dataPath: string;

  constructor(dataPath?: string) {
    if (dataPath) {
      this.dataPath = dataPath;
    } else {
      // Default path relative to this file in dist/ or src/
      // If we are in dist/index.js, data is in ../src/data or similar?
      // Let's assume the data file is copied to dist/data or remains in src/data
      // Ideally, we copy it to dist/data during build.
      this.dataPath = path.join(__dirname, 'data', 'adk_chunks.jsonl');
    }
    this.loadData();
  }

  private loadData() {
    try {
      if (!fs.existsSync(this.dataPath)) {
        console.error(`File not found: ${this.dataPath}`);
        return;
      }

      const fileContent = fs.readFileSync(this.dataPath, 'utf-8');
      const lines = fileContent.split('\n');

      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const chunk: Chunk = JSON.parse(line);
          this.chunks.push(chunk);
          
          const headerPath = chunk.header_path || 'Unknown';
          if (!this.headerMap.has(headerPath)) {
            this.headerMap.set(headerPath, []);
          }
          this.headerMap.get(headerPath)?.push(chunk);
        } catch (e) {
          console.warn('Could not parse line in JSONL file');
        }
      }
      console.error(`Loaded ${this.chunks.length} chunks covering ${this.headerMap.size} topics.`);
    } catch (error) {
      console.error(`Error loading data from ${this.dataPath}:`, error);
    }
  }

  public getStructure(): string[] {
    return Array.from(this.headerMap.keys()).sort();
  }

  public readTopic(topic: string): string {
    if (!this.headerMap.has(topic)) {
      return `Error: Topic '${topic}' not found.`;
    }
    
    const chunks = this.headerMap.get(topic);
    if (!chunks) return "";
    
    return chunks.map(c => c.text).join('\n\n');
  }

  public search(query: string, limit: number = 5): SearchResult[] {
    const queryLower = query.toLowerCase();
    const results: SearchResult[] = [];

    for (const chunk of this.chunks) {
      if (
        chunk.text.toLowerCase().includes(queryLower) || 
        chunk.header_path.toLowerCase().includes(queryLower)
      ) {
        results.push({
          topic: chunk.header_path,
          snippet: chunk.text.length > 300 ? chunk.text.substring(0, 300) + '...' : chunk.text
        });
      }
    }

    return results.slice(0, limit);
  }
}

