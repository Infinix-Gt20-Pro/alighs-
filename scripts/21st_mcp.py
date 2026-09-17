import sys
import json
import urllib.request

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

API_KEY = "21st_sk_a6255c38321cf1efbbb48eaf12c075a81dacd7537b5caadea1af8520ffdd2025"
ENDPOINT = "https://21st.dev/api/mcp"

def call_mcp(method, params=None):
    payload = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": method,
        "params": params or {}
    }
    headers = {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
        "User-Agent": "Antigravity-21st/1.0"
    }
    req = urllib.request.Request(ENDPOINT, data=json.dumps(payload).encode("utf-8"), headers=headers)
    with urllib.request.urlopen(req, timeout=15) as resp:
        return json.loads(resp.read().decode("utf-8"))

def search(query, limit=5):
    res = call_mcp("tools/call", {
        "name": "search",
        "arguments": {"query": query, "limit": limit}
    })
    for item in res.get("result", {}).get("content", []):
        print(item.get("text", ""))

def get_component(component_id):
    res = call_mcp("tools/call", {
        "name": "get_component",
        "arguments": {"id": component_id}
    })
    for item in res.get("result", {}).get("content", []):
        print(item.get("text", ""))

def list_tools():
    res = call_mcp("tools/list")
    tools = res.get("result", {}).get("tools", [])
    print(f"Total available 21st.dev MCP tools: {len(tools)}")
    for t in tools:
        print(f" - {t.get('name')}: {t.get('title')}")

if __name__ == "__main__":
    if len(sys.argv) < 2 or sys.argv[1] == "list":
        list_tools()
    elif sys.argv[1] == "search" and len(sys.argv) > 2:
        search(" ".join(sys.argv[2:]))
    elif sys.argv[1] == "get" and len(sys.argv) > 2:
        get_component(sys.argv[2])
    else:
        print("Usage:")
        print("  python scripts/21st_mcp.py list")
        print("  python scripts/21st_mcp.py search <query>")
        print("  python scripts/21st_mcp.py get <component_id>")
