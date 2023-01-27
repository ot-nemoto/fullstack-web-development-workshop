"""
【執筆メモStart】
http://127.0.0.1:8000/api/sales/
にアクセスすると
Salesモデルのid=1のレコードが返却されます。

https://www.django-rest-framework.org/api-guide/parsers/#fileuploadparser
【執筆メモEnd】
"""
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import FileSerializer
from .models import Sales
import csv
from django.http.multipartparser import MultiPartParser
import io

class SalesView(APIView):

    def post(self, request, format=None):
        serializer = FileSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        print(serializer.validated_data['file'].size)

        # Read csv file InMemoryUploadedFile
        file = serializer.validated_data['file'].read().decode('utf-8-sig')

        io_string = io.StringIO(file)
        for line in csv.reader(io_string):
            print(line)


        return Response(status=201)

    def get(self, request, format=None):
        entry = Sales.objects.get(id=1)
        return Response({"message": entry.price})
