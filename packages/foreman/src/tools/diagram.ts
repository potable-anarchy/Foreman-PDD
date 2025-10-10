import axios from 'axios';
import { promises as fs } from 'fs';
import path from 'path';

const OUTPUT_DIR = 'apps/web/public';
const ASCII_FILE = 'diagram.txt';
const IMAGE_FILE = 'diagram.png';

/**
 * Generates a system architecture diagram using Fireworks AI or ASCII fallback.
 * This function ensures reliable diagram generation by always providing a fallback option.
 * 
 * @param specName - The name of the project/specification for the diagram
 */
export async function generateDiagram(specName: string): Promise<void> {
  const apiKey = process.env.FIREWORKS_API_KEY;
  
  // Ensure output directory exists
  await ensureDirectoryExists();
  
  if (!apiKey) {
    console.log('🎨 No Fireworks API key found, generating ASCII diagram...');
    await generateAsciiDiagram(specName);
    return;
  }
  
  try {
    console.log('🎨 Generating diagram with Fireworks AI...');
    await generateFireworksDiagram(specName, apiKey);
  } catch (error) {
    console.warn('⚠️ Fireworks AI failed, falling back to ASCII:', error instanceof Error ? error.message : 'Unknown error');
    await generateAsciiDiagram(specName);
  }
}

/**
 * Ensures the output directory exists, creating it if necessary.
 * Handles directory creation errors gracefully.
 */
async function ensureDirectoryExists(): Promise<void> {
  try {
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
  } catch (error) {
    // Directory might already exist, that's fine
  }
}

/**
 * Generates an ASCII art diagram and saves it to a text file.
 * This is the reliable fallback method that always works.
 * 
 * @param specName - The name of the project/specification for the diagram
 */
async function generateAsciiDiagram(specName: string): Promise<void> {
  const diagram = createAsciiDiagram(specName);
  const outputPath = path.join(OUTPUT_DIR, ASCII_FILE);
  
  try {
    await fs.writeFile(outputPath, diagram, 'utf8');
    console.log(`✅ ASCII diagram saved to ${outputPath}`);
  } catch (error) {
    console.warn('⚠️ Failed to save ASCII diagram:', error instanceof Error ? error.message : 'Unknown error');
  }
}

/**
 * Generates a diagram using Fireworks AI and saves it as a PNG image.
 * Throws errors to trigger ASCII fallback if anything goes wrong.
 * 
 * @param specName - The name of the project/specification for the diagram
 * @param apiKey - The Fireworks AI API key
 */
async function generateFireworksDiagram(specName: string, apiKey: string): Promise<void> {
  const prompt = `Create a clean, professional system architecture diagram for "${specName}". 
  Show components like: User Interface (Next.js Dashboard), Foreman Agent Core (Orchestration Loop), 
  PDD CLI, Convex Database, Voice TTS, and Kanban Board. Use boxes, arrows, and clear labels. 
  Modern, technical diagram style with good contrast and readability.`;

  const response = await axios.post(
    'https://api.fireworks.ai/inference/v1/image_generation/accounts/fireworks/models/stable-diffusion-xl-1024-v1-0',
    {
      prompt,
      n: 1,
      size: '1024x1024',
      response_format: 'b64_json'
    },
    {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    }
  );

  if (!response.data?.data?.[0]?.b64_json) {
    throw new Error('Invalid response from Fireworks AI');
  }

  const imageBuffer = Buffer.from(response.data.data[0].b64_json, 'base64');
  const outputPath = path.join(OUTPUT_DIR, IMAGE_FILE);
  
  try {
    await fs.writeFile(outputPath, imageBuffer);
    console.log(`✅ AI-generated diagram saved to ${outputPath}`);
  } catch (error) {
    console.warn('⚠️ Failed to save AI diagram:', error instanceof Error ? error.message : 'Unknown error');
    throw error; // Re-throw to trigger ASCII fallback
  }
}

/**
 * Creates a detailed ASCII art system architecture diagram.
 * Uses Unicode box drawing characters for professional appearance.
 * 
 * @param specName - The name of the project/specification for the diagram
 * @returns A formatted ASCII diagram string
 */
function createAsciiDiagram(specName: string): string {
  return `System Architecture for ${specName}:

┌─────────────────────────────────────────────────────────┐
│                   User Interface                        │
│              (Next.js Dashboard)                        │
└───────────────────┬─────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│              Foreman Agent Core                         │
│            (Orchestration Loop)                         │
└──┬──────────┬──────────┬──────────┬───────────────────┘
   │          │          │          │
   ▼          ▼          ▼          ▼
┌─────┐  ┌────────┐  ┌───────┐  ┌────────┐
│ PDD │  │ Convex │  │ Voice │  │ Kanban │
│ CLI │  │   DB   │  │  TTS  │  │  Board │
└─────┘  └────────┘  └───────┘  └────────┘

Data Flow:
──────────
1. User interacts with Next.js Dashboard
2. Dashboard communicates with Foreman Agent Core
3. Core orchestrates between all subsystems:
   • PDD CLI for development tasks
   • Convex DB for data persistence
   • Voice TTS for audio feedback
   • Kanban Board for task management

Key Features:
─────────────
• Real-time synchronization
• Event-driven architecture
• Modular component design
• Scalable microservices pattern

Generated: ${new Date().toISOString()}
`;
}