# Generated by Django 3.2.6 on 2024-05-14 11:33

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('base', '0030_auto_20240514_1831'),
    ]

    operations = [
        migrations.CreateModel(
            name='Stat',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('top_product_paid', models.CharField(blank=True, max_length=200, null=True)),
                ('rate_product', models.CharField(blank=True, max_length=200, null=True)),
                ('statPaidD', models.IntegerField(null=True)),
                ('statPaidM', models.IntegerField(null=True)),
                ('statPaidY', models.IntegerField(null=True)),
                ('numberSoldByDay', models.DecimalField(decimal_places=2, max_digits=12, null=True)),
                ('numberSoldByM', models.DecimalField(decimal_places=2, max_digits=12, null=True)),
                ('numberSoldByY', models.DecimalField(decimal_places=2, max_digits=12, null=True)),
                ('rate_user', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='stats_rate_user', to=settings.AUTH_USER_MODEL)),
                ('user_bought_high', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='stats_user_bought_high', to=settings.AUTH_USER_MODEL)),
                ('user_paid_money_high', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='stats_user_paid_money_high', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
