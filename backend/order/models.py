from django.contrib.auth.models import User
from django.db import models
from core.models import Product


# customers order
class Order(models.Model):

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('delivered', 'Delivered'),
    ]

    user = models.ForeignKey(User, related_name='order', on_delete=models.CASCADE)
    first_name =models.CharField(max_length=100)
    last_name =models.CharField(max_length=100)
    email = models.EmailField(max_length=100)
    address = models.CharField(max_length=250)
    place = models.CharField(max_length=100)
    phone = models.CharField(max_length=100)  #uses PhoneNumberField for validation
    created_at = models.DateTimeField(auto_now_add=True)
    paid_amount = models.IntegerField(blank=True, null=True)
    transaction_id = models.CharField(max_length=250, null=True)
    delivery_status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')


    class Meta:
        ordering = ['-created_at',]

    def __str__(self):
        return f"{self.first_name} - {self.delivery_status}"



# order items
class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name="items", on_delete=models.CASCADE)
    product = models.ForeignKey(Product, related_name="items", on_delete=models.CASCADE)
    price = models.IntegerField(blank=True, null=True)
    quantity = models.IntegerField(default=1)
    sizes = models.CharField(max_length=250, null=True)

    def __str__(self):
        return '%s' % self.id

