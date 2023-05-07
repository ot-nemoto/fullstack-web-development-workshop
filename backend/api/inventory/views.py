"""
【執筆メモStart】
【執筆メモEnd】
"""
from rest_framework import generics, status, views, viewsets
from rest_framework.response import Response

from .models import Product
from .serializers import ProductSerializer

# DjangoにはRestAPIでも複数の取得方法がある
# 1. APIView: 一番汎用性が高い
class ProductsView(views.APIView):
    def get(self, request, format=None):
        queryset = Product.objects.all()
        serializer = ProductSerializer(queryset, many=True)
        return Response(serializer.data, status.HTTP_200_OK)

class ProductView(views.APIView):
    def get(self, request, id, format=None):
        product = Product.objects.get(id=id)
        serializer = ProductSerializer(product)
        return Response(serializer.data, status.HTTP_200_OK)

# 2. GenericsAPIView: 次に汎用性が高い
class ProductGenericView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

# 3. ModelViewSet: 汎用性は低いが楽
class ProductModelViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer