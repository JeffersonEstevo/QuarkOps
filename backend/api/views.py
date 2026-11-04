from django.shortcuts import get_object_or_404
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated

from .models import Comment, Post
from .permissions import AllowAnyForCreateReadAuth, IsAdminOrReadOnly
from .serializers import CommentSerializer, PostSerializer


from rest_framework.permissions import IsAuthenticated

from .serializers import UserSerializer, PostSerializer, CommentSerializer
from .models import User

class PostViewSet(viewsets.ModelViewSet):
    """
    CRUD de posts + ações customizadas:
    - POST /api/posts/{id}/like/   → incrementa likes
    - POST /api/posts/{id}/view/   → incrementa views
    - GET  /api/posts/{id}/comments/ → lista comentários
    - POST /api/posts/{id}/comments/ → cria comentário (anônimo permitido)
    """

    queryset = Post.objects.select_related("author").prefetch_related("comments__author_user")
    serializer_class = PostSerializer
    permission_classes = [IsAdminOrReadOnly]

    @action(detail=True, methods=["post"], permission_classes=[AllowAnyForCreateReadAuth])
    def like(self, request, pk=None):
        post = self.get_object()
        post.likes += 1
        post.save(update_fields=["likes"])
        return Response({"likes": post.likes})

    @action(detail=True, methods=["post"], permission_classes=[AllowAnyForCreateReadAuth])
    def view(self, request, pk=None):
        post = self.get_object()
        post.views += 1
        post.save(update_fields=["views"])
        return Response({"views": post.views})

    @action(detail=True, methods=["get", "post"], permission_classes=[AllowAnyForCreateReadAuth])
    def comments(self, request, pk=None):
        post = self.get_object()

        if request.method == "GET":
            serializer = CommentSerializer(post.comments.all(), many=True)
            return Response(serializer.data)

        # POST — criar comentário (anônimo por padrão)
        serializer = CommentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Se autenticado (staff ou leitor logado no futuro), vincula author_user.
        author_user = request.user if request.user.is_authenticated else None
        serializer.save(post=post, author_user=author_user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class CommentViewSet(viewsets.ModelViewSet):
    """
    Apenas DELETE é exposto diretamente (moderação).
    Criação/listagem acontece via /api/posts/{id}/comments/.
    """

    queryset = Comment.objects.select_related("post", "author_user")
    serializer_class = CommentSerializer
    permission_classes = [AllowAnyForCreateReadAuth]
    http_method_names = ["delete", "head", "options"]


class UserViewSet(viewsets.GenericViewSet):
    """
    Apenas `GET /api/users/me/` é exposto — retorna o usuário logado.

    Usado pelo AuthProvider após o login para popular `user` no estado global.
    """

    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=["get"])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)


from .serializers import (
    CategorySerializer,
    CommentSerializer,
    PostSerializer,
    SubcategorySerializer,
    UserSerializer,
)
from .models import Category, Subcategory, User


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Listagem e detalhe de categorias (público, read-only).

    Admin gerencia via Django Admin (ADR-017).
    """
    queryset = Category.objects.prefetch_related("subcategories").all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]
    lookup_field = "slug"  # /api/categories/programacao/


class SubcategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Listagem de subcategorias. Filtra por categoria via query param:
    /api/subcategories/?category=<uuid> ou ?category_slug=programacao
    """
    queryset = Subcategory.objects.select_related("category").all()
    serializer_class = SubcategorySerializer
    permission_classes = [AllowAny]
    lookup_field = "slug"

    def get_queryset(self):
        qs = super().get_queryset()
        category_slug = self.request.query_params.get("category_slug")
        category_id = self.request.query_params.get("category")
        if category_slug:
            qs = qs.filter(category__slug=category_slug)
        elif category_id:
            qs = qs.filter(category_id=category_id)
        return qs
    