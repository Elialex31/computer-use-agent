import { Sandbox } from '@e2b/desktop';
import { config } from './config';

let sandboxInstance: Sandbox | null = null;

export async function createSandbox(): Promise<Sandbox> {
  if (sandboxInstance) {
    return sandboxInstance;
  }

  console.log('Creating desktop sandbox...');
  sandboxInstance = await Sandbox.create({
    resolution: config.sandbox.resolution,
    dpi: config.sandbox.dpi,
    timeoutMs: config.sandbox.timeoutMs,
  });

  console.log('Starting VNC stream...');
  await sandboxInstance.stream.start();
  const streamUrl = sandboxInstance.stream.getUrl();
  console.log(`\n🖥️  Desktop available at: ${streamUrl}\n`);

  return sandboxInstance;
}

export async function closeSandbox(): Promise<void> {
  if (sandboxInstance) {
    console.log('Closing sandbox...');
    await sandboxInstance.kill();
    sandboxInstance = null;
  }
}

export function getSandbox(): Sandbox | null {
  return sandboxInstance;
}
