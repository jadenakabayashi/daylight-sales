#!/usr/bin/env python3
"""Thin wrapper around the plain Figma REST API (api.figma.com).

Used as a stopgap for the daylight-design-system skill until a Figma Dev Mode
seat is available (see references/figma-mcp-tools.md for the MCP path).

Auth: reads FIGMA_TOKEN from the environment, or from a .env file (simple
KEY=VALUE lines, no dependency) in the project root or this skill's directory.
Never pass the token on the command line or print it.

Usage:
  figma_api.py file <file_key> [--depth N]
  figma_api.py nodes <file_key> --ids 1:2,3:4
  figma_api.py images <file_key> --ids 1:2,3:4 [--format png|svg|pdf|jpg] [--scale N]
  figma_api.py components <file_key>
  figma_api.py component_sets <file_key>
  figma_api.py styles <file_key>
  figma_api.py variables <file_key>   # usually 403s without an Enterprise plan; that's expected

Output is raw JSON on stdout — pipe to `jq`/`grep`/`head` to filter, since
whole-file responses can be large. Prefer `file --depth 1` or `--depth 2` for
exploration, then `nodes --ids ...` to drill into a specific node.
"""
import argparse
import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request

BASE = "https://api.figma.com/v1"


def _load_dotenv_token():
    here = os.path.dirname(os.path.abspath(__file__))
    candidates = [
        os.path.join(os.getcwd(), ".env"),
        os.path.join(here, "..", "..", "..", "..", ".env"),  # project root from scripts/
    ]
    for path in candidates:
        if os.path.isfile(path):
            with open(path) as f:
                for line in f:
                    line = line.strip()
                    if not line or line.startswith("#") or "=" not in line:
                        continue
                    key, _, value = line.partition("=")
                    if key.strip() == "FIGMA_TOKEN":
                        return value.strip().strip('"').strip("'")
    return None


def get_token():
    token = os.environ.get("FIGMA_TOKEN")
    if not token:
        token = _load_dotenv_token()
    if not token:
        print(
            "FIGMA_TOKEN is not set. Generate a personal access token at "
            "figma.com -> account settings -> Security -> Personal access tokens "
            "(read-only 'File content' scope is enough), then either:\n"
            "  export FIGMA_TOKEN=... (in your shell profile), or\n"
            "  add FIGMA_TOKEN=... to a .env file in the project root.",
            file=sys.stderr,
        )
        sys.exit(1)
    return token


def _get(path, params=None):
    token = get_token()
    url = f"{BASE}{path}"
    if params:
        url += "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={"X-Figma-Token": token})
    try:
        with urllib.request.urlopen(req) as resp:
            return json.load(resp)
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace")
        print(f"HTTP {e.code} from {path}: {body}", file=sys.stderr)
        sys.exit(1)


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = parser.add_subparsers(dest="command", required=True)

    p = sub.add_parser("file")
    p.add_argument("file_key")
    p.add_argument("--depth", type=int, default=None)

    p = sub.add_parser("nodes")
    p.add_argument("file_key")
    p.add_argument("--ids", required=True, help="comma-separated node ids, colon form e.g. 1:2,3:4")

    p = sub.add_parser("images")
    p.add_argument("file_key")
    p.add_argument("--ids", required=True)
    p.add_argument("--format", default="png", choices=["png", "svg", "pdf", "jpg"])
    p.add_argument("--scale", type=float, default=None)

    p = sub.add_parser("components")
    p.add_argument("file_key")

    p = sub.add_parser("component_sets")
    p.add_argument("file_key")

    p = sub.add_parser("styles")
    p.add_argument("file_key")

    p = sub.add_parser("variables")
    p.add_argument("file_key")

    args = parser.parse_args()

    if args.command == "file":
        params = {"depth": args.depth} if args.depth is not None else None
        result = _get(f"/files/{args.file_key}", params)
    elif args.command == "nodes":
        result = _get(f"/files/{args.file_key}/nodes", {"ids": args.ids})
    elif args.command == "images":
        params = {"ids": args.ids, "format": args.format}
        if args.scale is not None:
            params["scale"] = args.scale
        result = _get(f"/images/{args.file_key}", params)
    elif args.command == "components":
        result = _get(f"/files/{args.file_key}/components")
    elif args.command == "component_sets":
        result = _get(f"/files/{args.file_key}/component_sets")
    elif args.command == "styles":
        result = _get(f"/files/{args.file_key}/styles")
    elif args.command == "variables":
        result = _get(f"/files/{args.file_key}/variables/local")
    else:
        parser.error("unknown command")
        return

    json.dump(result, sys.stdout, indent=2)
    sys.stdout.write("\n")


if __name__ == "__main__":
    main()
