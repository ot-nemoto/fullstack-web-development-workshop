"""
【執筆メモStart】
同期処理と非同期処理の実装です。
https://www.django-rest-framework.org/api-guide/parsers/#fileuploadparser
https://docs.python.org/ja/3/library/functions.html
https://pandas.pydata.org/
【執筆メモEnd】
"""
import pandas
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Sales, SalesFile, Status
from .serializers import FileSerializer


class SalesSyncView(APIView):

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
                sales_date=row['date'], price=row['price'], import_file=sales_file)
            sales.save()

        return Response(status=201)


class SalesAsyncView(APIView):
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
