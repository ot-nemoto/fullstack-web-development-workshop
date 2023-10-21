from api.inventory.models import Sales, SalesFile, Status
from api.inventory.serializers import FileSerializer
from rest_framework.views import APIView
from urllib import request, response
import pandas

class SalesAsyncView(APIView):
    pass

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
        return response(status=201)

class SalesList(APIView):
    pass
