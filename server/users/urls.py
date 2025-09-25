from django.urls import path
from .views import RegisterView, LoginView, current_user

urlpatterns = [
    path('signup/', RegisterView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('current-user/', current_user, name='current-user'),
]