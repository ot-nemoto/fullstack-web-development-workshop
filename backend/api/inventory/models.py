"""
【執筆メモStart】
商品モデル（テーブル）と、その子供の仕入/売上モデルを定義しています。
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
    price = models.IntegerField(verbose_name='価格')
    class Meta:
        db_table = 'product'
        verbose_name = '商品'

class Purchase(models.Model):
    """
    仕入
    """
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField(verbose_name='数量')
    purchase_date = models.DateTimeField(verbose_name='仕入日時')
    class Meta:
        db_table = 'purchase'
        verbose_name = '仕入'

class Order(models.Model):
    """
    売上
    """
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField(verbose_name='数量')
    order_date = models.DateTimeField(verbose_name='売上日時')
    class Meta:
        db_table = 'order'
        verbose_name = '売上'
