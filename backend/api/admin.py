from django.contrib import admin

from .models import Category, Comment, Post, Subcategory, User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("username", "display_name", "role", "is_staff", "is_active")
    search_fields = ("username", "display_name", "email")


class SubcategoryInline(admin.TabularInline):
    model = Subcategory
    extra = 0
    fields = ("name", "slug", "order")


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "order", "post_count")
    list_editable = ("order",)
    search_fields = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}
    inlines = [SubcategoryInline]

    @admin.display(description="Posts")
    def post_count(self, obj):
        return obj.posts.count()


@admin.register(Subcategory)
class SubcategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "slug", "order")
    list_filter = ("category",)
    search_fields = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ("title", "category", "subcategory", "author", "views", "likes", "created_at")
    list_filter = ("category", "subcategory", "author")
    search_fields = ("title", "summary", "content")
    readonly_fields = ("views", "likes", "created_at", "updated_at")
    autocomplete_fields = ("category", "subcategory")


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ("author_name", "post", "role", "created_at", "is_authenticated")
    list_filter = ("role", "created_at")
    search_fields = ("author_name", "text", "post__title")
    readonly_fields = ("created_at",)

    @admin.display(boolean=True, description="Autenticado?")
    def is_authenticated(self, obj):
        return obj.author_user is not None
    