from rest_framework import serializers

from .models import Category, Product, Size, ItemImage

class SizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Size
        fields = ['id', 'name']


class ItemImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemImage
        fields = ['id', 'image', 'alt_text', 'get_images',]


class ProductSerializer(serializers.ModelSerializer):
    sizes = SizeSerializer(many=True, read_only=True)  # Include sizes
    images = ItemImageSerializer(many=True, read_only=True)  # Include item images

    class Meta:
        model = Product
        fields =(
            "id",
            "name",
            "get_absolute_url",
            "description",
            "price",
            "get_image",
            "get_thumbnail",
            "sizes",
            "images",
        )


class CategorySerializer(serializers.ModelSerializer):
    products = ProductSerializer(many=True)

    class Meta:
        model = Category
        fields = (
            "id",
            "name",
            "get_absolute_url",
            "products",
        )