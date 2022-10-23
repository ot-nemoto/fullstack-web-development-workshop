from rest_framework import status
from rest_framework.exceptions import ValidationError

# https://www.django-rest-framework.org/api-guide/exceptions/


class BusinessException(ValidationError):
    """業務例外"""
    status_code = status.HTTP_422_UNPROCESSABLE_ENTITY
