# Django Import
from django.core.exceptions import RequestDataTooBig
from django.shortcuts import render
from datetime import datetime, timedelta
from decimal import Decimal
from rest_framework import status

# Rest Framework Import
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework.serializers import Serializer


# Local Import
from base.products import products
from base.models import *
from base.models import Coupon
from base.serializers import ProductSerializer, OrderSerializer
from base.serializers import CouponSerializer

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
    orders = user.orders.all()  # Use the related_name "orders" here
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


@api_view(["POST"])
# @permission_classes([IsAdminUser])
def getToatalFollowDMY(request):
    # Lấy ngày, tháng và năm từ body của yêu cầu POST
    day = request.data.get("day")
    month = request.data.get("month")
    year = request.data.get("year")
    orders_data = []
    # Kiểm tra xem ngày và năm đã được cung cấp hay không

    if day and not (month and year):
        return Response({"error": "Vui lòng nhập tháng và năm"})

    if day and month and year:  # Tính theo ngày, tháng, năm
        orders = Order.objects.filter(
            isPaid=True,
            createdAt__day=day,
            createdAt__month=month,
            createdAt__year=year,
        )
        total_revenue = orders.aggregate(total_revenue=Sum("totalPrice"))[
            "total_revenue"
        ]
        total_orders = orders.count()
    elif month and year:  # Tính theo tháng, năm
        orders = Order.objects.filter(
            createdAt__month=month, createdAt__year=year, isPaid=True
        )
        total_revenue = orders.aggregate(total_revenue=Sum("totalPrice"))[
            "total_revenue"
        ]
        total_orders = orders.count()
    elif year:  # Tính theo năm
        orders = Order.objects.filter(createdAt__year=year, isPaid=True)
        total_revenue = orders.aggregate(total_revenue=Sum("totalPrice"))[
            "total_revenue"
        ]
        total_orders = orders.count()

    else:  # Không có thông tin về ngày, tháng, năm
        return Response({"error": "Please provide at least year"})

    for order in orders:
        orders_data.append(
            {
                "_id": order._id,  # Thêm trường ID của đơn hàng
                "totalPrice": order.totalPrice,
                # "paidAt": order.paidAt,
            }
        )

    return Response(
        {
            "total_orders": total_orders,
            "total_revenue": total_revenue,
            "orders": orders_data,
        }
    )


@api_view(["POST"])
# @permission_classes([IsAdminUser])
def getToatalDMY(request):
    day_start = request.data.get("day_start")
    day_end = request.data.get("day_end")
    month_start = request.data.get("month_start")
    month_end = request.data.get("month_end")
    year_start = request.data.get("year_start")
    year_end = request.data.get("year_end")
    orders_data = []

    # Chuyển đổi các giá trị thành số nguyên
    try:
        if day_start:
            day_start = int(day_start)
        if day_end:
            day_end = int(day_end)
        if month_start:
            month_start = int(month_start)
        if month_end:
            month_end = int(month_end)
        if year_start:
            year_start = int(year_start)
        if year_end:
            year_end = int(year_end)
    except ValueError:
        return Response({"error": "Invalid date input"})

    # Kiểm tra xem ngày và năm đã được cung cấp hay không
    if (day_start or day_end) and not (
        month_start and month_end and year_start and year_end
    ):
        return Response({"error": "Vui lòng nhập đầy đủ tháng và năm"})

    if day_start and day_end and month_start and month_end and year_start and year_end:
        start_date = datetime(year_start, month_start, day_start)
        end_date = datetime(year_end, month_end, day_end)
        orders = Order.objects.filter(
            isPaid=True,
            createdAt__gte=start_date,
            createdAt__lte=end_date,
        )
        total_revenue = orders.aggregate(total_revenue=Sum("totalPrice"))[
            "total_revenue"
        ]
        total_orders = orders.count()
    elif month_start and month_end and year_start and year_end:
        start_date = datetime(year_start, month_start, 1)
        end_date = datetime(year_end, month_end, 1) + relativedelta(months=1, days=-1)
        orders = Order.objects.filter(
            createdAt__gte=start_date,
            createdAt__lte=end_date,
            isPaid=True,
        )
        total_revenue = orders.aggregate(total_revenue=Sum("totalPrice"))[
            "total_revenue"
        ]
        total_orders = orders.count()
    elif year_start and year_end:
        start_date = datetime(year_start, 1, 1)
        end_date = datetime(year_end, 12, 31)
        orders = Order.objects.filter(
            createdAt__gte=start_date,
            createdAt__lte=end_date,
            isPaid=True,
        )
        total_revenue = orders.aggregate(total_revenue=Sum("totalPrice"))[
            "total_revenue"
        ]
        total_orders = orders.count()
    else:
        return Response({"error": "Please provide at least year range"})

    for order in orders:
        orders_data.append(
            {
                "_id": order._id,
                "totalPrice": order.totalPrice,
            }
        )

    return Response(
        {
            "total_orders": total_orders,
            "total_revenue": total_revenue,
            "orders": orders_data,
        }
    )


