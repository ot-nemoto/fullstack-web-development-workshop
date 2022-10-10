from django.urls import path,include
from rest_framework import routers
from . import views

router = routers.SimpleRouter()
router.register('product',views.ProductViewSet)


urlpatterns = [
    path('backend/', views.ProductView.as_view()),
    path('modelview/', include(router.urls))
]
