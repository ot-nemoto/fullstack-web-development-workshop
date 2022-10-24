"""
【執筆メモStart】
独自の例外を定義しています。

■BusinessException
業務エラー（買おうとした商品が直前に売り切れ…などフロントエンドで把握できない業務的なエラー）
の場合はBusinessExceptionでHTTPステータス422を返却しています。
422の場合は、フロントエンドで返却したエラーメッセージを画面に表示…を想定しています。

https://www.django-rest-framework.org/api-guide/exceptions/
【執筆メモEnd】
"""
from rest_framework import status
from rest_framework.exceptions import ValidationError


class BusinessException(ValidationError):
    status_code = status.HTTP_422_UNPROCESSABLE_ENTITY
