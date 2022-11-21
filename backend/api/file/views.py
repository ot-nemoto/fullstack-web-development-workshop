"""
【執筆メモStart】
https://www.django-rest-framework.org/api-guide/parsers/#fileuploadparser
【執筆メモEnd】
"""
import tempfile

from django.http import FileResponse
from rest_framework import views
from rest_framework.response import Response


class FileUploadView(views.APIView):
    def post(self, request, format=None):
        file1 = request.data['file1']
        file2 = request.data['file2']
        text = request.data['text']
        print(file1.size)
        print(file2.size)
        print(text)
        return Response(status=204)

    def get(self, request, format=None):
        tmp = tempfile.NamedTemporaryFile(delete=False)
        with open(tmp.name, 'w') as f:
            f.write('ファイル内容')
        return FileResponse(open(tmp.name, 'rb'))
