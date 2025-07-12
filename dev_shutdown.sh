#!/bin/bash

# doil-sb Development Server Shutdown Script

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PID_FILE="$SCRIPT_DIR/.dev-server.pid"

# PID 파일이 있는지 확인
if [ ! -f "$PID_FILE" ]; then
    echo "❌ No development server running (PID file not found)"
    echo "   Use './startup.sh' to start the server."
    exit 1
fi

# PID 읽기
PID=$(cat "$PID_FILE")

# 프로세스가 실제로 실행 중인지 확인
if ! ps -p $PID > /dev/null 2>&1; then
    echo "❌ Development server is not running (PID: $PID)"
    echo "🧹 Cleaning up stale PID file..."
    rm -f "$PID_FILE"
    exit 1
fi

echo "🛑 Stopping doil-sb development server (PID: $PID)..."

# nodemon의 경우 자식 프로세스도 함께 종료
if ps -p $PID -o cmd= | grep -q "nodemon"; then
    echo "   Detected nodemon, stopping child processes..."
    # nodemon과 그 자식 프로세스들 모두 종료
    pkill -P $PID 2>/dev/null || true
fi

# Graceful shutdown 시도 (SIGTERM)
kill -TERM $PID 2>/dev/null

# 프로세스가 종료될 때까지 최대 10초 대기
WAIT_TIME=0
MAX_WAIT=10

while [ $WAIT_TIME -lt $MAX_WAIT ]; do
    if ! ps -p $PID > /dev/null 2>&1; then
        echo "✅ Development server stopped gracefully"
        rm -f "$PID_FILE"
        exit 0
    fi
    
    sleep 1
    WAIT_TIME=$((WAIT_TIME + 1))
    echo "   Waiting for graceful shutdown... ($WAIT_TIME/$MAX_WAIT)"
done

# Graceful shutdown이 실패한 경우 강제 종료 (SIGKILL)
echo "⚠️  Graceful shutdown failed, forcing termination..."
kill -KILL $PID 2>/dev/null

# 다시 한 번 확인
sleep 1
if ! ps -p $PID > /dev/null 2>&1; then
    echo "✅ Development server stopped (forced)"
    rm -f "$PID_FILE"
else
    echo "❌ Failed to stop development server"
    echo "   You may need to manually kill process $PID"
    exit 1
fi