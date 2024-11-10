from rest_framework import serializers

from .models import Category, Product, Size, ItemImage, ProductSizePrice

class SizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Size
        fields = ['id', 'name']


class ItemImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemImage
        fields = ['id', 'image', 'alt_text', 'get_images',]


class ProductSizePriceSerializer(serializers.ModelSerializer):
    size = SizeSerializer()  # Include the size details

    class Meta:
        model = ProductSizePrice
        fields = ['id', 'size', 'price','stock']  # Include size and price fields


class ProductSerializer(serializers.ModelSerializer):
    sizes = ProductSizePriceSerializer(many=True, read_only=True, source='size_prices')  # Include size-specific prices
    images = ItemImageSerializer(many=True, read_only=True)  # Include item images
    is_out_of_stock = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields =(
            "id",
            "name",
            "get_absolute_url",
            "description",
            "get_image",
            "get_thumbnail",
            "sizes",
            "images",
            "is_out_of_stock",
        )
    def get_is_out_of_stock(self, obj):
        # Check if all sizes are out of stock
        return not any(size.stock > 0 for size in obj.size_prices.all())


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