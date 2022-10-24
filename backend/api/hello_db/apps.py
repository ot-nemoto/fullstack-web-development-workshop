"""
【執筆メモStart】
django-admin startappで自動生成されたままの状態です。
【執筆メモEnd】
"""
from django.apps import AppConfig


class HelloDbConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "api.hello_db"
