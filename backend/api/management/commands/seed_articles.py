"""
Popula o banco com autores, categorias, subcategorias e artigos iniciais.
Idempotente — pode rodar várias vezes.

Uso: python manage.py seed_articles
"""
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

from api.models import Category, Comment, Post, Subcategory

User = get_user_model()


INITIAL_CATEGORIES = [
    {"name": "Programação", "slug": "programacao", "order": 1},
    {"name": "DevOps", "slug": "devops", "order": 2},
    {"name": "IA", "slug": "ia", "order": 3},
    {"name": "Linux", "slug": "linux", "order": 4},
    {"name": "Infraestrutura", "slug": "infraestrutura", "order": 5},
]

INITIAL_SUBCATEGORIES = [
    {"category_slug": "programacao", "name": "Python", "slug": "python", "order": 1},
    {"category_slug": "programacao", "name": "JavaScript", "slug": "javascript", "order": 2},
    {"category_slug": "programacao", "name": "TypeScript", "slug": "typescript", "order": 3},
    {"category_slug": "linux", "name": "Ubuntu", "slug": "ubuntu", "order": 1},
    {"category_slug": "linux", "name": "Debian", "slug": "debian", "order": 2},
    {"category_slug": "devops", "name": "Docker", "slug": "docker", "order": 1},
    {"category_slug": "devops", "name": "Kubernetes", "slug": "kubernetes", "order": 2},
]


SEED_POSTS = [
    {
        "author": {
            "username": "guido_dev",
            "display_name": "Guido Dev",
            "role": "Backend Lead",
            "bio": "Engenheiro de Software & Maintainer",
        },
        "post": {
            "title": "Desvendando o Python GIL: O Que Muda na Concorrência Moderna",
            "category_slug": "programacao",
            "subcategory_slug": "python",
            "read_time": "7 min de leitura",
            "summary": "Uma análise profunda sobre o GIL do CPython e propostas recentes para removê-lo.",
            "tags": ["python", "concurrency", "cpython", "backend"],
            "content": "<h2>Introdução ao GIL</h2><p>O GIL é um mutex que protege o acesso a objetos Python.</p>",
            "views": 3420,
            "likes": 42,
        },
    },
    {
        "author": {
            "username": "linuxops",
            "display_name": "LinuxOps Master",
            "role": "SRE Specialist",
            "bio": "DevOps & Container Orchestration",
        },
        "post": {
            "title": "Orquestração de Containers com Docker e Kubernetes",
            "category_slug": "devops",
            "subcategory_slug": "docker",
            "read_time": "9 min de leitura",
            "summary": "Boas práticas para otimização de imagens Docker e gerenciamento de pods.",
            "tags": ["devops", "docker", "kubernetes", "linux"],
            "content": "<h2>Introdução</h2><p>Containerização vai além de empacotar dependências.</p>",
            "views": 2890,
            "likes": 29,
        },
    },
    {
        "author": {
            "username": "dr_neural",
            "display_name": "Dr. Neural",
            "role": "ML Engineer",
            "bio": "LLMs & Fine-tuning",
        },
        "post": {
            "title": "Fine-Tuning de LLMs Open-Source: Da Teoria à Prática",
            "category_slug": "ia",
            "subcategory_slug": None,
            "read_time": "12 min de leitura",
            "summary": "Como adaptar LLMs usando LoRA e QLoRA em GPUs de consumo.",
            "tags": ["ai", "llm", "python", "machine_learning"],
            "content": "<h2>Cenário dos LLMs</h2><p>Treinar do zero é proibitivo para a maioria.</p>",
            "views": 4120,
            "likes": 56,
        },
    },
]


class Command(BaseCommand):
    help = "Popula o banco com autores, categorias, subcategorias e artigos iniciais (idempotente)."

    def handle(self, *args, **options):
        # ───── Fase 1: Categorias ─────
        categories = {}
        created_categories = 0
        for cat_data in INITIAL_CATEGORIES:
            cat, created = Category.objects.get_or_create(
                slug=cat_data["slug"],
                defaults={"name": cat_data["name"], "order": cat_data["order"]},
            )
            categories[cat_data["slug"]] = cat
            if created:
                created_categories += 1

        # ───── Fase 2: Subcategorias ─────
        subcategories = {}
        created_subcategories = 0
        for sub_data in INITIAL_SUBCATEGORIES:
            cat = categories.get(sub_data["category_slug"])
            if not cat:
                continue
            sub, created = Subcategory.objects.get_or_create(
                category=cat,
                slug=sub_data["slug"],
                defaults={"name": sub_data["name"], "order": sub_data["order"]},
            )
            subcategories[f"{sub_data['category_slug']}::{sub_data['slug']}"] = sub
            if created:
                created_subcategories += 1

        # ───── Fase 3: Posts ─────
        created_posts = 0
        for item in SEED_POSTS:
            author_data = item["author"]
            post_data = item["post"]

            author, _ = User.objects.get_or_create(
                username=author_data["username"],
                defaults={
                    "display_name": author_data["display_name"],
                    "role": author_data["role"],
                    "bio": author_data["bio"],
                },
            )

            category = categories.get(post_data["category_slug"])
            if not category:
                self.stdout.write(
                    self.style.WARNING(
                        f"Categoria '{post_data['category_slug']}' ausente. Pulando post."
                    )
                )
                continue

            subcategory = None
            if post_data.get("subcategory_slug"):
                sub_key = f"{post_data['category_slug']}::{post_data['subcategory_slug']}"
                subcategory = subcategories.get(sub_key)

            post_defaults = {
                "summary": post_data["summary"],
                "content": post_data["content"],
                "tags": post_data["tags"],
                "read_time": post_data["read_time"],
                "views": post_data["views"],
                "likes": post_data["likes"],
                "category": category,
                "subcategory": subcategory,
                "author": author,
            }

            post, created = Post.objects.get_or_create(
                title=post_data["title"],
                defaults=post_defaults,
            )
            if created:
                created_posts += 1
                Comment.objects.create(
                    post=post,
                    author_name="Ana_DevOps",
                    role="SRE Specialist",
                    text="Excelente artigo!",
                )

        # ───── Resumo ─────
        self.stdout.write(
            self.style.SUCCESS(
                f"Seed concluído: "
                f"{created_categories} nova(s) categoria(s), "
                f"{created_subcategories} nova(s) subcategoria(s), "
                f"{created_posts} novo(s) post(s). "
                f"Total: {Category.objects.count()} categorias, "
                f"{Subcategory.objects.count()} subcategorias, "
                f"{Post.objects.count()} posts."
            )
        )
        