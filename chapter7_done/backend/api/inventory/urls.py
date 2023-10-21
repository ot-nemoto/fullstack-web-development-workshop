from django.urls import path
from . import views
urlpatterns = [
    path('sync/', views.SalesSyncView.as_view()),
    path('async/', views.SalesAsyncView.as_view()),
    path('summary/', views.SalesList.as_view())
]
