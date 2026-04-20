from rest_framework.throttling import UserRateThrottle


class AuthLoginThrottle(UserRateThrottle):
    scope = "auth_login"


class AuthRegisterThrottle(UserRateThrottle):
    scope = "auth_register"


class AuthGoogleThrottle(UserRateThrottle):
    scope = "auth_google"


class AuthRefreshThrottle(UserRateThrottle):
    scope = "auth_refresh"


class AuthSessionThrottle(UserRateThrottle):
    scope = "auth_session"


class SessionReadThrottle(UserRateThrottle):
    scope = "session_read"


class SessionWriteThrottle(UserRateThrottle):
    scope = "session_write"


class SessionAdminThrottle(UserRateThrottle):
    scope = "session_admin"
