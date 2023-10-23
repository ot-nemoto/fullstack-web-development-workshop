from .serializers import SalesSerializer
from api.inventory.models import Sales, SalesFile, Status
from api.inventory.serializers import FileSerializer
from django.db.models import Sum
from django.db.models.functions import TruncMonth
from rest_framework.generics import ListAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
import pandas

class SalesAsyncView(APIView):
    def post(self, request, format=None):
        serializer = FileSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        filename = serializer.validated_data['file'].name
        
        with open(filename, 'wb') as f:
            f.write(serializer.validated_data['file'].read())
            
        sales_file = SalesFile(file_name=filename, status=Status.ASYNC_UNPROCESSED)
        sales_file.save()
        return Response(status=201)

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
                product_id=row['product'], sales_date=row['date'], quantity=row['quantity'], import_file=sales_file)
            sales.save()
            
        return Response(status=201)

class SalesList(ListAPIView):
    queryset = Sales.objects.annotate(monthly_date=TruncMonth('sales_date')).values('monthly_date').annotate(monthly_price=Sum('quantity')).order_by('monthly_date')
    serializer_class = SalesSerializer
