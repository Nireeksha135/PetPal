from fastapi import Depends, HTTPException, status


def get_current_user():
    """Development stub for current user dependency.

    Returns a lightweight object with the attributes routes expect.
    Replace with real auth/token validation in production.
    """
    class DevUser:
        id = "dev-user"
        email = "dev@local"
        full_name = "Developer"

    return DevUser()
