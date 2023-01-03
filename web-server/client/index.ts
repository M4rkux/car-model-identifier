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
    predictModel();
  };

  document.onpaste = (event: ClipboardEvent) => getImageFromClipboard(event.clipboardData?.items);

  async function predictModel(event: Event|null = null) {
    event?.preventDefault();

    const formData = new FormData();
    formData.append('image', file);

    const { maker, model, probability } = await (await fetch('http://localhost:5000', { method: 'POST', body: formData })).json() as BackendResponse;

    spanMaker.innerText = maker;
    spanModel.innerText = model;
    spanProbability.innerText = probability;
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
    predictModel();
  }
}


