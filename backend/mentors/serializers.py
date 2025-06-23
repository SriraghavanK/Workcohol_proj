from rest_framework import serializers
from .models import MentorProfile, Expertise
from users.serializers import UserSerializer

class ExpertiseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expertise
        fields = '__all__'

class MentorProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    expertise = ExpertiseSerializer(many=True, read_only=True)
    expertise_ids = serializers.PrimaryKeyRelatedField(
        many=True, 
        write_only=True, 
        queryset=Expertise.objects.all(),
        source='expertise',
        required=False
    )
    
    class Meta:
        model = MentorProfile
        fields = '__all__'
        read_only_fields = ['user', 'is_verified', 'total_sessions', 'rating', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['user'] = user
        return super().create(validated_data)

class MentorListSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    expertise = ExpertiseSerializer(many=True, read_only=True)
    
    class Meta:
        model = MentorProfile
        fields = ['id', 'user', 'expertise', 'experience_level', 'hourly_rate', 'is_verified', 'rating', 'total_sessions'] 