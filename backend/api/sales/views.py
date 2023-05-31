"""
【執筆メモStart】
同期処理と非同期処理の実装です。
https://www.django-rest-framework.org/api-guide/parsers/#fileuploadparser
https://docs.python.org/ja/3/library/functions.html
https://pandas.pydata.org/
https://docs.djangoproject.com/en/4.1/topics/db/aggregation/
https://docs.djangoproject.com/en/4.1/ref/models/database-functions/

■在庫ファイルサンプル
product,date,quantity
1,2023-03-01,300
1,2023-03-15,100
1,2023-04-03,200
【執筆メモEnd】
"""
import pandas
from django.db.models import Sum
from django.db.models.functions import TruncMonth
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView

from ..inventory.models import Sales, SalesFile, Status


class SalesSyncView(APIView):
    pass
    # inventoryに移動
