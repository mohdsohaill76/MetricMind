"""HTTP request logging middleware."""

import logging
from time import perf_counter

from starlette.types import ASGIApp, Message, Receive, Scope, Send


logger = logging.getLogger(__name__)


class RequestLoggingMiddleware:
    """Log the method, path, status code, and duration of each HTTP request."""

    def __init__(self, app: ASGIApp) -> None:
        self.app = app

    async def __call__(
        self, scope: Scope, receive: Receive, send: Send
    ) -> None:
        """Pass a request through and emit a log entry once it completes."""
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        start_time = perf_counter()
        status_code: int = 500

        async def send_with_status(message: Message) -> None:
            nonlocal status_code
            if message["type"] == "http.response.start":
                status_code = message["status"]
            await send(message)

        try:
            await self.app(scope, receive, send_with_status)
        finally:
            duration_ms = (perf_counter() - start_time) * 1_000
            logger.info(
                "%s %s -> %s (%.2f ms)",
                scope["method"],
                scope["path"],
                status_code,
                duration_ms,
            )
