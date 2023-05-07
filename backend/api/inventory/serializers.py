"""
【執筆メモStart】
ModelSerializerを使用することで、モデルからシリアライザを自動生成しています。
https://www.django-rest-framework.org/api-guide/serializers/
【執筆メモEnd】
"""
from rest_framework import serializers

from .models import Product, Purchase

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class PurchaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Purchase
        fields = '__all__'