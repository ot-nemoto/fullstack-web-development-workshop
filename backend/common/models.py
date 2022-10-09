from django.db import models


class Hello(models.Model):
    world = models.CharField(max_length=100)

    class Meta:
        db_table = "hello"


class Product(models.Model):
    """
    商品
    """
    name = models.DateField(max_length=100, verbose_name='商品名')

    class Meta:
        db_table = 'product'
        verbose_name = '商品'


class Sales(models.Model):
    """
    売上
    """
    price = models.IntegerField(verbose_name='販売価格')
    product = models.ForeignKey(
        Product, on_delete=models.PROTECT, verbose_name='CPコード')

    class Meta:
        db_table = 'sales'
        verbose_name = '売上'
