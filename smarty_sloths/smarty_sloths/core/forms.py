from django import forms


class ImageUploadForm(forms.Form):
    image = forms.ImageField()


class resultForm(forms.Form):
    result_mode = forms.CharField()
    result_text = forms.CharField(required=False)
    number_of_images = forms.IntegerField()
    remote_result_times = forms.CharField(required=False)
    result_data = forms.CharField(required=False)
    local_result_times = forms.CharField(required=False)