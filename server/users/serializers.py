from rest_framework import serializers
from .models import User
class registerSerializer(serializers.ModelSerializer):
    password=serializers.CharField(write_only=True)
    class Meta:
        model=User
        fields=['email','username','password','first_name','last_name','phone','address']
    def create(self, validated_data):
        user = User.objects.create_user(
        email=validated_data['email'],
        address=validated_data['address'],
        username=validated_data['username'],
        password=validated_data['password'],
        first_name=validated_data.get('first_name', ''),
        last_name=validated_data.get('last_name', ''),
        phone=validated_data.get('phone', '')
    )
        return user

