# Django Import
from django.core.exceptions import RequestDataTooBig
from django.shortcuts import render
from datetime import datetime

from rest_framework import status

# Rest Framework Import
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework.serializers import Serializer


# Local Import
from base.products import products
from base.models import *
from base.serializers import ProductSerializer, OrderSerializer


from django.db.models import Count, Sum
from django.utils.timezone import now

# views start from here


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def addOrderItems(request):
    user = request.user
    data = request.data
    print(data)
    orderItems = data["orderItems"]

    if orderItems and len(orderItems) == 0:
        return Response(
            {"detail": "No Order Items", "status": status.HTTP_400_BAD_REQUEST}
        )
    else:
        # (1) Create Order
        order = Order.objects.create(
            user=user,
            paymentMethod=data["paymentMethod"],
            taxPrice=data["taxPrice"],
            shippingPrice=data["shippingPrice"],
            totalPrice=data["totalPrice"],
        )

        # (2) Create Shipping Address

        shipping = ShippingAddress.objects.create(
            order=order,
            address=data["shippingAddress"]["address"],
            city=data["shippingAddress"]["city"],
            postalCode=data["shippingAddress"]["postalCode"],
            country=data["shippingAddress"]["country"],
        )

        # (3) Create order items

        for i in orderItems:
            product = Product.objects.get(_id=i["product"])

            item = OrderItem.objects.create(
                product=product,
                order=order,
                name=product.name,
                qty=i["qty"],
                price=i["price"],
                image=product.image.url,
            )

            # (4) Update Stock

            product.countInStock -= item.qty
            product.save()

        serializer = OrderSerializer(order, many=False)
        return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getMyOrders(request):
    user = request.user
    orders = user.order_set.all()
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAdminUser])
def getOrders(request):
    orders = Order.objects.all()
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getOrderById(request, pk):

    user = request.user

    try:
        order = Order.objects.get(_id=pk)
        if user.is_staff or order.user == user:
            serializer = OrderSerializer(order, many=False)
            return Response(serializer.data)
        else:
            Response(
                {"detail": "Not Authorized  to view this order"},
                status=status.HTTP_400_BAD_REQUEST,
            )
    except:
        return Response(
            {"detail": "Order does not exist"}, status=status.HTTP_400_BAD_REQUEST
        )


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def updateOrderToPaid(request, pk):
    order = Order.objects.get(_id=pk)
    order.isPaid = True
    order.paidAt = datetime.now()
    order.save()
    return Response("Order was paid")


@api_view(["PUT"])
@permission_classes([IsAdminUser])
def updateOrderToDelivered(request, pk):
    order = Order.objects.get(_id=pk)
    order.isDeliver = True
    order.deliveredAt = datetime.now()
    order.save()
    return Response("Order was Delivered")


@api_view(["PUT"])
@permission_classes([IsAdminUser])
def updateOrderStatus(request, pk):
    order = Order.objects.get(_id=pk)

    # Nhận trạng thái mới từ request data
    new_status = request.data.get("new_status", None)
    # Kiểm tra nếu trạng thái mới hợp lệ
    if new_status in [
        "Đã nhận được đơn hàng",
        "Đang soạn đơn",
        "Đã gửi bên vận chuyển",
        "Giao hàng thành công",
        "Boom hàng",
    ]:
        # Cập nhật trạng thái mới và thời gian tương ứng
        order.new_status = new_status  # Thay đổi tên trường thành new_status
        if new_status == "giao hàng thành công":
            order.deliveredAt = datetime.now()
        order.save()
        return Response("Trạng thái đơn hàng đã được cập nhật thành công")
    else:
        return Response("Trạng thái đơn hàng không hợp lệ", status=400)


# @api_view(["GET"])
# @permission_classes([IsAdminUser])
# def getTotalRevenue(request):
#     # Lấy tất cả các đơn hàng đã được thanh toán
#     orders = Order.objects.filter(isPaid=True)

#     # Thống kê đơn hàng theo ngày, tháng và năm
#     current_date = now().date()
#     current_month = now().month
#     current_year = now().year

#     orders_by_day = orders.filter(createdAt__date=current_date).count()
#     orders_by_month = orders.filter(createdAt__month=current_month).count()
#     orders_by_year = orders.filter(createdAt__year=current_year).count()

#     # Tính tổng doanh thu
#     total_revenue = (
#         orders.aggregate(total_revenue=Sum("totalPrice"))["total_revenue"] or 0
#     )

#     # Sản phẩm được mua nhiều nhất
#     top_product = (
#         OrderItem.objects.filter(order__in=orders)
#         .values("name")
#         .annotate(total_quantity=Sum("qty"))
#         .order_by("-total_quantity")
#         .first()
#     )

