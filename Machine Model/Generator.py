import torch.nn as nn #type: ignore
import AttentionModule as attenGANs
import torch #type: ignore

class Generator(nn.Module):
    def __init__(self, noise_dim, text_feature_dim, feature_dim, attention_dim):
        super(Generator, self).__init__()
        self.fc = nn.Linear(text_feature_dim + noise_dim, feature_dim * 16 * 16)
        self.attention = attenGANs(feature_dim, text_feature_dim, attention_dim)
        self.decoder = nn.Sequential(
            nn.ConvTranspose2d(512, 128, 4, 2, 1),
            nn.ReLU(True),
            nn.ConvTranspose2d(128, 64, 4, 2, 1),
            nn.ReLU(True),
            nn.ConvTranspose2d(64, 3, 4, 2, 1),
            nn.Tanh()
        )
    def forward(self, noise, text_features):
        combined_input = torch.cat((noise, text_features), dim=1)
        features = self.fc(combined_input)
        features = features.view(-1, 512, 16, 16) 
        attended_features = self.attention(features, text_features)
        if attended_features.size(1) != 512:
            raise ValueError(f'Expected 512 channels, but got {attended_features.size(1)}')
        image = self.decoder(attended_features)
        return image