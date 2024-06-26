from django.urls import path
from base.views import user_views as views


urlpatterns = [
    path('blogs/delete/<int:pk>/', views.deleteBlogById, name='delete_blog_by_id'),
    path('blogs/<int:pk>/', views.getBlogById, name='get_blog_by_id'),
    path('blogs/update/<int:pk>/', views.updateBlogById, name='update_blog_by_id'),
    path('addblog/', views.addBlog, name='add_blog'),
    path('blogs/', views.getBlogs, name='add_blog'),

    path('register/',views.registerUser,name='register'),
    path('',views.getUsers,name="users"),
    path('profile/',views.getUserProfile,name="user_profile"),
    path('profile/update/',views.updateUserProfile,name="user_profile_update"),
    path('login/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('<str:pk>/',views.getUserById,name="get_user"),
    path('update/<str:pk>/',views.updateUser,name="updateUser"),
    path('delete/<str:pk>/',views.deleteUser,name="deleteUser"),
]
