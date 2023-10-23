from rest_framework import serializers

class FileSerializer(serializers.Serializer):
    file = serializers.FileField()

class SalesSerializer(serializers.Serializer):
    monthly_date = serializers.DateTimeField(format='%Y-%m')
    monthly_price = serializers.IntegerField()
