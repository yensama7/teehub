from django.contrib.auth.models import User
from django.db import models
import uuid
from core.models import Product

class Order(models.Model):
    user = models.ForeignKey(User, related_name='order', on_delete=models.CASCADE)
    first_name =models.CharField(max_length=100)
    last_name =models.CharField(max_length=100)
    email = models.EmailField(max_length=100)
    address = models.CharField(max_length=250)
    place = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=100)  #uses PhoneNumberField for validation
    created_at = models.DateTimeField(auto_now_add=True)
    paid_amount = models.DecimalField(max_digits=6, decimal_places=2, blank=True, null=True)
    reference = models.CharField(max_length=100, unique=True, blank=True)  # Transaction reference

    class Meta:
        ordering = ['-created_at',]

    def __str__(self):
        return self.first_name
    
    def generate_reference(self): # creates unique transaction reference
        """Generate a unique reference for this order."""
        self.reference = str(uuid.uuid4())[:12]  # Generate a UUID and truncate it to 12 characters
        self.save()



class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name="items", on_delete=models.CASCADE)
    product = models.ForeignKey(Product, related_name="items", on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    quantity = models.IntegerField(default=1)

    def __str__(self):
        return '%s' % self.id

