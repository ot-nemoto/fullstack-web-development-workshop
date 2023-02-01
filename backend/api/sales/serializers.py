"""
【執筆メモStart】
ValidationSerializerシリアライザと、その子供のSubSerializerシリアライザを定義しています。
必須や桁数を定義しています。
https://www.django-rest-framework.org/api-guide/serializers/
【執筆メモEnd】
"""
from rest_framework import serializers


class FileSerializer(serializers.Serializer):
    file = serializers.FileField()
