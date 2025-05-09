# MCP First

## Run the server

```
pnpx tsx main.ts
```

## Run with inspector

```
pnpx @modelcontextprotocol/inspector pnpx tsx main.ts
```

## Configure in Windsurf

```
{
  "mcpServers": {
    "first": {
      "command": "npx",
      "args": [
        "-y",
        "tsx",
        "<project_path>/first/main.ts"
      ]
    }
  }
}
```
