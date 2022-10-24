"""
【執筆メモStart】
ValidationSerializerシリアライザと、その子供のSubSerializerシリアライザを定義しています。
必須や桁数を定義しています。
https://www.django-rest-framework.org/api-guide/serializers/
【執筆メモEnd】
"""
from rest_framework import serializers


class SubSerializer(serializers.Serializer):
    price = serializers.IntegerField(
        help_text="価格", allow_null=True, required=False)


class ValidationSerializer(serializers.Serializer):
    delivery_date = serializers.DateField(help_text="納品日", required=True)
    store = serializers.CharField(
        help_text="ストア", max_length=3, allow_null=True, required=False)
    price_product = SubSerializer(many=True)
