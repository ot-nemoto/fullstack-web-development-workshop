from rest_framework import status, views, viewsets
from rest_framework.response import Response

from .models import Product
from .serializers import ProductSerializer


class ProductView(views.APIView):
    def post(self, request):
        # http://127.0.0.1:8000/api/product/backend/
        # POST {"name":"hoge"}
        serializer = ProductSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status.HTTP_201_CREATED)


class ProductViewSet(viewsets.ModelViewSet):
    # 一覧 GET http://127.0.0.1:8000/api/product/
    #
    # 詳細 GET http://127.0.0.1:8000/api/product/1/
    #
    # 更新 PUT http://127.0.0.1:8000/api/product/1/
    # {
    # "name": "hoge2",
    # "id": 1,
    # "price_product": [
    #       {
    #         "id": 1,
    #         "price": 100,
    #         "start_date": "2010-10-10",
    #         "end_date": "2010-10-10",
    #         "product": 1
    #        }
    #     ]
    # }
    #
    # 追加 POST http://127.0.0.1:8000/api/product/
    # {
    #   "name": "追加",
    #   "id": 8,
    #   "price_product": []
    # }
    #
    # 削除 DELETE /api/product/1/
    #
    # 子テーブルも含めて取得
    queryset = Product.objects.all().prefetch_related('price_product')
    serializer_class = ProductSerializer
