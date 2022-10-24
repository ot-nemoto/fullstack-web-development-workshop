"""
【執筆メモStart】
商品シリアライザと、その子供の価格シリアライザを定義しています。
ModelSerializerを使用することで、モデルからシリアライザを自動生成しています。
https://www.django-rest-framework.org/api-guide/serializers/
【執筆メモEnd】
"""
from rest_framework import serializers

from .models import Product, Price


class PriceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Price
        fields = '__all__'


class ProductSerializer(serializers.ModelSerializer):
    price_product = PriceSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = ('name', 'id', 'price_product')
