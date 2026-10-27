"""
Popula o banco com autores e artigos iniciais (equivalente ao seed do frontend MVP).

Uso: python manage.py seed_articles
"""
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

from api.models import Comment, Post

User = get_user_model()


SEED = [
    {
        "author": {
            "username": "guido_dev",
            "display_name": "Guido Dev",
            "role": "Backend Lead",
            "bio": "Engenheiro de Software & Maintainer",
        },
        "post": {
            "title": "Desvendando o Python GIL: O Que Muda na Concorrência Moderna",
            "category": "Programação",
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
            "category": "DevOps",
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
            "category": "IA",
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
    help = "Popula o banco com autores e artigos iniciais (idempotente)."

    def handle(self, *args, **options):
        created_posts = 0

        for item in SEED:
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

            post, created = Post.objects.get_or_create(
                title=post_data["title"],
                defaults={**post_data, "author": author},
            )
            if created:
                created_posts += 1
                # Comentário de exemplo
                Comment.objects.create(
                    post=post,
                    author_name="Ana_DevOps",
                    role="SRE Specialist",
                    text="Excelente artigo!",
                )

        self.stdout.write(
            self.style.SUCCESS(
                f"Seed concluído: {created_posts} novos posts criados, "
                f"{Post.objects.count()} posts no total."
            )
        )
        