"""
【執筆メモStart】
商品モデル（テーブル）と、その子供の価格モデルを定義しています。
db_tableで実際のテーブル名を設定しています。
https://docs.djangoproject.com/ja/4.1/topics/db/models/
【執筆メモEnd】
"""
from django.db import models


class Product(models.Model):
    """
    商品
    """
    name = models.CharField(max_length=100, verbose_name='商品名')

    class Meta:
        db_table = 'product'
        verbose_name = '商品'


class Price(models.Model):
    """
    価格
    """
    price = models.IntegerField(verbose_name='販売価格')
    start_date = models.DateField(verbose_name='開始日')
    end_date = models.DateField(verbose_name='終了日')
    product = models.ForeignKey(
        Product, on_delete=models.PROTECT, verbose_name='商品', related_name='price_product')

    class Meta:
        db_table = 'price'
        verbose_name = '価格'
