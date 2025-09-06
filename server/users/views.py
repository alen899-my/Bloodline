from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from .serializers import registerSerializer
from .models import User
from rest_framework_simplejwt.tokens import RefreshToken


class RegisterView(APIView):
    def post(self,request):
        serializer=registerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
class LoginView(APIView):
    def post(self,request):
        email=request.data.get('email')
        password=request.data.get('password')
        user=authenticate(email=email,password=password)
        if user is not None:
            refresh=RefreshToken.for_user(user)
            return Response({'refresh':str(refresh),'access':str(refresh.access_token)},status=status.HTTP_200_OK)
        return Response({'error':'Invalid credentials'},status=status.HTTP_401_UNAUTHORIZED)
        