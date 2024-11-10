from django.contrib import admin
from .models import Product, Category, ItemImage, Size, ProductSizePrice

class ItemImageInline(admin.TabularInline):
    model = ItemImage
    extra = 1  # default number of image input form (1)

class ProductSizePriceInline(admin.TabularInline):
    model = ProductSizePrice
    extra = 1  # Allows adding a new size-price pair by default
    min_num = 1  # Ensures at least one size-price entry is required
    fields = ['size', 'price', 'stock']  # Displays fields for size, price, and stock

class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'date_added')
    inlines = [ItemImageInline, ProductSizePriceInline]  # Include both inlines
    prepopulated_fields = {"slug": ("name",)}

# Register models in the admin site
admin.site.register(Product, ProductAdmin)
admin.site.register(Category)
admin.site.register(Size)
