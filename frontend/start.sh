#!/bin/bash
export NEXT_TELEMETRY_DISABLED=1
echo "Menjalankan Next.js Server dengan penahan terminal (Anti-Exit)..."

# Gunakan tail -f untuk menahan standard input agar proses tidak tertutup otomatis oleh env
tail -f /dev/null | npx next dev -H 0.0.0.0
