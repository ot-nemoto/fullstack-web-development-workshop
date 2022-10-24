"""
【執筆メモStart】
Helloモデル（テーブル）を定義しています。
db_tableで実際のテーブル名を設定しています。
https://docs.djangoproject.com/ja/4.1/topics/db/models/
【執筆メモEnd】
"""
from django.db import models


class Hello(models.Model):
    world = models.CharField(max_length=100)

    class Meta:
        db_table = "hello"
