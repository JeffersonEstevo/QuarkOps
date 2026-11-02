from rest_framework import serializers

from .models import Comment, Post, User


class UserPublicSerializer(serializers.ModelSerializer):
    """Usuário exposto em posts (apenas campos públicos)."""

    class Meta:
        model = User
        fields = ("id", "display_name", "avatar_url", "bio", "role")

class UserSerializer(serializers.ModelSerializer):
    """
    Usuário completo (apenas para /me/ — requer autenticação).
    Expõe campos que o frontend precisa para o CRM.
    """

    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "email",
            "display_name",
            "avatar_url",
            "bio",
            "role",
            "is_staff",
            "is_superuser",
        )
        read_only_fields = fields


class CommentSerializer(serializers.ModelSerializer):
    """
    Serializa comentários.

    - Leitura: expõe `author_name`, `role`, `text`, `created_at` + flag `is_authenticated`.
    - Escrita (POST): aceita apenas `author_name`, `role`, `text` (RF-006).
      `author_user` é preenchido pelo servidor se autenticado (futuro, Passo 6).
    """

    is_authenticated = serializers.SerializerMethodField()
    author_user = UserPublicSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = (
            "id",
            "author_name",
            "author_user",
            "role",
            "text",
            "created_at",
            "is_authenticated",
        )
        read_only_fields = ("id", "created_at", "author_user")

    def get_is_authenticated(self, obj):
        return obj.author_user_id is not None


class PostSerializer(serializers.ModelSerializer):
    """
    Serializa posts.

    - Leitura: inclui `author` (UserPublicSerializer) e `comments` aninhados.
    - Escrita: aceita `author` como UUID (ou usa o usuário logado, se autenticado).
    """

    author = UserPublicSerializer(read_only=True)
    author_id = serializers.UUIDField(write_only=True, required=False)
    comments = CommentSerializer(many=True, read_only=True)

    class Meta:
        model = Post
        fields = (
            "id",
            "title",
            "category",
            "summary",
            "content",
            "tags",
            "read_time",
            "author",
            "author_id",
            "views",
            "likes",
            "comments",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "views", "likes", "created_at", "updated_at")

    def create(self, validated_data):
        # Se `author_id` não foi enviado, usa o usuário logado (staff).
        author_id = validated_data.pop("author_id", None)
        if author_id:
            validated_data["author"] = User.objects.get(id=author_id)
        else:
            validated_data["author"] = self.context["request"].user
        return Post.objects.create(**validated_data)
    