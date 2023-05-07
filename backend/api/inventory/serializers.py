"""
【執筆メモStart】
ModelSerializerを使用することで、モデルからシリアライザを自動生成しています。
https://www.django-rest-framework.org/api-guide/serializers/
【執筆メモEnd】
"""
from rest_framework import serializers

from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

# class ProductsSerializer(serializers.ListSerializer):
#     child = ProductSerializer()
