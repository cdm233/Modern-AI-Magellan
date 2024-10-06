from django.urls import path, include
from .views import handle_request

urlpatterns = [
    path('', handle_request),
]
