"""
【執筆メモStart】
モデル（テーブル）を定義しています。
db_tableで実際のテーブル名を設定しています。
https://docs.djangoproject.com/ja/4.1/topics/db/models/
【執筆メモEnd】
"""
from django.db import models


class SalesFile(models.Model):
    sales_date = models.DateField(verbose_name='売上日付')
    file_name = models.CharField(max_length=100, verbose_name='ファイル名')

    class Meta:
        verbose_name = '売上ファイル'
        db_table = 'sales_file'


class Sales(models.Model):
    price = models.IntegerField(verbose_name='価格')
    import_file = models.ForeignKey(
        SalesFile, on_delete=models.CASCADE, verbose_name='売上ファイルID')

    class Meta:
        verbose_name = '売上'
        db_table = "sales"
