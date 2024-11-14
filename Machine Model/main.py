# Install those dependancies first
# !pip install pycocotools
# !pip install --upgrade diffusers transformers -q
# !pip install transformers==4.27.4
# !pip install transformers==4.33.1

import AttentionModule as attenGANs
import CFG as cfg 
import CocoCaptionsDataset as cocodataset
import Discriminator as model_discriminator
import Generator as model_generator
import TextEncoder as textencoder
import VocabProcessor as model_vocab_processor

from torchvision.models import inception_v3
from scipy.linalg import sqrtm
from numpy import cov, trace, iscomplexobj

import torch
from torch.utils.data import DataLoader
import torchvision.transforms as transforms
import numpy as np
from diffusers import StableDiffusionPipeline
import matplotlib.pyplot as plt
print(torch.cuda.is_available())
    
transform = transforms.Compose([
    transforms.Resize((128, 128)),
    transforms.ToTensor(),
    transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5))
])
coco_dataset = cocodataset(root='/kaggle/input/coco-train2014-plus-annotations/train2014/train2014',
                                   annFile='/kaggle/input/coco-train2014-plus-annotations/annotations_trainval2014/annotations/captions_train2014.json',
                                   transform=transform)

vocab_processor = model_vocab_processor(coco_dataset)
data_loader = DataLoader(
    coco_dataset, 
    batch_size=32, 
    shuffle=True, 
    collate_fn=vocab_processor.collate_fn)

generator = model_generator(noise_dim=100, 
                            text_feature_dim=256, 
                            feature_dim=512, 
                            attention_dim=128)
discriminator = model_discriminator(image_channels=3, 
                                    feature_dim=512, 
                                    image_size=128)
text_encoder = textencoder(vocab_size=len(vocab_processor.vocab), 
                           embedding_dim=256, 
                           hidden_dim=256)
g_optimizer = torch.optim.Adam(generator.parameters(), 
                               lr=0.0002, 
                               betas=(0.5, 0.999))
d_optimizer = torch.optim.Adam(discriminator.parameters(), 
                               lr=0.0002, 
                               betas=(0.5, 0.999))
criterion = torch.nn.BCELoss()
epochs = 2

def Train_Model():
    for epoch in range(epochs):
        for i, (images, captions_tensor) in enumerate(data_loader):
            if captions_tensor.max() >= len(vocab_processor.vocab):
                print("Index out of range error likely to happen")
            real_labels = torch.ones(images.size(0), 1)
            fake_labels = torch.zeros(images.size(0), 1)
            d_optimizer.zero_grad()
            outputs = discriminator(images)
            d_loss_real = criterion(outputs, real_labels)
            noise = torch.randn(images.size(0), 100)
            text_features = text_encoder(captions_tensor)
            fake_images = generator(noise, text_features)
            outputs = discriminator(fake_images.detach())
            d_loss_fake = criterion(outputs, fake_labels)
            d_loss = d_loss_real + d_loss_fake
            d_loss.backward()
            d_optimizer.step()
            generator.zero_grad()
            outputs = discriminator(fake_images)
            g_loss = criterion(outputs, real_labels)
            g_loss.backward()
            g_optimizer.step()
            print(f'Epoch [{epoch+1}/{epochs}], 
                  Step [{i+1}/{len(data_loader)}], 
                  D Loss: {d_loss.item()}, 
                  G Loss: {g_loss.item()}')
            
Train_Model()
image_gen_model = StableDiffusionPipeline.from_pretrained(
    cfg.image_gen_model_id, 
    torch_dtype=torch.float16,
    revision="fp16", 
    use_auth_token='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', 
    guidance_scale=10
)
image_gen_model = image_gen_model.to(cfg.device)     
            
def generate_image(text, 
                   text_encoder, 
                   generator, 
                   vocab_processor, 
                   device='cpu'):
    tokens = vocab_processor.tokenizer(text)
    token_ids = [vocab_processor.vocab[token] for token in tokens]
    token_tensor = torch.tensor([token_ids], 
                                dtype=torch.long).to(device)
    sos_token = torch.tensor([[vocab_processor.vocab['<sos>']]], 
                             dtype=torch.long).to(device)
    eos_token = torch.tensor([[vocab_processor.vocab['<eos>']]], 
                             dtype=torch.long).to(device)
    token_tensor = torch.cat((sos_token, token_tensor, 
                              eos_token), dim=1)
    noise = torch.randn(1, 100).to(device)
    text_features = text_encoder(token_tensor)
    image = generator(noise, text_features)
    image = image_gen_model(text, 
                  num_inference_steps = cfg.image_gen_steps,
                  generator = cfg.generator ,
                  guidance_scale = cfg.image_gen_guidance_scale).images[0]
    image = image.resize(cfg.image_gen_size)
    return image

text = "A dog playing in the park"
device = 'cuda' if torch.cuda.is_available() else 'cpu'
generator.to(device)
text_encoder.to(device)
image_tensor = generate_image(text, 
                              text_encoder, 
                              generator, 
                              vocab_processor, 
                              device)

def show_image(image_tensor):
    image = image_tensor.detach().cpu()
    image = image.squeeze(0)
    image = (image + 1) / 2
    image = image.permute(1, 2, 0)
    plt.imshow(image)
    plt.axis('off')
    plt.show()
    
show_image(image_tensor)

def calculate_fid(real_images, 
                  generated_images, 
                  device='cpu'):
    inception_model = inception_v3(pretrained=True, 
                                   transform_input=False).to(device)
    inception_model.eval()
    resize = transforms.Resize((299, 299))
    normalize = transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5))
    transform = transforms.Compose([resize, normalize])
    def get_features(images, model, device):
        features = []
        for img in images:
            img = transform(img).unsqueeze(0).to(device)
            with torch.no_grad():
                feature = model(img)[0]
            features.append(feature.cpu().numpy().flatten())
        return np.array(features)
    real_features = get_features(real_images, 
                                 inception_model, 
                                 device)
    generated_features = get_features(generated_images, 
                                      inception_model, 
                                      device)
    mu1, sigma1 = real_features.mean(axis=0), cov(real_features, rowvar=False)
    mu2, sigma2 = generated_features.mean(axis=0), cov(generated_features, rowvar=False)
    ssdiff = np.sum((mu1 - mu2) ** 2.0)
    covmean, _ = sqrtm(sigma1.dot(sigma2), disp=False)
    if iscomplexobj(covmean):
        covmean = covmean.real
    fid = ssdiff + trace(sigma1 + sigma2 - 2.0 * covmean)
    return fid

real_images = []
generated_images = []

for i, (images, captions_tensor) in enumerate(data_loader):
    real_images.extend(images)
    noise = torch.randn(images.size(0), 100).to(device)
    text_features = text_encoder(captions_tensor.to(device))
    fake_images = generator(noise, text_features).detach().cpu()
    generated_images.extend(fake_images)
    if len(real_images) >= 1000 and len(generated_images) >= 1000:
        break
    
fid_score = calculate_fid(real_images[:1000], 
                          generated_images[:1000], 
                          device=device)
print(f'FID Score: {fid_score}')
