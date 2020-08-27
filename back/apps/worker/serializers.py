"""Worker serializers."""

from rest_framework import serializers

from .models import Employee


# class PrivateField(serializers.ReadOnlyField):
#     """Make a field private."""

#     def get_attribute(self, instance):
#         """
#         Given the *outgoing* object instance, return the primitive value
#         that should be used for this field.
#         """
#         if instance.created_by == self.context["request"].user:
#             return super(PrivateField, self).get_attribute(instance)
#         return None


class EmployeeSerializer(serializers.ModelSerializer):
    """Employee serializer."""

    # salary = PrivateField()

    class Meta:
        """Meta."""

        model = Employee
        fields = ["id", "name", "salary", "preference"]
