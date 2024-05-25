from django.urls import path
from base.views import order_views as views


urlpatterns = [
    path("", views.getOrders, name="allorders"),
    path("add/", views.addOrderItems, name="orders-add"),
    path("myorders/", views.getMyOrders, name="myorders"),
    path("<str:pk>/deliver/", views.updateOrderToDelivered, name="delivered"),
    path("<str:pk>/updatestatus/", views.updateOrderStatus, name="update-status"),
    path("<str:pk>/", views.getOrderById, name="user-order"),
    path("<str:pk>/pay/", views.updateOrderToPaid, name="pay"),
    path("stats/total/DMY/", views.getToatalFollowDMY, name="total_DMY"),
    path("stats/UP/", views.get_order_statisticsUP, name="total_UP"),
]
