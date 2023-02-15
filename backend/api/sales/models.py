"""
【執筆メモStart】
モデル（テーブル）を定義しています。
db_tableで実際のテーブル名を設定しています。
https://docs.djangoproject.com/ja/4.1/topics/db/models/
【執筆メモEnd】
"""
from django.db import models


class Status(models.IntegerChoices):
    """
    状態
    """
    SYNC = 0, '同期'
    ASYNC_UNPROCESSED = 1, '非同期_未処理'
    ASYNC_PROCESSED = 2, '非同期_処理済'


class SalesFile(models.Model):
    file_name = models.CharField(max_length=100, verbose_name='ファイル名')
    status = models.IntegerField(choices=Status.choices, verbose_name='状態')

    class Meta:
        verbose_name = '売上ファイル'
        db_table = 'sales_file'


class Sales(models.Model):
    sales_date = models.DateField(verbose_name='売上日付')
    price = models.IntegerField(verbose_name='価格')
    import_file = models.ForeignKey(
        SalesFile, on_delete=models.CASCADE, verbose_name='売上ファイルID')

    class Meta:
        verbose_name = '売上'
        db_table = "sales"
