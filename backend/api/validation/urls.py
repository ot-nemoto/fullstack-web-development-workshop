from django.urls import path
from . import views

urlpatterns = [
    path('', views.ValidationView.as_view()),
]
