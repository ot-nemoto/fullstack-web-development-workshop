"""
【執筆メモStart】
バッチ（カスタムコマンド）のサンプルです。
python manage.py hello_batch --settings config.settings.development
で実行できます。
https://docs.djangoproject.com/en/4.1/howto/custom-management-commands/
【執筆メモEnd】
"""
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    def handle(self, *args, **options):
        print("hello")
