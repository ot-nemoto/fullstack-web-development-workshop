"""
【執筆メモStart】
URLとviews.pyの紐づけを行っています。
https://www.django-rest-framework.org/api-guide/routers/
【執筆メモEnd】
"""
from django.urls import path, include
from rest_framework import routers
from . import views

router = routers.SimpleRouter()
router.register('', views.ProductViewSet)


urlpatterns = [
    path('backend/', views.ProductView.as_view()),
    path('', include(router.urls))
]
