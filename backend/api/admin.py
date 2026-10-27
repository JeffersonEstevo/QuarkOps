from django.contrib import admin

from .models import Comment, Post, User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("username", "display_name", "role", "is_staff", "is_active")
    search_fields = ("username", "display_name", "email")


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ("title", "author", "category", "views", "likes", "created_at")
    list_filter = ("category", "author")
    search_fields = ("title", "summary", "content")
    readonly_fields = ("views", "likes", "created_at", "updated_at")


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ("author_name", "post", "role", "created_at", "is_authenticated")
    list_filter = ("role", "created_at")
    search_fields = ("author_name", "text", "post__title")
    readonly_fields = ("created_at",)

    @admin.display(boolean=True, description="Autenticado?")
    def is_authenticated(self, obj):
        return obj.author_user is not None
    