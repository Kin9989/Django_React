# Generated by Django 3.2.6 on 2024-05-21 18:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0040_post_image'),
    ]

    operations = [
        migrations.CreateModel(
            name='Coupon',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(max_length=50, unique=True)),
                ('discount', models.DecimalField(decimal_places=2, max_digits=12)),
                ('is_active', models.BooleanField(default=True)),
                ('createdAt', models.DateTimeField(auto_now_add=True, null=True)),
            ],
        ),
    ]