@api_view(["GET"])
# @permission_classes([IsAdminUser])
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
            "user_id",
            "user__username",
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
        paid_orders.values("user_id", "user__username", "user__first_name")
        .annotate(total_orders=Count("_id"), total_money=Sum("totalPrice"))
        .order_by("-total_money")
    )
    today = datetime.now().date()
    yesterday = today - timedelta(days=1)
    today_revenue = (
        paid_orders.filter(paidAt__date=today).aggregate(
            today_revenue=Sum("totalPrice")
        )["today_revenue"]
        or 0
    )

    yesterday_revenue = (
        Order.objects.filter(isPaid=True, paidAt__date=yesterday).aggregate(
            yesterday_revenue=Sum("totalPrice")
        )["yesterday_revenue"]
        or 0
    )

    if yesterday_revenue == 0:
        if today_revenue == 0:
            percentage_change = 0
            change_symbol = "0%"
        else:
            percentage_change = 100  # Nếu hôm qua không có doanh thu, bất kỳ doanh thu nào hôm nay đều là tăng 100%
            change_symbol = f"+{percentage_change}%"
    else:
        percentage_change = (
            (today_revenue - yesterday_revenue) / yesterday_revenue
        ) * 100
        if percentage_change >= 0:
            change_symbol = f"+{percentage_change:.2f}%"
        else:
            change_symbol = f"{percentage_change:.2f}%"

    total_revenueP = (
        Order.objects.filter(isPaid=True).aggregate(total_revenueP=Sum("totalPrice"))[
            "total_revenueP"
        ]
        or 0
    )

    total_revenueOder = Order.objects.filter(isPaid=True).count() or 0
    return Response(
        {
            "topProductPaid": top_product_paid,
            "userPaidMoneyHigh": user_paid_money_high,
            "userBoughtHigh": user_bought_high,
            "rateProduct": rate_product,
            "rateUser": rate_user,
            "today_revenue": today_revenue,
            "yesterday_revenue": yesterday_revenue,
            "percentageChange": percentage_change,
            "changeSymbol": change_symbol,
            "total_revenueP": total_revenueP,
            "total_revenueOder": total_revenueOder,
        }
    )


# ----------------------coupon ----------------------


@api_view(["GET"])
# @permission_classes([IsAdminUser])
def get_coupons(request):
    coupons = Coupon.objects.all()
    serializer = CouponSerializer(coupons, many=True)
    return Response(serializer.data)


@api_view(["GET"])
# @permission_classes([IsAdminUser])
def get_coupon_by_id(request, pk):
    try:
        coupon = Coupon.objects.get(pk=pk)
    except Coupon.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    serializer = CouponSerializer(coupon)
    return Response(serializer.data)


@api_view(["POST"])
# @permission_classes([IsAdminUser])
def add_coupon(request):
    serializer = CouponSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["DELETE"])
# @permission_classes([IsAdminUser])
def delete_coupon(request, pk):
    try:
        coupon = Coupon.objects.get(pk=pk)
    except Coupon.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    coupon.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["PUT"])
# @permission_classes([IsAdminUser])
def update_coupon(request, pk):
    try:
        coupon = Coupon.objects.get(pk=pk)
    except Coupon.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    serializer = CouponSerializer(coupon, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def check_coupon(request):
    code = request.data.get("code")
    if not code:
        return Response(
            {"error": "Vui lòng nhập mã khuyến mãi"}, status=status.HTTP_400_BAD_REQUEST
        )

    try:
        coupon = Coupon.objects.get(code=code)
        return Response({"discount": coupon.discount})
    except Coupon.DoesNotExist:
        return Response(
            {"error": "Mã khuyến mãi không tồn tại"}, status=status.HTTP_404_NOT_FOUND
        )
