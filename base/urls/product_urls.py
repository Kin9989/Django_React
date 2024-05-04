from django.urls import path
from base.views import product_views as views


urlpatterns = [
    path("category/", views.createCategory, name="create_category"),
    path("categories/", views.getCategories, name="get_categories"),
    path("category/<int:pk>/", views.getCategory, name="get_category"),
    path("categories/delete/<int:pk>/", views.deleteCategory, name="delete_category"),
    path("category/<int:pk>/", views.updateCategory, name="update_category"),
    path("", views.getProducts, name="products"),
    path("create/", views.createProduct, name="create_product"),
    path("upload/", views.uploadImage, name="upload_image"),
    path("<str:pk>/reviews/", views.createProductReview, name="create-review"),
    path("top/", views.getTopProducts, name="top-products"),
    path("<str:pk>/", views.getProduct, name="product"),
    path("update/<str:pk>/", views.updateProduct, name="update_product"),
    path("delete/<str:pk>/", views.deleteProduct, name="delete_product"),
]
