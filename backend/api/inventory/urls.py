"""
【執筆メモStart】
URLとviews.pyの紐づけを行っています。
https://www.django-rest-framework.org/api-guide/routers/
【執筆メモEnd】
"""
from django.urls import path
from . import views

urlpatterns = [
    path('products', views.ProductsView.as_view()),
    path('products/generics', views.ProductGenericView.as_view()),
    path('products/model', views.ProductModelViewSet.as_view({'get': 'list'}))
]
