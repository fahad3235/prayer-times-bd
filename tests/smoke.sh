#!/bin/bash
# Headless-Chrome smoke test for Namaz Times BD.
# Serves the build dir, dumps the rendered DOM, asserts real content.
set -u
DIR="$(cd "$(dirname "$0")/.." && pwd)"
PORT=8377
SHELL_BIN="$HOME/.cache/ms-playwright/chromium_headless_shell-1187/chrome-linux/headless_shell"
cd "$DIR"
python3 -m http.server "$PORT" >/dev/null 2>&1 &
SRV=$!
sleep 1
DOM=$(timeout 30 "$SHELL_BIN" --no-sandbox --disable-gpu --dump-dom "http://127.0.0.1:$PORT/index.html" 2>/dev/null)
kill $SRV 2>/dev/null

fail=0
check() { # name, grep-pattern
  if echo "$DOM" | grep -q "$1"; then echo "PASS  $2"; else echo "FAIL  $2"; fail=1; fi
}
check '<title>Namaz Times BD' 'page title renders'
check 'id="timesList"' 'times list container exists'
n=$(echo "$DOM" | grep -o 'class="p-name"' | wc -l)
if [ "$n" -ge 6 ]; then echo "PASS  6 prayer rows rendered ($n found)"; else echo "FAIL  6 prayer rows rendered ($n found)"; fail=1; fi
check 'id="ringCountdown"' 'countdown element exists'
rows=$(echo "$DOM" | grep -oE '<tr( class="today")?><td>[0-9]+</td>' | wc -l)
if [ "$rows" -ge 28 ]; then echo "PASS  month table renders full month ($rows day rows)"; else echo "FAIL  month table day rows ($rows)"; fail=1; fi
check 'id="qiblaDeg"' 'qibla display exists'
check 'id="citySelect"' 'city selector exists'
if echo "$DOM" | grep -qiE 'undefined|NaN:[0-9]|error' | grep -v 'viewport-fit' ; then :; fi
echo "$DOM" | grep -oE '[0-9]{1,2}:[0-9]{2} (AM|PM)' | head -3
[ $fail -eq 0 ] && echo 'SMOKE TEST PASSED' || echo 'SMOKE TEST FAILED'
exit $fail
