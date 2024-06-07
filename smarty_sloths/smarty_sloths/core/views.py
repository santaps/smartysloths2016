from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import redirect
from django.template.response import TemplateResponse
from django.views.decorators.http import require_http_methods
from django.views.generic.detail import DetailView
from django.views.generic.list import ListView
from django.http import JsonResponse

from . import models, forms, utils


@login_required
@require_http_methods(["POST"])
def process(request):
    file = request.FILES.getlist('image')[0]
    if not file:
        return JsonResponse({'error': 'Image was not specified.'})

    # XXX: Ugly validation
    form = forms.ImageUploadForm(data=request.POST, files={'image': file})
    if not form.is_valid():
        return JsonResponse({'error': file.name + ' is either not an image or it is a corrupted image.'})
    try:
       text = utils.extract_text(file)
    except:
        return JsonResponse({'error': 'Failed to extract text from image: ' + file.name + '.'})

    return JsonResponse({'text': text})



def result(request):
    if request.method == 'POST':
        form = forms.resultForm(request.POST)
        if form.is_valid():
            mode = form.cleaned_data['result_mode']
            text = form.cleaned_data['result_text']
            number_of_images = form.cleaned_data['number_of_images']
            remote_times = form.cleaned_data['remote_result_times']
            data = form.cleaned_data['result_data']
            local_times = form.cleaned_data['local_result_times']
        else:
            messages.error(request, 'Failed to extract text from image(s).')
            return redirect('homepage')

        if mode == 'Benchmark' or mode == 'Remote':
            files = request.FILES.getlist('images')
            for file in files:
                imageForm = forms.ImageUploadForm(data=request.POST, files={'image': file})
                if not imageForm.is_valid():
                    messages.error(request, file.name + ' is either not an image or it is a corrupted image.')
                    return redirect('homepage')

            encoded_thumbnail = utils.get_encoded_thumbnail(files[0])
            entry = models.Entry.objects.create(user=request.user, text=text, encoded_thumbnail=encoded_thumbnail)
            for file in files:
                encoded_image = utils.get_encoded_image(file)
                entry.images.create(entry=entry, encoded_image=encoded_image)

    return TemplateResponse(request, 'core/result.html', {
        'mode': mode,
        'text': text,
        'number_of_images': number_of_images,
        'remote_times': remote_times,
        'data': data,
        'local_times': local_times
    })


class EntryDetailView(LoginRequiredMixin, DetailView):
    model = models.Entry
    template_name = 'core/entry.html'
    context_object_name = 'entry'

    def get_queryset(self):
        return self.model.objects.filter(user=self.request.user)


class HomePageView(LoginRequiredMixin, ListView):
    model = models.Entry
    queryset = models.Entry
    template_name = 'core/homepage.html'
    context_object_name = 'entries'
    paginate_by = 10
    ordering = '-created_at'

    def get_queryset(self):
        # queryset is user specific.
        queryset = self.model.objects.filter(user=self.request.user)
        queryset = queryset.order_by(self.get_ordering())

        return queryset
