from common.model_serializers import ProductSerializer,PriceSerializer
from common.models import Product, Price
from django.shortcuts import render
from rest_framework import status, views, viewsets
from rest_framework.response import Response


class ProductView(views.APIView):
    def post(self, request):
        # http://127.0.0.1:8000/api/product/backend/
        # POST {"name":"hoge"}
        serializer = ProductSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status.HTTP_201_CREATED)


class ProductViewSet(viewsets.ModelViewSet):
    # http://127.0.0.1:8000/api/product/modelview/product/
    # http://127.0.0.1:8000/api/product/modelview/product/1/
    # 子テーブルも含めて取得
    queryset = Product.objects.all().prefetch_related('price_product')
    serializer_class = ProductSerializer
