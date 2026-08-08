"""Shared pytest configuration for MetricMind backend tests."""

import os


os.environ.setdefault("JWT_SECRET_KEY", "metricmind-test-secret-key")
os.environ.setdefault(
    "DATABASE_URL",
    "postgresql+psycopg://localhost:5432/metricmind_test",
)
os.environ.setdefault("TEST_DATABASE_URL", os.environ["DATABASE_URL"])
