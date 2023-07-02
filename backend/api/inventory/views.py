"""
【執筆メモStart】
公式チュートリアルに合わせてinstance取得処理を共通化
https://www.django-rest-framework.org/tutorial/3-class-based-views/

各種絞込絞込み条件を追加
https://docs.djangoproject.com/en/4.2/ref/models/querysets/

認証・認可の設定を追加
https://www.django-rest-framework.org/api-guide/authentication/
https://www.django-rest-framework.org/api-guide/permissions/#isauthenticated
【執筆メモEnd】
"""
from api.exception import BusinessException
import pandas
from django.conf import settings
from django.db.models import F, Q, Value, Sum
from django.db.models.functions import TruncMonth, Coalesce
from rest_framework.exceptions import NotFound
from rest_framework import generics, status, views, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer

from .models import Product, Purchase, Sales, SalesFile, Status
from .serializers import InventorySerializer, ProductSerializer, PurchaseSerializer, SaleSerializer, SalesSerializer, FileSerializer

class LoginView(views.APIView):
    """ユーザーのログイン処理

    Args:
        APIView (class): rest_framework.viewsのAPIViewを受け取る
    """
    # 認証クラスの指定
    # リクエストヘッダーにtokenを差し込むといったカスタム動作をしないので素の認証クラスを使用する
    authentication_classes = [JWTAuthentication]
    # アクセス許可の指定
    permission_classes = []

    def post(self, request):
        serializer = TokenObtainPairSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        access = serializer.validated_data.get("access", None)
        refresh = serializer.validated_data.get("refresh", None)
        if access:
            response = Response(status=status.HTTP_200_OK)
            max_age = settings.COOKIE_TIME
            response.set_cookie('access', access, httponly=True, max_age=max_age)
            response.set_cookie('refresh', refresh, httponly=True, max_age=max_age)
            return response
        return Response({'errMsg': 'ユーザーの認証に失敗しました'}, status=status.HTTP_401_UNAUTHORIZED)

class RetryView(views.APIView):
    """ユーザーの再ログイン処理

    Args:
        APIView (class): rest_framework.viewsのAPIViewを受け取る
    """
    def post(self, request):
        serializer = TokenRefreshSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        access = serializer.validated_data.get("access", None)
        refresh = serializer.validated_data.get("refresh", None)
        if access:
            response = Response(status=status.HTTP_200_OK)
            max_age = settings.COOKIE_TIME
            response.set_cookie('access', access, httponly=True, max_age=max_age)
            response.set_cookie('refresh', refresh, httponly=True, max_age=max_age)
            return response
        return Response({'errMsg': 'ユーザーの認証に失敗しました'}, status=status.HTTP_401_UNAUTHORIZED)

class LogoutView(views.APIView):
    """ユーザーのログアウト処理

    Args:
        APIView (class): rest_framework.viewsのAPIViewを受け取る
    """
    def post(self, request, *args):
        response = Response(status=status.HTTP_200_OK)
        response.delete_cookie('access')
        response.delete_cookie('refresh')
        return response

# DjangoにはRestAPIでも複数の取得方法がある
# 1. APIView: 一番汎用性が高い
class ProductView(views.APIView):
    # # 認証クラスの指定
    # authentication_classes = [CustomJWTAuthentication]
    # # アクセス許可の指定
    # # 認証済みのリクエストのみ許可
    # permission_classes = [IsAuthenticated]

    # 商品操作に関する関数で共通で使用する商品取得関数
    def get_object(self, pk):
        try:
            return Product.objects.get(pk=pk)
        except Product.DoesNotExist:
            raise NotFound

    # 商品を取得する
    # クエリパラメータ
    # q: 商品名、説明のあいまい検索
    # limit: 件数
    # offset: x番目から
    # sort: 
    def get(self, request, id=None, format=None):
        if id is None :
            # 全商品を取得する
            queryset = Product.objects.all()
            # 絞込み条件
            # 取得項目を指定する
            # TDOO: 現状、取得フィールドを指定するとシリアライザーとの不一致で例外が発生する
            # fields = request.GET.get('fields')
            # if fields is not None:
            #     queryset = queryset.values(fields)

            # 名前をあいまい検索する
            q = request.GET.get('q')
            if q is not None:
                queryset = queryset.filter(Q(name__icontains=q))

            # 指定項目でソートする
            sort = request.GET.get('sort')
            if sort is not None:
                queryset = queryset.order_by(F(sort))

            # 取得件数とオフセットを指定する
            limit = request.GET.get('limit')
            if limit is None:
                limit = 50
            else:
                limit = int(limit)
            offset = request.GET.get('offset')
            if offset is None:
                offset = 0
            else:
                offset = int(offset)

            serializer = ProductSerializer(queryset[offset:offset + limit], many=True)
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
    # TODO: authentication_classes, permission_classes を設定する

    queryset = Product.objects.all()
    serializer_class = ProductSerializer

