window.onload = () => {

  const form = document.querySelector('#form') as HTMLFormElement;
  const fileInput = document.querySelector('#file_image') as HTMLInputElement;
  const inputPlaceholder = document.querySelector('#input_placeholder') as HTMLElement;
  const spanMaker = document.querySelector('#maker') as HTMLElement;
  const spanModel = document.querySelector('#model') as HTMLElement;
  const spanProbability = document.querySelector('#probability') as HTMLElement;
  const imgPreview = document.querySelector('#img_preview') as HTMLImageElement;

  let file: Blob;

  form?.addEventListener('onsubmit', predictModel);
  
  fileInput.onchange = () => {
    if (!fileInput?.files?.length) return;
  
    file = fileInput.files[0];
    updateImagePreview();
  };

  document.onpaste = (event: ClipboardEvent) => getImageFromClipboard(event.clipboardData?.items);

  async function predictModel(event: Event|null = null) {
    event?.preventDefault();

    const formData = new FormData();
    formData.append('image', file);
    
    spanMaker.innerText = '';
    spanModel.innerText = '';
    spanProbability.innerText = '';

    try {
      const { maker, model, probability } = await (await fetch('http://localhost:5000', { method: 'POST', body: formData })).json() as BackendResponse;
  
      spanMaker.innerText = maker;
      spanModel.innerText = model;
      spanProbability.innerText = probability;
    } catch (e) {
      console.error(e);
    }

    removeLoadingState();
  }

  function getImageFromClipboard(items: DataTransferItemList|undefined) {
    if (!items) return;

    const blob = items[0].getAsFile();
    if(blob?.type.match('image.*')) {
      file = blob;
      updateImagePreview();
    }
  }

  function updateImagePreview() {
    const imgUrl = URL.createObjectURL(file);
    imgPreview.src = imgUrl;
    inputPlaceholder.innerText = 'Click to update the image';
    inputPlaceholder.classList.add('has-item');
    addLoadingState();
    predictModel();
  }

  function addLoadingState() {
    fileInput.disabled = true;
  }
  
  function removeLoadingState() {
    fileInput.disabled = false;
  }
}


