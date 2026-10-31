"""
Re-salva todos os posts, aplicando sanitização via `Post.save()`.

Uso:
    python manage.py sanitize_existing_posts --dry-run   # só lista
    python manage.py sanitize_existing_posts             # aplica

Útil para migrar posts criados antes do ADR-013 (Passo 4).
"""
from django.core.management.base import BaseCommand

from api.models import Post
from api.sanitizers import sanitize_html


class Command(BaseCommand):
    help = "Sanitiza o HTML de todos os posts existentes (ADR-013)."

    def add_arguments(self, parser):
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Apenas lista posts que seriam alterados, sem gravar.",
        )

    def handle(self, *args, **options):
        dry_run = options["dry_run"]
        changed = 0
        unchanged = 0

        for post in Post.objects.all().iterator():
            clean = sanitize_html(post.content or "")
            if clean != (post.content or ""):
                changed += 1
                self.stdout.write(
                    self.style.WARNING(
                        f"[{'WOULD CHANGE' if dry_run else 'CHANGING'}] {post.id} — {post.title[:60]}"
                    )
                )
                if not dry_run:
                    post.content = clean
                    # save() chamaria sanitize_html de novo (idempotente — ok).
                    post.save(update_fields=["content"])
            else:
                unchanged += 1

        self.stdout.write("")
        self.stdout.write(
            self.style.SUCCESS(
                f"Resumo: {changed} post(s) {'a alterar' if dry_run else 'alterado(s)'}, "
                f"{unchanged} sem mudanças."
            )
        )
        if dry_run and changed > 0:
            self.stdout.write(
                self.style.WARNING(
                    "Rode sem --dry-run para aplicar as mudanças."
                )
            )
            