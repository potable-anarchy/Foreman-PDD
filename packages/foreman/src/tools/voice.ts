import axios from 'axios';

const ELEVENLABS_BASE_URL = 'https://api.elevenlabs.io/v1';
const DEFAULT_VOICE_ID = 'pNInz6obpgDQGcFmaJgB'; // Adam voice
const REQUEST_TIMEOUT = 10000; // 10 seconds

interface VoiceSettings {
  stability: number;
  similarity_boost: number;
}

interface TTSRequest {
  text: string;
  model_id: string;
  voice_settings: VoiceSettings;
}

/**
 * Announces a message using ElevenLabs text-to-speech API.
 * Falls back to console logging if API key is not configured.
 * Never throws errors - always degrades gracefully.
 */
export async function announceVoice(message: string): Promise<void> {
  // Always log to console for visibility
  console.log(`🎙️ ${message}`);

  const apiKey = process.env.ELEVENLABS_API_KEY;
  
  if (!apiKey) {
    console.log('⚠️  ElevenLabs API key not configured - skipping voice synthesis');
    return;
  }

  try {
    const voiceId = process.env.ELEVENLABS_VOICE_ID || DEFAULT_VOICE_ID;
    const url = `${ELEVENLABS_BASE_URL}/text-to-speech/${voiceId}`;
    
    const requestBody: TTSRequest = {
      text: message,
      model_id: 'eleven_monolingual_v1',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.5
      }
    };

    const response = await axios.post(url, requestBody, {
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json'
      },
      responseType: 'arraybuffer',
      timeout: REQUEST_TIMEOUT
    });

    if (response.status === 200 && response.data) {
      const audioSize = response.data.byteLength;
      console.log(`✅ Voice announcement generated successfully (${audioSize} bytes)`);
    } else {
      console.log('⚠️  Voice synthesis completed but no audio data received');
    }

  } catch (error) {
    // Handle different types of errors gracefully
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        console.log('⚠️  Voice synthesis timed out - continuing without audio');
      } else if (error.response?.status === 401) {
        console.log('⚠️  Invalid ElevenLabs API key - check configuration');
      } else if (error.response?.status === 429) {
        console.log('⚠️  ElevenLabs rate limit exceeded - try again later');
      } else if (error.response?.status === 422) {
        console.log('⚠️  Invalid voice configuration - check voice_id');
      } else {
        console.log(`⚠️  Voice synthesis failed: ${error.message}`);
      }
    } else {
      console.log(`⚠️  Unexpected error during voice synthesis: ${error}`);
    }
  }
}