"""
【執筆メモStart】
公式チュートリアルに合わせてinstance取得処理を共通化
https://www.django-rest-framework.org/tutorial/3-class-based-views/
【執筆メモEnd】
"""
from django.db.models import F, Value
from rest_framework.exceptions import NotFound
from rest_framework import generics, status, views, viewsets
from rest_framework.response import Response

from .models import Product, Purchase, Sales
from .serializers import InventorySerializer, ProductSerializer, PurchaseSerializer, SalesSerializer

# DjangoにはRestAPIでも複数の取得方法がある
# 1. APIView: 一番汎用性が高い
class ProductView(views.APIView):
    # 商品操作に関する関数で共通で使用する商品取得関数
    def get_object(self, pk):
        try:
            return Product.objects.get(pk=pk)
        except Product.DoesNotExist:
            raise NotFound

    # 商品を取得する
    def get(self, request, id=None, format=None):
        if id is None :
            # 全商品を取得する
            queryset = Product.objects.all()
            serializer = ProductSerializer(queryset, many=True)
        else: 
            # 1件の商品を取得する
            product = self.get_object(id)
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

    # 商品を更新する
    # URLからidを取得
    def put(self, request, id, format=None):
        product = self.get_object(id)
        serializer = ProductSerializer(instance=product, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status.HTTP_200_OK)

    # requestからidを取得
    # ただし、API設計的にリクエストパラメーターからidを取得することはないので参考程度に
    # def put(self, request, format=None):
    #     id = request.data.get('id')
    #     product = self.get_object(id)
    #     serializer = ProductSerializer(instance=product, data=request.data)
    #     serializer.is_valid(raise_exception=True)
    #     serializer.save()
    #     return Response(serializer.data, status.HTTP_200_OK)

    # 商品を削除する
    # URLからidを取得
    def delete(self, request, id, format=None):
        product = self.get_object(id)
        product.delete()
        return Response(status = status.HTTP_200_OK)

# 2. GenericsAPIView: 次に汎用性が高い
class ProductGenericView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

# 3. ModelViewSet: 汎用性は低いが楽
class ProductModelViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class PurchaseView(views.APIView):
    def get_object(self, pk):
        try:
            return Purchase.objects.get(pk=pk)
        except Purchase.DoesNotExist:
            raise NotFound

    # 仕入情報を取得する
    def get(self, request, id=None, format=None):
        if id is None :
            queryset = Purchase.objects.all()
            serializer = PurchaseSerializer(queryset, many=True)
        else: 
            product = self.get_object(id)
            serializer = PurchaseSerializer(product)
        return Response(serializer.data, status.HTTP_200_OK)

    # 仕入情報を登録する
    def post(self, request, format=None):
        serializer = PurchaseSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status.HTTP_201_CREATED)

    # 仕入れについては、更新・削除処理はない

class SalesView(views.APIView):
    def get_object(self, pk):
        try:
            return Sales.objects.get(pk=pk)
        except Sales.DoesNotExist:
            raise NotFound

    # 売上情報を取得する
    def get(self, request, id=None, format=None):
        if id is None :
            queryset = Sales.objects.all()
            serializer = SalesSerializer(queryset, many=True)
        else: 
            product = self.get_object(id)
            serializer = SalesSerializer(product)
        return Response(serializer.data, status.HTTP_200_OK)

    # 売上情報を登録する
    def post(self, request, format=None):
        serializer = SalesSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status.HTTP_201_CREATED)

    # 売上については、更新・削除処理はない

# 仕入れ・売上情報を一元的に扱うView
# 単一のモデルではなく仕入れ・売上モデルのそれぞれに依存する
class InventoryView(views.APIView):
    # 仕入れ・売上情報を取得する
    def get(self, request, id=None, format=None):
        if id is None :
            # 件数が多くなるので商品IDは必ず指定する
            return Response(serializer.data, status.HTTP_400_BAD_REQUEST)
        else: 
            # UNIONするために、それぞれフィールド名を再定義している
            purchase = Purchase.objects.filter(product_id=id).values("id", "quantity", type=Value('1'), date=F('purchase_date'))
            sales = Sales.objects.filter(product_id=id).values("id", "quantity", type=Value('2'), date=F('sales_date'))
            queryset = purchase.union(sales)
            serializer = InventorySerializer(queryset, many=True)
        return Response(serializer.data, status.HTTP_200_OK)