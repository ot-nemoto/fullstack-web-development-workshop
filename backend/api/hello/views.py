"""
【執筆メモStart】
http://127.0.0.1:8000/api/hello/backend/
にアクセスすると
{"message": "backend"}が返却されます。
【執筆メモEnd】
"""
from rest_framework.response import Response
from rest_framework.views import APIView


class Backend(APIView):
    def get(self, request, format=None):
        return Response({"message": "backend"})
