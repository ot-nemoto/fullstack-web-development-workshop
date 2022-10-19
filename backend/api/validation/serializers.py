from rest_framework import serializers


class ValidationSerializer(serializers.Serializer):
    delivery_date = serializers.DateField(help_text="納品日", required=True)
    store = serializers.CharField(
        help_text="コード", max_length=3, allow_null=True, required=False)
