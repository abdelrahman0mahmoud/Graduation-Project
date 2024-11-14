import torch.nn as nn #type: ignore

class Discriminator(nn.Module):
    def __init__(self, image_channels, feature_dim, image_size):
        super(Discriminator, self).__init__()
        self.image_size = image_size
        conv_feature_size = image_size // 4
        self.main = nn.Sequential(
            nn.Conv2d(image_channels, 64, kernel_size=4, stride=2, padding=1),  # Output: 64 x (Image_size/2) x (Image_size/2)
            nn.LeakyReLU(0.2, inplace=True),
            nn.Conv2d(64, 128, kernel_size=4, stride=2, padding=1),  # Output: 128 x (Image_size/4) x (Image_size/4)
            nn.BatchNorm2d(128),
            nn.LeakyReLU(0.2, inplace=True),
            nn.Flatten(),
            nn.Linear(128 * conv_feature_size * conv_feature_size, feature_dim),
            nn.LeakyReLU(0.2, inplace=True),
            nn.Linear(feature_dim, 1),
            nn.Sigmoid()
        )
    def forward(self, x):
        output = self.main(x)
        return output