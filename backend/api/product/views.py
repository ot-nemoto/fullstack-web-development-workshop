from common.model_serializers import ProductSerializer
from django.shortcuts import render
from rest_framework import status, views
from rest_framework.response import Response


class Product(views.APIView):
    def post(self, request):
        # {"name":"hoge"}
        serializer = ProductSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status.HTTP_201_CREATED)
