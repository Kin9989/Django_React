# Generated by Django 3.2.6 on 2024-05-17 18:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0036_product_categories'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='product',
            name='categories',
        ),
        migrations.RemoveField(
            model_name='product',
            name='category',
        ),
        migrations.AddField(
            model_name='product',
            name='category',
            field=models.ManyToManyField(related_name='products', to='base.Category'),
        ),
    ]
