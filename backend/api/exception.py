from rest_framework import status
from rest_framework.exceptions import ValidationError

# https://www.django-rest-framework.org/api-guide/exceptions/

class CustomValidationError(ValidationError):
    status_code = status.HTTP_422_UNPROCESSABLE_ENTITY
