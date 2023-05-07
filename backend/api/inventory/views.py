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
class ProductView(views.APIView):
    # 商品を取得する
    def get(self, request, id=None, format=None):
        if id is None :
            # 全商品を取得する
            queryset = Product.objects.all()
            serializer = ProductSerializer(queryset, many=True)
        else: 
            # 1件の商品を取得する
            product = Product.objects.get(id=id)
            serializer = ProductSerializer(product)
        return Response(serializer.data, status.HTTP_200_OK)

    # 商品を登録する
    def post(self, request, format=None):
        serializer = ProductSerializer(data=request.data)
        # When a serializer is passed a `data` keyword argument you must call `.is_valid()` before attempting to access the serialized `.data` representation.
        # You should either call `.is_valid()` first, or access `.initial_data` instead.
        # validationを通らなかった場合、例外を投げる
        serializer.is_valid(raise_exception=True)
        # 検証したデータを永続化する
        serializer.save()
        return Response(serializer.data, status.HTTP_201_CREATED)

# 2. GenericsAPIView: 次に汎用性が高い
class ProductGenericView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

# 3. ModelViewSet: 汎用性は低いが楽
class ProductModelViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer