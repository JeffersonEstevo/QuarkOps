from rest_framework import serializers

from .models import Category, Comment, Post, Subcategory, User


class UserPublicSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "display_name", "avatar_url", "bio", "role")


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "id", "username", "email", "display_name",
            "avatar_url", "bio", "role", "is_staff", "is_superuser",
        )
        read_only_fields = fields


class SubcategorySerializer(serializers.ModelSerializer):
    category_slug = serializers.CharField(source="category.slug", read_only=True)

    class Meta:
        model = Subcategory
        fields = ("id", "category", "category_slug", "name", "slug", "description", "order")
        read_only_fields = ("id", "slug")


class CategorySerializer(serializers.ModelSerializer):
    subcategories = SubcategorySerializer(many=True, read_only=True)

    class Meta:
        model = Category
        fields = ("id", "name", "slug", "description", "order", "subcategories")
        read_only_fields = ("id", "slug")


class CommentSerializer(serializers.ModelSerializer):
    is_authenticated = serializers.SerializerMethodField()
    author_user = UserPublicSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = (
            "id", "author_name", "author_user", "role", "text",
            "created_at", "is_authenticated",
        )
        read_only_fields = ("id", "created_at", "author_user")

    def get_is_authenticated(self, obj):
        return obj.author_user_id is not None


class PostSerializer(serializers.ModelSerializer):
    author = UserPublicSerializer(read_only=True)
    author_id = serializers.UUIDField(write_only=True, required=False)
    category = CategorySerializer(read_only=True)
    category_id = serializers.UUIDField(write_only=True, required=True)
    subcategory = SubcategorySerializer(read_only=True)
    subcategory_id = serializers.UUIDField(write_only=True, required=False, allow_null=True)
    comments = CommentSerializer(many=True, read_only=True)

    class Meta:
        model = Post
        fields = (
            "id", "title", "summary", "content",
            "category", "category_id",
            "subcategory", "subcategory_id",
            "tags", "read_time",
            "author", "author_id",
            "views", "likes", "comments",
            "created_at", "updated_at",
        )
        read_only_fields = ("id", "views", "likes", "created_at", "updated_at")

    def validate(self, attrs):
        """Valida que subcategoria pertence à categoria (ADR-017)."""
        category_id = attrs.get("category_id")
        subcategory_id = attrs.get("subcategory_id")

        if subcategory_id and category_id:
            try:
                subcat = Subcategory.objects.get(id=subcategory_id)
                if str(subcat.category_id) != str(category_id):
                    raise serializers.ValidationError(
                        {"subcategory_id": "A subcategoria não pertence à categoria escolhida."}
                    )
            except Subcategory.DoesNotExist:
                raise serializers.ValidationError(
                    {"subcategory_id": "Subcategoria não encontrada."}
                )
        return attrs

    def create(self, validated_data):
        category_id = validated_data.pop("category_id")
        subcategory_id = validated_data.pop("subcategory_id", None)
        author_id = validated_data.pop("author_id", None)

        validated_data["category"] = Category.objects.get(id=category_id)
        validated_data["subcategory"] = (
            Subcategory.objects.get(id=subcategory_id) if subcategory_id else None
        )
        validated_data["author"] = (
            User.objects.get(id=author_id)
            if author_id
            else self.context["request"].user
        )
        return Post.objects.create(**validated_data)

    def update(self, instance, validated_data):
        category_id = validated_data.pop("category_id", None)
        subcategory_id = validated_data.pop("subcategory_id", None)

        if category_id:
            validated_data["category"] = Category.objects.get(id=category_id)
        if subcategory_id is not None:
            validated_data["subcategory"] = (
                Subcategory.objects.get(id=subcategory_id) if subcategory_id else None
            )
        return super().update(instance, validated_data)
    