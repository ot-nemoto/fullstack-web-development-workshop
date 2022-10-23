from api.exception import BusinessException
from api.validation.serializers import ValidationSerializer
from django.shortcuts import render
from rest_framework import status, views
from rest_framework.response import Response


class ValidationView(views.APIView):
    def post(self, request):
        # http://127.0.0.1:8000/api/validation/
        # 【NG】POST {"delivery_date":"2022-10-10", "store":"111", "price_product":[{"price":"hoge"}]}
        # 【NG】POST {"delivery_date":"2022-10-10", "store":"123", "price_product":[{"price":1357}]}
        # 【OK】POST {"delivery_date":"2022-10-10", "store":"111", "price_product":[{"price":1357}]}
        serializer = ValidationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        if serializer.data.get('store') == '123':
            raise BusinessException('123ストアは現在メンテナンス中です。しばらくたってから再実行ください')
        return Response(serializer.data, status.HTTP_200_OK)
