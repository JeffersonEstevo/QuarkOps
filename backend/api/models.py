"""
Modelos de domínio do QuarkOps.

- User: AbstractUser customizado com campos de perfil (display_name, bio, avatar_url, role).
- Post: artigo do blog, com autor (FK User), conteúdo HTML e métricas (views, likes).
- Comment: comentário aninhado no post. Suporta autor anônimo (author_name) ou
  autenticado (author_user, FK opcional). Ver ADR-012.

IDs: todos os modelos usam UUID (ADR-012).
"""
import uuid

from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """
    Usuário customizado do QuarkOps.
    Substitui o User padrão do Django desde a primeira migration.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    display_name = models.CharField(
        max_length=120,
        help_text="Nome público exibido em posts e comentários (ex: 'Guido Dev').",
    )
    bio = models.CharField(
        max_length=200,
        blank=True,
        default="",
        help_text="Descrição curta exibida abaixo do nome (ex: 'Engenheiro de Software & Maintainer').",
    )
    avatar_url = models.URLField(
        blank=True,
        default="",
        help_text="URL da imagem de perfil. Se vazio, o frontend deriva iniciais do display_name.",
    )
    role = models.CharField(
        max_length=60,
        blank=True,
        default="",
        help_text="Cargo/função pública (ex: 'Backend Lead', 'SRE Specialist').",
    )

    def __str__(self):
        return self.display_name or self.username


class Post(models.Model):
    """Artigo do blog."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    title = models.CharField(max_length=200)
    category = models.CharField(max_length=60)
    summary = models.TextField(help_text="Resumo exibido nos cards da home.")
    content = models.TextField(help_text="HTML completo do artigo (sanitizado no save).")
    tags = models.JSONField(
        default=list,
        blank=True,
        help_text="Lista de tags (ex: ['python', 'concurrency']).",
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

    # Métricas
    views = models.PositiveIntegerField(default=0)
    likes = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["-created_at"]),
            models.Index(fields=["category"]),
        ]

    def save(self, *args, **kwargs):
        """Sanitiza o HTML antes de persistir (ADR-013)."""
        # Import local evita import circular em tempo de app-loading.
        from .sanitizers import sanitize_html

        if self.content:
            self.content = sanitize_html(self.content)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class Comment(models.Model):
    """
    Comentário aninhado em um Post.

    Suporta dois cenários (ADR-012):
    - Anônimo (MVP atual, RF-006): apenas `author_name` preenchido, `author_user` NULL.
    - Autenticado (futuro, Passo 6): `author_name` E `author_user` preenchidos.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE,
        related_name="comments",
    )

    author_name = models.CharField(
        max_length=120,
        help_text="Nome livre (sempre preenchido, mesmo em comentários autenticados).",
    )
    author_user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="comments",
        help_text="Preenchido apenas quando o autor está autenticado (futuro).",
    )
    role = models.CharField(
        max_length=60,
        blank=True,
        default="Leitor",
        help_text="Cargo exibido ao lado do nome (ex: 'Leitor', 'Backend Lead').",
    )
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["post", "-created_at"]),
        ]

    def __str__(self):
        return f"{self.author_name} @ {self.post.title[:40]}"
    