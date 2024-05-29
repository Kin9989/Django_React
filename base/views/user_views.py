# Django Import
from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from rest_framework import status

# Rest Framework Import
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework.serializers import Serializer

# Rest Framework JWT
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

# Local Import
from base.models import *
from base.serializers import UserSerializer, UserSerializerWithToken, PostSerializer


# JWT Views
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        serializer = UserSerializerWithToken(self.user).data

        for k, v in serializer.items():
            data[k] = v

        return data

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token["username"] = user.username
        token["message"] = "Hello Proshop"
        # ...

        return token


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


# SHOP API
@api_view(["GET"])
def getRoutes(request):
    routes = [
        "/api/products/",
        "/api/products/<id>",
        "/api/users",
        "/api/users/register",
        "/api/users/login",
        "/api/users/profile",
    ]
    return Response(routes)


@api_view(["POST"])
def registerUser(request):
    data = request.data
    try:
        user = User.objects.create(
            first_name=data["name"],
            username=data["email"],
            password=make_password(data["password"]),
        )

        serializer = UserSerializerWithToken(user, many=False)
        return Response(serializer.data)

    except:
        message = {"detail": "User with this email is already registered"}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getUserProfile(request):
    user = request.user
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def updateUserProfile(request):
    user = request.user
    serializer = UserSerializerWithToken(user, many=False)
    data = request.data
    user.first_name = data["name"]
    user.username = data["email"]
    user.email = data["email"]
    user.phone = data.get("last_name", "")

    if data["password"] != "":
        user.password = make_password(data["password"])
    user.save()
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAdminUser])
def getUsers(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAdminUser])
def getUserById(request, pk):
    users = User.objects.get(id=pk)
    serializer = UserSerializer(users, many=False)
    return Response(serializer.data)


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def updateUser(request, pk):
    user = User.objects.get(id=pk)

    data = request.data
    user.first_name = data["name"]
    user.username = data["email"]
    user.email = data["email"]
    user.is_staff = data["isAdmin"]

    user.save()
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)


@api_view(["DELETE"])
@permission_classes([IsAdminUser])
def deleteUser(request, pk):
    userForDeletion = User.objects.get(id=pk)
    userForDeletion.delete()
    return Response("User was deleted")


@api_view(["POST"])
@permission_classes([IsAdminUser])
def addBlog(request):
    if request.method == "POST":
        serializer = PostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
def getBlogs(request):
    if request.method == "GET":
        blogs = Post.objects.all()
        serializer = PostSerializer(blogs, many=True)
        return Response(serializer.data)


@api_view(["DELETE"])
def deleteBlogById(request, pk):
    try:
        blog = Post.objects.get(pk=pk)
    except Post.DoesNotExist:
        return Response("Blog not found")

    if request.method == "DELETE":
        blog.delete()
        return Response("Delete blog ok")


@api_view(["GET"])
def getBlogById(request, pk):
    try:
        blog = Post.objects.get(pk=pk)
    except Post.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        serializer = PostSerializer(blog)
        return Response(serializer.data)


@api_view(["PUT"])
def updateBlogById(request, pk):
    try:
        blog = Post.objects.get(pk=pk)
    except Post.DoesNotExist:
        return Response("Blog not found")

    if request.method == "PUT":
        serializer = PostSerializer(blog, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response("Update success!")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
