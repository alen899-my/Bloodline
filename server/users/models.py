from django.db import models
from django.contrib.auth.models import AbstractBaseUser,PermissionsMixin,BaseUserManager

class customUserManager(BaseUserManager):
    def create_user(self,email,username,password=None,**extra_fields):
        if not email:
            raise ValueError("User must have an email address")
        email=self.normalize_email(email)
        user=self.model(email=email,username=username,**extra_fields)
        user.set_password(password)
        user.save()
        return user
    def create_superuser(self,email,username,password=None,**extra_fields):
        extra_fields.setdefault('is_staff',True)
        extra_fields.setdefault('is_superuser',True)
        return self.create_user(email,username,password,**extra_fields
        )
class User(AbstractBaseUser,PermissionsMixin):
    username=models.CharField(max_length=255,unique=True)
    email=models.EmailField(max_length=255,unique=True)
    first_name=models.CharField(max_length=255)
    address=models.CharField(max_length=255,null=True)
    last_name=models.CharField(max_length=255)
    phone=models.CharField(max_length=255)
    is_active=models.BooleanField(default=True)
    is_staff=models.BooleanField(default=False)
    objects=customUserManager()
    USERNAME_FIELD='email'
    REQUIRED_FIELDS=['username']

    def __str__(self):
        return self.username