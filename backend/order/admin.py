from django.contrib import admin
from .models import Order, OrderItem

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'email', 'created_at', 'paid_amount', 'delivery_status')  # Display delivery status
    list_filter = ('delivery_status',)  # Add a filter for delivery status
    search_fields = ('first_name', 'last_name', 'email', 'delivery_status')
    actions = ['mark_as_delivered']

    # Custom action to mark selected orders as delivered
    def mark_as_delivered(self, request, queryset):
        queryset.update(delivery_status='delivered')
        self.message_user(request, "Selected orders have been marked as delivered.")
    mark_as_delivered.short_description = "Mark selected orders as delivered"

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('order', 'product', 'quantity', 'price', 'sizes')
