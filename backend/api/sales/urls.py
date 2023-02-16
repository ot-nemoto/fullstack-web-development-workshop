"""
【執筆メモStart】
URLとviews.pyの紐づけを行っています。
https://www.django-rest-framework.org/api-guide/routers/
【執筆メモEnd】
"""
from django.urls import path
from . import views

urlpatterns = [
    path('sync/', views.SalesSyncView.as_view()),
    path('async/', views.SalesAsyncView.as_view()),
    path('', views.SalesList.as_view())
]
