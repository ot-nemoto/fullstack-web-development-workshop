"""
【執筆メモStart】
■ProductView
商品の登録が可能です。
http://127.0.0.1:8000/api/product/backend/
POST {"name":"hoge"}


■ProductViewSet
ModelViewSetを使用しているので、一覧の下記操作が可能です。

一覧 GET http://127.0.0.1:8000/api/product/

詳細 GET http://127.0.0.1:8000/api/product/1/

更新 PUT http://127.0.0.1:8000/api/product/1/
{
"name": "hoge2",
"id": 1,
"price_product": [
      {
        "id": 1,
        "price": 100,
        "start_date": "2010-10-10",
        "end_date": "2010-10-10",
        "product": 1
       }
    ]
}

追加 POST http://127.0.0.1:8000/api/product/
{
  "name": "追加",
  "id": 8,
  "price_product": []
}

削除 DELETE http://127.0.0.1:8000/api/product/2/

子テーブルも含めて取得しています。

https://www.django-rest-framework.org/api-guide/viewsets/
【執筆メモEnd】
"""
from rest_framework import status, views, viewsets
from rest_framework.response import Response

from .models import Product
from .serializers import ProductSerializer


class ProductView(views.APIView):
    def post(self, request):
        serializer = ProductSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status.HTTP_201_CREATED)


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().prefetch_related('price_product')
    serializer_class = ProductSerializer
