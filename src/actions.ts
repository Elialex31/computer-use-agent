import { Sandbox } from '@e2b/desktop';
import { DesktopAction } from './types';

export async function executeAction(sandbox: Sandbox, action: DesktopAction): Promise<void> {
  switch (action.type) {
    case 'click':
      if (action.x !== undefined && action.y !== undefined) {
        console.log(`🖱️  Clicking at (${action.x}, ${action.y})`);
        await sandbox.leftClick(action.x, action.y);
      }
      break;

    case 'type':
      if (action.text) {
        console.log(`⌨️  Typing: "${action.text}"`);
        await sandbox.write(action.text);
      }
      break;

    case 'keypress':
      if (action.key) {
        console.log(`⌨️  Pressing key: ${action.key}`);
        await sandbox.press(action.key);
      }
      break;

    case 'scroll':
      if (action.direction && action.amount) {
        console.log(`📄 Scrolling ${action.direction} ${action.amount} ticks`);
        await sandbox.scroll(action.direction, action.amount);
      }
      break;

    case 'drag':
      if (
        action.startX !== undefined &&
        action.startY !== undefined &&
        action.endX !== undefined &&
        action.endY !== undefined
      ) {
        console.log(`🖱️  Dragging from (${action.startX}, ${action.startY}) to (${action.endX}, ${action.endY})`);
        await sandbox.drag([action.startX, action.startY], [action.endX, action.endY]);
      }
      break;

    case 'wait':
      const waitTime = (action.amount || 1) * 1000;
      console.log(`⏳ Waiting for ${waitTime}ms`);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
      break;

    case 'complete':
      console.log(`✅ Task marked as complete: ${action.reason || 'No reason provided'}`);
      break;

    default:
      console.warn(`Unknown action type: ${(action as DesktopAction).type}`);
  }
}

export async function takeScreenshot(sandbox: Sandbox): Promise<string> {
  const buffer = await sandbox.screenshot();
  return buffer.toString('base64');
}