# 3. ModelViewSet: 汎用性は低いが楽
class ProductModelViewSet(viewsets.ModelViewSet):
    # TODO: authentication_classes, permission_classes を設定する
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class PurchaseView(views.APIView):
    # TODO: authentication_classes, permission_classes を設定する
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
            serializer = SaleSerializer(queryset, many=True)
        else: 
            product = self.get_object(id)
            serializer = SaleSerializer(product)
        return Response(serializer.data, status.HTTP_200_OK)

    # 売上情報を登録する
    def post(self, request, format=None):
        sales_file = SalesFile(file_name="None", status=Status.SYNC)
        sales_file.save()
        data = request.data.copy()
        data['sales_date'] = '2022-01-01'
        data['import_file'] = sales_file.pk
        serializer = SaleSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        # バリデーション: 在庫が売る分の数量を超えないかチェック
        purchase = Purchase.objects.filter(product_id=data['product']).aggregate(quantity_sum=Coalesce(Sum('quantity'), 0))  # 在庫テーブルのレコードを取得
        sales = Sales.objects.filter(product_id=data['product']).aggregate(quantity_sum=Coalesce(Sum('quantity'), 0))  # 卸しテーブルのレコードを取得

        # 在庫が売る分の数量を超えている場合はエラーレスポンスを返す
        if purchase['quantity_sum'] < (sales['quantity_sum'] + int(data['quantity'])):
            raise BusinessException('在庫数量を超過することはできません')

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
            purchase = Purchase.objects.filter(product_id=id).prefetch_related('product').values("id", "quantity", type=Value('1'), date=F('purchase_date'), unit=F('product__price'))
            sales = Sales.objects.filter(product_id=id).prefetch_related('product').values("id", "quantity", type=Value('2'), date=F('sales_date'), unit=F('product__price'))
            queryset = purchase.union(sales).order_by(F("date"))
            serializer = InventorySerializer(queryset, many=True)
        return Response(serializer.data, status.HTTP_200_OK)

class SalesSyncView(views.APIView):

    def post(self, request, format=None):
        serializer = FileSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        filename = serializer.validated_data['file'].name

        with open(filename, 'wb') as f:
            f.write(serializer.validated_data['file'].read())

        sales_file = SalesFile(file_name=filename, status=Status.SYNC)
        sales_file.save()

        df = pandas.read_csv(filename)
        for _, row in df.iterrows():
            sales = Sales(
                product_id=row['product'], sales_date=row['date'], quantity=row['quantity'], import_file=sales_file)
            sales.save()

        return Response(status=201)


class SalesAsyncView(views.APIView):
    def post(self, request, format=None):
        serializer = FileSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        filename = serializer.validated_data['file'].name

        with open(filename, 'wb') as f:
            f.write(serializer.validated_data['file'].read())

        sales_file = SalesFile(
            file_name=filename, status=Status.ASYNC_UNPROCESSED)
        sales_file.save()

        return Response(status=201)


class SalesList(generics.ListAPIView):
    queryset = Sales.objects.annotate(monthly_date=TruncMonth('sales_date')).values(
        'monthly_date').annotate(monthly_price=Sum('quantity')).order_by('monthly_date')
    serializer_class = SalesSerializer
