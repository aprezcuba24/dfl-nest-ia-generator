# MCP dfl-nest

## Run with inspector

This is only for testing.

```
pnpx @modelcontextprotocol/inspector pnpx tsx main.ts
```

## Configure in Windsurf

```
{
  "mcpServers": {
    "dfl-nest": {
      "command": "npx",
      "args": [
        "-y",
        "tsx",
        "<project_path>/main.ts"
      ],
      "env": {
        "OPENAI_API_KEY": "YOUR_OPENAI_API_KEY"
      }
    }
  }
}
```
