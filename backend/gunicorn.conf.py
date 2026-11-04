# backend/gunicorn.conf.py
import multiprocessing

# Workers: 2 * CPUs + 1 é a heurística clássica
workers = multiprocessing.cpu_count() * 2 + 1
worker_class = "sync"
timeout = 60
keepalive = 5