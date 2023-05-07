"""
【執筆メモStart】
【執筆メモEnd】
"""
from rest_framework import status, views
from rest_framework.response import Response

# Create your views here.class ProductView(views.APIView):
    def get(self, request):
        return Response({"message": "product"})
        