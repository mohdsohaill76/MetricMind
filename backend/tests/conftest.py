"""Shared pytest configuration for MetricMind backend tests."""

import os


os.environ.setdefault("JWT_SECRET_KEY", "metricmind-test-secret-key")
