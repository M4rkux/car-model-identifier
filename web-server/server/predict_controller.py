from fastai.vision.all import *

learn = load_learner('./export.pkl')

def predict_image(file):
  img = PILImage.create(file)
  pred, pred_idx, probs = learn.predict(img)
  maker, model = pred.split('_')
  
  return {
    'maker': maker,
    'model': model,
    'probability': f'{probs[pred_idx]:.04f}'
  }