#     # Lưu thông tin thống kê theo ngày, tháng và năm vào một dictionary
#     statistics_by_date = {
#         "day": current_date.strftime("%d-%m-%Y"),
#         "month": current_month,
#         "year": current_year,
#         "orders": {
#             "by_day": orders_by_day,
#             "by_month": orders_by_month,
#             "by_year": orders_by_year,
#         },
#     }

#     return Response(
#         {
#             "statistics_by_date": statistics_by_date,
#             "total_revenue": total_revenue,
#             "top_product": top_product,
#             "current_date": current_date,
#         }
#     )


@api_view(["GET"])
@permission_classes([IsAdminUser])
def getTotalRevenue(request, month=None):
    # Lấy tất cả các đơn hàng
    orders = Order.objects.all()

    # Nếu không có tháng được chỉ định, sử dụng tháng hiện tại
    if month is None:
        current_month = now().month
    else:
        current_month = int(month)

    # Thống kê đơn hàng theo tháng
    orders_by_month = orders.filter(createdAt__month=current_month).count()

    # Tính tổng doanh thu của các đơn hàng trong tháng
    total_revenue = (
        orders.filter(createdAt__month=current_month).aggregate(
            total_revenue=Sum("totalPrice")
        )["total_revenue"]
        or 0
    )

    # Sản phẩm được mua nhiều nhất trong tháng
    top_product = (
        OrderItem.objects.filter(
            order__in=orders.filter(createdAt__month=current_month)
        )
        .values("product__name")
        .annotate(total_quantity=Sum("qty"))
        .order_by("-total_quantity")
        .first()
    )

    # Lưu thông tin thống kê của tháng vào một dictionary
    statistics_by_month = {
        "month": current_month,
        "orders_by_month": orders_by_month,
    }

    return Response(
        {
            "statistics_by_month": statistics_by_month,
            "total_revenue": total_revenue,
            "top_product": top_product,
        }
    )


@api_view(["GET"])
@permission_classes([IsAdminUser])
def getOrderStatsNoCheckIsPaid(request):
    # Lấy tất cả các đơn hàng đã được thanh toán
    orders = Order.objects.all()

    # Thống kê đơn hàng theo ngày, tháng và năm
    current_date = now().date()
    current_month = now().month
    current_year = now().year

    orders_by_day = orders.filter(createdAt__date=current_date).count()
    orders_by_month = orders.filter(createdAt__month=current_month).count()
    orders_by_year = orders.filter(createdAt__year=current_year).count()

    # Tính tổng doanh thu
    total_revenue = (
        orders.aggregate(total_revenue=Sum("totalPrice"))["total_revenue"] or 0
    )

    # Sản phẩm được mua nhiều nhất
    top_product = (
        OrderItem.objects.filter(order__in=orders)
        .values("name")
        .annotate(total_quantity=Sum("qty"))
        .order_by("-total_quantity")
        .first()
    )

    # Lưu thông tin thống kê theo ngày, tháng và năm vào một dictionary
    statistics_by_date = {
        "day": current_date.strftime("%d-%m-%Y"),
        "month": current_month,
        "year": current_year,
        "orders": {
            "by_day": orders_by_day,
            "by_month": orders_by_month,
            "by_year": orders_by_year,
        },
    }

    return Response(
        {
            "statistics_by_date": statistics_by_date,
            "total_revenue": total_revenue,
            "top_product": top_product,
            "current_date": current_date,
        }
    )


@api_view(["POST"])
@permission_classes([IsAdminUser])
def getToatalFollowDMY(request):
    # Lấy ngày, tháng và năm từ body của yêu cầu POST
    day = request.data.get("day")
    month = request.data.get("month")
    year = request.data.get("year")

    # Lấy tất cả các đơn hàng
    orders = Order.objects.all()

    # Nếu ngày được chỉ định, lọc đơn hàng theo ngày
    if day is not None and month is not None and year is not None:
        orders = orders.filter(
            createdAt__year=year, createdAt__month=month, createdAt__day=day
        )
    # Nếu chỉ có tháng và năm được chỉ định, lọc đơn hàng theo tháng
    elif month is not None and year is not None:
        orders = orders.filter(createdAt__year=year, createdAt__month=month)
    # Nếu chỉ có năm được chỉ định, lọc đơn hàng theo năm
    elif year is not None:
        orders = orders.filter(createdAt__year=year)

    # Thống kê đơn hàng
    orders_count = orders.count()

    # Tính tổng doanh thu
    total_revenue = (
        orders.aggregate(total_revenue=Sum("totalPrice"))["total_revenue"] or 0
    )

    # Sản phẩm được mua nhiều nhất
    top_product = (
        OrderItem.objects.filter(order__in=orders)
        .values("name")
        .annotate(total_quantity=Sum("qty"))
        .order_by("-total_quantity")
        .first()
    )

    return Response(
        {
            "orders_count": orders_count,
            "total_revenue": total_revenue,
            "top_product": top_product,
        }
    )


