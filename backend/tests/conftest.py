"""Shared pytest configuration for MetricMind backend tests."""

import os
import sys
from pathlib import Path

# Ensure backend root is on sys.path for test discovery
BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

os.environ.setdefault("JWT_SECRET_KEY", "metricmind-test-secret-key")
