"""
【執筆メモStart】
http://127.0.0.1:8000/api/hello_db/backend/
にアクセスすると
Helloモデルのid=1のレコードが返却されます。
【執筆メモEnd】
"""
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Hello


class Db(APIView):
    def get(self, request, format=None):
        entry = Hello.objects.get(id=1)
        return Response({"message": entry.world})
