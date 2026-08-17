# Computer Use Agent

An AI-powered computer use agent that interacts with virtual Linux desktops using E2B Desktop SDK and OpenAI's vision models.

## Features

- 🤖 **Autonomous desktop control** — Agent sees, understands, and controls the desktop
- 🧠 **LLM-powered decision making** — Uses OpenAI's vision models to analyze screenshots
- 🖥️ **Real-time desktop streaming** — VNC-based desktop viewing
- ⚙️ **Configurable actions** — Click, type, scroll, drag, and keypress support
- 📊 **Detailed logging** — Track agent decisions and actions
- 🔧 **Easy extensibility** — Simple architecture for custom tasks and actions

## Prerequisites

- Node.js 18+ and npm
- OpenAI API key (for `gpt-4o` or compatible model)
- E2B API key (free tier available at [e2b.dev](https://e2b.dev))

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Elialex31/computer-use-agent.git
   cd computer-use-agent
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` and add:
   - `OPENAI_API_KEY` — Your OpenAI API key
   - `E2B_API_KEY` — Your E2B API key

## Usage

### Run the agent

```bash
# Start the agent with default task
npm start

# Run in development mode with hot reload
npm run dev
```

### Custom tasks

Edit `src/agent.ts` and change the `exampleTask` variable:

```typescript
const exampleTask = 'Your custom task here';
```

Examples:
- `'Open Firefox and search for AI news'`
- `'Create a new file named hello.txt in the home directory'`
- `'Open a terminal and run: ls -la /home'`

## Architecture

```
src/
├── agent.ts       # Main agent loop
├── llm.ts         # OpenAI integration
├── sandbox.ts     # E2B Desktop setup
├── actions.ts     # Desktop action execution
├── config.ts      # Configuration management
└── types.ts       # TypeScript types
```

### Agent Loop Flow

1. **Screenshot** — Capture current desktop state
2. **Analysis** — Send screenshot to LLM for decision making
3. **Planning** — LLM returns next action with reasoning
4. **Execution** — Execute action on the desktop
5. **Repeat** — Continue until task is complete or max iterations reached

## Supported Actions

| Action | Parameters | Description |
|--------|-----------|-------------|
| `click` | `x`, `y` | Left-click at coordinates |
| `type` | `text` | Type text |
| `keypress` | `key` | Press a key (e.g., "Enter", "Tab", "Control+C") |
| `scroll` | `direction`, `amount` | Scroll up or down by ticks |
| `drag` | `startX`, `startY`, `endX`, `endY` | Drag from point A to point B |
| `wait` | `amount` | Wait for N seconds |
| `complete` | `reason` | Mark task as complete |

## Configuration

Edit `.env` to customize:

- `AGENT_MODEL` — LLM model to use (default: `gpt-4o`)
- `SANDBOX_RESOLUTION_WIDTH` — Desktop width (default: 1024)
- `SANDBOX_RESOLUTION_HEIGHT` — Desktop height (default: 720)
- `MAX_ITERATIONS` — Maximum agent iterations (default: 50)
- `DEBUG_MODE` — Enable detailed logging (default: true)

## Viewing the Desktop

When the agent runs, it prints a VNC URL:

```
🖥️  Desktop available at: https://vnc.e2b.dev/...
```

Open this URL in your browser to watch the agent work in real-time.

## Extending the Agent

### Add custom actions

Edit `src/actions.ts` to add new action types:

```typescript
case 'custom':
  // Your custom logic here
  break;
```

### Modify the LLM prompt

Edit the `systemPrompt` in `src/llm.ts` to change how the agent thinks.

### Integrate with other LLMs

Replace the OpenAI client in `src/llm.ts` with your preferred provider (Anthropic, etc.)

## Troubleshooting

### Agent gets stuck
- Increase `MAX_ITERATIONS` in `.env`
- Check the LLM reasoning to see what the agent is thinking
- Enable `DEBUG_MODE` for detailed action history

### Actions not executing
- Verify the desktop coordinates are correct
- Check that the window/element is visible in the screenshot
- Add `wait` actions between rapid clicks

### LLM errors
- Verify your OpenAI API key is valid
- Check that you have sufficient API credits
- Ensure the model specified in `.env` is available

## Advanced Examples

See `examples/` directory for complex use cases:
- Web scraping with Firefox
- File management tasks
- Terminal-based workflows

## Resources

- [E2B Desktop SDK Docs](https://docs.e2b.dev/)
- [E2B Surf (Reference Implementation)](https://github.com/e2b-dev/surf)
- [OpenAI Vision API](https://platform.openai.com/docs/guides/vision)

## License

MIT

## Support

For issues or questions:
- Open an issue on GitHub
- Check [E2B documentation](https://docs.e2b.dev/)
- Review [E2B Surf examples](https://github.com/e2b-dev/surf)
