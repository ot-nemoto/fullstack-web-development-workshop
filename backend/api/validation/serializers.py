from rest_framework import serializers


class SubSerializer(serializers.Serializer):
    store = serializers.CharField(
        help_text="コード", max_length=3, allow_null=True, required=False)


class ValidationSerializer(serializers.Serializer):
    delivery_date = serializers.DateField(help_text="納品日", required=True)
    store = serializers.CharField(
        help_text="コード", max_length=3, allow_null=True, required=False)
    price_product = SubSerializer(many=True)

    def validate_store(self, value):
        if '111' not in value:
            raise serializers.ValidationError("111以外はエラーです")
        return value
