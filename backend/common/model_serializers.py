from rest_framework import serializers

from common.models import Product, Price


class PriceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Price
        fields = '__all__'


class ProductSerializer(serializers.ModelSerializer):
    price_product = PriceSerializer(many=True)

    class Meta:
        model = Product
        fields = ('name', 'id', 'price_product')
