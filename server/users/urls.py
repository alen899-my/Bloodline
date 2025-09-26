from django.urls import path
from .views import RegisterView, LoginView, current_user, users_with_same_address

urlpatterns = [
    path('signup/', RegisterView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('current-user/', current_user, name='current-user'),
    path('same-address-users/', users_with_same_address, name='same-address-users'),
]
