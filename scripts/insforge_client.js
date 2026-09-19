const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const API_KEY = process.env.INSFORGE_API_KEY || '';
const API_BASE_URL = process.env.NEXT_PUBLIC_INSFORGE_URL || 'https://7fxjpnj5.us-east.insforge.app';

function runMcpCommand(toolName, toolArgs) {
  return new Promise((resolve, reject) => {
    const cp = spawn('npx.cmd', [
      '-y',
      '@insforge/mcp@latest',
      '--api_key', API_KEY,
      '--api_base_url', API_BASE_URL
    ], { shell: true });

    let buffer = '';
    let requestId = 1;
    let result = null;

    cp.stdout.on('data', (data) => {
      buffer += data.toString();
      const lines = buffer.split('\n');
      buffer = lines.pop(); // keep last partial line

      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const msg = JSON.parse(line.trim());
          if (msg.id === 1) {
            // Handshake response received, now notify initialized
            const notif = JSON.stringify({
              jsonrpc: '2.0',
              method: 'notifications/initialized',
              params: {}
            }) + '\n';
            cp.stdin.write(notif);

            if (toolName === 'tools/list') {
              requestId = 2;
              const req = JSON.stringify({
                jsonrpc: '2.0',
                id: 2,
                method: 'tools/list',
                params: {}
              }) + '\n';
              cp.stdin.write(req);
            } else {
              requestId = 2;
              const req = JSON.stringify({
                jsonrpc: '2.0',
                id: 2,
                method: 'tools/call',
                params: {
                  name: toolName,
                  arguments: toolArgs || {}
                }
              }) + '\n';
              cp.stdin.write(req);
            }
          } else if (msg.id === 2) {
            result = msg.result;
            cp.kill();
            resolve(result);
          }
        } catch (e) {
          // ignore non-json log lines
        }
      }
    });

    cp.on('close', () => {
      if (result) resolve(result);
      else resolve(null);
    });

    cp.on('error', reject);

    // Step 1: Send initialize
    const init = JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: { name: 'antigravity', version: '1.0.0' }
      }
    }) + '\n';
    cp.stdin.write(init);
  });
}

module.exports = { runMcpCommand, API_KEY, API_BASE_URL };

if (require.main === module) {
  const action = process.argv[2] || 'fetch-docs';
  const param = process.argv[3] || 'instructions';

  if (action === 'sql') {
    runMcpCommand('run-raw-sql', { query: param }).then((res) => {
      console.log(JSON.stringify(res, null, 2));
    });
  } else if (action === 'fetch-docs') {
    runMcpCommand('fetch-docs', { docType: param }).then((res) => {
      if (res && res.content) {
        for (const item of res.content) {
          console.log(item.text || JSON.stringify(item));
        }
      } else {
        console.log(JSON.stringify(res, null, 2));
      }
    });
  } else {
    runMcpCommand(action, param ? JSON.parse(param) : {}).then((res) => {
      console.log(JSON.stringify(res, null, 2));
    });
  }
}
