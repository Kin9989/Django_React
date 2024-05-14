from django.db import models
from django.contrib.auth.models import User
from django.db.models.fields import BLANK_CHOICE_DASH
from django.utils.text import slugify


# Create your models here.
class Post(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True)
    # author = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, blank=True)

    def save(self, *args, **kwargs):
        self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Product(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=200, null=False, blank=True)
    image = models.ImageField(null=True, blank=True, upload_to="images/")
    brand = models.CharField(max_length=200, null=False, blank=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    categoryName = models.CharField(max_length=100, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    rating = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    numReviews = models.IntegerField(null=True, blank=True, default=0)
    priceOrigin = models.DecimalField(
        max_digits=12, decimal_places=2, null=True, blank=True
    )
    price = models.DecimalField(max_digits=12, decimal_places=2, null=False, blank=True)
    countInStock = models.IntegerField(
        null=True,
        blank=True,
    )
    createdAt = models.DateTimeField(auto_now_add=True)
    _id = models.AutoField(primary_key=True, editable=False)

    def __str__(self):
        return self.name + " | " + self.brand + " | " + str(self.price)

    def save(self, *args, **kwargs):
        if self.category:
            self.categoryName = (
                self.category.name
            )  # Cập nhật categoryName từ name của category
        super().save(*args, **kwargs)


class Review(models.Model):
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=200, null=True, blank=True)
    rating = models.IntegerField(null=True, blank=True, default=0)
    comment = models.TextField(null=True, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    _id = models.AutoField(primary_key=True, editable=False)

    def __str__(self):
        return str(self.rating)


class Order(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, related_name="orders_user"
    )
    topProductPaid = models.ForeignKey(
        Product,
        on_delete=models.SET_NULL,
        null=True,
        related_name="orders_top_product_paid",
    )
    userPaidMoneyHigh = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name="orders_user_paid_money_high",
    )
    userBoughtHigh = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name="orders_user_bought_high",
    )
    rateProduct = models.ForeignKey(
        Product,
        on_delete=models.SET_NULL,
        null=True,
        related_name="orders_rate_product",
    )
    rateUser = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, related_name="orders_rate_user"
    )

    paymentMethod = models.CharField(max_length=200, null=True, blank=True)
    taxPrice = models.DecimalField(
        max_digits=12, decimal_places=2, null=True, blank=True
    )
    shippingPrice = models.DecimalField(
        max_digits=12, decimal_places=2, null=True, blank=True
    )
    totalPrice = models.DecimalField(
        max_digits=12, decimal_places=2, null=True, blank=True
    )
    isPaid = models.BooleanField(default=False)
    paidAt = models.DateTimeField(auto_now_add=False, null=True, blank=True)
    isDeliver = models.BooleanField(default=False)
    deliveredAt = models.DateTimeField(auto_now_add=False, null=True, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    _id = models.AutoField(primary_key=True, editable=False)
    new_status = models.CharField(
        max_length=100, blank=True, default="đã nhận được đơn hàng", null=True
    )
    statPaidD = models.IntegerField(null=True)  # Số sản phẩm hàng đã mua theo ngày
    statPaidM = models.IntegerField(null=True)  # Số sản phẩm hàng đã mua theo tháng
    statPaidY = models.IntegerField(null=True)  # Số sản phẩm hàng đã mua theo năm
    numberSoldByDay = models.DecimalField(
        null=True, max_digits=12, decimal_places=2
    )  # Doanh số người dùng đã mua theo ngày
    numberSoldByM = models.DecimalField(
        null=True, max_digits=12, decimal_places=2
    )  # Doanh số người dùng đã mua theo tháng
    numberSoldByY = models.DecimalField(
        null=True, max_digits=12, decimal_places=2
    )  # Doanh số người dùng đã mua theo năm

    def __str__(self):
        return str(self.createdAt)


class OrderItem(models.Model):
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    order = models.ForeignKey(Order, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=200, null=True, blank=True)
    qty = models.IntegerField(null=True, blank=True, default=0)
    price = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    image = models.CharField(max_length=200, null=True, blank=True)
    _id = models.AutoField(primary_key=True, editable=False)

    def __str__(self):
        return str(self.name)


class ShippingAddress(models.Model):
    order = models.OneToOneField(Order, on_delete=models.CASCADE, null=True, blank=True)
    address = models.CharField(max_length=200, null=True, blank=True)
    city = models.CharField(max_length=200, null=True, blank=True)
    postalCode = models.CharField(max_length=200, null=True, blank=True)
    country = models.CharField(max_length=200, null=True, blank=True)
    shippingPrice = models.DecimalField(
        max_digits=12, decimal_places=2, null=True, blank=True
    )
    _id = models.AutoField(primary_key=True, editable=False)

    def __str__(self):
        return str(self.address)
