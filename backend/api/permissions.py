from rest_framework.permissions import SAFE_METHODS, BasePermission


class IsAdminOrReadOnly(BasePermission):
    """
    - GET, HEAD, OPTIONS: liberados para todos (leitura pública).
    - POST, PUT, PATCH, DELETE: apenas staff autenticado (CRM).
    """

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_authenticated and request.user.is_staff)


class AllowAnyForCreateReadAuth(BasePermission):
    """
    - GET, HEAD, OPTIONS, POST: liberados (comentários anônimos são permitidos — RF-006).
    - DELETE: apenas staff autenticado (moderação — RF-017).
    """

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS or request.method == "POST":
            return True
        return bool(request.user and request.user.is_authenticated and request.user.is_staff)
    