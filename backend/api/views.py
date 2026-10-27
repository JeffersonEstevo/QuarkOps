from django.shortcuts import get_object_or_404
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Comment, Post
from .permissions import AllowAnyForCreateReadAuth, IsAdminOrReadOnly
from .serializers import CommentSerializer, PostSerializer


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
    