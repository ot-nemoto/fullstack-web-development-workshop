"""
【執筆メモStart】
django-admin startappで自動生成された後
nameを"api.sales"に変更しています。
【執筆メモEnd】
"""
from django.apps import AppConfig


class SalesConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "api.sales"
