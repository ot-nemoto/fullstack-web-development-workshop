from django.urls import path
from . import views

urlpatterns = [
    path('backend/', views.Product.as_view())
]