# @api_view(["GET"])
# @permission_classes([IsAdminUser])
# def getTotalRevenue(request):
#     # Lấy tất cả các đơn hàng đã được thanh toán

#     # orders = Order.objects.filter(isPaid=True)

#     # # Thống kê đơn hàng theo ngày, tháng và năm
#     # orders_by_day = orders.filter(createdAt__date=now().date()).count()
#     # orders_by_month = orders.filter(createdAt__month=now().month).count()
#     # orders_by_year = orders.filter(createdAt__year=now().year).count()

#     # # Tính tổng doanh thu
#     # total_revenue = (
#     #     orders.aggregate(total_revenue=Sum("totalPrice"))["total_revenue"] or 0
#     # )

#     # # Sản phẩm được mua nhiều nhất
#     # top_product = (
#     #     OrderItem.objects.filter(order__in=orders)
#     #     .values("product__name")
#     #     .annotate(total_quantity=Sum("qty"))
#     #     .order_by("-total_quantity")
#     #     .first()
#     # )

#     # return Response(
#     #     {
#     #         "orders_by_day": orders_by_day,
#     #         "orders_by_month": orders_by_month,
#     #         "orders_by_year": orders_by_year,
#     #         "total_revenue": total_revenue,
#     #         "top_product": top_product,
#     #     }
#     # )

#     orders = Order.objects.filter(isPaid=True)

#     # Thống kê đơn hàng theo ngày, tháng và năm
#     current_date = now().date()
#     current_month = now().month
#     current_year = now().year

#     orders_by_day = orders.filter(createdAt__date=current_date).count()
#     orders_by_month = orders.filter(createdAt__month=current_month).count()
#     orders_by_year = orders.filter(createdAt__year=current_year).count()

#     # Tính tổng doanh thu
#     total_revenue = (
#         orders.aggregate(total_revenue=Sum("totalPrice"))["total_revenue"] or 0
#     )

#     # Sản phẩm được mua nhiều nhất
#     top_product = (
#         OrderItem.objects.filter(order__in=orders)
#         .values("product__name")
#         .annotate(total_quantity=Sum("qty"))
#         .order_by("-total_quantity")
#         .first()
#     )

#     # Lưu thông tin thống kê theo ngày, tháng và năm vào một dictionary
#     statistics_by_date = {
#         "day": current_date.strftime("%d-%m-%Y"),
#         "month": current_month,
#         "year": current_year,
#         "orders": {
#             "by_day": orders_by_day,
#             "by_month": orders_by_month,
#             "by_year": orders_by_year,
#         },
#     }

#     return Response(
#         {
#             "statistics_by_date": statistics_by_date,
#             "total_revenue": total_revenue,
#             "top_product": top_product,
#             "current_date": current_date,
#         }
#     )


@api_view(["GET"])
@permission_classes([IsAdminUser])
def get_order_statisticsUP(request):
    # Lấy tất cả các đơn hàng đã thanh toán
    paid_orders = Order.objects.filter(isPaid=True)

    # Lấy top sản phẩm được mua nhiều nhất
    top_product_paid = (
        OrderItem.objects.filter(order__in=paid_orders)
        .values("name")
        .annotate(total_qty=Sum("qty"))
        .order_by("-total_qty")
        .first()
    )

    # Lấy người dùng đã mua nhiều nhất theo số tiền sản phẩm
    user_paid_money_high = (
        paid_orders.values(
            "user_id", "user__username"
        )  # Hoặc "user__email" tùy thuộc vào trường bạn muốn sử dụng
        .annotate(total_money=Sum("totalPrice"))
        .order_by("-total_money")
        .first()
    )
    # Lấy người dùng đã mua nhiều nhất theo số sản phẩm
    user_bought_high = (
        paid_orders.values(
            "user_id", "user__username"
        )  # Hoặc "user__email" tùy thuộc vào trường bạn muốn sử dụng
        .annotate(total_orders=Sum(1))
        .order_by("-total_orders")
        .first()
    )

    # Lấy thông tin sản phẩm được mua nhiều nhất và số lượt mua
    rate_product = (
        OrderItem.objects.filter(order__in=paid_orders)
        .values("name")
        .annotate(total_orders=Sum("qty"))
        .order_by("-total_orders")
    )

    # Lấy thông tin người dùng mua nhiều nhất, số lượt mua và tổng tiền
    rate_user = (
        paid_orders.values("user_id", "user__username")
        .annotate(total_orders=Count("_id"),
                total_money=Sum("totalPrice"))
        .order_by("-total_orders")
    )

    return Response(
        {
            "topProductPaid": top_product_paid,
            "userPaidMoneyHigh": user_paid_money_high,
            "userBoughtHigh": user_bought_high,
            "rateProduct": rate_product,
            "rateUser": rate_user,
        }
    )
