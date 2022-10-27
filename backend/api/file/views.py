"""
【執筆メモStart】
https://www.django-rest-framework.org/api-guide/parsers/#fileuploadparser
【執筆メモEnd】
"""
from rest_framework import views
from rest_framework.response import Response


class FileUploadView(views.APIView):
    def post(self, request,  format=None):
        file1 = request.data['file1']
        file2 = request.data['file2']
        text = request.data['text']
        print(file1.size)
        print(file2.size)
        print(text)
        return Response(status=204)
