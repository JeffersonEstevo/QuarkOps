"""
Modelos de domínio do QuarkOps.

- User: AbstractUser customizado (display_name, bio, avatar_url, role).
- Category: categoria de primeiro nível (ex: Programação, Linux, Matemática).
- Subcategory: subcategoria (ex: Python dentro de Programação). Opcional.
- Post: artigo do blog, com FK para Category e Subcategory (opcional).
- Comment: comentário aninhado no post (autor anônimo ou autenticado).

IDs: UUID em todos os modelos (ADR-012).
Hierarquia de categorias: 2 níveis (ADR-017).
"""
import uuid

from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.text import slugify


class User(AbstractUser):
    """
    Usuário customizado do QuarkOps.
    Substitui o User padrão do Django desde a primeira migration.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    display_name = models.CharField(
        max_length=120,
        help_text="Nome público exibido em posts e comentários.",
    )
    bio = models.CharField(
        max_length=200,
        blank=True,
        default="",
        help_text="Descrição curta exibida abaixo do nome.",
    )
    avatar_url = models.URLField(
        blank=True,
        default="",
        help_text="URL da imagem de perfil. Se vazio, o frontend deriva iniciais.",
    )
    role = models.CharField(
        max_length=60,
        blank=True,
        default="",
        help_text="Cargo/função pública (ex: 'Backend Lead').",
    )

    def __str__(self):
        return self.display_name or self.username


# ────────────────────────────────────────────────────────────
# Hierarquia de categorias (ADR-017)
# ────────────────────────────────────────────────────────────


class Category(models.Model):
    """
    Categoria de primeiro nível.

    Pode ter ou não subcategorias. Posts podem ficar diretamente na
    categoria (sem subcategoria) quando ela não tem subcategorias.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=60, unique=True)
    slug = models.SlugField(max_length=60, unique=True, blank=True)
    description = models.TextField(blank=True, default="")
    order = models.PositiveIntegerField(
        default=0,
        help_text="Ordenação manual (menor primeiro). Ex: Programação antes de Matemática.",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["order", "name"]
        verbose_name_plural = "Categories"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Subcategory(models.Model):
    """
    Subcategoria. Sempre pertence a uma Category.

    Post pode referenciar uma subcategoria ou ir direto na categoria.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name="subcategories",
    )
    name = models.CharField(max_length=60)
    slug = models.SlugField(max_length=60, blank=True)
    description = models.TextField(blank=True, default="")
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["order", "name"]
        unique_together = [("category", "slug")]  # Python em Programação ≠ Python em IA
        verbose_name_plural = "Subcategories"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.category.name} › {self.name}"


class Post(models.Model):
    """Artigo do blog."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    title = models.CharField(max_length=200)
    summary = models.TextField(help_text="Resumo exibido nos cards da home.")
    content = models.TextField(help_text="HTML completo do artigo (sanitizado no save).")

    # Hierarquia (ADR-017)
    category = models.ForeignKey(
        Category,
        on_delete=models.PROTECT,
        related_name="posts",
        help_text="Categoria principal (obrigatória).",
    )
    subcategory = models.ForeignKey(
        Subcategory,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="posts",
        help_text="Subcategoria (opcional). Deve pertencer à categoria escolhida.",
    )

    tags = models.JSONField(
        default=list,
        blank=True,
        help_text="Lista de tags livres (ex: ['python', 'concurrency']).",
    )
    read_time = models.CharField(
        max_length=40,
        default="5 min de leitura",
        help_text="Tempo estimado de leitura (string, exibida direto no frontend).",
    )

    author = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="posts",
    )

    views = models.PositiveIntegerField(default=0)
    likes = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["-created_at"]),
            models.Index(fields=["category"]),
            models.Index(fields=["subcategory"]),
        ]

    def clean(self):
        """Valida que subcategoria pertence à categoria (ADR-017)."""
        from django.core.exceptions import ValidationError

        if self.subcategory and self.category_id:
            if self.subcategory.category_id != self.category_id:
                raise ValidationError(
                    "A subcategoria selecionada não pertence à categoria escolhida."
                )

    def save(self, *args, **kwargs):
        """Sanitiza HTML antes de persistir (ADR-013)."""
        from .sanitizers import sanitize_html

        if self.content:
            self.content = sanitize_html(self.content)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class Comment(models.Model):
    """
    Comentário aninhado em um Post.

    - Anônimo (RF-006): author_name preenchido, author_user NULL.
    - Autenticado (Passo 6): author_name E author_user preenchidos.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE,
        related_name="comments",
    )

    author_name = models.CharField(max_length=120)
    author_user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="comments",
    )
    role = models.CharField(max_length=60, blank=True, default="Leitor")
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["post", "-created_at"]),
        ]

    def __str__(self):
        return f"{self.author_name} @ {self.post.title[:40]}"
    