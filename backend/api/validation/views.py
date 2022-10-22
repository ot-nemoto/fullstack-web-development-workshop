from api.validation.serializers import ValidationSerializer
from django.shortcuts import render
from rest_framework import status, views
from rest_framework.response import Response


class ValidationView(views.APIView):
    def post(self, request):
        # http://127.0.0.1:8000/api/validation/
        # POST {"delivery_date":"hoge", "store":"hoge"}
        # POST {"delivery_date":"2022-10-10", "store":"111","price_product":[{"store":"222"}]}
        serializer = ValidationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data, status.HTTP_200_OK)
