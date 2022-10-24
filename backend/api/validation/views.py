"""
【執筆メモStart】
バリデーションを行っています。

ValidationSerializerの定義にしたがって、is_validを行い
パラメータ不正（桁数超過、必須など）の場合はHTTPステータス400を返却しています。
パラメータ不正は、基本的にフロントエンドでチェックするので
発生するのは、値の改ざんくらいの想定です。

一方
業務エラー（買おうとした商品が直前に売り切れ…などフロントエンドで把握できない業務的なエラー）
の場合はBusinessExceptionでHTTPステータス422を返却しています。（記載の例は微妙ですが）
SerializerとHTTPステータスをわけることで、フロントエンドでの対応をわけることを想定しています。
（422の場合は返却したエラーメッセージを画面に表示、400の場合は専用エラー画面に遷移）

http://127.0.0.1:8000/api/validation/
【シリアライザNG】POST {"delivery_date":"2022-10-10", "store":"111", "price_product":[{"price":"hoge"}]}
【業務エラー】POST {"delivery_date":"2022-10-10", "store":"123", "price_product":[{"price":1357}]}
【OK】POST {"delivery_date":"2022-10-10", "store":"111", "price_product":[{"price":1357}]}

https://www.django-rest-framework.org/api-guide/views/
【執筆メモEnd】
"""
from api.exception import BusinessException
from api.validation.serializers import ValidationSerializer
from django.shortcuts import render
from rest_framework import status, views
from rest_framework.response import Response


class ValidationView(views.APIView):
    def post(self, request):
        serializer = ValidationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        if serializer.data.get('store') == '123':
            raise BusinessException('123ストアは現在メンテナンス中です。しばらくたってから再実行ください')
        return Response(serializer.data, status.HTTP_200_OK)
